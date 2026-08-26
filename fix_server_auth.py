import re

with open('server.ts', 'r') as f:
    content = f.read()

new_endpoint = """
  app.post("/api/generate-caption", async (req, res) => {
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
"""

# Replace existing route
start_idx = content.find('app.post("/api/generate-caption"')
end_idx = content.find('app.post("/api/webhook/asaas"')

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx:]
    content = before + new_endpoint.strip() + "\n\n  " + after
    with open('server.ts', 'w') as f:
        f.write(content)
        print("Updated server.ts")
else:
    print("Failed to find endpoints in server.ts")
