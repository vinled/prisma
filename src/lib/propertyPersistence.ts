import type { SupabaseClient } from '@supabase/supabase-js';
import type { EditorDraft, SavedProperty } from '../types';
import { putProperty } from './editorStorage';

export interface SaveResult {
  success: boolean;
  cloudSynced: boolean;
  property?: SavedProperty;
  properties?: SavedProperty[];
  reason?: 'offline' | 'limit' | 'conflict' | 'cloud' | 'empty';
}

export function hasContent(draft: EditorDraft) {
  const d = draft.details;
  return Boolean(d.images?.length || d.title || d.propertyType || d.neighborhood || d.city || d.price || d.rent_price || d.area);
}

const imageCache = new Map<string, string>();

export async function persistProperty(draft: EditorDraft, owner: string, client: SupabaseClient | null, plan: 'free' | 'pro'): Promise<SaveResult> {
  if (!hasContent(draft)) return { success: true, cloudSynced: false, reason: 'empty' };
  let property: SavedProperty = {
    id: draft.id,
    date: new Date(draft.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    details: { ...draft.details, editor_meta: { revision: draft.revision, updatedAt: draft.updatedAt, applyBrandKit: draft.applyBrandKit, step: draft.step } },
    selectedTemplate: draft.selectedTemplate,
    aspectRatio: draft.aspectRatio,
    templateOptions: draft.templateOptions,
    thumbnail: draft.details.images?.[0],
    pendingSync: Boolean(client),
    cloudRevision: draft.cloudRevision,
  };
  let properties = await putProperty(owner, property);
  const local = (reason?: SaveResult['reason']): SaveResult => ({ success: true, cloudSynced: false, property, properties, reason });
  if (!client) return local();
  if (globalThis.navigator?.onLine === false) return local('offline');
  try {
    const { data: existing, error: readError } = await client.from('properties').select('id, details').eq('id', draft.id).eq('user_id', owner).maybeSingle();
    if (readError) throw readError;
    const remoteRevision = existing?.details?.editor_meta?.revision;
    if (existing && remoteRevision !== draft.cloudRevision) return local('conflict');
    if (!existing && plan !== 'pro') {
      const { count, error } = await client.from('properties').select('id', { count: 'exact', head: true }).eq('user_id', owner);
      if (error || count === null) throw error || new Error('Contagem indisponível.');
      if (count >= 5) return local('limit');
    }
    const images: string[] = [];
    for (const source of draft.details.images || []) {
      if (!source.startsWith('data:') && !source.startsWith('blob:')) { images.push(source); continue; }
      const cacheKey = `${owner}:${draft.id}:${source}`;
      const cached = imageCache.get(cacheKey);
      if (cached) { images.push(cached); continue; }
      const blob = await (await fetch(source)).blob();
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())), b => b.toString(16).padStart(2, '0')).join('');
      const name = `${owner}/${draft.id}/${hash}.${blob.type === 'image/png' ? 'png' : 'jpg'}`;
      const { error } = await client.storage.from('fotos_imoveis').upload(name, blob, { contentType: blob.type, upsert: false });
      if (error && (error as any).statusCode !== '409' && (error as any).statusCode !== 409) throw error;
      const { data } = client.storage.from('fotos_imoveis').getPublicUrl(name);
      imageCache.set(cacheKey, data.publicUrl);
      if (imageCache.size > 30) imageCache.delete(imageCache.keys().next().value!);
      images.push(data.publicUrl);
    }
    const payload: any = {
      id: draft.id, user_id: owner,
      details: { ...property.details, images }, selected_template: draft.selectedTemplate,
      aspect_ratio: draft.aspectRatio, template_options: draft.templateOptions,
      thumbnail: images[0] || null,
    };
    let saved;
    if (existing) {
      let query = client.from('properties').update(payload).eq('id', draft.id).eq('user_id', owner);
      query = remoteRevision ? query.eq('details->editor_meta->>revision', remoteRevision) : query.is('details->editor_meta->>revision', null);
      saved = await query.select('id');
      if (!saved.error && !saved.data?.length) return local('conflict');
    } else saved = await client.from('properties').insert(payload).select('id');
    if (saved.error) throw saved.error;
    property = { ...property, details: payload.details, thumbnail: images[0], pendingSync: false, cloudRevision: draft.revision };
    properties = await putProperty(owner, property);
    return { success: true, cloudSynced: true, property, properties };
  } catch (error) {
    console.warn('Rascunho salvo localmente; sincronização pendente:', error);
    if ((error as any)?.code === '23514' || String((error as any)?.message).includes('Limite de 5 imóveis')) return local('limit');
    return local('cloud');
  }
}
