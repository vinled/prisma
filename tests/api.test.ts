import test from 'node:test';
import assert from 'node:assert/strict';
import cancel from '../api/cancel-subscription';
import caption from '../api/generate-caption';
import checkout from '../api/create-checkout';
import webhook from '../api/webhook/asaas';

function response() {
  return {
    code: 200, body: null as any,
    setHeader() {},
    status(code: number) { this.code = code; return this; },
    json(body: any) { this.body = body; return this; },
    end() {},
  };
}

test('APIs privadas recusam requisições sem autenticação', async () => {
  for (const handler of [cancel, caption, checkout]) {
    const res = response();
    await handler({ method: 'POST', headers: {}, body: {} }, res);
    assert.equal(res.code, 401);
  }
});

test('webhook recusa token ausente sem consultar o banco', async () => {
  const res = response();
  await webhook({ method: 'POST', headers: {}, body: {} }, res);
  assert.equal(res.code, 401);
});

test('checkout recusa CPF inválido antes de criar cobrança', async () => {
  const res = response();
  await checkout({ method: 'POST', headers: { authorization: 'Bearer test-token' }, body: { cpf: '123' } }, res);
  assert.equal(res.code, 400);
});

test('falha no cancelamento não rebaixa o plano nem informa sucesso', async () => {
  const originalFetch = globalThis.fetch;
  const keys = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'ASAAS_API_KEY'];
  const originalEnv = keys.map(key => process.env[key]);
  const calls: string[] = [];
  try {
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    process.env.ASAAS_API_KEY = 'test-asaas-key';
    globalThis.fetch = async (input, init) => {
      const url = String(input);
      calls.push(`${init?.method || 'GET'} ${url}`);
      if (url.includes('/auth/v1/user')) return Response.json({ id: '00000000-0000-4000-8000-000000000001', email: 'test@example.com' });
      if (url.includes('/rpc/pn_claim_billing')) return Response.json({ acquired: true, account: { phase: 'idle' } });
      if (url.includes('/rpc/pn_release_billing')) return Response.json(null);
      if (init?.method === 'DELETE') return Response.json({ error: 'Provider unavailable' }, { status: 500 });
      if (url.includes('/subscriptions?')) return Response.json({ data: [{ id: 'sub_test' }] });
      throw new Error(`Unexpected request: ${url}`);
    };
    const res = response();
    await cancel({ method: 'POST', headers: { authorization: 'Bearer test-token' } }, res);
    assert.equal(res.code, 502);
    assert.notEqual(res.body.success, true);
    assert.ok(calls.some(call => call.startsWith('DELETE')));
    assert.ok(!calls.some(call => call.includes('/rest/v1/profiles')));
    assert.ok(!calls.some(call => call.includes('pn_apply_billing_event')));
  } finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, index) => {
      if (originalEnv[index] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[index];
    });
  }
});
