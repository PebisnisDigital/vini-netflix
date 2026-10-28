import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import App from '../App';
import { PortfolioProvider } from '../data/PortfolioContext';
import { createPortfolioFromBrief, sushmitaContent, validateBrief, type PortfolioContent } from '../data/clientModel';
import { getDraft, preparedBrief } from '../data/studioDraft';
import VisualCanvasTools from './VisualCanvasTools';

export default function StudioPreview() {
  const canvasMode = new URLSearchParams(location.search).get('canvas') === '1';
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (canvasMode) {
      setContent(sushmitaContent);
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
      for (const [index, file] of Object.entries(draft.watchPhotos || {})) {
        const url = URL.createObjectURL(file); urls.push(url);
        if (page.watchCards?.[Number(index)]) page.watchCards[Number(index)].image = url;
      }
      for (const [index, file] of Object.entries(draft.pickPhotos || {})) {
        const url = URL.createObjectURL(file); urls.push(url);
        if (page.topPicks[Number(index)]) page.topPicks[Number(index)].image = url;
      }
      for (const [key, file] of Object.entries(draft.episodePhotos || {})) {
        const [season, episode] = key.split('-').map(Number);
        const url = URL.createObjectURL(file); urls.push(url);
        if (page.seasons[season]?.episodes[episode]) page.seasons[season].episodes[episode].image = url;
      }
      if (mounted) { setContent(page); setSlug(brief.slug); document.title = `Preview ${brief.name} — PESONAFLIX`; }
    }).catch((e) => { if (mounted) setError(e.message); });
    return () => { mounted = false; urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [canvasMode]);

  if (error) return <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#09090d] px-5 text-center text-white"><p className="text-xl font-bold">Preview belum tersedia</p><p className="max-w-lg text-white/65">{error}</p><a className="rounded-xl bg-white px-5 py-3 font-bold text-black" href="/studio">Kembali ke Studio</a></div>;
  if (!content) return <div className="flex min-h-screen items-center justify-center bg-[#09090d] text-white">Menyiapkan preview…</div>;
  return <>
    {!canvasMode && <div className="fixed right-4 top-4 z-[9999] flex items-center gap-3 rounded-xl border border-white/15 bg-black/85 px-4 py-2.5 text-sm text-white shadow-xl backdrop-blur"><span className="hidden text-white/60 sm:inline">PREVIEW · Belum Live</span><a className="font-bold text-[#ff6f85] underline" href="/studio">← Kembali Edit</a></div>}
    {canvasMode && <style>{'[data-studio-edit]{cursor:text!important}[data-studio-edit]:hover{outline:2px dashed var(--color-crimson-2);outline-offset:2px}[data-studio-edit="portrait"], [data-studio-edit^="project:"]{cursor:pointer!important}'}</style>}
    <MotionConfig reducedMotion="user"><PortfolioProvider data={content}>{canvasMode ? <VisualCanvasTools content={content}><App slug={slug} editorMode /></VisualCanvasTools> : <App slug={slug} editorMode={false}/>}</PortfolioProvider></MotionConfig>
  </>;
}
