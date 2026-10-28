import { useCallback, useEffect, useRef, useState } from 'react';
import { createCanvasPortfolio, DEFAULT_THEME, normalizeSlug, type ClientBrief } from '../data/clientModel';
import { preparedBrief, type StudioDraft } from '../data/studioDraft';

type CanvasProps = {
  draft: StudioDraft;
  patch: (changes: Partial<ClientBrief>) => void;
  changeProject: (index: number, changes: Partial<ClientBrief['projects'][number]>) => void;
  setPhoto: (index: number | null, file: File | null) => void;
  setWatchPhoto: (index: number, file: File) => void;
  watchAction: (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index?: number) => void;
  reorder: (index: number, direction: number) => void;
  removeProject: (index: number) => void;
  notice: (text: string) => void;
};

const splitItems = (value: string) => value.split(/[\n,•]+/).map((v) => v.trim()).filter(Boolean);
const newProject = (): ClientBrief['projects'][number] => ({ title: '', description: '', category: 'Portofolio', year: String(new Date().getFullYear()), tags: [], website: '', image: '' });

async function fitImage(file: File): Promise<File> {
  if (!/^image\/(png|jpeg|webp|avif)$/.test(file.type)) throw new Error('Foto harus berupa PNG, JPG, WebP, atau AVIF.');
  if (file.size <= 2_500_000) return file;
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
    if (!blob || blob.size > 2_500_000) throw new Error('Foto terlalu besar. Kompres sampai maksimal 2,5 MB.');
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
  } finally { bitmap.close(); }
}

/** Editor visual tanpa sidebar: kanvas publik dipakai langsung sebagai tempat penyuntingan. */
export default function ElementorCanvas({ draft, patch, changeProject, setPhoto, setWatchPhoto, watchAction, reorder, removeProject, notice }: CanvasProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const latest = useRef({ draft, patch, changeProject, setPhoto, setWatchPhoto, watchAction, reorder, removeProject, notice });
  latest.current = { draft, patch, changeProject, setPhoto, setWatchPhoto, watchAction, reorder, removeProject, notice };
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [photoUrls, setPhotoUrls] = useState<{ portrait: string; projects: Record<number, string>; watch: Record<number, string> }>({ portrait: '', projects: {}, watch: {} });
  const current = preparedBrief(draft);

  useEffect(() => {
    const urls: string[] = [];
    const portrait = draft.portrait ? URL.createObjectURL(draft.portrait) : '';
    if (portrait) urls.push(portrait);
    const projects: Record<number, string> = {};
    for (const [index, file] of Object.entries(draft.projectPhotos)) {
      projects[Number(index)] = URL.createObjectURL(file);
      urls.push(projects[Number(index)]);
    }
    const watch: Record<number, string> = {};
    for (const [index, file] of Object.entries(draft.watchPhotos || {})) {
      watch[Number(index)] = URL.createObjectURL(file);
      urls.push(watch[Number(index)]);
    }
    setPhotoUrls({ portrait, projects, watch });
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [draft.portrait, draft.projectPhotos, draft.watchPhotos]);

  const sendCanvas = useCallback(() => {
    const content = structuredClone(createCanvasPortfolio(current));
    if (photoUrls.portrait) { content.profile.portrait.src = photoUrls.portrait; content.profile.portrait.srcSet = ''; }
    for (const [index, url] of Object.entries(photoUrls.projects)) if (content.projects[Number(index)]) content.projects[Number(index)].image = url;
    for (const [index, url] of Object.entries(photoUrls.watch)) if (content.watchCards?.[Number(index)]) content.watchCards[Number(index)].image = url;
    frame.current?.contentWindow?.postMessage({ type: 'PESONAFLIX_CANVAS_UPDATE', content }, location.origin);
  }, [current, photoUrls]);

  useEffect(() => { sendCanvas(); }, [sendCanvas]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data.type !== 'string') return;
      if (data.type === 'PESONAFLIX_CANVAS_READY') { sendCanvas(); return; }
      const { draft: state, patch: apply, changeProject: applyProject, setPhoto: photo, setWatchPhoto: watchPhoto, watchAction: updateWatch, reorder: move, removeProject: remove, notice: notify } = latest.current;
      if (data.type === 'PESONAFLIX_VISUAL_TEXT' && typeof data.field === 'string' && typeof data.value === 'string' && data.value.length < 15000) {
        const field = data.field;
        const value = data.value;
        if (field === 'name') {
          const replacingSample = state.mode === 'create' && state.brief.name === 'Sushmita Dasari' && value !== 'Sushmita Dasari';
          apply({ name: value, slug: state.brief.slug || normalizeSlug(value), photo: { ...state.brief.photo, alt: `Foto ${value}` }, ...(replacingSample ? { email: '', links: { website: '', linkedin: '', github: '' } } : {}) });
        } else if (field === 'role' || field === 'location' || field === 'bio') apply({ [field]: value });
        else if (field === 'tagline' || field === 'interests') apply({ [field]: splitItems(value) });
        else if (field.startsWith('project:')) {
          const [, position, property] = field.split(':');
          const index = Number(position);
          if (!Number.isInteger(index) || index < 0 || index >= state.brief.projects.length) return;
          if (property === 'tags') applyProject(index, { tags: splitItems(value) });
          else if (property === 'title' || property === 'description' || property === 'category' || property === 'year' || property === 'website') applyProject(index, { [property]: value });
        } else if (field.startsWith('watch:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          const cards = state.brief.watchCards ?? createCanvasPortfolio(preparedBrief(state)).watchCards ?? [];
          if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
          if ((property === 'title' || property === 'subtitle') && value.trim()) apply({ watchCards: cards.map((item, i) => i === index ? { ...item, [property]: value } : item) });
          if (property === 'target' && ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'].includes(value)) apply({ watchCards: cards.map((item, i) => i === index ? { ...item, target: value as typeof item.target } : item) });
        } else if (field.startsWith('highlight:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          if (!Number.isInteger(index) || index < 0 || index >= (state.brief.highlights?.length || 0)) return;
          if (property === 'title' || property === 'description' || property === 'category') apply({ highlights: state.brief.highlights!.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field.startsWith('skill:')) {
          const index = Number(field.split(':')[1]);
          if (Number.isInteger(index) && index >= 0 && index < state.brief.skills.length) apply({ skills: state.brief.skills.map((item, i) => i === index ? value : item) });
        } else if (field.startsWith('experience:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          if (Number.isInteger(index) && index >= 0 && index < state.brief.experiences.length && (property === 'company' || property === 'role' || property === 'period' || property === 'description')) apply({ experiences: state.brief.experiences.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field.startsWith('education:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          if (Number.isInteger(index) && index >= 0 && index < (state.brief.education?.length || 0) && (property === 'school' || property === 'degree' || property === 'place' || property === 'period')) apply({ education: state.brief.education!.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field.startsWith('contact:')) {
          const key = field.split(':')[1];
          if (key === 'email') apply({ email: value });
          else if (key === 'website' || key === 'linkedin' || key === 'github') apply({ links: { ...state.brief.links, [key]: value } });
        }
      }
      if (data.type === 'PESONAFLIX_VISUAL_FILE') {
        if (Number.isInteger(data.watchIndex)) {
          const cards = state.brief.watchCards ?? createCanvasPortfolio(preparedBrief(state)).watchCards ?? [];
          if (!(data.file instanceof File) || data.watchIndex < 0 || data.watchIndex >= cards.length) return;
          void fitImage(data.file).then((file) => watchPhoto(data.watchIndex, file)).catch((error) => notify(error.message));
          return;
        }
        if (!(data.file instanceof File) || (data.index !== null && (!Number.isInteger(data.index) || data.index < 0 || data.index >= state.brief.projects.length))) return;
        void fitImage(data.file).then((file) => photo(data.index, file)).catch((error) => notify(error.message));
      }
      if (data.type === 'PESONAFLIX_VISUAL_THEME' && (data.key === 'accent' || data.key === 'background') && /^#[0-9a-fA-F]{6}$/.test(data.value)) {
        apply({ theme: { ...(state.brief.theme || DEFAULT_THEME), [data.key]: data.value } });
      }
      if (data.type === 'PESONAFLIX_VISUAL_ACTION') {
        const index = Number(data.index);
        switch (data.action) {
          case 'watch-add': updateWatch('add'); break;
          case 'watch-duplicate': updateWatch('duplicate', index); break;
          case 'watch-up': updateWatch('up', index); break;
          case 'watch-down': updateWatch('down', index); break;
          case 'watch-remove': updateWatch('remove', index); break;
          case 'add': apply({ projects: [...state.brief.projects, newProject()] }); break;
          case 'duplicate': if (Number.isInteger(index) && state.brief.projects[index]) {
            apply({ projects: [...state.brief.projects, { ...state.brief.projects[index], title: `${state.brief.projects[index].title} (Salinan)` }] });
            if (state.projectPhotos[index]) photo(state.brief.projects.length, state.projectPhotos[index]);
          } break;
          case 'up': move(index, -1); break;
          case 'down': move(index, 1); break;
          case 'remove': remove(index); break;
          case 'experience-add': apply({ experiences: [...state.brief.experiences, { company: '', role: '', period: '', description: '' }] }); break;
          case 'experience-remove': apply({ experiences: state.brief.experiences.filter((_, i) => i !== index) }); break;
          case 'education-add': apply({ education: [...(state.brief.education || []), { school: '', degree: '', place: '', period: '' }] }); break;
          case 'education-remove': apply({ education: (state.brief.education || []).filter((_, i) => i !== index) }); break;
          case 'highlight-add': apply({ highlights: [...(state.brief.highlights || []), { title: 'Sorotan Baru', description: 'Tulis kisah pencapaian di sini.', category: 'Perjalanan' }] }); break;
          case 'highlight-remove': apply({ highlights: (state.brief.highlights || []).filter((_, i) => i !== index) }); break;
          case 'skill-add': apply({ skills: [...state.brief.skills, 'Keahlian Baru'] }); break;
          case 'skill-remove': apply({ skills: state.brief.skills.filter((_, i) => i !== index) }); break;
          case 'reset-theme': apply({ theme: { ...DEFAULT_THEME } }); break;
        }
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [sendCanvas]);

  return <section className="min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-[#121218]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
      <div><p className="text-sm font-extrabold">✦ Editor Visual PESONAFLIX <span className="ml-1 rounded bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300">EDIT LANGSUNG</span></p><p className="mt-1 text-xs text-white/45">Klik teks atau foto di kanvas. Gunakan tombol di dalam kanvas untuk menambah dan mengatur kartu.</p></div>
      <div className="flex gap-1 rounded-lg bg-black/40 p-1"><button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')} className={`rounded-md px-3 py-1.5 text-xs ${device === 'desktop' ? 'bg-white/15' : 'text-white/45'}`}>Desktop</button><button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')} className={`rounded-md px-3 py-1.5 text-xs ${device === 'mobile' ? 'bg-white/15' : 'text-white/45'}`}>HP</button></div>
    </div>
    <div className="flex justify-center overflow-auto bg-[#050506] p-2 sm:p-4">
      <iframe ref={frame} title="Kanvas visual portofolio Netflix" src="/studio/preview?canvas=1" onLoad={sendCanvas} className="block h-[min(84vh,980px)] min-h-[650px] shrink-0 rounded-lg border border-white/15 bg-[#07070a] shadow-2xl transition-[width] duration-300" style={{ width: device === 'mobile' ? 'min(390px, 100%)' : '100%' }} />
    </div>
    <p className="px-4 pb-4 text-xs leading-relaxed text-white/45">Edit di kanvas tersimpan sebagai draft lokal. Tombol Simpan Draft menyimpan ke browser ini, bukan langsung menerbitkan website.</p>
  </section>;
}
