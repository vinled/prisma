import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for generating caption
  app.post("/api/generate-caption", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "A chave GEMINI_API_KEY não foi configurada nas variáveis de ambiente do servidor." });
      }

      const {
        type,
        neighborhood,
        bedrooms,
        parking,
        price,
        differentials,
        targetAudience,
        whatsapp
      } = req.body;

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const diffsStr = differentials && differentials.length > 0 
        ? differentials.join(", ") 
        : "Nenhum diferencial listado";

      const prompt = `Você é um copywriter especialista em mercado imobiliário de alto padrão. Crie uma legenda persuasiva para o Instagram sobre este imóvel. Tipo: ${type}, Bairro: ${neighborhood}, Quartos: ${bedrooms}, Vagas: ${parking}, Preço: ${price}. Diferenciais: [${diffsStr}]. Adapte o tom de voz estritamente para o público: ${targetAudience}. Use emojis estrategicamente, bullet points limpos e finalize com uma CTA para este WhatsApp: ${whatsapp}. Não invente dados.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      res.json({ caption: response.text });
    } catch (error: any) {
      console.error("API error:", error);
      res.status(500).json({ error: error.message || "Erro interno na API." });
    }
  });

  
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
