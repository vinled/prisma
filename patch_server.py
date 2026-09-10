import re

with open('server.ts', 'r') as f:
    content = f.read()

old_block = """      // Check user privileges (Pro Plan)
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

      const { promptText } = req.body;"""

new_block = """      const { promptText, targetAudience } = req.body;

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
      }"""

content = content.replace(old_block, new_block)

with open('server.ts', 'w') as f:
    f.write(content)
