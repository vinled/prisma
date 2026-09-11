import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    const { cpf } = req.body || {};
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

    // Criar cobrança dinâmica no Asaas
    const asaasUrl = "https://api.asaas.com/v3/paymentLinks"; // Note: For dynamic links with external reference, it's better to create a charge (billing) or use payment links.
    // Actually, creating a direct billing (cobranca) requires customer creation first.
    // Wait, can we create a payment link with external reference directly? No, payment links are usually generic.
    // If we want a checkout URL, we can create a Customer, then a Payment.
    
    // Let's create a customer first (or find existing)
    const customerResponse = await fetch("https://api.asaas.com/v3/customers", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        name: user.email?.split('@')[0] || "Usuário PostNaMão",
        email: user.email,
        cpfCnpj: cpf,
        externalReference: user.id
      })
    });
    
    let customerId;
    if (customerResponse.ok) {
      const customerData = await customerResponse.json();
      customerId = customerData.id;
    } else {
      // Try to find if email exists
      const searchResponse = await fetch(`https://api.asaas.com/v3/customers?email=${user.email}`, {
        headers: { 'access_token': asaasApiKey }
      });
      const searchData = await searchResponse.json();
      if (searchData.data && searchData.data.length > 0) {
        customerId = searchData.data[0].id;
      } else {
        throw new Error("Falha ao criar cliente no Asaas.");
      }
    }

    // Agora cria a Assinatura (Recorrente)
    const subscriptionResponse = await fetch("https://api.asaas.com/v3/subscriptions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "UNDEFINED", // Permite cartão, pix, boleto
        value: 49.90, // Valor do plano pro mensal
        nextDueDate: new Date().toISOString().split('T')[0], // Hoje
        cycle: "MONTHLY",
        description: "Assinatura Plano PRO - PostNaMão",
        externalReference: user.id, // O WEBHOOK VAI LER ISSO NAS COBRANÇAS GERADAS!
      })
    });

    if (!subscriptionResponse.ok) {
      const err = await subscriptionResponse.text();
      console.error("Erro Asaas (Subscription):", err);
      return res.status(400).json({ error: `Asaas Sub: ${err}` });
    }

    const subData = await subscriptionResponse.json();
    const subId = subData.id;

    // A assinatura gera a primeira cobrança automaticamente. Vamos buscá-la para pegar o link de pagamento.
    let invoiceUrl = null;
    let retries = 0;
    
    while (!invoiceUrl && retries < 3) {
      const paymentsResponse = await fetch(`https://api.asaas.com/v3/subscriptions/${subId}/payments?status=PENDING`, {
        headers: { 'access_token': asaasApiKey }
      });
      const paymentsData = await paymentsResponse.json();
      
      if (paymentsData.data && paymentsData.data.length > 0) {
        invoiceUrl = paymentsData.data[0].invoiceUrl;
      } else {
        // Wait 1 second before retrying
        await new Promise(r => setTimeout(r, 1000));
        retries++;
      }
    }

    if (!invoiceUrl) {
       // Fallback se demorar muito para gerar
       return res.status(500).json({ error: "Assinatura criada, mas falha ao recuperar link de pagamento. Tente novamente." });
    }
    
    return res.status(200).json({ 
      url: invoiceUrl, 
      isStatic: false
    });
    
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return res.status(500).json({ error: error.message || "Erro interno" });
  }
}
