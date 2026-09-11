with open('api/create-checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'throw new Error(`Asaas: ${err}`);',
    'return res.status(400).json({ error: `Asaas: ${err}` });'
)

with open('api/create-checkout.ts', 'w') as f:
    f.write(content)

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'throw new Error(`Asaas: ${err}`);',
    'return res.status(400).json({ error: `Asaas: ${err}` });'
)
content = content.replace(
    'throw new Error("Falha ao gerar cobrança.");',
    'return res.status(400).json({ error: `Asaas: ${err}` });'
)

with open('server.ts', 'w') as f:
    f.write(content)
