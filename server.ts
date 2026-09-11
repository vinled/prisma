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
      const { cpf } = req.body || {};

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
        
        if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
          const { error } = await supabase.from("profiles").update({ plan: "pro" }).eq("id", userId);
          if (error) throw error;
          console.log(`User ${userId} upgraded to pro successfully.`);
        } 
        else if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_DELETED" || event === "PAYMENT_REFUNDED" || event === "PAYMENT_CHARGEBACK_REQUESTED") {
          const { error } = await supabase.from("profiles").update({ plan: "free" }).eq("id", userId);
          if (error) throw error;
          console.log(`User ${userId} downgraded to free due to event ${event}.`);
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

            const subscriptionResponse = await fetch("https://api.asaas.com/v3/subscriptions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        },
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: 49.90,
          nextDueDate: new Date().toISOString().split('T')[0],
          cycle: "MONTHLY",
          description: "Assinatura Plano PRO - PostNaMão",
          externalReference: user.id,
        })
      });

      if (!subscriptionResponse.ok) {
        const err = await subscriptionResponse.text();
        console.error("Erro Asaas Sub:", err);
        return res.status(400).json({ error: `Asaas Sub: ${err}` });
      }

      const subData = await subscriptionResponse.json();
      const subId = subData.id;

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
          await new Promise(r => setTimeout(r, 1000));
          retries++;
        }
      }

      if (!invoiceUrl) {
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
