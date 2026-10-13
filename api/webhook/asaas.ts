import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import { activeSubscriptions, applyPlan, BillingError, claimLease, paymentGrantsAccess, payments, releaseLease, respondBillingError, type BillingLease } from '../../server/billing.js';

const EVENTS = new Set(['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED', 'PAYMENT_OVERDUE', 'PAYMENT_DELETED', 'PAYMENT_REFUNDED', 'PAYMENT_CHARGEBACK_REQUESTED', 'SUBSCRIPTION_DELETED', 'SUBSCRIPTION_INACTIVATED']);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  let lease: BillingLease;
  let admin;
  try {
    const received = req.headers['asaas-access-token'];
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (typeof received !== 'string' || !received || !expected) throw new BillingError(401, 'Webhook não autorizado.');
    const actualBuffer = Buffer.from(received);
    const expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) throw new BillingError(401, 'Webhook não autorizado.');
    const { id, event, payment, subscription } = req.body || {};
    if (!EVENTS.has(event)) return res.status(200).json({ received: true, ignored: true });
    const userId = payment?.externalReference || subscription?.externalReference;
    if (typeof id !== 'string' || !id || id.length > 200) throw new BillingError(400, 'Evento sem identificador válido.');
    if (typeof userId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) return res.status(200).json({ received: true, ignored: true });
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const apiKey = process.env.ASAAS_API_KEY;
    if (!url || !key || !apiKey) throw new BillingError(503, 'Webhook temporariamente indisponível.');
    admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: existing, error } = await admin.from('pn_billing_events').select('event_id').eq('event_id', id).maybeSingle();
    if (error) throw new BillingError(503, 'Não foi possível consultar o registro do evento.');
    if (existing) return res.status(200).json({ received: true, duplicate: true });
    lease = await claimLease(admin, userId);
    // Reconcile current Asaas state, so an old overdue/refund event cannot undo a newer payment.
    const subscriptions = await activeSubscriptions(apiKey, userId);
    let plan: 'free' | 'pro' = 'free';
    let paidSubscriptionId: string | null = null;
    for (const active of subscriptions) {
      if ((await payments(apiKey, active.id)).some(item => paymentGrantsAccess(item))) {
        plan = 'pro'; paidSubscriptionId = active.id; break;
      }
    }
    const result = await applyPlan(admin, lease, id, plan, paidSubscriptionId || subscriptions[0]?.id || null);
    return res.status(200).json({ received: true, duplicate: result.duplicate });
  } catch (error) { return respondBillingError(res, error); }
  finally { if (lease) await releaseLease(admin, lease); }
}
