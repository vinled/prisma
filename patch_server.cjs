const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importSupabase = `import { createClient } from "@supabase/supabase-js";\nimport { GoogleGenAI } from "@google/genai";`;

code = code.replace(`import { GoogleGenAI } from "@google/genai";`, importSupabase);

const webhookCode = `
  // Asaas Webhook API route
  app.post("/api/webhook/asaas", async (req, res) => {
    try {
      const token = req.headers["asaas-access-token"];
      if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
        return res.status(401).json({ error: "Não Autorizado" });
      }

      const { event, payment } = req.body;

      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const userId = payment?.externalReference || payment?.customer;
        
        if (userId) {
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
          
          if (!supabaseUrl || !supabaseServiceRole) {
            console.error("Supabase credentials missing for webhook");
            return res.status(500).json({ error: "Supabase config missing" });
          }
          
          const supabase = createClient(supabaseUrl, supabaseServiceRole);
          
          // Assuming 'profiles' table stores the plan
          const { error } = await supabase
            .from("profiles")
            .update({ plan: "pro" })
            .eq("id", userId);
            
          if (error) {
            console.error("Failed to update user plan:", error);
            throw error;
          }
          console.log(\`User \${userId} upgraded to pro successfully.\`);
        }
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook Error:", error);
      return res.status(500).json({ error: "Erro interno no webhook" });
    }
  });

  // Vite middleware for development
`;

code = code.replace(`// Vite middleware for development`, webhookCode);

fs.writeFileSync('server.ts', code);
