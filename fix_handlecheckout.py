with open('src/utils/checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'export async function handleCheckout(onLoading: (isLoading: boolean) => void) {',
    'export async function handleCheckout(cpf: string, onLoading: (isLoading: boolean) => void) {'
)

content = content.replace(
    'method: \'POST\',',
    'method: \'POST\',\n      body: JSON.stringify({ cpf }),'
)
content = content.replace(
    '`Bearer ${session.access_token}`',
    '`Bearer ${session.access_token}`,\n        \'Content-Type\': \'application/json\''
)

with open('src/utils/checkout.ts', 'w') as f:
    f.write(content)

with open('api/create-checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'const token = authHeader.split(" ")[1];',
    'const token = authHeader.split(" ")[1];\n    const { cpf } = req.body || {};'
)

content = content.replace(
    'email: user.email,',
    'email: user.email,\n        cpfCnpj: cpf,'
)
content = content.replace(
    'billingType: "PIX",',
    'billingType: "UNDEFINED",'
)

with open('api/create-checkout.ts', 'w') as f:
    f.write(content)

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'const token = authHeader.split(" ")[1];',
    'const token = authHeader.split(" ")[1];\n      const { cpf } = req.body || {};'
)

content = content.replace(
    'email: user.email,',
    'email: user.email,\n          cpfCnpj: cpf,'
)
content = content.replace(
    'billingType: "PIX",',
    'billingType: "UNDEFINED",'
)

with open('server.ts', 'w') as f:
    f.write(content)
