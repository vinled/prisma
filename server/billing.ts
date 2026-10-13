import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

export class BillingError extends Error {
  constructor(public status: number, message: string, public definitive = false) { super(message); }
}

export function requireToken(req: any) {
  const value = req.headers.authorization;
  if (typeof value !== 'string' || !/^Bearer \S+$/.test(value)) throw new BillingError(401, 'Faça login para continuar.');
  return value.slice(7);
}

export async function authenticateBilling(req: any): Promise<{ user: User; admin: SupabaseClient; apiKey: string }> {
  const token = requireToken(req);
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.ASAAS_API_KEY;
  if (!url || !anon || !service || !apiKey) throw new BillingError(503, 'O serviço de assinaturas não está disponível. Contate o suporte.');
  const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user) throw new BillingError(401, 'Sua sessão expirou. Faça login novamente.');
  return { user: data.user, admin: createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } }), apiKey };
}

export async function asaas<T = any>(apiKey: string, route: string, init: RequestInit = {}): Promise<T> {
  const base = process.env.ASAAS_API_URL || 'https://api.asaas.com/v3';
  if (!['https://api.asaas.com/v3', 'https://api-sandbox.asaas.com/v3'].includes(base)) throw new BillingError(503, 'Ambiente Asaas inválido.');
  let response: Response;
  try {
    response = await fetch(`${base}${route}`, {
      ...init, signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json', 'access_token': apiKey, 'User-Agent': 'PostNaMao', ...init.headers },
    });
  } catch { throw new BillingError(503, 'O Asaas não confirmou a operação. Aguarde antes de tentar novamente.'); }
  if (!response.ok) {
    throw new BillingError(response.status === 429 ? 429 : 502,
      'Não foi possível confirmar a operação no Asaas. Confira os dados ou contate o suporte.',
      [400, 401, 403, 404, 422].includes(response.status));
  }
  try { return await response.json(); }
  catch { throw new BillingError(502, 'O Asaas retornou uma resposta incompleta.'); }
}

export async function asaasList(apiKey: string, route: string): Promise<any[]> {
  const items: any[] = [];
  for (let offset = 0; offset < 1000; offset += 100) {
    const page = await asaas(apiKey, `${route}${route.includes('?') ? '&' : '?'}limit=100&offset=${offset}`);
    if (!Array.isArray(page.data)) throw new BillingError(502, 'Consulta Asaas incompleta.');
    items.push(...page.data);
    if (!page.hasMore) return items;
  }
  throw new BillingError(503, 'Há muitos registros para confirmar a assinatura. Contate o suporte.');
}

export function activeSubscriptions(apiKey: string, userId: string) {
  return asaasList(apiKey, `/subscriptions?externalReference=${encodeURIComponent(userId)}&status=ACTIVE`);
}

export function payments(apiKey: string, subscriptionId: string) {
  return asaasList(apiKey, `/subscriptions/${encodeURIComponent(subscriptionId)}/payments`);
}

export function paymentGrantsAccess(payment: any, today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })) {
  if (payment.deleted || !['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(payment.status) || !/^\d{4}-\d{2}-\d{2}$/.test(payment.dueDate || '')) return false;
  const settled = [payment.paymentDate, payment.confirmedDate, payment.clientPaymentDate]
    .filter(value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)).map(value => value.slice(0, 10)).sort().pop();
  const start = settled && settled > payment.dueDate ? settled : payment.dueDate;
  const [year, month, day] = start.split('-').map(Number);
  const nextMonthLastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const end = new Date(Date.UTC(year, month, Math.min(day, nextMonthLastDay))).toISOString().slice(0, 10);
  return start <= today && today < end;
}

export function validInvoiceUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try { const url = new URL(value); return url.protocol === 'https:' && (url.hostname === 'asaas.com' || url.hostname.endsWith('.asaas.com')); }
  catch { return false; }
}

export interface BillingLease { userId: string; token: string; account: any }
export async function claimLease(admin: SupabaseClient, userId: string): Promise<BillingLease> {
  const token = randomUUID();
  const { data, error } = await admin.rpc('pn_claim_billing', { p_user_id: userId, p_lock_token: token });
  if (error) throw new BillingError(503, 'O controle de assinaturas está indisponível. Contate o suporte.');
  if (!data?.acquired) throw new BillingError(409, 'Já existe uma operação de assinatura em andamento. Aguarde alguns segundos.');
  return { userId, token, account: data.account };
}

export async function updateAccount(admin: SupabaseClient, lease: BillingLease, changes: Record<string, unknown>) {
  const { data, error } = await admin.from('pn_billing_accounts')
    .update({ ...changes, updated_at: new Date().toISOString() }).eq('user_id', lease.userId)
    .eq('lock_token', lease.token).gt('lock_until', new Date().toISOString()).select('user_id').maybeSingle();
  if (error || !data) throw new BillingError(503, 'Não foi possível registrar a operação. Contate o suporte antes de tentar novamente.');
  Object.assign(lease.account, changes);
}

export async function releaseLease(admin: SupabaseClient, lease: BillingLease) {
  try {
    const { error } = await admin.rpc('pn_release_billing', { p_user_id: lease.userId, p_lock_token: lease.token });
    if (error) console.warn('A trava de assinatura será liberada por expiração.');
  } catch { console.warn('A trava de assinatura será liberada por expiração.'); }
}

export async function applyPlan(admin: SupabaseClient, lease: BillingLease, eventId: string, plan: 'free' | 'pro', subscriptionId: string | null, cancelled = false) {
  const { data, error } = await admin.rpc('pn_apply_billing_event', {
    p_event_id: eventId, p_user_id: lease.userId, p_lock_token: lease.token,
    p_plan: plan, p_subscription_id: subscriptionId, p_cancelled: cancelled,
  });
  if (error) throw new BillingError(503, 'A alteração do plano não foi confirmada. A operação será reconciliada.');
  return data;
}

export function respondBillingError(res: any, error: unknown) {
  const status = error instanceof BillingError ? error.status : 500;
  if ([409, 429, 503].includes(status)) res.setHeader('Retry-After', '8');
  const message = error instanceof BillingError ? error.message : 'Não foi possível concluir a operação. Contate o suporte.';
  if (!(error instanceof BillingError)) console.error('Erro interno de assinatura:', (error as Error)?.message);
  return res.status(status).json({ error: message });
}
