import test from 'node:test';
import assert from 'node:assert/strict';
import checkout from '../api/create-checkout';
import webhook from '../api/webhook/asaas';
import { paymentGrantsAccess } from '../server/billing';

const USER = '00000000-0000-4000-8000-000000000101';
const request = () => ({ method: 'POST', headers: { authorization: 'Bearer test-token' }, body: { cpf: '12345678901' } });
function response() {
  return { code: 200, body: null as any, setHeader() {}, status(code: number) { this.code = code; return this; }, json(body: any) { this.body = body; return this; } };
}

async function scenario(options: any, run: (state: any) => Promise<void>) {
  const originalFetch = globalThis.fetch;
  const keys = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'ASAAS_API_KEY', 'ASAAS_WEBHOOK_TOKEN', 'ASAAS_API_URL'];
  const saved = keys.map(key => process.env[key]);
  const state: any = { posts: 0, plans: [], locked: false, account: { phase: options.phase || 'idle' }, created: Boolean(options.existing), events: new Set<string>(options.events || []) };
  try {
    Object.assign(process.env, { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'test-anon', SUPABASE_SERVICE_ROLE_KEY: 'test-service', ASAAS_API_KEY: 'test-asaas', ASAAS_WEBHOOK_TOKEN: 'test-webhook', ASAAS_API_URL: 'https://api-sandbox.asaas.com/v3' });
    globalThis.fetch = async (input, init) => {
      const url = new URL(String(input));
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (url.pathname === '/auth/v1/user') return Response.json({ id: USER, email: 'test@example.invalid' });
      if (url.pathname.endsWith('/pn_claim_billing')) {
        if (state.locked) return Response.json({ acquired: false });
        state.locked = true;
        return Response.json({ acquired: true, account: structuredClone(state.account) });
      }
      if (url.pathname.endsWith('/pn_release_billing')) { state.locked = false; return Response.json(null); }
      if (url.pathname.endsWith('/pn_apply_billing_event')) {
        const duplicate = state.events.has(body.p_event_id);
        if (!duplicate) { state.plans.push(body.p_plan); state.events.add(body.p_event_id); }
        return Response.json({ duplicate });
      }
      if (url.pathname.endsWith('/pn_billing_accounts')) {
        Object.assign(state.account, body);
        return Response.json({ user_id: USER });
      }
      if (url.pathname.endsWith('/pn_billing_events')) {
        const id = url.searchParams.get('event_id')?.replace(/^eq\./, '');
        return Response.json(state.events.has(id) ? [{ event_id: id }] : []);
      }
      if (url.pathname === '/v3/subscriptions' && init?.method === 'POST') {
        state.posts++;
        if (options.createGate) await options.createGate();
        if (options.ambiguous) throw new Error('Connection lost after POST');
        state.created = true;
        return Response.json({ id: 'sub_test' });
      }
      if (url.pathname === '/v3/subscriptions') return Response.json({ data: state.created ? [{ id: 'sub_test', customer: 'cus_test', externalReference: USER }] : [], hasMore: false });
      if (url.pathname === '/v3/customers') return Response.json({ data: [{ id: 'cus_test', cpfCnpj: '12345678901' }], hasMore: false });
      if (url.pathname === '/v3/subscriptions/sub_test/payments') {
        if (options.paymentFailure) return Response.json({}, { status: 500 });
        return Response.json({ data: options.paid ? [{ id: 'pay_test', dueDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }), status: 'RECEIVED' }] : [{ id: 'pay_test', dueDate: '2026-10-13', status: 'PENDING', invoiceUrl: 'https://www.asaas.com/i/test' }], hasMore: false });
      }
      throw new Error(`Unexpected request: ${url.pathname}`);
    };
    await run(state);
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, i) => saved[i] === undefined ? delete process.env[key] : process.env[key] = saved[i]);
  }
}

test('repetir checkout reutiliza a assinatura e o link, sem criar outra cobrança', async () => {
  await scenario({}, async state => {
    const first = response(); const second = response();
    await checkout(request(), first); await checkout(request(), second);
    assert.equal(first.code, 200); assert.equal(second.code, 200);
    assert.equal(first.body.url, second.body.url);
    assert.equal(second.body.reused, true);
    assert.equal(state.posts, 1);
  });
});

test('checkouts simultâneos não executam dois POSTs de assinatura', async () => {
  let entered: () => void; let release: () => void;
  const started = new Promise<void>(resolve => entered = resolve);
  const gate = new Promise<void>(resolve => release = resolve);
  await scenario({ createGate: async () => { entered(); await gate; } }, async state => {
    const first = response(); const second = response();
    const firstRequest = checkout(request(), first);
    await started;
    await checkout(request(), second);
    assert.equal(second.code, 409);
    release(); await firstRequest;
    assert.equal(first.code, 200);
    assert.equal(state.posts, 1);
  });
});

test('timeout depois de POST mantém a tentativa inconclusiva e não repete a criação', async () => {
  await scenario({ ambiguous: true }, async state => {
    const first = response(); const second = response();
    await checkout(request(), first); await checkout(request(), second);
    assert.equal(first.code, 503); assert.equal(second.code, 503);
    assert.equal(state.account.phase, 'uncertain');
    assert.equal(state.posts, 1);
  });
});

test('assinatura já paga não apresenta outra cobrança', async () => {
  await scenario({ existing: true, paid: true }, async state => {
    const res = response(); await checkout(request(), res);
    assert.equal(res.code, 409); assert.equal(state.posts, 0);
  });
});

test('webhook repetido não aplica o plano novamente', async () => {
  await scenario({ existing: true, paid: true }, async state => {
    const event = { method: 'POST', headers: { 'asaas-access-token': 'test-webhook' }, body: { id: 'evt_test', event: 'PAYMENT_RECEIVED', payment: { externalReference: USER } } };
    const first = response(); const second = response();
    await webhook(event, first); await webhook(event, second);
    assert.equal(first.code, 200); assert.equal(second.body.duplicate, true);
    assert.deepEqual(state.plans, ['pro']);
  });
});

test('notificação antiga de atraso não rebaixa uma assinatura paga atualmente', async () => {
  await scenario({ existing: true, paid: true }, async state => {
    const res = response();
    await webhook({ method: 'POST', headers: { 'asaas-access-token': 'test-webhook' }, body: { id: 'evt_old', event: 'PAYMENT_OVERDUE', payment: { externalReference: USER } } }, res);
    assert.equal(res.code, 200); assert.deepEqual(state.plans, ['pro']);
  });
});

test('falha ao reconciliar o Asaas não registra sucesso nem muda o plano', async () => {
  await scenario({ existing: true, paymentFailure: true }, async state => {
    const res = response();
    await webhook({ method: 'POST', headers: { 'asaas-access-token': 'test-webhook' }, body: { id: 'evt_failure', event: 'PAYMENT_RECEIVED', payment: { externalReference: USER } } }, res);
    assert.equal(res.code, 502); assert.deepEqual(state.plans, []);
    assert.equal(state.events.has('evt_failure'), false);
  });
});

test('pagamentos cancelados/refundados e períodos encerrados não concedem Pro', () => {
  assert.equal(paymentGrantsAccess({ status: 'REFUNDED', dueDate: '2026-10-01' }, '2026-10-13'), false);
  assert.equal(paymentGrantsAccess({ status: 'RECEIVED', deleted: true, dueDate: '2026-10-01' }, '2026-10-13'), false);
  assert.equal(paymentGrantsAccess({ status: 'RECEIVED', dueDate: '2026-09-01' }, '2026-10-13'), false);
  assert.equal(paymentGrantsAccess({ status: 'RECEIVED', dueDate: '2026-09-01', paymentDate: '2026-10-12' }, '2026-10-13'), true);
  assert.equal(paymentGrantsAccess({ status: 'RECEIVED', dueDate: '2026-01-31' }, '2026-02-27'), true);
  assert.equal(paymentGrantsAccess({ status: 'RECEIVED', dueDate: '2026-01-31' }, '2026-02-28'), false);
});
