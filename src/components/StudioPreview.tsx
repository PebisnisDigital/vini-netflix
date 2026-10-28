import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { MotionConfig } from 'framer-motion';
import App from '../App';
import { PortfolioProvider } from '../data/PortfolioContext';
import { createPortfolioFromBrief, DEFAULT_THEME, validateBrief, viniContent, type PortfolioContent } from '../data/clientModel';
import { getDraft, preparedBrief } from '../data/studioDraft';

type TextField = 'name' | 'role' | 'location' | 'bio' | 'tagline';
type CardField = 'title' | 'description' | 'category' | 'year' | 'website';
type InlineEdit = { field: TextField | `project:${number}:${CardField}`; value: string; top: number; left: number; width: number; fontSize: number; fontWeight: string };
const cardFields: CardField[] = ['title', 'description', 'category', 'year', 'website'];
const canvasInput = 'w-full rounded-lg border border-white/20 bg-[#17171e] px-3 py-2.5 text-sm text-white outline-none focus:border-rose-400';

export default function StudioPreview() {
  const canvasMode = new URLSearchParams(location.search).get('canvas') === '1';
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [editing, setEditing] = useState<InlineEdit | null>(null);
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const [cardValues, setCardValues] = useState<Record<CardField, string>>({ title: '', description: '', category: '', year: '', website: '' });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const photoIndex = useRef<number | null>(null);

  const sendToStudio = (data: Record<string, unknown>) => window.parent.postMessage(data, location.origin);

  const startPhoto = (index: number | null) => {
    photoIndex.current = index;
    photoInput.current?.click();
  };

  useEffect(() => {
    if (canvasMode) {
      setContent(viniContent);
      setSlug('studio-canvas');
      const receive = (event: MessageEvent) => {
        if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'PESONAFLIX_CANVAS_UPDATE') return;
        if (event.data.content?.profile && Array.isArray(event.data.content.projects)) {
          setContent(event.data.content as PortfolioContent);
          setSlug('studio-canvas');
        }
      };
      window.addEventListener('message', receive);
      window.parent.postMessage({ type: 'PESONAFLIX_CANVAS_READY' }, location.origin);
      return () => window.removeEventListener('message', receive);
    }
    const slugFromUrl = new URLSearchParams(location.search).get('slug') || '';
    const urls: string[] = [];
    let mounted = true;
    void getDraft(slugFromUrl).then((draft) => {
      if (!draft) throw new Error('Draft tidak ditemukan di browser ini. Simpan dari Studio terlebih dahulu.');
      const brief = preparedBrief(draft);
      const invalid = validateBrief(brief);
      if (invalid.length) throw new Error(invalid.join(' · '));
      const page = createPortfolioFromBrief(brief);
      if (draft.portrait) {
        const url = URL.createObjectURL(draft.portrait); urls.push(url);
        page.profile.portrait.src = url; page.profile.portrait.srcSet = '';
      }
      for (const [index, file] of Object.entries(draft.projectPhotos)) {
        const url = URL.createObjectURL(file); urls.push(url);
        if (page.projects[Number(index)]) page.projects[Number(index)].image = url;
      }
      if (mounted) { setContent(page); setSlug(brief.slug); document.title = `Preview ${brief.name} — PESONAFLIX`; }
    }).catch((e) => { if (mounted) setError(e.message); });
    return () => { mounted = false; urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [canvasMode]);

  const editOnCanvas = (event: MouseEvent<HTMLDivElement>) => {
    if (!canvasMode) return;
    const element = event.target as HTMLElement;
    const editable = element.closest<HTMLElement>('[data-studio-edit]');
    event.preventDefault();
    event.stopPropagation();
    if (!editable || !content) return;
    const field = editable.dataset.studioEdit;
    setEditing(null);
    setCardIndex(null);
    setPaletteOpen(false);
    if (field === 'portrait') { startPhoto(null); return; }
    const beginText = (key: InlineEdit['field'], value: string) => {
      const rect = editable.getBoundingClientRect();
      const css = getComputedStyle(editable);
      const width = Math.min(window.innerWidth - 28, Math.max(190, rect.width + 20));
      setEditing({ field: key, value, top: Math.max(10, Math.min(rect.top, window.innerHeight - 110)),
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width,
        fontSize: Math.min(52, Number.parseFloat(css.fontSize) || 16), fontWeight: css.fontWeight });
    };
    if (field?.startsWith('project:')) {
      const [, indexText, cardField] = field.split(':');
      const index = Number(indexText);
      const project = content.projects[index];
      if (!project) return;
      if (cardFields.includes(cardField as CardField)) {
        const value = ({ title: project.title, description: project.logline, category: project.genre,
          year: project.year, website: project.github || '' })[cardField as CardField];
        beginText(`project:${index}:${cardField as CardField}`, value);
        return;
      }
      setCardIndex(index);
      setCardValues({ title: project.title, description: project.logline, category: project.genre, year: project.year, website: project.github || '' });
      return;
    }
    if (!['name', 'role', 'location', 'bio', 'tagline'].includes(field || '')) return;
    const key = field as TextField;
    const value = ({ name: content.profile.displayName, role: content.profile.role, location: content.profile.location,
      bio: content.profile.intro, tagline: content.profile.tagline.join(' • ') })[key];
    beginText(key, value);
  };

  const changeText = (value: string) => {
    setEditing((current) => current ? { ...current, value } : current);
    if (editing?.field.startsWith('project:')) {
      const [, index, field] = editing.field.split(':');
      sendToStudio({ type: 'PESONAFLIX_CANVAS_CARD', index: Number(index), field, value });
    } else if (editing) sendToStudio({ type: 'PESONAFLIX_CANVAS_TEXT', field: editing.field, value });
  };

  const changeCard = (field: CardField, value: string) => {
    setCardValues((current) => ({ ...current, [field]: value }));
    if (cardIndex !== null) sendToStudio({ type: 'PESONAFLIX_CANVAS_CARD', index: cardIndex, field, value });
  };

  const overlayStyle: CSSProperties = editing ? { top: editing.top, left: editing.left, width: editing.width,
    fontSize: editing.fontSize, fontWeight: editing.fontWeight } : {};

  if (error) return <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#09090d] px-5 text-center text-white"><p className="text-xl font-bold">Preview belum tersedia</p><p className="max-w-lg text-white/65">{error}</p><a className="rounded-xl bg-white px-5 py-3 font-bold text-black" href="/studio">Kembali ke Studio</a></div>;
  if (!content) return <div className="flex min-h-screen items-center justify-center bg-[#09090d] text-white">Menyiapkan preview…</div>;
  return <>
    {!canvasMode && <div className="fixed right-4 top-4 z-[9999] flex items-center gap-3 rounded-xl border border-white/15 bg-black/85 px-4 py-2.5 text-sm text-white shadow-xl backdrop-blur"><span className="hidden text-white/60 sm:inline">PREVIEW · Belum Live</span><a className="font-bold text-[#ff6f85] underline" href="/studio">← Kembali Edit</a></div>}
    {canvasMode && <style>{'[data-studio-edit]{cursor:text!important}[data-studio-edit="portrait"],[data-studio-edit^="project:"]{cursor:pointer!important}[data-studio-edit]:hover{outline:2px dashed var(--color-crimson-2);outline-offset:3px}a,button{cursor:pointer!important}'}</style>}
    <MotionConfig reducedMotion="user"><div onClickCapture={editOnCanvas}><PortfolioProvider data={content}><App slug={slug} editorMode={canvasMode}/></PortfolioProvider></div></MotionConfig>
    {canvasMode && <>
      <input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" aria-label="Pilih foto untuk kanvas" onChange={(e) => {
        const file = e.currentTarget.files?.[0];
        if (file) sendToStudio({ type: 'PESONAFLIX_CANVAS_PHOTO', index: photoIndex.current, file });
        e.currentTarget.value = '';
      }}/>
      {editing && <div className="fixed z-[99990]" style={overlayStyle}>
        {editing.field === 'bio' || editing.field === 'tagline' || editing.field.endsWith(':description') ?
          <textarea autoFocus aria-label={`Edit ${editing.field} langsung di kanvas`} rows={editing.field === 'bio' ? 5 : 3}
            className="w-full resize-y rounded-md border-2 border-rose-400 bg-[#08080c]/95 p-2 leading-snug text-white shadow-2xl outline-none"
            style={{ fontSize: Math.min(editing.fontSize, 19), fontWeight: editing.fontWeight }} value={editing.value}
            onChange={(e) => changeText(e.target.value)} onBlur={() => setEditing(null)}
            onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Escape') setEditing(null); }}/>
          : <input autoFocus aria-label={`Edit ${editing.field} langsung di kanvas`} type="text" value={editing.value}
            className="w-full rounded-md border-2 border-rose-400 bg-[#08080c]/95 px-2 py-1 leading-tight text-white shadow-2xl outline-none"
            onChange={(e) => changeText(e.target.value)} onBlur={() => setEditing(null)}
            onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter' || e.key === 'Escape') setEditing(null); }}/>
        }
        <span className="mt-1 inline-block rounded bg-rose-600 px-2 py-1 text-[11px] font-bold text-white">Edit langsung · Klik luar untuk selesai</span>
      </div>}
      <div className="fixed bottom-4 right-4 z-[99980] flex flex-wrap items-end justify-end gap-2">
        {paletteOpen && <div className="w-52 rounded-2xl border border-white/20 bg-[#16161d]/95 p-4 text-white shadow-2xl backdrop-blur-xl">
          <h4 className="mb-3 text-sm font-bold">Warna Website</h4>
          <label className="mb-3 flex items-center justify-between text-xs">Aksen <input type="color" aria-label="Ubah warna aksen langsung di kanvas" value={content.profile.theme?.accent || DEFAULT_THEME.accent} onChange={(e) => sendToStudio({ type: 'PESONAFLIX_CANVAS_THEME', field: 'accent', color: e.target.value })}/></label>
          <label className="flex items-center justify-between text-xs">Latar <input type="color" aria-label="Ubah warna latar langsung di kanvas" value={content.profile.theme?.background || DEFAULT_THEME.background} onChange={(e) => sendToStudio({ type: 'PESONAFLIX_CANVAS_THEME', field: 'background', color: e.target.value })}/></label>
        </div>}
        <button type="button" className="rounded-full border border-white/25 bg-black/85 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-lg" onClick={() => startPhoto(null)}>▧ Ganti Foto</button>
        <button type="button" className="rounded-full border border-white/25 bg-black/85 px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-lg" onClick={() => setPaletteOpen((current) => !current)}>🎨 Warna</button>
        <button type="button" className="rounded-full bg-[#e50931] px-4 py-3 text-xs font-bold text-white shadow-2xl" onClick={() => sendToStudio({ type: 'PESONAFLIX_CANVAS_ADD_CARD' })}>＋ Kartu</button>
      </div>
      {cardIndex !== null && content.projects[cardIndex] && <div role="presentation" className="fixed inset-0 z-[99995] flex items-center justify-center bg-black/75 px-3 py-6 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setCardIndex(null); }}>
        <section role="dialog" aria-modal="true" aria-label={`Edit kartu karya ${cardIndex + 1} dalam kanvas`} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-rose-400/40 bg-[#121219] p-5 text-white shadow-[0_24px_100px_rgba(0,0,0,.8)]">
          <div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Edit langsung dalam canvas</p><h3 className="text-xl font-black">Kartu Karya {cardIndex + 1}</h3></div><button type="button" aria-label="Selesai edit kartu" className="rounded-full bg-white/10 px-3 py-2 text-sm" onClick={() => setCardIndex(null)}>✕</button></div>
          <div className="mb-4 h-28 overflow-hidden rounded-xl bg-gradient-to-br from-[#4d1c36] to-[#070709]">{content.projects[cardIndex].image && <img className="h-full w-full object-cover" src={content.projects[cardIndex].image} alt={`Preview kartu ${cardIndex + 1}`}/>}</div>
          <div className="grid gap-3">{cardFields.map((field) => <label key={field} className="block"><span className="mb-1 block text-xs font-semibold text-white/70">{({ title: 'Judul Kartu', description: 'Deskripsi', category: 'Kategori', year: 'Tahun', website: 'Link Karya (opsional)' })[field]}</span>{field === 'description' ? <textarea rows={3} className={canvasInput} value={cardValues[field]} onChange={(e) => changeCard(field, e.target.value)}/> : <input className={canvasInput} value={cardValues[field]} onChange={(e) => changeCard(field, e.target.value)}/>}</label>)}</div>
          <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="rounded-lg bg-white/15 px-3 py-2 text-sm font-bold" onClick={() => startPhoto(cardIndex)}>▧ Ganti Foto Kartu</button><button type="button" className="rounded-lg bg-white/10 px-3 py-2 text-sm" disabled={cardIndex === 0} onClick={() => { sendToStudio({ type: 'PESONAFLIX_CANVAS_MOVE_CARD', index: cardIndex, direction: -1 }); setCardIndex(null); }}>↑ Geser</button><button type="button" className="rounded-lg bg-white/10 px-3 py-2 text-sm" disabled={cardIndex >= content.projects.length - 1} onClick={() => { sendToStudio({ type: 'PESONAFLIX_CANVAS_MOVE_CARD', index: cardIndex, direction: 1 }); setCardIndex(null); }}>↓ Geser</button></div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><button type="button" className="text-xs text-red-300 underline disabled:opacity-30" disabled={content.projects.length <= 1} onClick={() => { if (window.confirm('Hapus kartu karya ini dari draft?')) { sendToStudio({ type: 'PESONAFLIX_CANVAS_REMOVE_CARD', index: cardIndex }); setCardIndex(null); } }}>Hapus Kartu</button><button type="button" className="rounded-lg bg-[#e50931] px-5 py-2.5 text-sm font-bold" onClick={() => setCardIndex(null)}>Selesai</button></div>
        </section>
      </div>}
    </>}
  </>;
}
