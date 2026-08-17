import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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
