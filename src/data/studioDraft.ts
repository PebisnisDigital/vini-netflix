import type { ClientBrief } from './clientModel';
import noahInna from './clients/noahinna.json';

export type StudioDraft = {
  slug: string;
  brief: ClientBrief;
  portrait: File | null;
  projectPhotos: Record<number, File>;
  watchPhotos?: Record<number, File>;
  pickPhotos?: Record<number, File>;
  episodePhotos?: Record<string, File>;
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
/** Isi hanya kartu contoh Noah Inna yang belum pernah diberi judul/keterangan sendiri. */
export function completeNoahInnaDraft(draft: StudioDraft): StudioDraft {
  if (draft.slug !== 'noahinna' && draft.brief.slug !== 'noahinna') return draft;
  let changed = false;
  const projects = draft.brief.projects.map((project, index) => {
    if (index < 4 || index > 6) return project;
    const published = noahInna.projects[index];
    if (!published) return project;
    const title = project.title.trim();
    const genericTitle = !title || /^KARYA\s*[5-7]$/i.test(title);
    const matchedTitle = title === published.title;
    if (!genericTitle && !matchedTitle) return project;
    const genericDescription = !project.description.trim() || project.description.trim() === 'Ceritakan karya unggulan klien di sini.';
    const completed = {
      ...project,
      title: genericTitle ? published.title : project.title,
      description: genericDescription ? published.description : project.description,
      category: !project.category || project.category === 'Portofolio' ? published.category : project.category,
      year: !project.year || /^20\d{2}$/.test(project.year) ? published.year : project.year,
      tags: project.tags?.length ? project.tags : published.tags,
      website: project.website || published.website || '',
      image: project.image || published.image || '',
    };
    if (JSON.stringify(completed) !== JSON.stringify(project)) changed = true;
    return completed;
  });
  return changed ? { ...draft, brief: { ...draft.brief, projects }, updatedAt: Date.now() } : draft;
}

export async function listDrafts(): Promise<StudioDraft[]> {
  const existing = await transaction<StudioDraft[]>('readonly', (store) => store.getAll());
  const completed = existing.map(completeNoahInnaDraft);
  for (let i = 0; i < completed.length; i++) {
    if (completed[i] !== existing[i]) await saveDraft(completed[i]);
  }
  return completed;
}
export async function deleteDraft(slug: string) { await transaction('readwrite', (store) => store.delete(slug)); }

export const clientBriefBlank = (): ClientBrief => ({
  slug: '', name: '', role: '', location: '', bio: '', tagline: [], interests: [],
  photo: { src: '', alt: '' }, email: '', whatsapp: '', links: { website: '', linkedin: '', github: '' },
  projects: [{ title: '', year: String(new Date().getFullYear()), description: '', category: 'Portofolio', tags: [], website: '', image: '' }],
  experiences: [], education: [], skills: [], highlights: [],
});

export function preparedBrief(draft: StudioDraft): ClientBrief {
  const { brief, portrait, projectPhotos, watchPhotos = {}, pickPhotos = {}, episodePhotos = {} } = draft;
  const ext = (file: File) => file.name.split('.').pop()?.toLowerCase() || 'webp';
  return {
    ...brief,
    photo: { ...brief.photo, src: portrait ? `/clients/${brief.slug}/foto-utama.${ext(portrait)}` : brief.photo.src },
    projects: brief.projects.map((project, i) => ({ ...project, image: projectPhotos[i] ? `/clients/${brief.slug}/karya-${i + 1}.${ext(projectPhotos[i])}` : project.image || '' })),
    watchCards: brief.watchCards?.map((card, i) => ({ ...card, image: watchPhotos[i] ? `/clients/${brief.slug}/jelajah-${i + 1}.${ext(watchPhotos[i])}` : card.image || '' })),
    pickCards: brief.pickCards?.map((card, i) => ({ ...card, image: pickPhotos[i] ? `/clients/${brief.slug}/pilihan-${i + 1}.${ext(pickPhotos[i])}` : card.image || '' })),
    seasons: brief.seasons?.map((season, i) => ({ ...season, episodes: season.episodes.map((episode, j) => ({ ...episode, image: episodePhotos[`${i}-${j}`] ? `/clients/${brief.slug}/musim-${i + 1}-episode-${j + 1}.${ext(episodePhotos[`${i}-${j}`])}` : episode.image || '' })) })),
  };
}
