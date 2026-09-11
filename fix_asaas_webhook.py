import re

with open('api/webhook/asaas.ts', 'r') as f:
    content = f.read()

# Replace the userId logic
old_logic = """    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const userId = payment?.externalReference || payment?.customer;
      
      if (userId) {"""

new_logic = """    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const userId = payment?.externalReference;
      
      // Valida se userId é um UUID (Supabase ID) antes de tentar o update,
      // para evitar Erro 500 caso seja um customer ID (cus_xxxx)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
      
      if (userId && isUuid) {"""

content = content.replace(old_logic, new_logic)

with open('api/webhook/asaas.ts', 'w') as f:
    f.write(content)
