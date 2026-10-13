import type { SupabaseClient, User } from '@supabase/supabase-js';
import { activeSubscriptions, applyPlan, asaas, asaasList, BillingError, paymentGrantsAccess, payments, updateAccount, validInvoiceUrl, type BillingLease } from './billing';

async function invoice(apiKey: string, subscriptionId: string, admin: SupabaseClient, lease: BillingLease) {
  const invoices = await payments(apiKey, subscriptionId);
  const paid = invoices.find(payment => paymentGrantsAccess(payment));
  if (paid) {
    await applyPlan(admin, lease, `checkout-paid:${subscriptionId}:${paid.id}`, 'pro', subscriptionId);
    throw new BillingError(409, 'Sua assinatura já está paga e o plano foi confirmado. Acesse Minha Conta.');
  }
  const pending = invoices.filter(p => !p.deleted && ['PENDING', 'OVERDUE'].includes(p.status)).sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
  const url = pending[0]?.invoiceUrl;
  if (url && !validInvoiceUrl(url)) throw new BillingError(502, 'O endereço de pagamento não foi validado. Contate o suporte.');
  return url as string | undefined;
}

export async function createOrReuseCheckout(admin: SupabaseClient, apiKey: string, user: User, cpf: string, lease: BillingLease) {
  const subscriptions = await activeSubscriptions(apiKey, user.id);
  if (subscriptions.length > 1) throw new BillingError(409, 'Há mais de uma assinatura ativa nesta conta. Contate o suporte antes de pagar novamente.');
  let subscriptionId = subscriptions[0]?.id;
  const reused = Boolean(subscriptionId);
  if (subscriptionId) {
    await updateAccount(admin, lease, { subscription_id: subscriptionId, customer_id: subscriptions[0].customer, phase: 'ready' });
  } else if (lease.account.phase === 'creating' || lease.account.phase === 'uncertain' || lease.account.subscription_id) {
    // A timed-out POST may have created a subscription. Never send another POST blindly.
    throw new BillingError(503, 'Estamos confirmando uma tentativa anterior. Nenhuma nova assinatura será criada. Aguarde ou contate o suporte.');
  } else {
    const customers = await asaasList(apiKey, `/customers?externalReference=${encodeURIComponent(user.id)}`);
    let customerId = customers.find(customer => String(customer.cpfCnpj).replace(/\D/g, '') === cpf)?.id;
    if (!customerId) {
      const customer = await asaas(apiKey, '/customers', {
        method: 'POST', body: JSON.stringify({ name: user.email?.split('@')[0] || 'Usuário PostNaMão', email: user.email, cpfCnpj: cpf, externalReference: user.id }),
      });
      if (!customer.id) throw new BillingError(502, 'Não foi possível confirmar o cadastro de cobrança.');
      customerId = customer.id;
    }
    await updateAccount(admin, lease, { customer_id: customerId, phase: 'creating' });
    try {
      const subscription = await asaas(apiKey, '/subscriptions', {
        method: 'POST', body: JSON.stringify({ customer: customerId, billingType: 'UNDEFINED', value: 49.90,
          nextDueDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }), cycle: 'MONTHLY',
          description: 'Assinatura Plano PRO - PostNaMão', externalReference: user.id }),
      });
      if (!subscription.id) throw new BillingError(502, 'O Asaas não confirmou o identificador da assinatura.');
      subscriptionId = subscription.id;
      await updateAccount(admin, lease, { subscription_id: subscriptionId, phase: 'ready' });
    } catch (error) {
      const phase = error instanceof BillingError && error.definitive ? 'idle' : 'uncertain';
      await updateAccount(admin, lease, { phase });
      throw error;
    }
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const url = await invoice(apiKey, subscriptionId, admin, lease);
    if (url) {
      await updateAccount(admin, lease, { checkout_url: url, phase: 'ready' });
      return { url, isStatic: false, reused };
    }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new BillingError(503, 'A assinatura já foi criada. O link de pagamento está sendo preparado; tente novamente em alguns segundos.');
}
