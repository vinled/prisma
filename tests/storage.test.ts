import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { acknowledgeDraft, loadDraft, loadProperties, putProperty, saveDraft } from '../src/lib/editorStorage';
import { SaveQueue } from '../src/lib/saveQueue';
import { persistProperty } from '../src/lib/propertyPersistence';
import type { EditorDraft } from '../src/types';

function draft(id = crypto.randomUUID()): EditorDraft {
  return {
    id, revision: crypto.randomUUID(), updatedAt: Date.now(),
    details: { title: 'Teste', price: '', neighborhood: '', city: '', state: '', area: '', bedrooms: '', suites: '', bathrooms: '', parking: '', propertyCode: '', propertyType: '', propertySubtype: '', amenities: [], differentials: [], leisureArea: null, whatsapp: '', images: [] },
    selectedTemplate: 'modern', aspectRatio: 'story', templateOptions: { badge: 'VENDIDO', gradientOpacity: 40 }, applyBrandKit: false, step: 3, previewIndex: 0,
  };
}

test('rascunho mantém fotos acima da capacidade habitual do localStorage e todos os ajustes', async () => {
  const saved = draft();
  saved.details.images = ['data:image/jpeg;base64,' + 'A'.repeat(6 * 1024 * 1024)];
  await saveDraft('owner-large', saved);
  assert.deepEqual(await loadDraft('owner-large'), saved);
});

test('rascunhos e imóveis de uma conta não aparecem em outra', async () => {
  const saved = draft();
  await saveDraft('owner-a', saved);
  const result = await persistProperty(saved, 'owner-a', null, 'free');
  assert.equal(result.success, true);
  assert.equal(await loadDraft('owner-b'), undefined);
  assert.deepEqual(await loadProperties('owner-b'), []);
  assert.equal((await loadProperties('owner-a'))[0].id, saved.id);
});

test('confirmação antiga da nuvem não substitui a edição mais recente', async () => {
  const old = draft();
  const newer = { ...old, revision: crypto.randomUUID(), details: { ...old.details, title: 'Editado durante o envio' } };
  await saveDraft('owner-ack', newer);
  await acknowledgeDraft('owner-ack', old.id, old.revision);
  const recovered = await loadDraft('owner-ack');
  assert.equal(recovered.details.title, newer.details.title);
  assert.equal(recovered.revision, newer.revision);
  assert.equal(recovered.cloudRevision, old.revision);
});

test('fila serializa os envios e agrupa alterações pendentes pela edição mais recente', async () => {
  let release: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const writes: number[] = [];
  const queue = new SaveQueue<number, number>(async value => {
    writes.push(value);
    if (value === 1) await gate;
    return value;
  });
  const first = queue.enqueue(1);
  const second = queue.enqueue(2);
  const third = queue.enqueue(3);
  release();
  assert.deepEqual(await Promise.all([first, second, third]), [1, 3, 3]);
  assert.deepEqual(writes, [1, 3]);
});

test('falha no banco deixa as fotos e o imóvel salvos localmente', async () => {
  const saved = draft();
  saved.details.images = ['data:image/jpeg;base64,AAAA'];
  const fakeClient = { from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ error: new Error('Offline') }) }) }) }) }) };
  const result = await persistProperty(saved, 'owner-offline', fakeClient as any, 'free');
  assert.equal(result.success, true);
  assert.equal(result.cloudSynced, false);
  assert.deepEqual((await loadProperties('owner-offline'))[0].details.images, saved.details.images);
});

test('versão remota diferente impede sobrescrita de alterações feitas em outro aparelho', async () => {
  const saved = draft();
  let writes = 0;
  const fakeClient = { from: () => ({
    select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: saved.id, details: { editor_meta: { revision: 'other-device' } } } }) }) }) }),
    update: () => { writes++; throw new Error('Não deveria atualizar'); },
  }) };
  const result = await persistProperty(saved, 'owner-conflict', fakeClient as any, 'free');
  assert.equal(result.reason, 'conflict');
  assert.equal(writes, 0);
  assert.equal((await loadProperties('owner-conflict'))[0].pendingSync, true);
});

test('escritas concorrentes de imóveis distintos preservam os dois registros', async () => {
  const a = await persistProperty(draft(), 'owner-concurrent-source', null, 'pro');
  const b = { ...a.property, id: crypto.randomUUID() };
  await Promise.all([putProperty('owner-concurrent', a.property), putProperty('owner-concurrent', b)]);
  assert.equal((await loadProperties('owner-concurrent')).length, 2);
});

test('resposta antiga da nuvem não apaga uma edição nova da lista de imóveis', async () => {
  const a = await persistProperty(draft(), 'owner-late', null, 'pro');
  const newer = { ...a.property, details: { ...a.property.details, title: 'Novo', editor_meta: { ...a.property.details.editor_meta, updatedAt: a.property.details.editor_meta.updatedAt + 1 } }, pendingSync: true };
  await putProperty('owner-late', newer);
  await putProperty('owner-late', { ...a.property, cloudRevision: 'ack-old', pendingSync: false });
  const recovered = (await loadProperties('owner-late'))[0];
  assert.equal(recovered.details.title, 'Novo');
  assert.equal(recovered.pendingSync, true);
  assert.equal(recovered.cloudRevision, 'ack-old');
});
