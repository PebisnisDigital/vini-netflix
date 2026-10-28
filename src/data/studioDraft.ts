import type { ClientBrief } from './clientModel';

export type StudioDraft = {
  slug: string;
  brief: ClientBrief;
  portrait: File | null;
  projectPhotos: Record<number, File>;
  watchPhotos?: Record<number, File>;
  pickPhotos?: Record<number, File>;
  mode: 'create' | 'edit';
  updatedAt: number;
};

const DB_NAME = 'personalflix-studio-v1';
const STORE = 'drafts';

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('Browser ini tidak mendukung penyimpanan draft.')); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE, { keyPath: 'slug' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = operation(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function saveDraft(draft: StudioDraft) { await transaction('readwrite', (store) => store.put(draft)); }
export async function getDraft(slug: string): Promise<StudioDraft | undefined> { return transaction('readonly', (store) => store.get(slug)); }
export async function listDrafts(): Promise<StudioDraft[]> { return transaction('readonly', (store) => store.getAll()); }
export async function deleteDraft(slug: string) { await transaction('readwrite', (store) => store.delete(slug)); }

export const clientBriefBlank = (): ClientBrief => ({
  slug: '', name: '', role: '', location: '', bio: '', tagline: [], interests: [],
  photo: { src: '', alt: '' }, email: '', links: { website: '', linkedin: '', github: '' },
  projects: [{ title: '', year: String(new Date().getFullYear()), description: '', category: 'Portofolio', tags: [], website: '', image: '' }],
  experiences: [], education: [], skills: [], highlights: [],
});

export function preparedBrief(draft: StudioDraft): ClientBrief {
  const { brief, portrait, projectPhotos, watchPhotos = {}, pickPhotos = {} } = draft;
  const ext = (file: File) => file.name.split('.').pop()?.toLowerCase() || 'webp';
  return {
    ...brief,
    photo: { ...brief.photo, src: portrait ? `/clients/${brief.slug}/foto-utama.${ext(portrait)}` : brief.photo.src },
    projects: brief.projects.map((project, i) => ({ ...project, image: projectPhotos[i] ? `/clients/${brief.slug}/karya-${i + 1}.${ext(projectPhotos[i])}` : project.image || '' })),
    watchCards: brief.watchCards?.map((card, i) => ({ ...card, image: watchPhotos[i] ? `/clients/${brief.slug}/jelajah-${i + 1}.${ext(watchPhotos[i])}` : card.image || '' })),
    pickCards: brief.pickCards?.map((card, i) => ({ ...card, image: pickPhotos[i] ? `/clients/${brief.slug}/pilihan-${i + 1}.${ext(pickPhotos[i])}` : card.image || '' })),
  };
}
