import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { DEFAULT_THEME, type PortfolioContent } from '../data/clientModel';

type EditBox = {
  field: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  multiline: boolean;
};

type Props = { content: PortfolioContent; children: ReactNode };
type ChangeMessage =
  | { type: 'PESONAFLIX_VISUAL_TEXT'; field: string; value: string }
  | { type: 'PESONAFLIX_VISUAL_FILE'; index: number | null; file: File; watchIndex?: number; pickIndex?: number }
  | { type: 'PESONAFLIX_VISUAL_ACTION'; action: string; index?: number }
  | { type: 'PESONAFLIX_VISUAL_THEME'; key: 'accent' | 'background'; value: string };

const uiButton = 'rounded-lg border border-white/20 bg-[#18181f] px-3 py-2 text-xs font-semibold text-white transition hover:border-[#ff6983] hover:bg-[#30202a] disabled:opacity-30';
const uiInput = 'w-full rounded-lg border border-white/20 bg-[#14141a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff6983]';

function emit(message: ChangeMessage) { window.parent.postMessage(message, location.origin); }

function fieldValue(content: PortfolioContent, field: string): string {
  const { profile, projects, achievements, skillCategories } = content;
  const values: Record<string, string> = {
    name: profile.displayName,
    role: profile.role,
    location: profile.location,
    tagline: profile.tagline.join(' • '),
    bio: profile.intro,
    interests: profile.interests.join('\n'),
    'picks:heading': content.picksHeading || `Pilihan ${profile.displayName}`,
    'picks:kicker': content.picksKicker || `${content.topPicks.length} Sorotan · perjalanan & karya`,
  };
  if (field in values) return values[field];
  const parts = field.split(':');
  if (parts[0] === 'project') {
    const item = projects[Number(parts[1])];
    if (!item) return '';
    return ({ title: item.title, description: item.logline, category: item.genre, year: item.year, tags: item.stack.join(', '), website: item.github || '' } as Record<string, string>)[parts[2]] || '';
  }
  if (parts[0] === 'watch') {
    const item = content.watchCards?.[Number(parts[1])];
    return item ? ({ title: item.title, subtitle: item.subtitle } as Record<string, string>)[parts[2]] || '' : '';
  }
  if (parts[0] === 'pick') {
    const item = content.topPicks[Number(parts[1])];
    return item ? ({ label: item.label, title: item.title, detail: item.detail } as Record<string, string>)[parts[2]] || '' : '';
  }
  if (parts[0] === 'highlight') {
    const item = achievements[Number(parts[1])];
    return item ? ({ title: item.title, description: item.detail, category: item.org } as Record<string, string>)[parts[2]] || '' : '';
  }
  if (parts[0] === 'skill') return skillCategories.flatMap((c) => c.skills)[Number(parts[1])]?.name || '';
  return '';
}

/** Editor yang berada di kanvas: tidak mengubah DOM React asli selama teks sedang diketik. */
export default function VisualCanvasTools({ content, children }: Props) {
  const [box, setBox] = useState<EditBox | null>(null);
  const [value, setValue] = useState('');
  const [card, setCard] = useState<number | null>(null);
  const [watchCard, setWatchCard] = useState<number | null>(null);
  const [pickCard, setPickCard] = useState<number | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [recordTab, setRecordTab] = useState<'experience' | 'education' | 'highlights' | 'skills'>('experience');
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileTarget = useRef<{ index: number | null; watchIndex?: number; pickIndex?: number }>({ index: null });
  const activeBox = useRef<EditBox | null>(null);

  useEffect(() => { fieldRef.current?.focus(); fieldRef.current?.select(); }, [box?.field]);

  const beginText = (field: string, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const computed = getComputedStyle(target);
    const x = Math.max(8, Math.min(rect.left, window.innerWidth - 230));
    const edit: EditBox = {
      field, value: fieldValue(content, field), x, y: Math.max(8, Math.min(rect.top, window.innerHeight - 96)),
      width: Math.min(window.innerWidth - x - 8, Math.max(220, rect.width)),
      height: Math.min(190, Math.max(48, rect.height + 12)),
      fontSize: computed.fontSize, fontWeight: computed.fontWeight,
      textAlign: computed.textAlign === 'center' ? 'center' : computed.textAlign === 'right' ? 'right' : 'left',
      multiline: ['bio', 'interests', 'tagline'].includes(field) || field.endsWith(':description') || field.endsWith(':subtitle') || field.endsWith(':detail'),
    };
    activeBox.current = edit;
    setBox(edit); setValue(edit.value);
  };

  const closeText = (commit: boolean) => {
    const editing = activeBox.current;
    if (!editing) return;
    activeBox.current = null;
    setBox(null);
    if (commit && editing.value.trim() !== value.trim()) emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: editing.field, value: value.trim() });
  };

  const pickFile = (index: number | null) => { fileTarget.current = { index }; fileRef.current?.click(); };
  const pickWatchFile = (index: number) => { fileTarget.current = { index: null, watchIndex: index }; fileRef.current?.click(); };
  const pickPickFile = (index: number) => { fileTarget.current = { index: null, pickIndex: index }; fileRef.current?.click(); };

  const handleCanvasClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const editable = target.closest<HTMLElement>('[data-studio-edit]');
    if (!editable) {
      // Hindari tautan luar dan aksi modal portofolio pada mode editor.
      if (target.closest('a, button, [role="button"]')) { event.preventDefault(); event.stopPropagation(); }
      return;
    }
    event.preventDefault(); event.stopPropagation();
    const field = editable.dataset.studioEdit || '';
    if (field === 'portrait') { pickFile(null); return; }
    if (/^pick:\d+$/.test(field)) { setPickCard(Number(field.split(':')[1])); setCard(null); setWatchCard(null); return; }
    if (field.startsWith('pick:')) { setPickCard(Number(field.split(':')[1])); setCard(null); setWatchCard(null); }
    if (/^watch:\d+$/.test(field)) {
      setWatchCard(Number(field.split(':')[1])); setCard(null); setPickCard(null); return;
    }
    if (field.startsWith('watch:')) { setWatchCard(Number(field.split(':')[1])); setCard(null); setPickCard(null); }
    if (/^project:\d+$/.test(field)) {
      setCard(Number(field.split(':')[1])); setWatchCard(null); setPickCard(null); setShowCardDetails(false); return;
    }
    if (field.startsWith('project:')) { setCard(Number(field.split(':')[1])); setWatchCard(null); setPickCard(null); }
    beginText(field, editable);
  };

  const color = content.profile.theme || DEFAULT_THEME;
  const activeProject = card === null ? null : content.projects[card];
  const activeWatchCard = watchCard === null ? null : content.watchCards?.[watchCard];
  const activePickCard = pickCard === null ? null : content.topPicks[pickCard];

  return <>
    <div onClickCapture={handleCanvasClick} className="visual-canvas-root">{children}</div>
    <input ref={fileRef} className="sr-only" tabIndex={-1} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => {
      const file = event.currentTarget.files?.[0];
      if (file) emit({ type: 'PESONAFLIX_VISUAL_FILE', ...fileTarget.current, file });
      event.currentTarget.value = '';
    }}/>
    <div className="pointer-events-none fixed inset-x-2 top-2 z-[9990] flex justify-center">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-[#101014]/95 p-2 text-white shadow-[0_15px_45px_rgba(0,0,0,.7)] backdrop-blur-xl">
        <span className="hidden px-2 text-[10px] font-extrabold tracking-widest text-[#ff6c87] sm:inline">EDIT VISUAL</span>
        <button type="button" className={uiButton} onClick={() => pickFile(null)}>📷 Foto Utama</button>
        <button type="button" className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'add' })}>＋ Kartu</button>
        <button type="button" className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'watch-add' })}>＋ Jelajah</button>
        <button type="button" className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'pick-add' })}>＋ Pilihan</button>
        <button type="button" className={`${uiButton} ${showColors ? 'border-[#ff6983]' : ''}`} onClick={() => { setShowColors((v) => !v); setShowContact(false); }}>🎨 Warna</button>
        <button type="button" className={`${uiButton} ${showContact ? 'border-[#ff6983]' : ''}`} onClick={() => { setShowContact((v) => !v); setShowColors(false); }}>✎ Kontak</button>
        <button type="button" className={`${uiButton} ${showRecords ? 'border-[#ff6983]' : ''}`} onClick={() => setShowRecords(true)}>▤ Riwayat</button>
      </div>
    </div>
    {showColors && <div className="fixed right-3 top-[76px] z-[9991] w-56 rounded-2xl border border-white/20 bg-[#121218] p-4 text-white shadow-2xl">
      <p className="mb-3 text-sm font-bold">Warna Website</p>
      {(['accent', 'background'] as const).map((key) => <label key={key} className="mb-3 flex items-center justify-between gap-3 text-xs"><span>{key === 'accent' ? 'Aksen' : 'Latar'}</span><input type="color" aria-label={key === 'accent' ? 'Warna aksen' : 'Warna latar'} value={color[key]} onChange={(e) => emit({ type: 'PESONAFLIX_VISUAL_THEME', key, value: e.target.value })}/></label>)}
      <button className={uiButton} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'reset-theme' }); setShowColors(false); }}>Warna Netflix</button>
    </div>}
    {showContact && <div className="fixed right-3 top-[76px] z-[9991] w-[min(340px,calc(100vw-24px))] space-y-3 rounded-2xl border border-white/20 bg-[#121218] p-4 text-white shadow-2xl">
      <p className="text-sm font-bold">Kontak & Tautan</p>
      {([{ key: 'email', label: 'Email', value: content.profile.email }, { key: 'website', label: 'Website', value: content.profile.links.website }, { key: 'linkedin', label: 'LinkedIn', value: content.profile.links.linkedin }, { key: 'github', label: 'GitHub', value: content.profile.links.github }] as const).map(({ key, label, value: initial }) =>
        <label key={`${key}-${initial}`} className="block space-y-1 text-xs"><span>{label}</span><input className={uiInput} defaultValue={initial} onBlur={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `contact:${key}`, value: e.target.value.trim() })} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} /></label>)}
      <button type="button" className={uiButton} onClick={() => setShowContact(false)}>Selesai</button>
    </div>}
    {showRecords && <div className="fixed inset-0 z-[9993] flex items-start justify-center overflow-auto bg-black/75 p-3 pt-16 text-white backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowRecords(false); }}>
      <div className="w-full max-w-2xl rounded-2xl border border-[#ff6680]/30 bg-[#101016] p-4 shadow-[0_20px_90px_rgba(0,0,0,.8)] sm:p-6">
        <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#ff7c95]">Edit di kanvas</p><h2 className="text-lg font-bold">Riwayat & Sorotan</h2></div><button className={uiButton} onClick={() => setShowRecords(false)}>Selesai ✕</button></div>
        <div className="mb-5 flex flex-wrap gap-2">{([{ id: 'experience', title: 'Pengalaman' }, { id: 'education', title: 'Pendidikan' }, { id: 'highlights', title: 'Pencapaian' }, { id: 'skills', title: 'Keahlian' }] as const).map((tab) => <button key={tab.id} className={`${uiButton} ${recordTab === tab.id ? 'border-[#ff6680] bg-[#e50931]/20' : ''}`} onClick={() => setRecordTab(tab.id)}>{tab.title}</button>)}</div>
        <div className="max-h-[65vh] space-y-4 overflow-auto pr-1">
          {recordTab === 'experience' && <>{content.experience.map((item, i) => <div key={`exp-${i}`} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex justify-between text-sm font-bold"><span>Pengalaman {i + 1}</span><button className="text-xs text-red-300" onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'experience-remove', index: i })}>Hapus</button></div>{([{ key: 'company', label: 'Perusahaan', value: item.company }, { key: 'role', label: 'Jabatan', value: item.role }, { key: 'period', label: 'Periode', value: item.period }, { key: 'description', label: 'Cerita', value: item.points.join('\n') }] as const).map(({ key, label, value: initial }) => <label key={`${i}-${key}-${initial}`} className="block space-y-1 text-xs"><span>{label}</span><input className={uiInput} defaultValue={initial} onBlur={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `experience:${i}:${key}`, value: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}/></label>)}</div>)}<button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'experience-add' })}>＋ Tambah Pengalaman</button></>}
          {recordTab === 'education' && <>{content.education.map((item, i) => <div key={`edu-${i}`} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex justify-between text-sm font-bold"><span>Pendidikan {i + 1}</span><button className="text-xs text-red-300" onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'education-remove', index: i })}>Hapus</button></div>{([{ key: 'school', label: 'Sekolah / kampus', value: item.school }, { key: 'degree', label: 'Gelar / jurusan', value: item.degree }, { key: 'place', label: 'Lokasi', value: item.place }, { key: 'period', label: 'Tahun', value: item.period }] as const).map(({ key, label, value: initial }) => <label key={`${i}-${key}-${initial}`} className="block space-y-1 text-xs"><span>{label}</span><input className={uiInput} defaultValue={initial} onBlur={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `education:${i}:${key}`, value: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}/></label>)}</div>)}<button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'education-add' })}>＋ Tambah Pendidikan</button></>}
          {recordTab === 'highlights' && <>{content.achievements.map((item, i) => <div key={`achievement-${i}`} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex justify-between text-sm font-bold"><span>Sorotan {i + 1}</span><button className="text-xs text-red-300" onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'highlight-remove', index: i })}>Hapus</button></div>{([{ key: 'title', label: 'Judul', value: item.title }, { key: 'description', label: 'Cerita', value: item.detail }, { key: 'category', label: 'Kategori', value: item.org }] as const).map(({ key, label, value: initial }) => <label key={`${i}-${key}-${initial}`} className="block space-y-1 text-xs"><span>{label}</span><input className={uiInput} defaultValue={initial} onBlur={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `highlight:${i}:${key}`, value: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}/></label>)}</div>)}<button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'highlight-add' })}>＋ Tambah Sorotan</button></>}
          {recordTab === 'skills' && <><div className="grid gap-2 sm:grid-cols-2">{content.skillCategories.flatMap((category) => category.skills).map((skill, i) => <div className="flex items-center gap-2" key={`${i}-${skill.name}`}><input className={uiInput} aria-label={`Keahlian ${i + 1}`} defaultValue={skill.name} onBlur={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `skill:${i}`, value: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}/><button className="text-sm text-red-300" onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'skill-remove', index: i })}>✕</button></div>)}</div><button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'skill-add' })}>＋ Tambah Keahlian</button></>}
        </div>
      </div>
    </div>}
    {pickCard !== null && activePickCard && <div className="pointer-events-none fixed inset-x-2 bottom-4 z-[9989] flex justify-center">
      <div className="pointer-events-auto max-w-full rounded-2xl border border-[#ff6983]/45 bg-[#151219]/95 p-3 text-white shadow-[0_20px_65px_rgba(0,0,0,.8)] backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between gap-4"><span className="max-w-[230px] truncate text-xs font-bold text-[#ff9aaa]">PILIHAN {pickCard + 1} · {activePickCard.title}</span><button type="button" aria-label="Tutup aksi pilihan" onClick={() => setPickCard(null)}>✕</button></div>
        <div className="flex flex-wrap gap-1.5">
          <button className={uiButton} onClick={() => pickPickFile(pickCard)}>📷 Foto</button>
          {(['label', 'title', 'detail'] as const).map((field) => <button key={field} className={uiButton} onClick={(event) => beginText(`pick:${pickCard}:${field}`, event.currentTarget)}>
            ✎ {field === 'label' ? 'Label' : field === 'title' ? 'Judul' : 'Deskripsi'}
          </button>)}
          <button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'pick-add' })}>＋ Tambah</button>
          <button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'pick-duplicate', index: pickCard })}>⧉ Salin</button>
          <button className={uiButton} disabled={pickCard === 0} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'pick-up', index: pickCard }); setPickCard(pickCard - 1); }}>←</button>
          <button className={uiButton} disabled={pickCard === content.topPicks.length - 1} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'pick-down', index: pickCard }); setPickCard(pickCard + 1); }}>→</button>
          <button className={`${uiButton} text-red-300`} disabled={content.topPicks.length <= 1} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'pick-remove', index: pickCard }); setPickCard(null); }}>Hapus</button>
        </div>
        <p className="mt-2 text-[11px] text-white/50">Klik label, judul, atau deskripsi pada kartu untuk mengubah teks.</p>
      </div>
    </div>}
    {watchCard !== null && activeWatchCard && <div className="pointer-events-none fixed inset-x-2 bottom-4 z-[9989] flex justify-center">
      <div className="pointer-events-auto max-w-full rounded-2xl border border-[#ff6983]/45 bg-[#151219]/95 p-3 text-white shadow-[0_20px_65px_rgba(0,0,0,.8)] backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between gap-4"><span className="max-w-[230px] truncate text-xs font-bold text-[#ff9aaa]">JELAJAH {watchCard + 1} · {activeWatchCard.title}</span><button type="button" aria-label="Tutup aksi jelajah" onClick={() => setWatchCard(null)}>✕</button></div>
        <div className="mb-2 flex items-center gap-2"><label htmlFor="watch-target" className="text-xs text-white/60">Menuju bagian</label><select id="watch-target" className={`${uiInput} min-w-0 flex-1`} value={activeWatchCard.target} onChange={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `watch:${watchCard}:target`, value: e.target.value })}>
          <option value="about">Tentang Saya</option><option value="journey">Perjalanan</option><option value="originals">Karya</option><option value="picks">Pilihan Karya</option><option value="skills">Keahlian</option><option value="moments">Momen Penting</option><option value="story">Cerita Lengkap</option>
        </select></div>
        <div className="flex flex-wrap gap-1.5">
          <button className={uiButton} onClick={() => pickWatchFile(watchCard)}>📷 Foto</button>
          <button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'watch-add' })}>＋ Tambah</button>
          <button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'watch-duplicate', index: watchCard })}>⧉ Salin</button>
          <button className={uiButton} disabled={watchCard === 0} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'watch-up', index: watchCard }); setWatchCard(watchCard - 1); }}>←</button>
          <button className={uiButton} disabled={watchCard === (content.watchCards?.length ?? 0) - 1} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'watch-down', index: watchCard }); setWatchCard(watchCard + 1); }}>→</button>
          <button className={`${uiButton} text-red-300`} disabled={(content.watchCards?.length ?? 0) <= 1} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'watch-remove', index: watchCard }); setWatchCard(null); }}>Hapus</button>
        </div>
        <p className="mt-2 text-[11px] text-white/50">Klik judul atau keterangannya langsung di kartu untuk mengubah teks.</p>
      </div>
    </div>}
    {card !== null && activeProject && <div className="pointer-events-none fixed inset-x-2 bottom-4 z-[9989] flex justify-center">
      <div className="pointer-events-auto max-w-full rounded-2xl border border-[#ff6983]/45 bg-[#151219]/95 p-3 text-white shadow-[0_20px_65px_rgba(0,0,0,.8)] backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between gap-4"><span className="max-w-[160px] truncate text-xs font-bold text-[#ff9aaa]">KARTU {card + 1} · {activeProject.title}</span><button type="button" onClick={() => { setCard(null); setShowCardDetails(false); }} aria-label="Tutup aksi kartu">✕</button></div>
        <div className="flex flex-wrap gap-1.5">
          <button className={uiButton} onClick={() => pickFile(card)}>📷 Foto</button>
          <button className={uiButton} onClick={() => setShowCardDetails((v) => !v)}>✎ Detail</button>
          <button className={uiButton} onClick={() => emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'duplicate', index: card })}>⧉ Salin</button>
          <button className={uiButton} disabled={card === 0} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'up', index: card }); setCard(card - 1); }}>←</button>
          <button className={uiButton} disabled={card === content.projects.length - 1} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'down', index: card }); setCard(card + 1); }}>→</button>
          <button className={`${uiButton} text-red-300`} disabled={content.projects.length <= 1} onClick={() => { emit({ type: 'PESONAFLIX_VISUAL_ACTION', action: 'remove', index: card }); setCard(null); }}>Hapus</button>
        </div>
        {showCardDetails && <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {([{ key: 'tags', label: 'Kata kunci', value: activeProject.stack.join(', ') }, { key: 'website', label: 'Link proyek', value: activeProject.github || '' }] as const).map(({ key, label, value: initial }) =>
            <label key={`${card}-${key}-${initial}`} className="space-y-1 text-xs"><span>{label}</span><input className={uiInput} defaultValue={initial} onBlur={(e) => emit({ type: 'PESONAFLIX_VISUAL_TEXT', field: `project:${card}:${key}`, value: e.target.value.trim() })} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}/></label>)}
        </div>}
      </div>
    </div>}
    {box && <div className="fixed inset-0 z-[9995]" onMouseDown={(e) => { if (e.target === e.currentTarget) closeText(true); }}>
      <textarea
        ref={fieldRef} value={value} onChange={(e) => setValue(e.target.value)}
        onBlur={() => closeText(true)}
        onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); closeText(false); } if (e.key === 'Enter' && (!box.multiline || e.ctrlKey || e.metaKey)) { e.preventDefault(); closeText(true); } }}
        aria-label={`Edit ${box.field} langsung di kanvas`}
        className="fixed resize-y rounded-lg border-2 border-[#ff5478] bg-[#0b0b11]/95 p-2 text-white shadow-[0_0_0_5px_rgba(229,9,49,.15),0_15px_45px_#000] outline-none"
        style={{ left: box.x, top: box.y, width: box.width, minHeight: box.height, maxHeight: '55vh', fontSize: box.fontSize, fontWeight: box.fontWeight, textAlign: box.textAlign }}
      />
      <div className="fixed z-[9996] flex items-center gap-2 rounded-lg border border-white/20 bg-[#15151b] px-2 py-1 text-[11px] text-white" style={{ left: box.x, top: Math.min(window.innerHeight - 36, box.y + box.height + 6) }}>
        <span className="text-white/60">Enter: simpan · Esc: batal</span>
        <button type="button" className="rounded bg-[#e50931] px-2 py-1 font-bold" onMouseDown={(e) => e.preventDefault()} onClick={() => closeText(true)}>Simpan</button>
        <button type="button" className="px-1" onMouseDown={(e) => e.preventDefault()} onClick={() => closeText(false)}>Batal</button>
      </div>
    </div>}
  </>;
}

export { fieldValue };
