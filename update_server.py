import re

with open('server.ts', 'r') as f:
    content = f.read()

# Update webhook in server.ts
old_webhook = """      if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const userId = payment?.externalReference;
        
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
        
        if (userId && isUuid) {
          const supabaseUrl = process.env.VITE_SUPABASE_URL;
          const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
          
          if (!supabaseUrl || !supabaseServiceRole) {
            console.error("Supabase credentials missing for webhook");
            return res.status(500).json({ error: "Supabase config missing" });
          }
          
          const supabase = createClient(supabaseUrl, supabaseServiceRole);
          
          // Assuming 'profiles' table stores the plan
          const { error } = await supabase
            .from("profiles")
            .update({ plan: "pro" })
            .eq("id", userId);
            
          if (error) {
            console.error("Failed to update user plan:", error);
            throw error;
          }
          console.log(`User ${userId} upgraded to pro successfully.`);
        }
      }"""

new_webhook = """      const userId = payment?.externalReference;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId || '');
      
      if (userId && isUuid) {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseServiceRole) {
          console.error("Supabase credentials missing for webhook");
          return res.status(500).json({ error: "Supabase config missing" });
        }
        
        const supabase = createClient(supabaseUrl, supabaseServiceRole);
        
        if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
          const { error } = await supabase.from("profiles").update({ plan: "pro" }).eq("id", userId);
          if (error) throw error;
          console.log(`User ${userId} upgraded to pro successfully.`);
        } 
        else if (event === "PAYMENT_OVERDUE" || event === "PAYMENT_DELETED" || event === "PAYMENT_REFUNDED" || event === "PAYMENT_CHARGEBACK_REQUESTED") {
          const { error } = await supabase.from("profiles").update({ plan: "free" }).eq("id", userId);
          if (error) throw error;
          console.log(`User ${userId} downgraded to free due to event ${event}.`);
        }
      }"""

content = content.replace(old_webhook, new_webhook)

# Update create-checkout in server.ts
old_checkout = """      const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        },
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: 49.90,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: "Assinatura Plano PRO - PostNaMão",
          externalReference: user.id,
        })
      });
      if (!paymentResponse.ok) {
        return res.status(400).json({ error: `Asaas: ${err}` });
      }

      const paymentData = await paymentResponse.json();
      
      return res.status(200).json({ 
        url: paymentData.invoiceUrl,
        isStatic: false
      });"""

new_checkout = """      const subscriptionResponse = await fetch("https://api.asaas.com/v3/subscriptions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': asaasApiKey
        },
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: 49.90,
          nextDueDate: new Date().toISOString().split('T')[0],
          cycle: "MONTHLY",
          description: "Assinatura Plano PRO - PostNaMão",
          externalReference: user.id,
        })
      });

      if (!subscriptionResponse.ok) {
        const err = await subscriptionResponse.text();
        console.error("Erro Asaas Sub:", err);
        return res.status(400).json({ error: `Asaas Sub: ${err}` });
      }

      const subData = await subscriptionResponse.json();
      const subId = subData.id;

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
          await new Promise(r => setTimeout(r, 1000));
          retries++;
        }
      }

      if (!invoiceUrl) {
         return res.status(500).json({ error: "Assinatura criada, mas falha ao recuperar link de pagamento. Tente novamente." });
      }
      
      return res.status(200).json({ 
        url: invoiceUrl, 
        isStatic: false
      });"""

# Because `err` is not defined in the old one (`const err = ...` was missing), I should just replace using regex or string block.
import re
# Find the start of paymentResponse up to the end of the handler
start_idx = content.find('const paymentResponse = await fetch("https://api.asaas.com/v3/payments", {')
end_idx = content.find('    } catch (error: any) {', start_idx)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_checkout + "\n  " + content[end_idx:]

with open('server.ts', 'w') as f:
    f.write(content)
