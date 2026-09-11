import re

with open('api/create-checkout.ts', 'r') as f:
    content = f.read()

# Replace payment creation with subscription creation
payment_code = """    // Agora cria a cobrança
    const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "UNDEFINED", // Permite cartão, pix, boleto
        value: 49.90, // Valor do plano pro
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +3 dias
        description: "Assinatura Plano PRO - PostNaMão",
        externalReference: user.id, // O WEBHOOK VAI LER ISSO!
      })
    });"""

sub_code = """    // Agora cria a Assinatura (Recorrente)
    const subscriptionResponse = await fetch("https://api.asaas.com/v3/subscriptions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': asaasApiKey
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "UNDEFINED", // Permite cartão, pix, boleto
        value: 49.90, // Valor do plano pro mensal
        nextDueDate: new Date().toISOString().split('T')[0], // Hoje
        cycle: "MONTHLY",
        description: "Assinatura Plano PRO - PostNaMão",
        externalReference: user.id, // O WEBHOOK VAI LER ISSO NAS COBRANÇAS GERADAS!
      })
    });"""

content = content.replace(payment_code, sub_code)

payment_handling = """    if (!paymentResponse.ok) {
      const err = await paymentResponse.text();
      console.error("Erro Asaas:", err);
      return res.status(400).json({ error: `Asaas: ${err}` });
    }

    const paymentData = await paymentResponse.json();
    
    return res.status(200).json({ 
      url: paymentData.invoiceUrl, // Link direto para a fatura (checkout)
      isStatic: false
    });"""

sub_handling = """    if (!subscriptionResponse.ok) {
      const err = await subscriptionResponse.text();
      console.error("Erro Asaas (Subscription):", err);
      return res.status(400).json({ error: `Asaas Sub: ${err}` });
    }

    const subData = await subscriptionResponse.json();
    const subId = subData.id;

    // A assinatura gera a primeira cobrança automaticamente. Vamos buscá-la para pegar o link de pagamento.
    let invoiceUrl = null;
    let retries = 0;
    
    while (!invoiceUrl && retries < 3) {
      const paymentsResponse = await fetch(`https://api.asaas.com/v3/subscriptions/${subId}/payments?status=PENDING`, {
        headers: { 'access_token': asaasApiKey }
      });
      const paymentsData = await paymentsResponse.json();
      
      if (paymentsData.data && paymentsData.data.length > 0) {
        invoiceUrl = paymentsData.data[0].invoiceUrl;
      } else {
        // Wait 1 second before retrying
        await new Promise(r => setTimeout(r, 1000));
        retries++;
      }
    }

    if (!invoiceUrl) {
       // Fallback se demorar muito para gerar
       return res.status(500).json({ error: "Assinatura criada, mas falha ao recuperar link de pagamento. Tente novamente." });
    }
    
    return res.status(200).json({ 
      url: invoiceUrl, 
      isStatic: false
    });"""

content = content.replace(payment_handling, sub_handling)

with open('api/create-checkout.ts', 'w') as f:
    f.write(content)

