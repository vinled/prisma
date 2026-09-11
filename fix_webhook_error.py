files_to_fix = ['api/webhook/asaas.ts', 'server.ts']

for file_path in files_to_fix:
    with open(file_path, 'r') as f:
        content = f.read()

    content = content.replace('return res.status(401).json({ error: "Não Autorizado" });', 'return res.status(401).json({ error: "Não Autorizado. O Token da Vercel é diferente do Token do Asaas. Verifique se copiou a chave certa (Token do Webhook) e sem espaços." });')
    
    with open(file_path, 'w') as f:
        f.write(content)
