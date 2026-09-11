with open('api/create-checkout.ts', 'r') as f:
    content = f.read()

content = content.replace('billingType: "UNDEFINED"', 'billingType: "PIX"')
content = content.replace('value: 29.90', 'value: 49.90')

with open('api/create-checkout.ts', 'w') as f:
    f.write(content)

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace('billingType: "UNDEFINED"', 'billingType: "PIX"')
content = content.replace('value: 29.90', 'value: 49.90')

with open('server.ts', 'w') as f:
    f.write(content)
