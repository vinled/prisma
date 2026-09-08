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

      // Check user privileges (Pro Plan)
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (!profile || profile.plan !== "pro") {
        return res.status(403).json({ error: "Forbidden: Recurso exclusivo do Plano Pro." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "A chave GEMINI_API_KEY não foi configurada nas variáveis de ambiente do servidor." });
      }

      const { promptText } = req.body;
      
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
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
      const token = (req.headers["asaas-access-token"] as string) || "";
      const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN || "";
      
      const tokenBuffer = Buffer.from(token);
      const expectedBuffer = Buffer.from(expectedToken);
      
      if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
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
          console.log(`User ${userId} upgraded to pro successfully.`);
        }
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook Error:", error);
      return res.status(500).json({ error: "Erro interno no webhook" });
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
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
