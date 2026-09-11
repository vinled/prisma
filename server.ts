import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    frameguard: false
  }));
  app.use(express.json());

  // API route for generating caption
  const generateCaptionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Muitas requisições. Tente novamente em um minuto." }
  });
  
  app.post("/api/generate-caption", generateCaptionLimiter, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      }
      const token = authHeader.split(" ")[1];

      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({ error: "Supabase config missing in server" });
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Validate token
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      const { promptText, targetAudience } = req.body;

      // Check user privileges (Pro Plan)
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (targetAudience && targetAudience.includes('(Pro)')) {
        if (!profile || profile.plan !== "pro") {
          return res.status(403).json({ error: "Forbidden: Recurso exclusivo do Plano Pro." });
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "A chave GEMINI_API_KEY não foi configurada nas variáveis de ambiente do servidor." });
      }
      
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
      });

      res.json({ caption: response.text });
    } catch (error: any) {
      console.error("API error:", error);
      res.status(500).json({ error: error.message || "Erro interno na API." });
    }
  });

  app.post("/api/webhook/asaas", async (req, res) => {
    try {
      const token = ((req.headers["asaas-access-token"] as string) || "").trim();
      const expectedToken = (process.env.ASAAS_WEBHOOK_TOKEN || "").trim();
      
      if (!token || !expectedToken) { 
         return res.status(401).json({ error: "Token ausente" });
      }

      if (token !== expectedToken) {
        return res.status(401).json({ error: "Não Autorizado. O Token da Vercel é diferente do Token do Asaas. Verifique se copiou a chave certa (Token do Webhook) e sem espaços." });
      }

      const { event, payment } = req.body;

      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const userId = payment?.externalReference;
        
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
        
        if (userId && isUuid) {
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
          console.log(`User ${userId} upgraded to pro successfully.`);
        }
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook Error:", error);
      return res.status(500).json({ error: "Erro interno no webhook" });
    }
  });

  
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
        return res.status(500).json({ error: "ASAAS_API_KEY não configurada no servidor." });
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

  // Vite middleware for development

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
