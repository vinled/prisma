import re

# Fix src/utils/checkout.ts
with open('src/utils/checkout.ts', 'r') as f:
    content = f.read()

content = content.replace('window.location.href = "https://www.asaas.com/c/j299iil4aqkray3j";', 'alert("Você precisa estar logado para assinar o plano.");')

old_catch = """    if (data.url) {
      window.location.href = data.url;
    } else {
      window.location.href = "https://www.asaas.com/c/j299iil4aqkray3j";
    }
  } catch (error) {
    console.error("Checkout error:", error);
    window.location.href = "https://www.asaas.com/c/j299iil4aqkray3j"; // Fallback estático
  }"""

new_catch = """    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao gerar link de pagamento. Verifique as configurações do Asaas.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Erro interno ao conectar com a API de pagamento. Verifique as configurações do servidor.");
  }"""

content = content.replace(old_catch, new_catch)

with open('src/utils/checkout.ts', 'w') as f:
    f.write(content)

# Fix server.ts
with open('server.ts', 'r') as f:
    server = f.read()

old_server_fallback = """      if (!asaasApiKey) {
        return res.status(200).json({ 
          url: "https://www.asaas.com/c/j299iil4aqkray3j",
          isStatic: true
        });
      }"""

new_server_fallback = """      if (!asaasApiKey) {
        return res.status(500).json({ error: "ASAAS_API_KEY não configurada no servidor." });
      }"""

server = server.replace(old_server_fallback, new_server_fallback)

with open('server.ts', 'w') as f:
    f.write(server)

# Fix api/create-checkout.ts
with open('api/create-checkout.ts', 'r') as f:
    api_checkout = f.read()

old_api_fallback = """    if (!asaasApiKey) {
      // Se não tiver a chave da API, retorna o link estático como fallback
      return res.status(200).json({ 
        url: "https://www.asaas.com/c/j299iil4aqkray3j",
        isStatic: true
      });
    }"""

new_api_fallback = """    if (!asaasApiKey) {
      return res.status(500).json({ error: "ASAAS_API_KEY não configurada no servidor." });
    }"""

api_checkout = api_checkout.replace(old_api_fallback, new_api_fallback)

with open('api/create-checkout.ts', 'w') as f:
    f.write(api_checkout)

