import re

with open('server.ts', 'r') as f:
    content = f.read()

# Imports
content = content.replace('import { GoogleGenAI } from "@google/genai";', 
'''import { GoogleGenAI } from "@google/genai";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";''')

# Helmet setup
content = content.replace('app.use(express.json());',
'''app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    frameguard: false
  }));
  app.use(express.json());''')

# Rate limit
content = content.replace('// API route for generating caption',
'''// API route for generating caption
  const generateCaptionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Muitas requisições. Tente novamente em um minuto." }
  });''')

content = content.replace('app.post("/api/generate-caption", async (req, res) => {',
'app.post("/api/generate-caption", generateCaptionLimiter, async (req, res) => {')

# Asaas webhook token comparison
old_token_check = '''      const token = req.headers["asaas-access-token"];
      if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
        return res.status(401).json({ error: "Não Autorizado" });
      }'''

new_token_check = '''      const token = (req.headers["asaas-access-token"] as string) || "";
      const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN || "";
      
      const tokenBuffer = Buffer.from(token);
      const expectedBuffer = Buffer.from(expectedToken);
      
      if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
        return res.status(401).json({ error: "Não Autorizado" });
      }'''

content = content.replace(old_token_check, new_token_check)

with open('server.ts', 'w') as f:
    f.write(content)
