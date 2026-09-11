import re

with open('server.ts', 'r') as f:
    content = f.read()

cancel_endpoint = """
  app.post("/api/cancel-subscription", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({ error: "Supabase config missing" });
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      const asaasApiKey = process.env.ASAAS_API_KEY;
      if (!asaasApiKey) {
        return res.status(500).json({ error: "ASAAS_API_KEY não configurada no servidor." });
      }

      const subscriptionsResponse = await fetch(`https://api.asaas.com/v3/subscriptions?externalReference=${user.id}&status=ACTIVE`, {
        headers: { 'access_token': asaasApiKey }
      });
      
      const subscriptionsData = await subscriptionsResponse.json();
      
      if (!subscriptionsData.data || subscriptionsData.data.length === 0) {
         return res.status(404).json({ error: "Nenhuma assinatura ativa encontrada." });
      }
      
      let cancelled = 0;
      for (const sub of subscriptionsData.data) {
        const cancelResponse = await fetch(`https://api.asaas.com/v3/subscriptions/${sub.id}`, {
          method: 'DELETE',
          headers: { 'access_token': asaasApiKey }
        });
        if (cancelResponse.ok) cancelled++;
      }
      
      const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const adminSupabase = createClient(supabaseUrl, supabaseServiceRole!);
      await adminSupabase.from("profiles").update({ plan: "free" }).eq("id", user.id);

      return res.status(200).json({ success: true, message: `Assinatura cancelada com sucesso.` });
      
    } catch (error: any) {
      console.error("Cancel Error:", error);
      return res.status(500).json({ error: error.message || "Erro interno" });
    }
  });
"""

# Insert right before app.post("/api/webhook/asaas")
idx = content.find('  app.post("/api/webhook/asaas"')
if idx != -1:
    content = content[:idx] + cancel_endpoint + "\n" + content[idx:]

with open('server.ts', 'w') as f:
    f.write(content)

