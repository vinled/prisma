import re

with open('server.ts', 'r') as f:
    content = f.read()

new_endpoint = """
  app.post("/api/generate-caption", async (req, res) => {
    try {
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
"""

# Replace existing route
start_idx = content.find('app.post("/api/generate-caption"')
end_idx = content.find('app.post("/api/webhook/asaas"')

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx:]
    content = before + new_endpoint + after
    with open('server.ts', 'w') as f:
        f.write(content)
        print("Updated server.ts")
