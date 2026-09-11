import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const asaasApiKey = process.env.ASAAS_API_KEY;
    
    if (!asaasApiKey) {
      return res.status(500).json({ error: "ASAAS_API_KEY não configurada no servidor." });
    }

    // Buscar a assinatura ativa do cliente no Asaas usando externalReference (que é o user.id)
    const subscriptionsResponse = await fetch(`https://api.asaas.com/v3/subscriptions?externalReference=${user.id}&status=ACTIVE`, {
      headers: { 'access_token': asaasApiKey }
    });
    
    const subscriptionsData = await subscriptionsResponse.json();
    
    if (!subscriptionsData.data || subscriptionsData.data.length === 0) {
       return res.status(404).json({ error: "Nenhuma assinatura ativa encontrada." });
    }
    
    // Cancela todas as assinaturas ativas encontradas para este usuário (normalmente será apenas 1)
    let cancelled = 0;
    for (const sub of subscriptionsData.data) {
      const cancelResponse = await fetch(`https://api.asaas.com/v3/subscriptions/${sub.id}`, {
        method: 'DELETE',
        headers: { 'access_token': asaasApiKey }
      });
      if (cancelResponse.ok) cancelled++;
    }
    
    // Atualiza o banco de dados para "free" imediatamente
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminSupabase = createClient(supabaseUrl!, supabaseServiceRole!);
    await adminSupabase.from("profiles").update({ plan: "free" }).eq("id", user.id);

    return res.status(200).json({ success: true, message: `Assinatura cancelada com sucesso (${cancelled}).` });
    
  } catch (error: any) {
    console.error("Cancel Error:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}
