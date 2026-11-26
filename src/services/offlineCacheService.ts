export interface OfflineStudyPack {
  id: string;
  title: string;
  category: 'JAMB Scheme' | 'JAMB Past Questions' | 'Curriculum Lesson' | 'JSS Syllabus';
  stream?: string;
  itemCount: number;
  sizeKB: number;
  savedAt: string;
  payload: any;
}

const OFFLINE_STORAGE_KEY = 'ilearnit_offline_study_packs_v1';
const LOW_DATA_KEY = 'ilearnit_low_data_mode_v1';

export function getOfflinePacks(): OfflineStudyPack[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isPackSavedOffline(packId: string): boolean {
  return getOfflinePacks().some((p) => p.id === packId);
}

export function savePackOffline(pack: Omit<OfflineStudyPack, 'savedAt' | 'sizeKB'>): OfflineStudyPack[] {
  const current = getOfflinePacks().filter((p) => p.id !== pack.id);
  const serialized = JSON.stringify(pack.payload || {});
  const sizeKB = Math.max(2, Math.round((serialized.length * 2) / 1024));
  const entry: OfflineStudyPack = {
    ...pack,
    sizeKB,
    savedAt: new Date().toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
  const updated = [entry, ...current];
  try {
    window.localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ilearnit:offline_packs_updated', { detail: updated }));
  } catch (err) {
    console.warn('Offline storage limit reached:', err);
  }
  return updated;
}

export function removeOfflinePack(packId: string): OfflineStudyPack[] {
  const updated = getOfflinePacks().filter((p) => p.id !== packId);
  try {
    window.localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ilearnit:offline_packs_updated', { detail: updated }));
  } catch {}
  return updated;
}

export function getLowDataMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(LOW_DATA_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setLowDataMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOW_DATA_KEY, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('ilearnit:low_data_changed', { detail: enabled }));
  } catch {}
}
