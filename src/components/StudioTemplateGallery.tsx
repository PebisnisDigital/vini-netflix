import { CheckCircle2, Clapperboard, ExternalLink, Image, LockKeyhole, Sparkles, UserRoundX } from 'lucide-react';
import { canApplyIdentityMode, canApplyTemplate, identityModes, templateCatalog, type IdentityMode, type TemplateId } from '../data/templateCatalog.mjs';

type Props = {
  selectedTemplateId: TemplateId;
  identityMode: IdentityMode;
  onApplyTemplate: (id: TemplateId) => void;
  onApplyIdentity: (id: IdentityMode) => void;
  onEditWebsite: () => void;
};

/** Grid ringkas seluruh gaya Studio; mode identitas tetap terpisah. */
export default function StudioTemplateGallery({ selectedTemplateId, identityMode, onApplyTemplate, onApplyIdentity, onEditWebsite }: Props) {
  const active = templateCatalog.find((item) => item.id === selectedTemplateId);

  return (
    <section aria-label="Katalog template PESONAFLIX" className="mx-auto max-w-[1280px] space-y-5 rounded-2xl border border-[#fd5579]/20 bg-[#121218] p-3 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff7294]">PESONAFLIX STUDIO · TEMPLATE</p>
          <h3 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Pilih Gaya Website</h3>
          <p className="mt-1 text-xs text-white/50">16 gaya siap pakai · Pilih, lihat demo, lalu edit.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/60">{templateCatalog.length} gaya</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ff6487]/25 bg-gradient-to-r from-[#2b1722] to-[#19151e] px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#ff6487]/15 text-[#ff9eb6]"><CheckCircle2 size={17} /></span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">Gaya aktif</p>
            <p className="truncate text-sm font-extrabold text-[#ffdae3]">{active?.name || 'ORIGINAL'} <span className="font-normal text-white/45">· {active?.family || 'Sinematik'}</span></p>
          </div>
        </div>
        <button type="button" onClick={onEditWebsite} className="min-h-9 shrink-0 rounded-lg bg-[#eb2553] px-3.5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#ff3867] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9eb6]">
          Edit Website
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5 lg:gap-3" aria-label="16 pilihan gaya website">
        {templateCatalog.map((item) => {
          const applied = selectedTemplateId === item.id;
          const available = canApplyTemplate(item.id);
          return (
            <article key={item.id} className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-[#1b1a22] shadow-[0_4px_16px_#00000016] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#00000030] ${applied ? 'border-[#ff6587] ring-1 ring-[#ff6587]/50' : 'border-white/10 hover:border-white/30'}`}>
              <div className="relative flex h-[84px] min-w-0 flex-col justify-between overflow-hidden p-2.5 sm:h-[90px]" style={{ background: `linear-gradient(140deg, ${item.colors[0]} 5%, ${item.colors[1]} 76%, ${item.colors[2]})` }}>
                <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-7 h-20 w-20 rounded-full border-[10px] border-white/20" />
                <div aria-hidden="true" className="pointer-events-none absolute right-10 top-5 h-8 w-8 rotate-12 rounded-lg border-[3px] border-white/15" />
                <div className="relative flex items-start justify-between gap-1">
                  <span className="max-w-[78%] truncate rounded-full border border-white/20 bg-black/25 px-2 py-0.5 text-[9px] font-bold text-white/90 backdrop-blur-sm">{item.family}</span>
                  {applied && <CheckCircle2 size={15} className="shrink-0 text-white drop-shadow-md" aria-label="Gaya aktif" />}
                </div>
                <h4 className="relative line-clamp-2 break-words text-[13px] font-black leading-[1.05] text-white drop-shadow-lg sm:text-[15px]" style={{ fontFamily: `"${item.fonts[0]}", system-ui, sans-serif`, textShadow: '0 2px 9px #000a' }}>{item.name}</h4>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
                <p className="line-clamp-2 min-h-[2.5em] text-[11px] leading-[1.3] text-white/60" title={item.description}>{item.description}</p>
                <div className="mt-auto flex min-w-0 gap-1.5">
                  {available ? (
                    <button type="button" disabled={applied} onClick={() => onApplyTemplate(item.id)} aria-pressed={applied} className={`min-h-9 min-w-0 flex-1 rounded-lg px-1.5 text-[11px] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9eb6] ${applied ? 'cursor-default bg-[#ff6487]/15 text-[#ffadbf]' : 'bg-[#e72b57] text-white hover:bg-[#ff3867]'}`}>
                      {applied ? 'Dipakai' : 'Pilih'}
                    </button>
                  ) : (
                    <span className="flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 text-[10px] text-white/50"><LockKeyhole size={11} /> Terkunci</span>
                  )}
                  {item.demoUrl && (
                    <a href={item.demoUrl} target="_blank" rel="noreferrer" className="flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-lg border border-white/15 px-2 text-[11px] font-bold text-white/75 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9eb6]" aria-label={`Lihat demo gaya ${item.name}`} title={`Lihat demo ${item.name}`}>
                      <ExternalLink size={12} /> <span className="hidden sm:inline">Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2"><Sparkles size={16} className="text-[#ff82a2]"/><h4 className="text-sm font-extrabold">Tampilan Pemilik Website</h4></div>
        <p className="mb-3 max-w-2xl text-xs leading-relaxed text-white/55">Mode identitas terpisah dari gaya website. Avatar AI dan FACELESS belum tersedia.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {identityModes.map((item) => {
            const allowed = canApplyIdentityMode(item.id);
            const Icon = item.id === 'photo' ? Image : item.id === 'avatar' ? Clapperboard : UserRoundX;
            return <button key={item.id} type="button" disabled={!allowed || identityMode === item.id} onClick={() => onApplyIdentity(item.id)} aria-pressed={identityMode === item.id} className={`flex min-h-20 items-start gap-2 rounded-lg border p-3 text-left transition ${identityMode === item.id ? 'border-[#ff6487] bg-[#ff6487]/10' : 'border-white/10 bg-white/[0.035]'} ${allowed ? 'hover:border-[#ff6487]' : 'cursor-not-allowed opacity-60'}`}>
              <Icon size={18} className="mt-0.5 shrink-0 text-[#ff98ad]"/>
              <span><strong className="block text-xs">{item.name}</strong><span className="mt-0.5 block text-[11px] leading-snug text-white/55">{item.description}</span><span className={`mt-1 block text-[10px] font-bold ${allowed ? 'text-emerald-300' : 'text-white/45'}`}>{allowed ? identityMode === item.id ? 'Sedang dipakai' : 'Tersedia' : 'Segera hadir'}</span></span>
            </button>;
          })}
        </div>
      </div>

      <p className="rounded-lg border border-amber-400/15 bg-amber-300/5 px-3 py-2.5 text-[11px] leading-relaxed text-amber-100/75">Kartu menunjukkan palet gaya, bukan hasil akhir. Buka Demo untuk melihat gerakan aslinya. Berpindah gaya tidak menghapus data klien; gambar AI tidak dibuat otomatis.</p>
    </section>
  );
}
