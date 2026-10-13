import { activeSubscriptions, applyPlan, asaas, authenticateBilling, claimLease, releaseLease, respondBillingError, type BillingLease } from '../server/billing';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  let lease: BillingLease;
  let admin;
  try {
    const context = await authenticateBilling(req);
    admin = context.admin;
    lease = await claimLease(admin, context.user.id);
    const subscriptions = await activeSubscriptions(context.apiKey, context.user.id);
    for (const subscription of subscriptions) {
      await asaas(context.apiKey, `/subscriptions/${encodeURIComponent(subscription.id)}`, { method: 'DELETE' });
    }
    await applyPlan(admin, lease, `cancel:${lease.token}`, 'free', null, true);
    return res.status(200).json({ success: true, message: subscriptions.length ? 'Assinatura cancelada com sucesso.' : 'A renovação já estava cancelada.' });
  } catch (error) { return respondBillingError(res, error); }
  finally { if (lease) await releaseLease(admin, lease); }
}
