import { CheckCircle2, Clapperboard, ExternalLink, Image, LockKeyhole, Sparkles, UserRoundX } from 'lucide-react';
import { canApplyIdentityMode, canApplyTemplate, identityModes, templateCatalog, type IdentityMode, type TemplateId } from '../data/templateCatalog.mjs';

type Props = {
  selectedTemplateId: TemplateId;
  identityMode: IdentityMode;
  onApplyTemplate: (id: TemplateId) => void;
  onApplyIdentity: (id: IdentityMode) => void;
  onEditWebsite: () => void;
};

const families = ['Sinematik', 'Ceria', 'Bercerita', 'Profesional'] as const;

const statusText = (status: 'available' | 'demo' | 'planned') => {
  if (status === 'available') return 'Siap dipakai';
  if (status === 'demo') return 'Demo tersedia';
  return 'Segera hadir';
};

/** Galeri perencanaan 16 gaya. Yang belum punya renderer sengaja tidak dapat dipilih. */
export default function StudioTemplateGallery({ selectedTemplateId, identityMode, onApplyTemplate, onApplyIdentity, onEditWebsite }: Props) {
  const active = templateCatalog.find((item) => item.id === selectedTemplateId);
  return (
    <section aria-label="Katalog template PESONAFLIX" className="space-y-6 rounded-2xl border border-[#fd5579]/25 bg-[#121218] p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff7294]">PESONAFLIX STUDIO · TEMPLATE</p>
          <h3 className="mt-2 text-2xl font-black sm:text-3xl">Pilih Gaya Website</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">Ada 16 gaya dalam katalog. ORIGINAL, CHIBI 3D, dan ANIME sudah bisa dipilih untuk klien. Gaya lainnya menyusul.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-right">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-white/45">Gaya klien ini</span>
          <strong className="mt-1 block text-base text-[#ffd6df]">{active?.name || 'ORIGINAL'}</strong>
        </div>
      </div>

      {selectedTemplateId === 'chibi-3d' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ff90b3]/30 bg-gradient-to-r from-[#402036] to-[#25121e] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold text-[#ffb4cc]">CHIBI 3D aktif untuk klien ini</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">Selanjutnya isi data klien, unggah ilustrasi karakter CHIBI dan poster karya milik klien, lalu simpan dan periksa preview. Template mengatur tata letak, font, warna dan gerakan; belum otomatis mengubah foto menjadi karakter 3D.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-xl bg-[#ff4b82] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#ff70a0]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'anime' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#8eeeff]/35 bg-gradient-to-r from-[#29315c] to-[#44203e] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold text-[#a3f4ff]">ANIME aktif untuk klien ini</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">Karakter bergaya anime, langit bercahaya, font dan kartu sinematik akan mengikuti gaya ini. Ganti teks, unggah ilustrasi anime serta poster karya milik klien di editor. Sistem belum otomatis mengubah foto menjadi ilustrasi.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-xl bg-[#ed69ad] px-5 py-2.5 text-sm font-extrabold text-[#190e30] transition hover:bg-[#ff9acb]">Buka Editor Website</button>
        </div>
      )}

      <div className="space-y-7">
        {families.map((family) => (
          <div key={family}>
            <h4 className="mb-3 border-b border-white/10 pb-2 text-sm font-extrabold uppercase tracking-[0.15em] text-white/75">{family}</h4>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {templateCatalog.filter((item) => item.family === family).map((item) => {
                const applied = selectedTemplateId === item.id;
                const available = canApplyTemplate(item.id);
                return (
                  <article key={item.id} className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-[#181820] transition-colors ${applied ? 'border-[#ff5c82] ring-1 ring-[#ff5c82]/60' : 'border-white/10 hover:border-white/25'}`}>
                    <div className="relative flex h-28 items-end overflow-hidden px-4 pb-3" style={{ background: `linear-gradient(135deg, ${item.colors[0]} 8%, ${item.colors[1]} 80%, ${item.colors[2]})` }}>
                      <div className="absolute -right-5 -top-7 h-24 w-24 rounded-full border-[12px] border-white/20" aria-hidden="true" />
                      <div className="absolute right-12 top-3 h-12 w-12 rotate-12 rounded-2xl border-4 border-white/10" aria-hidden="true" />
                      <p className="relative max-w-full break-words text-2xl font-black leading-none tracking-tight text-white drop-shadow-lg" style={{ fontFamily: `"${item.fonts[0]}", system-ui, sans-serif`, textShadow: '0 2px 12px #0008' }}>{item.name}</p>
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.status === 'available' ? 'bg-emerald-500/15 text-emerald-300' : item.status === 'demo' ? 'bg-sky-500/15 text-sky-300' : 'bg-white/10 text-white/50'}`}>{statusText(item.status)}</span>
                        {applied && <span className="flex items-center gap-1 text-[10px] font-bold text-[#ff9db6]"><CheckCircle2 size={13}/> Terpilih</span>}
                      </div>
                      <p className="text-xs leading-relaxed text-white/70">{item.description}</p>
                      <p className="text-[11px] text-white/40">{item.audience}</p>
                      <div className="mt-auto flex gap-2 pt-2">
                        {available ? (
                          <button type="button" disabled={applied} onClick={() => onApplyTemplate(item.id)} className="flex min-h-10 flex-1 items-center justify-center rounded-lg bg-[#eb2553] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#ff3767] disabled:cursor-default disabled:bg-white/10 disabled:text-white/60">{applied ? 'Sedang Dipakai' : 'Gunakan Gaya'}</button>
                        ) : (
                          <span className="flex min-h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/40"><LockKeyhole size={12}/> Belum Aktif</span>
                        )}
                        {item.demoUrl && <a href={item.demoUrl} target="_blank" rel="noreferrer" className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-white/20 px-3 text-xs font-bold text-white/80 hover:bg-white/10" aria-label={`Lihat demo gaya ${item.name}`}><ExternalLink size={14}/> Demo</a>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2"><Sparkles size={19} className="text-[#ff82a2]"/><h4 className="text-lg font-extrabold">Tampilan Pemilik Website</h4></div>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-white/55">FACELESS adalah mode identitas, bukan gaya ke-17. Nantinya bisa digabung dengan berbagai template. Saat ini hanya foto asli yang aman diterbitkan.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {identityModes.map((item) => {
            const allowed = canApplyIdentityMode(item.id);
            const Icon = item.id === 'photo' ? Image : item.id === 'avatar' ? Clapperboard : UserRoundX;
            return <button key={item.id} type="button" disabled={!allowed || identityMode === item.id} onClick={() => onApplyIdentity(item.id)} aria-pressed={identityMode === item.id} className={`flex min-h-28 items-start gap-3 rounded-xl border p-4 text-left transition ${identityMode === item.id ? 'border-[#ff6487] bg-[#ff6487]/10' : 'border-white/10 bg-white/[0.035]'} ${allowed ? 'hover:border-[#ff6487]' : 'cursor-not-allowed opacity-60'}`}>
              <Icon size={22} className="mt-0.5 shrink-0 text-[#ff98ad]"/>
              <span><strong className="block text-sm">{item.name}</strong><span className="mt-1 block text-xs leading-relaxed text-white/55">{item.description}</span><span className={`mt-2 block text-[10px] font-bold ${allowed ? 'text-emerald-300' : 'text-white/45'}`}>{allowed ? identityMode === item.id ? 'Sedang dipakai' : 'Tersedia' : 'Segera hadir'}</span></span>
            </button>;
          })}
        </div>
      </div>

      <p className="rounded-xl border border-amber-400/15 bg-amber-300/5 px-4 py-3 text-xs leading-relaxed text-amber-100/75">Warna pada kartu hanyalah petunjuk palet. Untuk melihat desain utuh, pilih gaya lalu buka editor atau tautan demo. Gaya tidak otomatis menghasilkan gambar AI. Nama, karya, dan WhatsApp klien tetap tersimpan saat berpindah gaya.</p>
    </section>
  );
}
