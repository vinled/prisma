import re

with open('api/webhook/asaas.ts', 'r') as f:
    content = f.read()

upgrade_logic = """    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const userId = payment?.externalReference;
      
      // Valida se userId é um UUID (Supabase ID) antes de tentar o update,
      // para evitar Erro 500 caso seja um customer ID (cus_xxxx)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
      
      if (userId && isUuid) {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseServiceRole) {
          return res.status(500).json({ error: "Supabase config missing" });
        }
        
        const supabase = createClient(supabaseUrl, supabaseServiceRole);
        
        const { error } = await supabase
          .from("profiles")
          .update({ plan: "pro" })
          .eq("id", userId);
          
        if (error) {
          throw error;
        }
      }
    }"""

new_logic = """    const userId = payment?.externalReference;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
    
    if (userId && isUuid) {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !supabaseServiceRole) {
        return res.status(500).json({ error: "Supabase config missing" });
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceRole);

      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const { error } = await supabase.from("profiles").update({ plan: "pro" }).eq("id", userId);
        if (error) throw error;
      } 
      else if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_DELETED" || event === "PAYMENT_REFUNDED" || event === "PAYMENT_CHARGEBACK_REQUESTED") {
        // Se não pagou, cancelou ou pediu reembolso, volta para grátis
        const { error } = await supabase.from("profiles").update({ plan: "free" }).eq("id", userId);
        if (error) throw error;
      }
    }"""

content = content.replace(upgrade_logic, new_logic)

with open('api/webhook/asaas.ts', 'w') as f:
    f.write(content)
