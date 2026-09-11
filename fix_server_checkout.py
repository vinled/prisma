import re

with open('server.ts', 'r') as f:
    content = f.read()

new_endpoint = """
  app.post("/api/create-checkout", async (req, res) => {
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
        return res.status(200).json({ 
          url: "https://www.asaas.com/c/j299iil4aqkray3j",
          isStatic: true
        });
      }

      const customerResponse = await fetch("https://api.asaas.com/v3/customers", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        },
        body: JSON.stringify({
          name: user.email?.split('@')[0] || "Usuário PostNaMão",
          email: user.email,
          externalReference: user.id
        })
      });
      
      let customerId;
      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        customerId = customerData.id;
      } else {
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

      const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        },
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: 29.90,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: "Assinatura Plano PRO - PostNaMão",
          externalReference: user.id,
        })
      });

      if (!paymentResponse.ok) {
        throw new Error("Falha ao gerar cobrança.");
      }

      const paymentData = await paymentResponse.json();
      
      return res.status(200).json({ 
        url: paymentData.invoiceUrl,
        isStatic: false
      });
      
    } catch (error: any) {
      console.error("Checkout Error:", error);
      return res.status(500).json({ error: error.message || "Erro interno" });
    }
  });
"""

# Insert before Vite middleware
content = content.replace("// Vite middleware for development", new_endpoint + "\n  // Vite middleware for development")

with open('server.ts', 'w') as f:
    f.write(content)
