import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createCanvasPortfolio, effectiveTheme, findUnreplacedSushmitaExamples, normalizeSlug, sushmitaExampleBrief, validateBrief, type ClientBrief } from '../data/clientModel';
import { clientReferralCode, normalizeClientWhatsapp } from '../utils/clientWhatsapp.mjs';
import { deleteDraft, listDrafts, preparedBrief, saveDraft, type StudioDraft } from '../data/studioDraft';
import { publishedClients } from '../data/studioPublished';
import ElementorCanvas from './ElementorCanvas';
import StudioTemplateGallery from './StudioTemplateGallery';
import { canApplyIdentityMode, canApplyTemplate, resolveTemplateId, type IdentityMode, type TemplateId } from '../data/templateCatalog.mjs';
import { optimizeStudioImage, type StudioImageKind } from '../utils/imageOptimizer.mjs';

type Session = { configured: boolean; authenticated: boolean; login: string | null; mode?: 'studio' | 'legacy'; publisherConfigured?: boolean };
type SubmittedPR = { number: number; url: string; branch: string; sha: string };
const pendingKey = (slug: string) => `pesonaflix-pending-${slug}`;
function readPending(slug: string): SubmittedPR | null {
  try {
    const data = JSON.parse(localStorage.getItem(pendingKey(slug)) || 'null');
    return Number.isSafeInteger(data?.number) && /^[a-f0-9]{40}$/i.test(data?.sha || '') && typeof data?.url === 'string' ? data : null;
  } catch { return null; }
}
const field = 'w-full rounded-xl border border-white/15 bg-[#18181f] px-3.5 py-3 text-base text-white placeholder:text-white/30 outline-none transition focus:border-[#ff5c75] focus:ring-2 focus:ring-[#ff5c75]/10';
const card = 'rounded-2xl border border-white/10 bg-[#121218] p-5';
const secondary = 'rounded-xl border border-white/20 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-40';
const initialSession: Session = { configured: false, authenticated: false, login: null, mode: 'legacy' };

async function readPublisherSession(): Promise<Session> {
  const response = await fetch('/api/studio/status', { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('Status akses tidak tersedia.');
  const studio = await response.json() as Session;
  if (studio.mode === 'studio') return { ...studio, login: 'Tim Studio' };
  return fetch('/api/auth/status').then((result) => result.json() as Promise<Session>);
}

function Control({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block min-w-0 space-y-2"><span className="block text-sm font-semibold text-white/85">{label}</span>{children}{hint && <span className="block text-xs leading-relaxed text-white/45">{hint}</span>}</label>;
}

function Photo({ file, existing, title, kind = 'work', onChange }: { file?: File | null; existing: string; title: string; kind?: StudioImageKind; onChange: (value: File | null) => void }) {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const change = async (next?: File) => {
    setError('');
    if (!next) { onChange(null); return; }
    setProcessing(true);
    try { onChange(await optimizeStudioImage(next, kind)); }
    catch (cause) { setError((cause as Error).message); }
    finally { setProcessing(false); }
  };
  return <div className="space-y-2"><div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-gradient-to-br from-[#301320] via-[#17111b] to-[#08080b]">
    {(preview || existing) ? <img src={preview || existing} alt={title} className="h-full w-full object-contain"/> : <div className="text-center text-white/45"><span className="mb-2 block text-3xl">▧</span><span className="text-xs">Belum ada foto</span></div>}
    {file && <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px]">Foto baru</span>}
  </div><label className="block cursor-pointer rounded-xl border border-white/20 px-3 py-3 text-center text-sm font-semibold hover:border-[#ff6b82]">{processing ? 'Mengoptimalkan foto…' : existing || file ? 'Ganti Foto' : 'Tambah Foto'}<input type="file" disabled={processing} accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" onChange={(e) => { void change(e.target.files?.[0]); e.currentTarget.value = ''; }}/></label>
    {file && <p className="text-xs text-emerald-300">WebP siap unggah · {Math.ceil(file.size / 1024)} KB</p>}
    {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
    {file && <button type="button" className="text-xs text-white/55 underline" onClick={() => onChange(null)}>Batalkan foto baru</button>}
  </div>;
}

function splitLines(text: string) { return text.split(/\n|,/).map((s) => s.trim()).filter(Boolean); }
const newProject = (): ClientBrief['projects'][number] => ({ title: '', year: String(new Date().getFullYear()), description: '', category: 'Portofolio', tags: [], website: '', image: '' });

async function apiPost(path: string, body: unknown) {
  const res = await fetch(path, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'x-personalflix-action': '1' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Permintaan belum berhasil.');
  return data;
}

type CanvasProps = {
  draft: StudioDraft;
  patch: (changes: Partial<ClientBrief>) => void;
  changeProject: (index: number, changes: Partial<ClientBrief['projects'][number]>) => void;
  setPhoto: (index: number | null, file: File | null) => void;
  reorder: (index: number, direction: number) => void;
  removeProject: (index: number) => void;
};

/** Kanvas sebenarnya merender App Netflix yang sama dengan halaman publik, di iframe terisolasi. */
function CanvasEditor({ draft, patch, changeProject, setPhoto, reorder, removeProject }: CanvasProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [selected, setSelected] = useState('name');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [photoUrls, setPhotoUrls] = useState<{ portrait: string; projects: Record<number, string> }>({ portrait: '', projects: {} });
  const current = preparedBrief(draft);
  const theme = effectiveTheme(current);
  const selectedProject = selected.startsWith('project:') ? Number(selected.split(':')[1]) : -1;

  useEffect(() => {
    const urls: string[] = [];
    const portrait = draft.portrait ? URL.createObjectURL(draft.portrait) : '';
    if (portrait) urls.push(portrait);
    const projects: Record<number, string> = {};
    for (const [index, photo] of Object.entries(draft.projectPhotos)) {
      projects[Number(index)] = URL.createObjectURL(photo);
      urls.push(projects[Number(index)]);
    }
    setPhotoUrls({ portrait, projects });
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [draft.portrait, draft.projectPhotos]);

  const sendCanvas = useCallback(() => {
    const content = createCanvasPortfolio(current);
    if (photoUrls.portrait) { content.profile.portrait.src = photoUrls.portrait; content.profile.portrait.srcSet = ''; }
    for (const [index, url] of Object.entries(photoUrls.projects)) {
      if (content.projects[Number(index)]) content.projects[Number(index)].image = url;
    }
    frame.current?.contentWindow?.postMessage({ type: 'PESONAFLIX_CANVAS_UPDATE', content }, location.origin);
  }, [current, photoUrls]);

  useEffect(() => { sendCanvas(); }, [sendCanvas]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'PESONAFLIX_CANVAS_READY') sendCanvas();
      if (event.data?.type === 'PESONAFLIX_CANVAS_SELECT' && typeof event.data.field === 'string') setSelected(event.data.field);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [sendCanvas]);

  const quick = (label: string, id: string) => <button type="button" onClick={() => setSelected(id)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${selected === id ? 'bg-[#e50931] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>{label}</button>;
  const project = current.projects[selectedProject];
  return <div className="grid min-w-0 gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
    <section className="order-2 min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-[#121218]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div><p className="text-sm font-extrabold">✦ Canvas Netflix <span className="ml-2 rounded bg-emerald-500/15 px-2 py-1 text-[10px] text-emerald-300">LIVE EDIT</span></p><p className="mt-1 text-xs text-white/45">Ubah isi melalui panel kiri. Perubahan langsung muncul di kanvas.</p></div>
        <div className="flex gap-1 rounded-lg bg-black/40 p-1"><button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')} className={`rounded-md px-3 py-1.5 text-xs ${device === 'desktop' ? 'bg-white/15' : 'text-white/45'}`}>Desktop</button><button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')} className={`rounded-md px-3 py-1.5 text-xs ${device === 'mobile' ? 'bg-white/15' : 'text-white/45'}`}>HP</button></div>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">{quick('Teks', 'name')}{quick('Foto Utama', 'portrait')}{quick('Kartu Karya', 'project:0')}{quick('Warna', 'theme')}{quick('Tentang', 'bio')}</div>
      <div className="flex justify-center overflow-auto bg-[#050506] p-2 sm:p-4">
        <iframe ref={frame} title="Kanvas portofolio Netflix yang dapat diedit" src="/studio/preview?canvas=1" onLoad={sendCanvas} className="block h-[690px] shrink-0 rounded-lg border border-white/15 bg-[#07070a] shadow-2xl transition-[width] duration-300" style={{ width: device === 'mobile' ? 'min(390px, 100%)' : '100%' }} />
      </div>
      <p className="px-4 pb-4 text-xs leading-relaxed text-white/45">Tampilan di atas menggunakan komponen website asli. Scroll di dalam kanvas untuk mengedit bagian bawah. Pengunjung belum melihat perubahan sampai diterbitkan.</p>
    </section>
    <aside className="order-1 h-fit space-y-4 rounded-2xl border border-[#ff536e]/25 bg-[#14131a] p-4 xl:sticky xl:top-24">
      <div><p className="text-xs font-bold uppercase tracking-widest text-[#ff7188]">Panel Edit</p><h3 className="mt-1 text-xl font-extrabold">{({ name: 'Nama Klien', role: 'Profesi', location: 'Lokasi', tagline: 'Headline', bio: 'Tentang Saya', portrait: 'Foto Utama', theme: 'Warna Tema' } as Record<string, string>)[selected] || (project ? `Kartu Karya ${selectedProject + 1}` : 'Pilih Elemen')}</h3><p className="mt-2 text-xs text-white/45">Setiap perubahan langsung terlihat di kanvas sebelah.</p></div>
      {selected === 'name' && <Control label="Nama lengkap / brand"><input className={field} value={draft.brief.name} placeholder="Nama Klien" onChange={(e) => {
        const replacingSample = draft.mode === 'create' && draft.brief.name === 'Sushmita Dasari' && e.target.value !== 'Sushmita Dasari';
        patch({ name: e.target.value, slug: draft.brief.slug || normalizeSlug(e.target.value), photo: { ...draft.brief.photo, alt: `Foto ${e.target.value}` },
          ...(replacingSample ? { email: '', links: { website: '', linkedin: '', github: '' } } : {}) });
      }}/></Control>}
      {selected === 'role' && <Control label="Profesi"><input className={field} value={draft.brief.role} placeholder="Profesi Klien" onChange={(e) => patch({ role: e.target.value })}/></Control>}
      {selected === 'location' && <Control label="Kota / lokasi"><input className={field} value={draft.brief.location} placeholder="Bandung, Indonesia" onChange={(e) => patch({ location: e.target.value })}/></Control>}
      {selected === 'tagline' && <Control label="Sorotan (satu baris per poin)"><textarea rows={4} className={field} value={draft.brief.tagline.join('\n')} onChange={(e) => patch({ tagline: splitLines(e.target.value) })}/></Control>}
      {selected === 'bio' && <Control label="Tentang Saya"><textarea rows={7} className={field} value={draft.brief.bio} placeholder="Cerita singkat klien..." onChange={(e) => patch({ bio: e.target.value })}/></Control>}
      {selected === 'portrait' && <><p className="text-xs text-white/60">{current.templateId === 'miniature-world' ? 'Unggah foto atau ilustrasi diorama miniatur yang sesuai dengan profesi klien. Template tidak otomatis membuat miniatur AI.' : current.templateId === 'paper-cut' ? 'Unggah ilustrasi lapisan kertas milik klien untuk panggung PAPER CUT. Sistem tidak otomatis membuat gambar AI.' : 'Foto transparan lebih cocok untuk efek Netflix.'} Foto Sushmita hanyalah contoh dan wajib diganti sebelum tayang.</p><Photo kind="hero" title="Foto utama" file={draft.portrait} existing={draft.mode === 'edit' ? draft.brief.photo.src : '/assets/portrait-720.webp'} onChange={(file) => setPhoto(null, file)}/></>}
      {selected === 'theme' && <><Control label="Warna aksen"><input aria-label="Warna aksen" type="color" value={theme.accent} className="h-12 w-full cursor-pointer rounded-lg bg-transparent" onChange={(e) => patch({ theme: { ...theme, accent: e.target.value } })}/></Control><Control label="Warna latar"><input aria-label="Warna latar" type="color" value={theme.background} className="h-12 w-full cursor-pointer rounded-lg bg-transparent" onChange={(e) => patch({ theme: { ...theme, background: e.target.value } })}/></Control><button type="button" className={secondary} onClick={() => patch({ theme: undefined })}>Kembalikan warna {current.templateId === 'miniature-world' ? 'MINIATURE WORLD' : current.templateId === 'pixel-retro' ? 'PIXEL RETRO' : current.templateId === 'paper-cut' ? 'PAPER CUT' : current.templateId === 'scrapbook' ? 'SCRAPBOOK' : current.templateId === 'storybook' ? 'STORYBOOK' : current.templateId === 'doodle' ? 'DOODLE' : current.templateId === 'editorial-premium' ? 'EDITORIAL PREMIUM' : current.templateId === 'komik-pop' ? 'KOMIK POP' : current.templateId === 'clay-3d' ? 'CLAY 3D' : current.templateId === 'anime' ? 'ANIME' : current.templateId === 'chibi-3d' || current.designVariant === 'chibi-cinema' ? 'CHIBI' : 'ORIGINAL'}</button><p className="text-xs text-white/45">Aksen memengaruhi tulisan, tombol dan beberapa highlight. Struktur halaman tetap dipertahankan.</p></>}
      {project && <><Control label="Judul kartu"><input className={field} value={project.title} onChange={(e) => changeProject(selectedProject, { title: e.target.value })}/></Control><Control label="Deskripsi"><textarea className={field} rows={4} value={project.description} onChange={(e) => changeProject(selectedProject, { description: e.target.value })}/></Control><Control label="Kategori"><input className={field} value={project.category} onChange={(e) => changeProject(selectedProject, { category: e.target.value })}/></Control><Control label="Tahun"><input className={field} value={project.year} onChange={(e) => changeProject(selectedProject, { year: e.target.value })}/></Control><Photo title={`Foto kartu ${selectedProject + 1}`} file={draft.projectPhotos[selectedProject]} existing={project.image || ''} onChange={(file) => setPhoto(selectedProject, file)}/><div className="flex flex-wrap gap-2"><button type="button" className={secondary} disabled={selectedProject === 0} onClick={() => { reorder(selectedProject, -1); setSelected(`project:${selectedProject - 1}`); }}>↑ Geser</button><button type="button" className={secondary} disabled={selectedProject === current.projects.length - 1} onClick={() => { reorder(selectedProject, 1); setSelected(`project:${selectedProject + 1}`); }}>↓ Geser</button><button type="button" className={`${secondary} text-red-300`} disabled={current.projects.length <= 1} onClick={() => { removeProject(selectedProject); setSelected('project:0'); }}>Hapus</button></div></>}
      <div className="border-t border-white/10 pt-4"><p className="mb-2 text-xs font-semibold text-white/50">Kartu karya ({current.projects.length})</p><div className="flex flex-wrap gap-2">{current.projects.map((item, index) => <button type="button" key={index} onClick={() => setSelected(`project:${index}`)} className={`rounded-lg px-3 py-2 text-xs ${selected === `project:${index}` ? 'bg-[#e50931]' : 'bg-white/10'}`}>{item.title || `Kartu ${index + 1}`}</button>)}</div><button type="button" className={`${secondary} mt-3 w-full`} onClick={() => { patch({ projects: [...draft.brief.projects, newProject()] }); setSelected(`project:${draft.brief.projects.length}`); }}>＋ Tambah Kartu</button></div>
    </aside>
  </div>;
}

export default function StudioEditor() {
  const [drafts, setDrafts] = useState<StudioDraft[]>([]);
  const [published, setPublished] = useState<ClientBrief[]>([]);
  const [active, setActive] = useState<StudioDraft | null>(null);
  const [session, setSession] = useState<Session>(initialSession);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [pr, setPr] = useState<SubmittedPR | null>(null);
  const [approved, setApproved] = useState(false);
  const [search, setSearch] = useState('');
  const [workspaceTab, setWorkspaceTab] = useState<'templates' | 'editor'>('editor');
  const prepared = useMemo(() => active ? preparedBrief(active) : null, [active]);

  useEffect(() => {
    void Promise.all([listDrafts(), publishedClients(), readPublisherSession().catch(() => initialSession)]).then(([local, live, auth]) => {
      setDrafts(local.sort((a, b) => b.updatedAt - a.updatedAt));
      setPublished(live); setSession(auth);
      const last = sessionStorage.getItem('personalflix-last-draft');
      const recent = local.find((d) => d.slug === last);
      if (recent) { setActive(recent); setPr(readPending(recent.slug)); }
    }).catch(() => setNotice('Tidak bisa membuka draft lokal. Coba browser biasa, bukan mode privat.'));
  }, []);

  const patch = (changes: Partial<ClientBrief>) => {
    setActive((current) => current ? { ...current, brief: { ...current.brief, ...changes }, updatedAt: Date.now() } : current);
    setNotice(''); setPr(null); setApproved(false);
  };
  const changeProject = (index: number, changes: Partial<ClientBrief['projects'][number]>) => {
    if (!active) return;
    patch({ projects: active.brief.projects.map((item, i) => i === index ? { ...item, ...changes } : item) });
  };
  const refreshList = async () => setDrafts((await listDrafts()).sort((a, b) => b.updatedAt - a.updatedAt));
  const persist = async (entry = active) => {
    if (!entry) throw new Error('Pilih klien terlebih dahulu.');
    const brief = preparedBrief(entry);
    if (!brief.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(brief.slug)) throw new Error('Masukkan nama URL yang valid sebelum menyimpan draft.');
    const saved = { ...entry, slug: brief.slug, updatedAt: Date.now() };
    await saveDraft(saved); sessionStorage.setItem('personalflix-last-draft', saved.slug);
    setActive(saved); await refreshList(); return saved;
  };
  const saveClick = async () => { try { await persist(); setNotice('Draft tersimpan di browser ini.'); } catch (e) { setNotice((e as Error).message); } };
  const preview = async () => {
    try {
      if (!prepared) return;
      const errors = validateBrief(prepared);
      if (!active?.portrait && active?.mode === 'create') errors.push('Foto utama wajib dipilih.');
      if (errors.length) { setNotice(errors.join(' · ')); return; }
      await persist(); window.location.assign(`/studio/preview?slug=${prepared.slug}`);
    } catch (e) { setNotice((e as Error).message); }
  };
  const newClient = () => { setActive({ slug: '', brief: sushmitaExampleBrief(), portrait: null, projectPhotos: {}, watchPhotos: {}, pickPhotos: {}, episodePhotos: {}, mode: 'create', updatedAt: Date.now() }); setWorkspaceTab('templates'); setPr(null); setNotice(''); };
  const choose = (draft: StudioDraft) => { setActive(draft); setWorkspaceTab('editor'); sessionStorage.setItem('personalflix-last-draft', draft.slug); setPr(readPending(draft.slug)); setNotice(''); };
  const usePublished = (brief: ClientBrief) => {
    const existing = drafts.find((d) => d.slug === brief.slug);
    choose(existing ? { ...existing, mode: 'edit' } : { slug: brief.slug, brief, portrait: null, projectPhotos: {}, watchPhotos: {}, pickPhotos: {}, episodePhotos: {}, mode: 'edit', updatedAt: Date.now() });
  };
  const setPhoto = (index: number | null, file: File | null) => {
    setActive((current) => {
      if (!current) return current;
      if (index === null) {
        return { ...current, portrait: file };
      }
      const photos = { ...current.projectPhotos };
      if (file) photos[index] = file; else delete photos[index];
      return { ...current, projectPhotos: photos };
    });
    setPr(null);
  };
  const applyTemplate = (id: TemplateId) => {
    if (!active || !canApplyTemplate(id)) return;
    if (id === 'original' && (active.brief.designVariant || active.brief.templateId === 'anime' || active.brief.templateId === 'chibi-3d' || active.brief.templateId === 'clay-3d' || active.brief.templateId === 'komik-pop' || active.brief.templateId === 'editorial-premium' || active.brief.templateId === 'doodle' || active.brief.templateId === 'storybook' || active.brief.templateId === 'scrapbook' || active.brief.templateId === 'paper-cut' || active.brief.templateId === 'pixel-retro' || active.brief.templateId === 'miniature-world' || active.brief.templateId === 'documentary' || active.brief.templateId === 'minimalist' || active.brief.templateId === 'futuristic-neon') && !window.confirm('Ganti ke ORIGINAL? Gambar tetap tersimpan, tetapi tampilan website akan berubah setelah diterbitkan.')) return;
    patch({ templateId: id, designVariant: undefined });
    setNotice(id === 'futuristic-neon' ? 'FUTURISTIC NEON dipilih. HUD digital, kamera foto, cahaya neon dan orbit bergerak otomatis tanpa kontrol. Isi data karya sebenarnya dan unggah foto milik klien melalui Editor Website; ilustrasi AI demo tidak digunakan untuk klien baru.' : id === 'minimalist' ? 'MINIMALIST dipilih. Profil rapi, tipografi profesional, indeks karya dan foto bergerak halus otomatis. Isi data faktual serta unggah foto milik klien di Editor Website; template tidak membuat foto AI secara otomatis.' : id === 'documentary' ? 'DOCUMENTARY dipilih. Kamera dokumenter bergerak, grain, filmstrip dan cuplikan karya otomatis. Unggah foto asli serta tulis fakta pengalaman klien di Editor Website; jangan gunakan ilustrasi AI sebagai bukti kegiatan.' : id === 'miniature-world' ? 'MINIATURE WORLD dipilih. Diorama mengambang, kamera makro, orbit, dan kartu karya bergerak otomatis. Lengkapi profil serta unggah miniatur sesuai profesi klien melalui Editor Website.' : id === 'chibi-3d' ? 'CHIBI 3D dipilih. Buka Editor Website untuk mengisi data dan gambar karakter klien; simpan lalu periksa preview.' : id === 'anime' ? 'ANIME dipilih. Buka Editor Website, isi identitas klien dan unggah ilustrasi anime sendiri; simpan dan periksa preview.' : id === 'clay-3d' ? 'CLAY 3D dipilih. Buka Editor Website, isi cerita klien dan unggah foto atau ilustrasi tanah liat milik klien; simpan lalu periksa preview.' : id === 'komik-pop' ? 'KOMIK POP dipilih. Panel komik, font, palet, dan animasi otomatis siap. Isi identitas serta unggah ilustrasi komik milik klien, lalu periksa preview.' : id === 'editorial-premium' ? 'EDITORIAL PREMIUM dipilih. Sampul majalah, font, foto elegan, dan animasi otomatis siap. Unggah foto klien serta rapikan kisah profesionalnya lewat Editor Website.' : id === 'doodle' ? 'DOODLE dipilih. Kertas sketsa, coretan, font tulisan tangan, dan animasi otomatis siap. Unggah ilustrasi klien sendiri, simpan dan periksa preview.' : id === 'storybook' ? 'STORYBOOK dipilih. Halaman buku bergambar, cat air, tipografi dongeng, dan animasi otomatis siap. Isi kisah lalu unggah ilustrasi klien sendiri melalui Editor Website.' : id === 'scrapbook' ? 'SCRAPBOOK dipilih. Polaroid, stiker, catatan, dan animasi otomatis siap. Isi cerita, unggah foto milik klien, simpan dan periksa preview.' : id === 'paper-cut' ? 'PAPER CUT dipilih. Diorama kertas berlapis dan gerak otomatis siap. Lengkapi profil dan unggah ilustrasi klien sendiri melalui Editor Website.' : id === 'pixel-retro' ? 'PIXEL RETRO dipilih. Character select, font arcade, kartu quest dan animasi otomatis siap. Lengkapi profil serta unggah karakter pixel milik klien di Editor Website.' : 'Gaya ORIGINAL dipilih. Simpan draft lalu periksa preview sebelum menerbitkan.');
  };
  const applyIdentity = (id: IdentityMode) => {
    if (!canApplyIdentityMode(id)) return;
    patch({ identityMode: id });
  };
  const setWatchPhoto = (index: number, file: File) => {
    setActive((current) => {
      if (!current) return current;
      const watchCards = current.brief.watchCards ?? createCanvasPortfolio(preparedBrief(current)).watchCards ?? [];
      return { ...current, brief: { ...current.brief, watchCards }, watchPhotos: { ...current.watchPhotos, [index]: file }, updatedAt: Date.now() };
    });
    setPr(null);
  };
  const watchAction = (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index = -1) => {
    setActive((current) => {
      if (!current) return current;
      const original = current.brief.watchCards ?? createCanvasPortfolio(preparedBrief(current)).watchCards ?? [];
      const cards = original.map((card) => ({ ...card }));
      const photos = { ...(current.watchPhotos || {}) };
      if (action === 'add') {
        if (cards.length >= 30) return current;
        cards.push({ target: 'originals', title: 'Kartu Jelajah Baru', subtitle: 'Klik untuk mengubah keterangannya', image: '' });
      } else if (action === 'duplicate') {
        if (cards.length >= 30 || !cards[index]) return current;
        cards.push({ ...cards[index], title: `${cards[index].title} (Salinan)` });
        if (photos[index]) photos[cards.length - 1] = photos[index];
      } else if (action === 'up' || action === 'down') {
        const target = index + (action === 'up' ? -1 : 1);
        if (!cards[index] || target < 0 || target >= cards.length) return current;
        [cards[index], cards[target]] = [cards[target], cards[index]];
        const moved = photos[index];
        if (photos[target]) photos[index] = photos[target]; else delete photos[index];
        if (moved) photos[target] = moved; else delete photos[target];
      } else if (action === 'remove') {
        if (!cards[index] || cards.length <= 1) return current;
        cards.splice(index, 1);
        const shifted: Record<number, File> = {};
        for (const [key, file] of Object.entries(photos)) {
          const i = Number(key); if (i !== index) shifted[i > index ? i - 1 : i] = file;
        }
        return { ...current, brief: { ...current.brief, watchCards: cards }, watchPhotos: shifted, updatedAt: Date.now() };
      }
      return { ...current, brief: { ...current.brief, watchCards: cards }, watchPhotos: photos, updatedAt: Date.now() };
    });
    setNotice(''); setPr(null); setApproved(false);
  };
  const setPickPhoto = (index: number, file: File) => {
    setActive((current) => {
      if (!current) return current;
      const pickCards = current.brief.pickCards ?? createCanvasPortfolio(preparedBrief(current)).topPicks.map((pick) => ({ ...pick }));
      return { ...current, brief: { ...current.brief, pickCards }, pickPhotos: { ...current.pickPhotos, [index]: file }, updatedAt: Date.now() };
    });
    setPr(null);
  };
  const pickAction = (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index = -1) => {
    setActive((current) => {
      if (!current) return current;
      const source = current.brief.pickCards ?? createCanvasPortfolio(preparedBrief(current)).topPicks;
      const cards = source.map((item) => ({ ...item }));
      const photos = { ...(current.pickPhotos || {}) };
      if (action === 'add') {
        if (cards.length >= 30) return current;
        cards.push({ label: 'SOROTAN', title: 'Pilihan Baru', detail: 'Klik tulisan ini untuk mengubah ceritanya.', image: '', palette: cards[0]?.palette });
      } else if (action === 'duplicate') {
        if (cards.length >= 30 || !cards[index]) return current;
        cards.push({ ...cards[index], title: `${cards[index].title} (Salinan)` });
        if (photos[index]) photos[cards.length - 1] = photos[index];
      } else if (action === 'up' || action === 'down') {
        const target = index + (action === 'up' ? -1 : 1);
        if (!cards[index] || target < 0 || target >= cards.length) return current;
        [cards[index], cards[target]] = [cards[target], cards[index]];
        const moved = photos[index];
        if (photos[target]) photos[index] = photos[target]; else delete photos[index];
        if (moved) photos[target] = moved; else delete photos[target];
      } else if (action === 'remove') {
        if (!cards[index] || cards.length <= 1) return current;
        cards.splice(index, 1);
        const shifted: Record<number, File> = {};
        for (const [key, file] of Object.entries(photos)) {
          const i = Number(key); if (i !== index) shifted[i > index ? i - 1 : i] = file;
        }
        return { ...current, brief: { ...current.brief, pickCards: cards }, pickPhotos: shifted, updatedAt: Date.now() };
      }
      return { ...current, brief: { ...current.brief, pickCards: cards }, pickPhotos: photos, updatedAt: Date.now() };
    });
    setNotice(''); setPr(null); setApproved(false);
  };
  const setEpisodePhoto = (season: number, episode: number, file: File) => {
    setActive((current) => {
      if (!current) return current;
      const seasons = current.brief.seasons ?? createCanvasPortfolio(preparedBrief(current)).seasons;
      return { ...current, brief: { ...current.brief, seasons }, episodePhotos: { ...current.episodePhotos, [`${season}-${episode}`]: file }, updatedAt: Date.now() };
    });
    setNotice(''); setPr(null); setApproved(false);
  };
  const seasonAction = (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', index = -1) => {
    setActive((current) => {
      if (!current) return current;
      const seasons = structuredClone(current.brief.seasons ?? createCanvasPortfolio(preparedBrief(current)).seasons);
      const photos = { ...(current.episodePhotos || {}) };
      if (action === 'add') {
        if (seasons.length >= 10) return current;
        const number = seasons.length + 1;
        seasons.push({ number, title: 'Musim Baru', period: 'Tahun / Periode', synopsis: 'Klik teks untuk menuliskan cerita perjalanan.', episodes: [{ code: `S${String(number).padStart(2, '0')} E01`, title: 'Episode Baru', runtime: 'Periode', description: 'Klik untuk mengubah cerita episode.', tags: ['Karya'], palette: { from: '#260815', via: '#792342', to: '#08080d', accent: '#ff547e' } }] });
      } else if (action === 'duplicate') {
        if (!seasons[index] || seasons.length >= 10) return current;
        const target = seasons.length;
        seasons.push({ ...structuredClone(seasons[index]), number: target + 1, title: `${seasons[index].title} (Salinan)` });
        for (const [key, file] of Object.entries(photos)) if (key.startsWith(`${index}-`)) photos[`${target}-${key.split('-')[1]}`] = file;
      } else if (action === 'up' || action === 'down') {
        const target = index + (action === 'up' ? -1 : 1);
        if (!seasons[index] || target < 0 || target >= seasons.length) return current;
        [seasons[index], seasons[target]] = [seasons[target], seasons[index]];
        const reordered: Record<string, File> = {};
        for (const [key, file] of Object.entries(photos)) {
          const [s, e] = key.split('-').map(Number);
          reordered[`${s === index ? target : s === target ? index : s}-${e}`] = file;
        }
        return { ...current, brief: { ...current.brief, seasons }, episodePhotos: reordered, updatedAt: Date.now() };
      } else if (action === 'remove') {
        if (!seasons[index] || seasons.length <= 1) return current;
        seasons.splice(index, 1);
        const shifted: Record<string, File> = {};
        for (const [key, file] of Object.entries(photos)) {
          const [s, e] = key.split('-').map(Number);
          if (s !== index) shifted[`${s > index ? s - 1 : s}-${e}`] = file;
        }
        return { ...current, brief: { ...current.brief, seasons }, episodePhotos: shifted, updatedAt: Date.now() };
      }
      return { ...current, brief: { ...current.brief, seasons }, episodePhotos: photos, updatedAt: Date.now() };
    });
    setNotice(''); setPr(null); setApproved(false);
  };
  const episodeAction = (action: 'add' | 'duplicate' | 'up' | 'down' | 'remove', seasonIndex: number, index = -1) => {
    setActive((current) => {
      if (!current) return current;
      const seasons = structuredClone(current.brief.seasons ?? createCanvasPortfolio(preparedBrief(current)).seasons);
      const episodes = seasons[seasonIndex]?.episodes;
      if (!episodes) return current;
      const photos = { ...(current.episodePhotos || {}) };
      if (action === 'add') {
        if (episodes.length >= 15) return current;
        episodes.push({ code: '', title: 'Episode Baru', runtime: 'Periode', description: 'Klik untuk mengubah cerita episode.', tags: ['Karya'], palette: { from: '#260815', via: '#792342', to: '#08080d', accent: '#ff547e' } });
      } else if (action === 'duplicate') {
        if (!episodes[index] || episodes.length >= 15) return current;
        episodes.push({ ...structuredClone(episodes[index]), title: `${episodes[index].title} (Salinan)` });
        if (photos[`${seasonIndex}-${index}`]) photos[`${seasonIndex}-${episodes.length - 1}`] = photos[`${seasonIndex}-${index}`];
      } else if (action === 'up' || action === 'down') {
        const target = index + (action === 'up' ? -1 : 1);
        if (!episodes[index] || target < 0 || target >= episodes.length) return current;
        [episodes[index], episodes[target]] = [episodes[target], episodes[index]];
        const src = photos[`${seasonIndex}-${index}`]; const dst = photos[`${seasonIndex}-${target}`];
        if (dst) photos[`${seasonIndex}-${index}`] = dst; else delete photos[`${seasonIndex}-${index}`];
        if (src) photos[`${seasonIndex}-${target}`] = src; else delete photos[`${seasonIndex}-${target}`];
      } else if (action === 'remove') {
        if (!episodes[index] || episodes.length <= 1) return current;
        episodes.splice(index, 1);
        const shifted: Record<string, File> = {};
        for (const [key, file] of Object.entries(photos)) {
          const [s, e] = key.split('-').map(Number);
          if (s !== seasonIndex || e !== index) shifted[`${s}-${s === seasonIndex && e > index ? e - 1 : e}`] = file;
        }
        return { ...current, brief: { ...current.brief, seasons }, episodePhotos: shifted, updatedAt: Date.now() };
      }
      return { ...current, brief: { ...current.brief, seasons }, episodePhotos: photos, updatedAt: Date.now() };
    });
    setNotice(''); setPr(null); setApproved(false);
  };
  const reorder = (index: number, direction: number) => {
    if (!active) return;
    const target = index + direction;
    if (target < 0 || target >= active.brief.projects.length) return;
    const projects = [...active.brief.projects]; [projects[index], projects[target]] = [projects[target], projects[index]];
    const photos = { ...active.projectPhotos };
    const tmp = photos[index];
    if (photos[target]) photos[index] = photos[target]; else delete photos[index];
    if (tmp) photos[target] = tmp; else delete photos[target];
    setActive({ ...active, brief: { ...active.brief, projects }, projectPhotos: photos }); setPr(null);
  };
  const removeProject = (index: number) => {
    if (!active || active.brief.projects.length <= 1) return;
    const projects = active.brief.projects.filter((_, i) => i !== index);
    const photos: Record<number, File> = {};
    for (const [key, value] of Object.entries(active.projectPhotos)) {
      const i = Number(key); if (i !== index) photos[i > index ? i - 1 : i] = value;
    }
    setActive({ ...active, brief: { ...active.brief, projects }, projectPhotos: photos }); setPr(null);
  };
  const publish = async () => {
    if (!active || !prepared || busy) return;
    const errors = validateBrief(prepared, { requireWhatsapp: true });
    if (active.mode === 'create') {
      const leftovers = findUnreplacedSushmitaExamples(prepared);
      if (leftovers.length) errors.push(`Masih ada data Sushmita: ${leftovers.join(', ')}. Ganti dengan data klien sebelum menerbitkan.`);
    }
    if (active.mode === 'create' && !active.portrait) errors.push('Foto utama diperlukan untuk klien baru.');
    if (errors.length) { setNotice(errors.join(' · ')); return; }
    try {
      setBusy(true); setNotice('Memeriksa dan mengunggah foto ke GitHub…');
      const saved = await persist();
      const publishingBrief = preparedBrief(saved);
      if (session.mode === 'studio' && !session.publisherConfigured) throw new Error('Penerbitan otomatis belum terhubung. Atur kunci GitHub di Vercel terlebih dahulu.');
      if (!session.authenticated) {
        if (!session.configured) throw new Error('Login GitHub belum diaktifkan. Atur OAuth pada Vercel terlebih dahulu.');
        window.location.assign('/api/auth/start'); return;
      }
      const files: { file: File; path: string }[] = [];
      if (saved.portrait) files.push({ file: saved.portrait, path: `public${publishingBrief.photo.src}` });
      for (const [index, file] of Object.entries(saved.projectPhotos)) files.push({ file, path: `public${publishingBrief.projects[Number(index)].image}` });
      for (const [index, file] of Object.entries(saved.watchPhotos || {})) {
        const image = publishingBrief.watchCards?.[Number(index)]?.image;
        if (image) files.push({ file, path: `public${image}` });
      }
      for (const [index, file] of Object.entries(saved.pickPhotos || {})) {
        const image = publishingBrief.pickCards?.[Number(index)]?.image;
        if (image) files.push({ file, path: `public${image}` });
      }
      for (const [key, file] of Object.entries(saved.episodePhotos || {})) {
        const [season, episode] = key.split('-').map(Number);
        const image = publishingBrief.seasons?.[season]?.episodes[episode]?.image;
        if (image) files.push({ file, path: `public${image}` });
      }
      const assets: { path: string; sha: string }[] = [];
      for (const { file, path } of files) {
        const response = await fetch('/api/assets', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': file.type, 'x-personalflix-action': '1', 'x-client-photo-path': path }, body: file });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Gagal mengunggah ${file.name}.`);
        assets.push({ path: data.path, sha: data.sha });
      }
      setNotice(session.mode === 'studio' ? 'Membuat perubahan dan menjalankan pemeriksaan otomatis…' : 'Membuat branch dan Pull Request untuk preview…');
      const result = await apiPost('/api/publish', { brief: publishingBrief, assets, mode: saved.mode }) as SubmittedPR;
      if (session.mode === 'studio') localStorage.setItem(pendingKey(saved.slug), JSON.stringify(result));
      setPr(result); setApproved(false);
      setNotice(session.mode === 'studio' ? 'Proses terbit otomatis dimulai. GitHub sedang menjalankan pengujian; halaman ini boleh ditutup.' : 'Preview GitHub berhasil disiapkan. Periksa tampilan sebelum menerbitkan live.');
    } catch (error) { setNotice((error as Error).message); }
    finally { setBusy(false); }
  };
  const merge = async () => {
    if (!pr || !approved || busy) return;
    try {
      setBusy(true); setNotice('Memeriksa validasi GitHub sebelum menerbitkan…');
      const result = await apiPost('/api/publish-merge', { number: pr.number, sha: pr.sha, confirmed: true });
      if (result.merged) {
        setNotice(`Berhasil! Vercel sedang menerbitkan https://pesonaflix.vercel.app/${result.slug}`); setPr(null);
        if (active) {
          const updated = { ...active, brief: preparedBrief(active), portrait: null, projectPhotos: {}, watchPhotos: {}, pickPhotos: {}, episodePhotos: {}, mode: 'edit' as const, updatedAt: Date.now() };
          await saveDraft(updated); setActive(updated); await refreshList();
        }
      }
    } catch (error) { setNotice((error as Error).message); }
    finally { setBusy(false); }
  };

  useEffect(() => {
    if (!pr || session.mode !== 'studio') return;
    let cancelled = false;
    let polling = false;
    const poll = async () => {
      if (polling || cancelled) return;
      polling = true;
      try {
        const response = await fetch(`/api/publish-status?number=${pr.number}&sha=${encodeURIComponent(pr.sha)}`, { credentials: 'same-origin', cache: 'no-store' });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Belum bisa mengambil status penerbitan.');
        if (cancelled) return;
        if (result.state === 'merged') {
          localStorage.removeItem(pendingKey(result.slug));
          setNotice(`Perubahan lolos tes! Vercel sedang memperbarui ${result.url}`);
          setPr(null);
          if (active) {
            const updated = { ...active, brief: preparedBrief(active), portrait: null, projectPhotos: {}, watchPhotos: {}, pickPhotos: {}, episodePhotos: {}, mode: 'edit' as const, updatedAt: Date.now() };
            await saveDraft(updated); if (!cancelled) { setActive(updated); await refreshList(); }
          }
        } else if (result.state === 'failed') {
          localStorage.removeItem(pendingKey(result.slug));
          setNotice(`${result.message} Buka PR untuk melihat detailnya: ${pr.url}`);
          setPr(null);
        } else setNotice(result.message || 'Publikasi otomatis sedang diproses…');
      } catch (cause) { if (!cancelled) setNotice((cause as Error).message); }
      finally { polling = false; }
    };
    void poll();
    const interval = window.setInterval(() => { void poll(); }, 6000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [pr, session.mode]);

  const logout = async () => {
    try { await apiPost('/api/studio/logout', {}); window.location.reload(); }
    catch (cause) { setNotice((cause as Error).message); }
  };

  return <div className="min-h-screen bg-[#09090d] font-sans text-white">
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0b0b10]/95 px-5 py-4 backdrop-blur-lg sm:px-8"><a href="/" className="font-extrabold tracking-widest">PESONA<span className="text-[#ff4566]">FLIX</span><span className="ml-2 text-xs font-medium tracking-normal text-white/45">STUDIO</span></a><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[#ff6580] bg-[#ff6580]/10 px-3 py-2 text-xs font-bold text-white">Editor CMS</span><a href="/studio?tab=formulir" className={secondary}>Formulir Klien</a><span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">{session.authenticated ? `● ${session.login}` : 'Draft lokal · Tanpa login'}</span>{session.mode === 'studio' && <button type="button" className={secondary} onClick={() => { void logout(); }}>Keluar</button>}<a href="/vini" target="_blank" rel="noreferrer" className={secondary}>Lihat Contoh</a></div></header>
    <div className={`mx-auto grid max-w-[1720px] gap-5 px-4 py-6 lg:px-6 ${active ? 'lg:grid-cols-1' : 'lg:grid-cols-[230px_minmax(0,1fr)]'}`}>
      <aside className={`${card} ${active ? 'hidden' : ''} h-fit lg:sticky lg:top-24`}><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff6580]">PESONAFLIX Studio</p><h1 className="mt-1 text-2xl font-extrabold">Website Klien</h1><p className="mt-2 text-sm text-white/50">Seperti menulis postingan, tetapi hasilnya portofolio bergaya serial.</p></div>
        <button type="button" onClick={newClient} className="mb-5 w-full rounded-xl bg-[#e50931] px-4 py-3 text-sm font-bold hover:bg-[#fb2951]">＋ Buat Klien Baru</button>
        <input aria-label="Cari klien" className={`${field} mb-3`} value={search} placeholder="Cari nama klien…" onChange={(e) => setSearch(e.target.value)}/>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Draft tersimpan</p>
        <div className="space-y-1">{drafts.filter((d) => d.brief.name.toLowerCase().includes(search.toLowerCase()) || d.slug.includes(search.toLowerCase())).map((entry) => <button type="button" key={entry.slug} onClick={() => choose(entry)} className={`w-full rounded-lg px-3 py-2.5 text-left text-sm ${active?.slug === entry.slug ? 'bg-[#e50931]/20 text-white' : 'text-white/70 hover:bg-white/5'}`}><span className="block font-semibold">{entry.brief.name || entry.slug}</span><span className="block text-xs text-white/45">/{entry.slug} · Draft lokal</span></button>)}{!drafts.length && <p className="rounded-lg bg-white/[0.03] p-3 text-xs text-white/40">Belum ada draft.</p>}</div>
        <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-white/40">Sudah tayang</p>
        <div className="space-y-1">{published.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())).map((entry) => <button key={entry.slug} type="button" onClick={() => usePublished(entry)} className="w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/5"><span className="block font-semibold">{entry.name}</span><span className="block text-xs text-emerald-300/70">/{entry.slug} · Edit website</span></button>)}<p className="px-3 pt-2 text-xs text-white/40">Halaman /vini adalah contoh master dan tetap dilindungi.</p></div>
      </aside>

      <main className="min-w-0 space-y-5">
        {active && <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <button type="button" onClick={newClient} className={secondary}>＋ Website Baru</button>
          <details className="group relative">
            <summary className={`${secondary} cursor-pointer list-none`}>▤ Pilih Klien</summary>
            <div className="absolute left-0 top-full z-30 mt-2 max-h-80 min-w-[250px] space-y-1 overflow-y-auto rounded-xl border border-white/15 bg-[#18161e] p-3 shadow-2xl">
              <input aria-label="Cari klien" className={`${field} mb-2`} value={search} placeholder="Cari nama klien…" onChange={(e) => setSearch(e.target.value)}/>
              <p className="px-2 text-[11px] font-bold uppercase tracking-widest text-white/40">Draft tersimpan</p>
              {drafts.filter((d) => d.brief.name.toLowerCase().includes(search.toLowerCase()) || d.slug.includes(search.toLowerCase())).map((entry) => <button type="button" key={entry.slug} className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-white/10" onClick={(event) => { choose(entry); event.currentTarget.closest('details')?.removeAttribute('open'); }}>{entry.brief.name || entry.slug}<span className="block text-xs text-white/45">/{entry.slug}</span></button>)}
              <p className="px-2 pt-2 text-[11px] font-bold uppercase tracking-widest text-white/40">Sudah tayang</p>
              {published.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())).map((entry) => <button type="button" key={entry.slug} className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-white/10" onClick={(event) => { usePublished(entry); event.currentTarget.closest('details')?.removeAttribute('open'); }}>{entry.name}<span className="block text-xs text-emerald-300/60">/{entry.slug}</span></button>)}
              {!drafts.length && !published.length && <p className="px-2 py-2 text-xs text-white/40">Belum ada klien tersimpan.</p>}
            </div>
          </details>
          <span className="text-xs text-white/40">Edit langsung di kanvas · Simpan sebelum pindah klien</span>
        </div>}
        {!active ? <section className={`${card} flex min-h-[400px] flex-col items-center justify-center gap-4 text-center`}><span className="text-6xl">✦</span><h2 className="text-3xl font-extrabold">Mulai Karya Baru</h2><p className="max-w-md text-white/55">Masukkan data klien dari WhatsApp, ganti foto dan atur kartu sesuai kebutuhan. Simpan draft kapan saja.</p><button type="button" onClick={newClient} className="rounded-xl bg-[#e50931] px-6 py-3 font-bold">Buat Klien Baru</button></section> : <>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[#ff6580]">{active.mode === 'create' ? 'Website baru' : 'Edit website terbit'}</p><h2 className="mt-1 text-2xl font-extrabold">{active.brief.name || 'Klien Tanpa Nama'}</h2><p className="mt-1 text-sm text-white/45">/{active.brief.slug || 'nama-klien'} · Data tersimpan hanya di browser ini sampai dipublikasikan.</p></div><div className="flex flex-wrap gap-2"><button type="button" className={secondary} onClick={saveClick}>Simpan Draft</button><button type="button" className={secondary} onClick={() => { void preview(); }}>Preview Lengkap</button></div></div>
          <nav aria-label="Menu kerja klien" className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#111117] p-2">
            <button type="button" aria-current={workspaceTab === 'templates' ? 'page' : undefined} onClick={() => setWorkspaceTab('templates')} className={`rounded-xl px-5 py-3 text-sm font-extrabold transition ${workspaceTab === 'templates' ? 'bg-[#e50931] text-white' : 'text-white/65 hover:bg-white/10'}`}>▦ TEMPLATE · 16 Gaya</button>
            <button type="button" aria-current={workspaceTab === 'editor' ? 'page' : undefined} onClick={() => setWorkspaceTab('editor')} className={`rounded-xl px-5 py-3 text-sm font-extrabold transition ${workspaceTab === 'editor' ? 'bg-[#e50931] text-white' : 'text-white/65 hover:bg-white/10'}`}>✎ EDITOR WEBSITE</button>
          </nav>
          {active.mode === 'create' && <p className="rounded-xl border border-amber-400/25 bg-amber-300/10 px-4 py-3 text-sm leading-relaxed text-amber-100">Ini adalah contoh lengkap portofolio Sushmita dari repo master. Klik teks, foto, dan kartu langsung di dalam kanvas untuk menyesuaikannya. Ganti semua identitas dan aset contoh sebelum menerbitkan.</p>}
          {workspaceTab === 'templates' ? <StudioTemplateGallery selectedTemplateId={resolveTemplateId(active.brief)} identityMode={active.brief.identityMode || 'photo'} onApplyTemplate={applyTemplate} onApplyIdentity={applyIdentity} onEditWebsite={() => setWorkspaceTab('editor')} /> : new URLSearchParams(location.search).has('legacy') ? <CanvasEditor draft={active} patch={patch} changeProject={changeProject} setPhoto={setPhoto} reorder={reorder} removeProject={removeProject} /> : <ElementorCanvas draft={active} patch={patch} changeProject={changeProject} setPhoto={setPhoto} setWatchPhoto={setWatchPhoto} watchAction={watchAction} setPickPhoto={setPickPhoto} pickAction={pickAction} setEpisodePhoto={setEpisodePhoto} seasonAction={seasonAction} episodeAction={episodeAction} reorder={reorder} removeProject={removeProject} notice={setNotice} />}
          <section className={`${card} border-[#5ad0c8]/35`}>
            <h3 className="text-lg font-extrabold">WhatsApp Pemilik & Referral</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">Tombol “Mau Dibuatin” di website ini akan membuka WhatsApp pemiliknya, bukan WhatsApp Teh Vini. Gunakan nomor bisnis yang siap menerima pesan dari pengunjung.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <Control label="Nomor WhatsApp pemilik *" hint="Bisa diawali 08, 62, atau +62. Wajib diisi sebelum terbit.">
                <input className={field} type="tel" inputMode="tel" autoComplete="tel" placeholder="0812xxxxxxxx" value={active.brief.whatsapp || ''} onChange={(e) => patch({ whatsapp: e.target.value })}/>
              </Control>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <span className="block text-xs text-white/50">Kode referral</span>
                <strong className="mt-1 block tracking-wider">{clientReferralCode(active.brief.slug) || 'Setelah nama URL diisi'}</strong>
              </div>
            </div>
            {active.brief.whatsapp && !normalizeClientWhatsapp(active.brief.whatsapp) && <p role="alert" className="mt-3 text-sm text-amber-300">Nomor WhatsApp belum valid. Periksa kembali angkanya.</p>}
            <p className="mt-3 text-xs leading-relaxed text-white/45">Kode referral ikut tercantum pada pesan WhatsApp. Komisi 50% dicatat setelah pesanan dan pembayaran diverifikasi, bukan dari jumlah klik.</p>
          </section>
          <details className={`${card} group hidden`}><summary className="cursor-pointer text-base font-extrabold text-white">⚙ Pengaturan Detail <span className="ml-2 text-xs font-normal text-white/45">Pengalaman, pendidikan, keahlian, tautan, dan data tambahan</span></summary><div className="space-y-5 pt-6">
          <section className={card}><h3 className="mb-5 text-xl font-extrabold">01 · Profil & Redaksi</h3><div className="grid gap-4 sm:grid-cols-2">
            <Control label="Nama lengkap / brand *"><input className={field} value={active.brief.name} placeholder="Satria Putra" onChange={(e) => patch({ name: e.target.value, slug: active.brief.slug || normalizeSlug(e.target.value), photo: { ...active.brief.photo, alt: `Foto ${e.target.value}` } })}/></Control>
            <Control label="Alamat halaman *" hint={`pesonaflix.vercel.app/${active.brief.slug || 'nama-klien'}`}><input disabled={active.mode === 'edit'} className={`${field} disabled:opacity-50`} value={active.brief.slug} placeholder="satria" onChange={(e) => patch({ slug: normalizeSlug(e.target.value) })}/></Control>
            <Control label="Profesi *"><input className={field} value={active.brief.role} placeholder="Fotografer • Digital Creator" onChange={(e) => patch({ role: e.target.value })}/></Control>
            <Control label="Kota / lokasi *"><input className={field} value={active.brief.location} placeholder="Bandung, Indonesia" onChange={(e) => patch({ location: e.target.value })}/></Control>
          </div><div className="mt-4"><Control label="Tentang Saya *"><textarea className={field} rows={4} value={active.brief.bio} placeholder="Ceritakan tentang klien…" onChange={(e) => patch({ bio: e.target.value })}/></Control></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2"><Control label="Headline / Sorotan *" hint="Satu kalimat per baris"><textarea className={field} rows={3} value={active.brief.tagline.join('\n')} onChange={(e) => patch({ tagline: splitLines(e.target.value) })}/></Control><Control label="Minat / Hobi" hint="Satu poin per baris"><textarea className={field} rows={3} value={active.brief.interests.join('\n')} onChange={(e) => patch({ interests: splitLines(e.target.value) })}/></Control></div></section>

          <section className={card}><h3 className="mb-2 text-xl font-extrabold">02 · Foto Utama</h3><p className="mb-4 text-sm text-white/50">Untuk hero, foto badan setengah dengan latar transparan paling cocok. Foto otomatis dikonversi ke WebP tanpa menambah latar putih.</p><div className="max-w-xs"><Photo kind="hero" title="Foto utama klien" file={active.portrait} existing={active.mode === 'edit' ? active.brief.photo.src : ''} onChange={(file) => setPhoto(null, file)}/></div></section>

          <section className={card}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-extrabold">03 · Kartu Karya</h3><p className="mt-1 text-sm text-white/50">Satu karya = satu kartu PESONAFLIX. Foto tiap kartu bisa berbeda.</p></div><button type="button" className={secondary} onClick={() => patch({ projects: [...active.brief.projects, newProject()] })}>＋ Tambah Kartu</button></div>
            <div className="space-y-5">{active.brief.projects.map((project, i) => <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><div className="mb-4 flex items-center justify-between gap-2"><span className="font-bold text-[#ff728a]">Kartu {i + 1}</span><div className="flex gap-1"><button type="button" aria-label={`Geser kartu ${i + 1} ke atas`} disabled={i === 0} className={secondary} onClick={() => reorder(i, -1)}>↑</button><button type="button" aria-label={`Geser kartu ${i + 1} ke bawah`} disabled={i === active.brief.projects.length - 1} className={secondary} onClick={() => reorder(i, 1)}>↓</button><button type="button" disabled={active.brief.projects.length < 2} className={`${secondary} text-red-300`} onClick={() => removeProject(i)}>Hapus</button></div></div>
                <div className="grid gap-4 md:grid-cols-[210px_1fr]"><Photo title={`Foto karya ${i + 1}`} file={active.projectPhotos[i]} existing={active.mode === 'edit' ? project.image || '' : ''} onChange={(file) => setPhoto(i, file)}/><div className="space-y-3"><Control label="Judul kartu *"><input className={field} value={project.title} placeholder="Karya Unggulan" onChange={(e) => changeProject(i, { title: e.target.value })}/></Control><Control label="Deskripsi *"><textarea rows={3} className={field} value={project.description} placeholder="Ceritakan karya…" onChange={(e) => changeProject(i, { description: e.target.value })}/></Control><div className="grid gap-3 sm:grid-cols-2"><Control label="Kategori"><input className={field} value={project.category} onChange={(e) => changeProject(i, { category: e.target.value })}/></Control><Control label="Tahun"><input className={field} value={project.year} onChange={(e) => changeProject(i, { year: e.target.value })}/></Control></div><Control label="Kata kunci (pisah koma)"><input className={field} value={project.tags.join(', ')} onChange={(e) => changeProject(i, { tags: splitLines(e.target.value) })}/></Control><Control label="Link karya (opsional)"><input className={field} placeholder="https://…" value={project.website || ''} onChange={(e) => changeProject(i, { website: e.target.value })}/></Control></div></div>
              </div>)}</div>
          </section>

          <section className={card}><h3 className="mb-5 text-xl font-extrabold">04 · Perjalanan & Pendidikan</h3><div className="space-y-4">{active.brief.experiences.map((exp, i) => <div key={i} className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-2"><Control label="Perusahaan"><input className={field} value={exp.company} onChange={(e) => patch({ experiences: active.brief.experiences.map((x, j) => i === j ? { ...x, company: e.target.value } : x) })}/></Control><Control label="Jabatan"><input className={field} value={exp.role} onChange={(e) => patch({ experiences: active.brief.experiences.map((x, j) => i === j ? { ...x, role: e.target.value } : x) })}/></Control><Control label="Periode"><input className={field} value={exp.period} onChange={(e) => patch({ experiences: active.brief.experiences.map((x, j) => i === j ? { ...x, period: e.target.value } : x) })}/></Control><Control label="Deskripsi"><input className={field} value={exp.description} onChange={(e) => patch({ experiences: active.brief.experiences.map((x, j) => i === j ? { ...x, description: e.target.value } : x) })}/></Control><button type="button" className="text-left text-xs text-red-300" onClick={() => patch({ experiences: active.brief.experiences.filter((_, j) => j !== i) })}>Hapus</button></div>)}<button type="button" className={secondary} onClick={() => patch({ experiences: [...active.brief.experiences, { company: '', role: '', period: '', description: '' }] })}>＋ Tambah Pengalaman</button></div>
            <h4 className="mb-4 mt-8 text-base font-bold">Pendidikan</h4><div className="space-y-4">{(active.brief.education || []).map((edu, i) => <div key={i} className="grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-2">{(['school', 'degree', 'place', 'period'] as const).map((key) => <Control key={key} label={({ school: 'Sekolah / Kampus', degree: 'Jurusan / Gelar', place: 'Kota', period: 'Tahun' })[key]}><input className={field} value={edu[key]} onChange={(e) => patch({ education: (active.brief.education || []).map((x, j) => i === j ? { ...x, [key]: e.target.value } : x) })}/></Control>)}<button type="button" className="text-left text-xs text-red-300" onClick={() => patch({ education: (active.brief.education || []).filter((_, j) => j !== i) })}>Hapus</button></div>)}<button type="button" className={secondary} onClick={() => patch({ education: [...(active.brief.education || []), { school: '', degree: '', place: '', period: '', score: '' }] })}>＋ Tambah Pendidikan</button></div></section>

          <section className={card}><h3 className="mb-5 text-xl font-extrabold">05 · Keahlian, Pencapaian & Kontak</h3><Control label="Keahlian" hint="Satu keahlian per baris. Pengaturan kategori lengkap tersedia di kanvas visual."><textarea className={field} rows={3} value={active.brief.skills.join('\n')} onChange={(e) => patch({ skills: splitLines(e.target.value), skillCategories: undefined })}/></Control>
            <h4 className="mb-4 mt-6 font-bold">Pencapaian</h4>{(active.brief.highlights || []).map((highlight, i) => <div key={i} className="mb-3 grid gap-3 rounded-xl border border-white/10 p-3 sm:grid-cols-2">{(['title', 'description', 'category'] as const).map((key) => <Control key={key} label={({ title: 'Judul', description: 'Cerita', category: 'Kategori' })[key]}><input className={field} value={highlight[key] || ''} onChange={(e) => patch({ highlights: (active.brief.highlights || []).map((h, j) => j === i ? { ...h, [key]: e.target.value } : h) })}/></Control>)}<button type="button" className="text-left text-xs text-red-300" onClick={() => patch({ highlights: (active.brief.highlights || []).filter((_, j) => j !== i) })}>Hapus</button></div>)}<button type="button" className={secondary} onClick={() => patch({ highlights: [...(active.brief.highlights || []), { title: '', description: '', category: '' }] })}>＋ Tambah Pencapaian</button>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><Control label="Email publik"><input className={field} value={active.brief.email || ''} onChange={(e) => patch({ email: e.target.value })}/></Control>{(['website', 'linkedin', 'github'] as const).map((key) => <Control key={key} label={`Link ${key}`}><input className={field} value={active.brief.links?.[key] || ''} placeholder="https://…" onChange={(e) => patch({ links: { ...active.brief.links, [key]: e.target.value } })}/></Control>)}</div>
          </section>

          </div></details>
          <section className={`${card} border-[#ff486b]/40`}><h3 className="text-xl font-extrabold">Simpan, Preview, Terbitkan</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{session.mode === 'studio' ? 'Simpan Draft tetap lokal. Tombol Terbitkan Otomatis akan mengunggah perubahan secara aman, menjalankan tes, lalu memperbarui website melalui Vercel tanpa login GitHub.' : 'Perubahan di Canvas hanya tersimpan pada perangkat ini. Untuk menerbitkan, login GitHub akan membuat Pull Request, melewati pengujian, lalu perlu persetujuan Teteh sebelum masuk ke website live.'}</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" className={secondary} onClick={saveClick}>Simpan Draft</button><button type="button" className={secondary} onClick={() => { void preview(); }}>Lihat Preview</button><button type="button" disabled={busy || Boolean(pr) || (session.mode === 'studio' && !session.publisherConfigured)} onClick={() => { void publish(); }} className="rounded-xl bg-[#e50931] px-5 py-3 text-sm font-bold hover:bg-[#fa284c] disabled:opacity-50">{busy ? 'Memproses…' : session.mode === 'studio' ? 'Terbitkan Otomatis' : session.authenticated ? 'Siapkan Preview GitHub' : 'Login GitHub & Siapkan Preview'}</button></div>
            {session.mode === 'studio' && !session.publisherConfigured && <p className="mt-3 text-xs text-amber-300">Akses Studio aktif, tetapi kunci penerbitan GitHub belum disiapkan di Vercel. Draft dan preview tetap bisa digunakan.</p>}
            {session.mode !== 'studio' && !session.configured && <p className="mt-3 text-xs text-amber-300">Mode otomatis belum diaktifkan pada Vercel. Editor dan preview lokal tetap bisa digunakan.</p>}
            {pr && <div className="mt-5 space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"><p className="font-semibold text-emerald-300">{session.mode === 'studio' ? 'Publikasi sedang diproses otomatis' : `PR #${pr.number} siap diperiksa`}</p><a href={pr.url} target="_blank" rel="noreferrer" className="block break-all text-sm underline">Lihat proses di GitHub ↗</a>{session.mode !== 'studio' && <><label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 accent-[#e50931]" checked={approved} onChange={(e) => setApproved(e.target.checked)}/><span>Saya sudah mengecek foto, redaksi, link, dan tampilan HP/desktop di preview.</span></label><button type="button" disabled={!approved || busy} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold disabled:opacity-40" onClick={() => { void merge(); }}>Terbitkan ke Website Live</button></>}</div>}
            {notice && <p role="status" className="mt-4 rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-white/80">{notice}</p>}
          </section>
          <div className="pb-6 text-right"><button type="button" className="text-xs text-red-300/70 underline" onClick={() => { if (active.slug && window.confirm('Hapus draft dari browser ini? Website yang sudah live tidak ikut terhapus.')) { void deleteDraft(active.slug).then(async () => { setActive(null); await refreshList(); }); } }}>Hapus Draft Lokal</button></div>
        </>}
      </main>

      <aside className={`${card} ${active ? 'hidden' : ''} h-fit lg:sticky lg:top-24`}><h3 className="mb-4 text-base font-extrabold">Ringkasan Visual</h3>{active ? <><div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#491327] to-[#120c12] p-4"><p className="text-[10px] font-bold tracking-[0.3em] text-[#ff99aa]">THE SERIES</p><h4 className="mt-3 break-words text-2xl font-black uppercase">{active.brief.name || 'NAMA KLIEN'}</h4><p className="mt-2 text-xs text-white/70">{active.brief.role || 'Profesi klien'}</p></div><p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-white/50">{active.brief.projects.length} Kartu karya</p><div className="space-y-2">{active.brief.projects.slice(0, 5).map((project, i) => <div key={i} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"><p className="truncate text-sm font-bold">{project.title || `Karya ${i + 1}`}</p><p className="truncate text-xs text-white/45">{project.category}</p></div>)}</div><p className="mt-5 text-xs leading-relaxed text-white/45">Preview lengkap menampilkan animasi dan susunan asli website, bukan sekadar ringkasan di samping.</p></> : <p className="text-sm text-white/50">Pilih klien untuk melihat ringkasan.</p>}
        <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs font-bold uppercase tracking-wider text-white/50">Privasi</p><p className="mt-2 text-xs leading-relaxed text-white/50">Draft dan foto disimpan hanya di browser ini (IndexedDB). Gunakan perangkat pribadi; jangan memakai komputer umum. Saat menerbitkan, foto dan data klien menjadi publik di website.</p></div>
      </aside>
    </div>
  </div>;
}
