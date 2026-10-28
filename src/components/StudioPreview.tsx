import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import App from '../App';
import { PortfolioProvider } from '../data/PortfolioContext';
import { createPortfolioFromBrief, validateBrief, type PortfolioContent } from '../data/clientModel';
import { getDraft, preparedBrief } from '../data/studioDraft';

export default function StudioPreview() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
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
  }, []);

  if (error) return <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#09090d] px-5 text-center text-white"><p className="text-xl font-bold">Preview belum tersedia</p><p className="max-w-lg text-white/65">{error}</p><a className="rounded-xl bg-white px-5 py-3 font-bold text-black" href="/studio">Kembali ke Studio</a></div>;
  if (!content) return <div className="flex min-h-screen items-center justify-center bg-[#09090d] text-white">Menyiapkan preview…</div>;
  return <><div className="fixed right-4 top-4 z-[9999] flex items-center gap-3 rounded-xl border border-white/15 bg-black/85 px-4 py-2.5 text-sm text-white shadow-xl backdrop-blur"><span className="hidden text-white/60 sm:inline">PREVIEW · Belum Live</span><a className="font-bold text-[#ff6f85] underline" href="/studio">← Kembali Edit</a></div><MotionConfig reducedMotion="user"><PortfolioProvider data={content}><App slug={slug}/></PortfolioProvider></MotionConfig></>;
}
