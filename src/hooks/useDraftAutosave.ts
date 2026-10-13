import { useCallback, useEffect, useRef, useState } from 'react';
import type { EditorDraft } from '../types';
import { acknowledgeDraft, loadDraft, saveDraft } from '../lib/editorStorage';
import { hasContent, type SaveResult } from '../lib/propertyPersistence';
import { SaveQueue } from '../lib/saveQueue';

type Status = 'loading' | 'saving' | 'local' | 'syncing' | 'saved' | 'error' | 'conflict' | 'limit';
type SaveJob = { owner: string; draft: EditorDraft };

export function useDraftAutosave(owner: string | null, draft: EditorDraft,
  restore: (draft?: EditorDraft) => void, sync: (draft: EditorDraft) => Promise<SaveResult>) {
  const [readyOwner, setReadyOwner] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [recovered, setRecovered] = useState(false);
  const latest = useRef({ owner, draft, restore, sync });
  latest.current = { owner, draft, restore, sync };
  const cloudRevisions = useRef(new Map<string, string>());
  const locallySaved = useRef('');
  const cloudSaved = useRef('');
  const abandoned = useRef(new Set<string>());
  const localQueue = useRef<SaveQueue<{ owner: string; draft: EditorDraft }, void>>(null);
  const cloudQueue = useRef<SaveQueue<{ owner: string; draft: EditorDraft }, SaveResult>>(null);
  if (!localQueue.current) localQueue.current = new SaveQueue<SaveJob, void>(async job => {
    await saveDraft(job.owner, { ...job.draft, cloudRevision: cloudRevisions.current.get(job.draft.id) || job.draft.cloudRevision });
    if (latest.current.owner === job.owner && latest.current.draft.revision === job.draft.revision) {
      locallySaved.current = job.draft.revision;
      setStatus(cloudSaved.current === job.draft.revision ? 'saved' : 'local');
    }
  });
  if (!cloudQueue.current) cloudQueue.current = new SaveQueue<SaveJob, SaveResult>(async job => {
    if (latest.current.owner !== job.owner || abandoned.current.has(job.draft.id)) return { success: true, cloudSynced: false };
    const snapshot = { ...job.draft, cloudRevision: cloudRevisions.current.get(job.draft.id) || job.draft.cloudRevision };
    if (job.draft.revision === latest.current.draft.revision) setStatus('syncing');
    const result = await latest.current.sync(snapshot);
    if (result.cloudSynced) {
      cloudRevisions.current.set(snapshot.id, snapshot.revision);
      await acknowledgeDraft(job.owner, snapshot.id, snapshot.revision);
      cloudSaved.current = snapshot.revision;
    }
    if (latest.current.owner === job.owner && latest.current.draft.revision === snapshot.revision) {
      setStatus(result.reason === 'conflict' ? 'conflict' : result.reason === 'limit' ? 'limit' : result.cloudSynced ? 'saved' : 'local');
    }
    return result;
  });

  useEffect(() => {
    let active = true;
    setReadyOwner(null);
    locallySaved.current = '';
    cloudSaved.current = '';
    cloudRevisions.current.clear();
    setStatus('loading');
    setRecovered(false);
    if (!owner) return;
    loadDraft(owner).then(saved => {
      if (!active) return;
      if (saved?.cloudRevision) cloudRevisions.current.set(saved.id, saved.cloudRevision);
      latest.current.restore(saved);
      setRecovered(Boolean(saved && hasContent(saved)));
      setReadyOwner(owner);
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [owner]);

  const flushLocal = useCallback(async () => {
    const current = latest.current;
    if (!current.owner || readyOwner !== current.owner) return;
    try {
      await localQueue.current!.enqueue({ owner: current.owner, draft: current.draft });
    } catch (error) { setStatus('error'); throw error; }
  }, [readyOwner]);

  const saveNow = useCallback(async (): Promise<SaveResult> => {
    const current = latest.current;
    if (!current.owner || readyOwner !== current.owner) return { success: false, cloudSynced: false };
    try {
      await flushLocal();
      return await cloudQueue.current!.enqueue({ owner: current.owner, draft: current.draft });
    } catch (error) { setStatus('error'); return { success: false, cloudSynced: false }; }
  }, [readyOwner, flushLocal]);

  useEffect(() => {
    if (!owner || readyOwner !== owner) return;
    setStatus('saving');
    const localTimer = window.setTimeout(() => { void flushLocal().catch(() => {}); }, 400);
    const cloudTimer = window.setTimeout(() => {
      if (hasContent(latest.current.draft)) void saveNow();
    }, 2000);
    return () => { clearTimeout(localTimer); clearTimeout(cloudTimer); };
  }, [owner, readyOwner, draft, flushLocal, saveNow]);

  useEffect(() => {
    if (!owner || readyOwner !== owner) return;
    const flush = () => { void flushLocal().catch(() => {}); };
    const visibility = () => { if (document.visibilityState === 'hidden') flush(); };
    const online = () => { if (hasContent(latest.current.draft)) void saveNow(); };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (hasContent(latest.current.draft) && locallySaved.current !== latest.current.draft.revision) {
        flush();
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('online', online);
    window.addEventListener('offline', flush);
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', flush);
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [owner, readyOwner, flushLocal, saveNow]);

  const selectRevision = (id: string, revision?: string) => {
    if (revision) cloudRevisions.current.set(id, revision);
    else cloudRevisions.current.delete(id);
  };
  const abandon = async (id: string) => {
    abandoned.current.add(id);
    await cloudQueue.current!.idle();
  };
  return { status, recovered, ready: Boolean(owner && readyOwner === owner), saveNow, flushLocal, selectRevision, abandon,
    getRevision: (id: string) => cloudRevisions.current.get(id), dismissRecovered: () => setRecovered(false) };
}
