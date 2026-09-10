import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export default async function handler(req: any, res: any) {
  // CORS Headers
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
    const token = (req.headers["asaas-access-token"] as string) || "";
    const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN || "";
    
    if (!token || !expectedToken) {
       return res.status(401).json({ error: "Token ausente" });
    }

    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expectedToken);
    
    if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
      return res.status(401).json({ error: "Não Autorizado" });
    }

    const { event, payment } = req.body || {};

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const userId = payment?.externalReference || payment?.customer;
      
      if (userId) {
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
    }
    
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: "Erro interno no webhook" });
  }
}
