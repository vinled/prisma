with open('api/create-checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'throw new Error("Falha ao gerar cobrança.");',
    'throw new Error(`Asaas: ${err}`);'
)

with open('api/create-checkout.ts', 'w') as f:
    f.write(content)

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'throw new Error("Falha ao gerar cobrança.");',
    'throw new Error(`Asaas: ${err}`);'
)

with open('server.ts', 'w') as f:
    f.write(content)

with open('src/utils/checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'throw new Error(errorData.error || "Falha ao gerar cobrança");',
    'throw new Error(`Asaas: ${errorData.error}` || "Falha ao gerar cobrança");'
)

with open('src/utils/checkout.ts', 'w') as f:
    f.write(content)
