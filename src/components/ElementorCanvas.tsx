import { useCallback, useEffect, useRef, useState } from 'react';
import { createCanvasPortfolio, effectiveTheme, normalizeSlug, type ClientBrief } from '../data/clientModel';
import { preparedBrief, type StudioDraft } from '../data/studioDraft';
import { withStudioDemoPreviewAssets } from '../data/studioStyleStarters';
import { optimizeStudioImage, type StudioImageKind } from '../utils/imageOptimizer.mjs';

type CanvasProps = {
  draft: StudioDraft;
  patch: (changes: Partial<ClientBrief>) => void;
  changeProject: (index: number, changes: Partial<ClientBrief['projects'][number]>) => void;
  setPhoto: (index: number | null, file: File | null) => void;
  setWatchPhoto: (index: number, file: File) => void;
  watchAction: (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index?: number) => void;
  setPickPhoto: (index: number, file: File) => void;
  pickAction: (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index?: number) => void;
  setEpisodePhoto: (season: number, episode: number, file: File) => void;
  seasonAction: (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index?: number) => void;
  episodeAction: (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', season: number, index?: number) => void;
  reorder: (index: number, direction: number) => void;
  removeProject: (index: number) => void;
  notice: (text: string) => void;
};

const splitItems = (value: string) => value.split(/[\n,•]+/).map((v) => v.trim()).filter(Boolean);
const newProject = (): ClientBrief['projects'][number] => ({ title: '', description: '', category: 'Portofolio', year: String(new Date().getFullYear()), tags: [], website: '', image: '' });

/** Editor visual tanpa sidebar: kanvas publik dipakai langsung sebagai tempat penyuntingan. */
export default function ElementorCanvas({ draft, patch, changeProject, setPhoto, setWatchPhoto, watchAction, setPickPhoto, pickAction, setEpisodePhoto, seasonAction, episodeAction, reorder, removeProject, notice }: CanvasProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const latest = useRef({ draft, patch, changeProject, setPhoto, setWatchPhoto, watchAction, setPickPhoto, pickAction, setEpisodePhoto, seasonAction, episodeAction, reorder, removeProject, notice });
  latest.current = { draft, patch, changeProject, setPhoto, setWatchPhoto, watchAction, setPickPhoto, pickAction, setEpisodePhoto, seasonAction, episodeAction, reorder, removeProject, notice };
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [photoUrls, setPhotoUrls] = useState<{ portrait: string; projects: Record<number, string>; watch: Record<number, string>; picks: Record<number, string>; episodes: Record<string, string> }>({ portrait: '', projects: {}, watch: {}, picks: {}, episodes: {} });
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
    const picks: Record<number, string> = {};
    for (const [index, file] of Object.entries(draft.pickPhotos || {})) {
      picks[Number(index)] = URL.createObjectURL(file);
      urls.push(picks[Number(index)]);
    }
    const episodes: Record<string, string> = {};
    for (const [key, file] of Object.entries(draft.episodePhotos || {})) {
      episodes[key] = URL.createObjectURL(file); urls.push(episodes[key]);
    }
    setPhotoUrls({ portrait, projects, watch, picks, episodes });
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [draft.portrait, draft.projectPhotos, draft.watchPhotos, draft.pickPhotos, draft.episodePhotos]);

  const sendCanvas = useCallback(() => {
    const base = createCanvasPortfolio(current);
    const content = draft.mode === 'create' ? withStudioDemoPreviewAssets(base, current) : structuredClone(base);
    if (photoUrls.portrait) { content.profile.portrait.src = photoUrls.portrait; content.profile.portrait.srcSet = ''; }
    for (const [index, url] of Object.entries(photoUrls.projects)) if (content.projects[Number(index)]) content.projects[Number(index)].image = url;
    for (const [index, url] of Object.entries(photoUrls.watch)) if (content.watchCards?.[Number(index)]) content.watchCards[Number(index)].image = url;
    for (const [index, url] of Object.entries(photoUrls.picks)) if (content.topPicks[Number(index)]) content.topPicks[Number(index)].image = url;
    for (const [key, url] of Object.entries(photoUrls.episodes)) {
      const [season, episode] = key.split('-').map(Number);
      if (content.seasons[season]?.episodes[episode]) content.seasons[season].episodes[episode].image = url;
    }
    frame.current?.contentWindow?.postMessage({ type: 'PESONAFLIX_CANVAS_UPDATE', content }, location.origin);
  }, [current, draft.mode, photoUrls]);

  useEffect(() => { sendCanvas(); }, [sendCanvas]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data.type !== 'string') return;
      if (data.type === 'PESONAFLIX_CANVAS_READY') { sendCanvas(); return; }
      const { draft: state, patch: apply, changeProject: applyProject, setPhoto: photo, setWatchPhoto: watchPhoto, watchAction: updateWatch, setPickPhoto: pickPhoto, pickAction: updatePick, setEpisodePhoto: episodePhoto, seasonAction: updateSeason, episodeAction: updateEpisode, reorder: move, removeProject: remove, notice: notify } = latest.current;
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
        } else if (field.startsWith('pick:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          const cards = state.brief.pickCards ?? createCanvasPortfolio(preparedBrief(state)).topPicks.map((item) => ({ ...item }));
          if (!Number.isInteger(index) || index < 0 || index >= cards.length) return;
          if ((property === 'label' || property === 'title' || property === 'detail') && value.trim()) apply({ pickCards: cards.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field === 'picks:heading' || field === 'picks:kicker') {
          if (value.trim()) apply({ [field === 'picks:heading' ? 'picksHeading' : 'picksKicker']: value });
        } else if (field.startsWith('journey:')) {
          const prop = field.split(':')[1];
          if (value.trim() && (prop === 'heading' || prop === 'aside' || prop === 'kicker')) apply({ [prop === 'heading' ? 'journeyHeading' : prop === 'aside' ? 'journeyAside' : 'journeyKicker']: value });
        } else if (field.startsWith('season:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          const seasons = state.brief.seasons ?? createCanvasPortfolio(preparedBrief(state)).seasons;
          if (Number.isInteger(index) && seasons[index] && ['title', 'period', 'synopsis'].includes(property) && value.trim()) apply({ seasons: seasons.map((season, i) => i === index ? { ...season, [property]: value } : season) });
        } else if (field.startsWith('episode:')) {
          const [, seasonIndex, episodeIndex, property] = field.split(':'); const s = Number(seasonIndex); const e = Number(episodeIndex);
          const seasons = state.brief.seasons ?? createCanvasPortfolio(preparedBrief(state)).seasons;
          if (!Number.isInteger(s) || !Number.isInteger(e) || !seasons[s]?.episodes[e]) return;
          if (['title', 'description', 'runtime', 'tags'].includes(property) && (property === 'tags' || value.trim())) {
            apply({ seasons: seasons.map((season, i) => i === s ? { ...season, episodes: season.episodes.map((episode, j) => j === e ? { ...episode, [property]: property === 'tags' ? splitItems(value) : value } : episode) } : season) });
          }
        } else if (field.startsWith('highlight:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          if (!Number.isInteger(index) || index < 0 || index >= (state.brief.highlights?.length || 0)) return;
          if (property === 'title' || property === 'description' || property === 'category') apply({ highlights: state.brief.highlights!.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field.startsWith('skills:')) {
          const property = field.split(':')[1];
          if (value.trim() && (property === 'heading' || property === 'aside' || property === 'kicker')) {
            apply({ [property === 'heading' ? 'skillsHeading' : property === 'aside' ? 'skillsAside' : 'skillsKicker']: value });
          }
        } else if (field.startsWith('skill-category:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          const categories = state.brief.skillCategories ?? createCanvasPortfolio(preparedBrief(state)).skillCategories;
          if (Number.isInteger(index) && categories[index] && (property === 'title' || property === 'subtitle') && (property === 'subtitle' || value.trim())) {
            apply({ skillCategories: categories.map((group, i) => i === index ? { ...group, [property]: value } : group) });
          }
        } else if (field.startsWith('skill:')) {
          const [, groupPosition, skillPosition, property] = field.split(':');
          const groupIndex = Number(groupPosition); const skillIndex = Number(skillPosition);
          const categories = state.brief.skillCategories ?? createCanvasPortfolio(preparedBrief(state)).skillCategories;
          if (!Number.isInteger(groupIndex) || !Number.isInteger(skillIndex) || !categories[groupIndex]?.skills[skillIndex]) return;
          if (!['name', 'mono', 'note', 'evidence'].includes(property) || ((property === 'name' || property === 'mono') && !value.trim())) return;
          if (property === 'mono' && value.length > 8) { notify('Simbol kotak maksimal 8 karakter.'); return; }
          const updated = categories.map((group, i) => i !== groupIndex ? group : { ...group, skills: group.skills.map((skill, j) => j !== skillIndex ? skill : {
            ...skill,
            [property]: property === 'evidence' ? value.split(/\r?\n|\s+•\s+/).map((line: string) => line.trim()).filter(Boolean) : value,
          }) });
          apply({ skillCategories: updated, skills: updated.flatMap((group) => group.skills.map((skill) => skill.name)) });
        } else if (field.startsWith('experience:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          if (Number.isInteger(index) && index >= 0 && index < state.brief.experiences.length && (property === 'company' || property === 'role' || property === 'period' || property === 'description')) apply({ experiences: state.brief.experiences.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field.startsWith('education:')) {
          const [, position, property] = field.split(':'); const index = Number(position);
          if (Number.isInteger(index) && index >= 0 && index < (state.brief.education?.length || 0) && (property === 'school' || property === 'degree' || property === 'place' || property === 'period')) apply({ education: state.brief.education!.map((item, i) => i === index ? { ...item, [property]: value } : item) });
        } else if (field.startsWith('contact:')) {
          const key = field.split(':')[1];
          if (key === 'email') apply({ email: value });
          else if (['website', 'linkedin', 'github', 'facebook', 'instagram', 'tiktok', 'threads', 'youtube'].includes(key)) apply({ links: { ...state.brief.links, [key]: value } });
        }
      }
      if (data.type === 'PESONAFLIX_VISUAL_FILE') {
        const optimizeAndSave = (kind: StudioImageKind, save: (file: File) => void) => {
          void optimizeStudioImage(data.file, kind).then((file) => {
            save(file);
            notify(`Foto dioptimalkan menjadi WebP · ${Math.ceil(file.size / 1024)} KB`);
          }).catch((error: Error) => notify(error.message));
        };
        if (Number.isInteger(data.seasonIndex) && Number.isInteger(data.episodeIndex)) {
          const seasons = state.brief.seasons ?? createCanvasPortfolio(preparedBrief(state)).seasons;
          if (!(data.file instanceof File) || data.seasonIndex < 0 || data.episodeIndex < 0 || !seasons[data.seasonIndex]?.episodes[data.episodeIndex]) return;
          optimizeAndSave('episode', (file) => episodePhoto(data.seasonIndex, data.episodeIndex, file));
          return;
        }
        if (Number.isInteger(data.pickIndex)) {
          const cards = state.brief.pickCards ?? createCanvasPortfolio(preparedBrief(state)).topPicks;
          if (!(data.file instanceof File) || data.pickIndex < 0 || data.pickIndex >= cards.length) return;
          optimizeAndSave('card', (file) => pickPhoto(data.pickIndex, file));
          return;
        }
        if (Number.isInteger(data.watchIndex)) {
          const cards = state.brief.watchCards ?? createCanvasPortfolio(preparedBrief(state)).watchCards ?? [];
          if (!(data.file instanceof File) || data.watchIndex < 0 || data.watchIndex >= cards.length) return;
          optimizeAndSave('card', (file) => watchPhoto(data.watchIndex, file));
          return;
        }
        if (!(data.file instanceof File) || (data.index !== null && (!Number.isInteger(data.index) || data.index < 0 || data.index >= state.brief.projects.length))) return;
        optimizeAndSave(data.index === null ? 'hero' : 'work', (file) => photo(data.index, file));
      }
      if (data.type === 'PESONAFLIX_VISUAL_THEME' && (data.key === 'accent' || data.key === 'background') && /^#[0-9a-fA-F]{6}$/.test(data.value)) {
        apply({ theme: { ...effectiveTheme(state.brief), [data.key]: data.value } });
      }
      if (data.type === 'PESONAFLIX_VISUAL_ACTION') {
        const index = Number(data.index);
        const categoryIndex = Number(data.categoryIndex);
        const categories = state.brief.skillCategories ?? createCanvasPortfolio(preparedBrief(state)).skillCategories;
        const totalSkills = categories.reduce((sum, group) => sum + group.skills.length, 0);
        const saveCategories = (updated: typeof categories) => apply({ skillCategories: updated, skills: updated.flatMap((group) => group.skills.map((skill) => skill.name)) });
        switch (data.action) {
          case 'season-add': updateSeason('add'); break;
          case 'season-duplicate': updateSeason('duplicate', index); break;
          case 'season-up': updateSeason('up', index); break;
          case 'season-down': updateSeason('down', index); break;
          case 'season-remove': updateSeason('remove', index); break;
          case 'episode-add': updateEpisode('add', Number(data.seasonIndex)); break;
          case 'episode-duplicate': updateEpisode('duplicate', Number(data.seasonIndex), index); break;
          case 'episode-up': updateEpisode('up', Number(data.seasonIndex), index); break;
          case 'episode-down': updateEpisode('down', Number(data.seasonIndex), index); break;
          case 'episode-remove': updateEpisode('remove', Number(data.seasonIndex), index); break;
          case 'pick-add': updatePick('add'); break;
          case 'pick-duplicate': updatePick('duplicate', index); break;
          case 'pick-up': updatePick('up', index); break;
          case 'pick-down': updatePick('down', index); break;
          case 'pick-remove': updatePick('remove', index); break;
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
          case 'skill-category-add': if (categories.length < 12 && totalSkills < 100) saveCategories([...categories, { id: `kategori-${Date.now().toString(36)}`, title: 'Kategori Baru', subtitle: 'Bidang yang saya tekuni', skills: [{ name: 'Keahlian Baru', mono: 'KB', evidence: [] }] }]); break;
          case 'skill-category-duplicate': if (categories[index] && categories.length < 12 && totalSkills + categories[index].skills.length <= 100) saveCategories([...categories.slice(0, index + 1), { ...structuredClone(categories[index]), id: `kategori-${Date.now().toString(36)}`, title: `${categories[index].title} (Salinan)` }, ...categories.slice(index + 1)]); break;
          case 'skill-category-up': if (index > 0 && index < categories.length) { const items = [...categories]; [items[index - 1], items[index]] = [items[index], items[index - 1]]; saveCategories(items); } break;
          case 'skill-category-down': if (index >= 0 && index < categories.length - 1) { const items = [...categories]; [items[index], items[index + 1]] = [items[index + 1], items[index]]; saveCategories(items); } break;
          case 'skill-category-remove': if (categories.length > 1 && categories[index]) saveCategories(categories.filter((_, i) => i !== index)); break;
          case 'skill-add': {
            const groupIndex = Number.isInteger(categoryIndex) ? categoryIndex : 0;
            if (categories[groupIndex] && categories[groupIndex].skills.length < 40 && totalSkills < 100) saveCategories(categories.map((group, i) => i === groupIndex ? { ...group, skills: [...group.skills, { name: 'Keahlian Baru', mono: 'KB', evidence: [] }] } : group));
            break;
          }
          case 'skill-duplicate': if (categories[categoryIndex]?.skills[index] && categories[categoryIndex].skills.length < 40 && totalSkills < 100) saveCategories(categories.map((group, i) => i === categoryIndex ? { ...group, skills: [...group.skills.slice(0, index + 1), { ...structuredClone(group.skills[index]), name: `${group.skills[index].name} (Salinan)` }, ...group.skills.slice(index + 1)] } : group)); break;
          case 'skill-up': case 'skill-down': {
            const group = categories[categoryIndex]; const other = data.action === 'skill-up' ? index - 1 : index + 1;
            if (group && index >= 0 && index < group.skills.length && other >= 0 && other < group.skills.length) {
              const items = [...group.skills]; [items[index], items[other]] = [items[other], items[index]];
              saveCategories(categories.map((item, i) => i === categoryIndex ? { ...item, skills: items } : item));
            }
            break;
          }
          case 'skill-remove': if (categories[categoryIndex]?.skills[index] && categories[categoryIndex].skills.length > 1) saveCategories(categories.map((group, i) => i === categoryIndex ? { ...group, skills: group.skills.filter((_, j) => j !== index) } : group)); break;
          case 'reset-theme': apply({ theme: undefined }); break;
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
