import os

files_to_fix = ['api/webhook/asaas.ts', 'server.ts']

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()

    # We will replace the token validation logic
    old_logic = """    const token = (req.headers["asaas-access-token"] as string) || "";
    const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN || "";
    
    if (!token || !expectedToken) { 
       return res.status(401).json({ error: "Token ausente" });
    }

    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expectedToken);
    
    if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {"""

    new_logic = """    const token = ((req.headers["asaas-access-token"] as string) || "").trim();
    const expectedToken = (process.env.ASAAS_WEBHOOK_TOKEN || "").trim();
    
    if (!token || !expectedToken) { 
       return res.status(401).json({ error: "Token ausente. Verifique se configurou a ASAAS_WEBHOOK_TOKEN na Vercel." });
    }

    if (token !== expectedToken) {"""
    
    if old_logic in content:
        content = content.replace(old_logic, new_logic)
    else:
        # For server.ts which might be slightly different:
        old_logic_2 = """      const token = (req.headers["asaas-access-token"] as string) || "";
      const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN || "";
      
      const tokenBuffer = Buffer.from(token);
      const expectedBuffer = Buffer.from(expectedToken);
      
      if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {"""
        
        new_logic_2 = """      const token = ((req.headers["asaas-access-token"] as string) || "").trim();
      const expectedToken = (process.env.ASAAS_WEBHOOK_TOKEN || "").trim();
      
      if (!token || !expectedToken) { 
         return res.status(401).json({ error: "Token ausente" });
      }

      if (token !== expectedToken) {"""
        content = content.replace(old_logic_2, new_logic_2)

    with open(file_path, 'w') as f:
        f.write(content)

