import type { EditorDraft, SavedProperty } from '../types';

const DB_NAME = 'postnamao-editor';
const STORE = 'records';
let database: Promise<IDBDatabase> | undefined;

function openDatabase() {
  if (!database) database = new Promise<IDBDatabase>((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('Armazenamento indisponível.')); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => {
      request.result.onversionchange = () => { request.result.close(); database = undefined; };
      resolve(request.result);
    };
    request.onerror = () => { database = undefined; reject(request.error); };
    request.onblocked = () => reject(new Error('Feche outras abas para atualizar o armazenamento.'));
  });
  return database;
}

async function read<T>(key: string): Promise<T | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function write(key: string, value: unknown): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = tx.onabort = () => reject(tx.error || new Error('Não foi possível salvar.'));
  });
}

export function loadDraft(owner: string) { return read<EditorDraft>(`draft:${owner}`); }
export function saveDraft(owner: string, draft: EditorDraft) { return write(`draft:${owner}`, draft); }

export async function acknowledgeDraft(owner: string, id: string, revision: string) {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.get(`draft:${owner}`);
    request.onsuccess = () => {
      const draft = request.result as EditorDraft | undefined;
      if (draft?.id === id) store.put({ ...draft, cloudRevision: revision }, `draft:${owner}`);
    };
    tx.oncomplete = () => resolve();
    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}

export async function loadProperties(owner = 'local'): Promise<SavedProperty[]> {
  const saved = await read<SavedProperty[]>(`properties:${owner}`);
  if (saved) return saved;
  // Import only the current owner's existing cache; keep the original as a backup.
  const raw = globalThis.localStorage?.getItem(`postnamao_saved_properties_${owner}`);
  try {
    const legacy = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(legacy)) return [];
    if (legacy.length) await write(`properties:${owner}`, legacy);
    return legacy;
  } catch { return []; }
}

export function saveProperties(properties: SavedProperty[], owner = 'local') {
  return write(`properties:${owner}`, properties);
}

export async function putProperty(owner: string, property: SavedProperty): Promise<SavedProperty[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.get(`properties:${owner}`);
    let properties: SavedProperty[];
    request.onsuccess = () => {
      const previous = (request.result || []) as SavedProperty[];
      const current = previous.find(p => p.id === property.id);
      // An older cloud response may acknowledge a revision, but must not erase newer edits.
      const incomingTime = property.details.editor_meta?.updatedAt || 0;
      const currentTime = current?.details.editor_meta?.updatedAt || 0;
      const next = current && currentTime > incomingTime
        ? { ...current, cloudRevision: property.cloudRevision || current.cloudRevision }
        : property;
      properties = [next, ...previous.filter(p => p.id !== property.id)];
      store.put(properties, `properties:${owner}`);
    };
    tx.oncomplete = () => resolve(properties);
    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}
