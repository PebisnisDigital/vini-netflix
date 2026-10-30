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
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">Ada 16 gaya dalam katalog. Kini 15 gaya siap untuk klien, termasuk MINIMALIST dan FUTURISTIC NEON. Tinggal VINTAGE HERITAGE yang menyusul.</p>
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

      {selectedTemplateId === 'clay-3d' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#a9e5d0]/35 bg-gradient-to-r from-[#3d5166] to-[#684b58] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold text-[#c7f8e3]">CLAY 3D aktif untuk klien ini</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Font bulat, warna tanah liat, panggung miniatur, kartu karya dan gerak stop-motion akan tampil otomatis. Isi cerita dan unggah gambar karakter CLAY milik klien melalui Editor Website. Belum ada konversi foto menjadi clay otomatis.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-xl bg-[#ffad93] px-5 py-2.5 text-sm font-extrabold text-[#28334e] transition hover:bg-[#ffd0aa]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'komik-pop' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ffd83b]/40 bg-gradient-to-r from-[#092f56] via-[#13355e] to-[#4c2254] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold text-[#ffdf54]">KOMIK POP aktif untuk klien ini</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Panel komik, font poster, warna cerah, titik halftone, dan animasi otomatis akan diterapkan. Animasi scroll ORIGINAL tetap digunakan. Isi data dan unggah ilustrasi serta poster karya klien melalui Editor Website. Sistem tidak otomatis mengubah foto menjadi komik.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-lg border-2 border-[#081b42] bg-[#ffd83b] px-5 py-2.5 text-sm font-extrabold text-[#081b42] shadow-[5px_5px_0_#f52983] transition hover:-translate-y-1">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'editorial-premium' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e1ba86]/40 bg-gradient-to-r from-[#241e19] via-[#363027] to-[#4c4030] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Playfair_Display'] text-lg font-semibold text-[#f4ddbc]">EDITORIAL PREMIUM aktif untuk klien ini</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Sampul majalah, tipografi serif, kertas ivory, foto elegan, kartu karya terkurasi, dan kamera bergerak otomatis. Section serta animasi ORIGINAL tetap aktif. Isi identitas dan unggah foto editorial klien sendiri melalui Editor Website. Sistem belum membuat foto AI secara otomatis.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-sm border border-[#ffedce] bg-[#e7c698] px-5 py-2.5 text-sm font-bold text-[#1d1711] transition hover:bg-[#f9ddb3]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'doodle' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-[#f6c94d]/60 bg-gradient-to-r from-[#1a466c] via-[#205783] to-[#3b6474] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Caveat'] text-3xl font-bold text-[#ffe58c]">✎ DOODLE aktif untuk klien ini!</p>
            <p className="mt-1 text-xs leading-relaxed text-white/85">Kertas sketsa, font tulisan tangan, coretan, stiker dan animasi otomatis akan tampil bersama section dan animasi master ORIGINAL. Isi identitas dan unggah ilustrasi serta poster karya klien melalui Editor Website. Sistem belum otomatis membuat ilustrasi dari foto.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-[14px_8px_17px_12px] border-2 border-[#16334d] bg-[#f6c94d] px-5 py-2.5 text-sm font-extrabold text-[#16334d] shadow-[4px_4px_0_#fff8e8] transition hover:-translate-y-1">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'storybook' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8c5a0]/45 bg-gradient-to-r from-[#324c40] via-[#486552] to-[#795c57] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['DM_Serif_Display'] text-2xl text-[#ffedce]">✦ STORYBOOK aktif untuk klien ini</p>
            <p className="mt-1 text-xs leading-relaxed text-white/85">Lembaran buku cerita, lukisan cat air, tipografi dongeng, dan animasi membalik halaman berjalan otomatis. Section dan motion master ORIGINAL tetap aktif. Lengkapi kisah serta unggah ilustrasi milik klien melalui Editor Website; gambar AI tidak dibuat otomatis.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-xl border border-[#f3ddb7] bg-[#f4dfbf] px-5 py-2.5 text-sm font-extrabold text-[#314737] transition hover:bg-[#fff3db]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'scrapbook' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-[#f7d78a]/60 bg-gradient-to-r from-[#31494c] via-[#6b5e60] to-[#a56b76] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Caveat'] text-3xl font-bold text-[#ffe69d]">✂ SCRAPBOOK aktif untuk klien ini!</p>
            <p className="mt-1 text-xs leading-relaxed text-white/85">Kolase polaroid, foto analog, washi tape, memo tempel, dan stiker bergerak otomatis. Section serta animasi master ORIGINAL tetap dipakai. Isi identitas dan unggah foto atau ilustrasi milik klien melalui Editor Website; tidak ada konversi foto AI otomatis.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-[6px_13px_7px_12px] border-2 border-[#344b51] bg-[#f9dc90] px-5 py-2.5 text-sm font-extrabold text-[#344b51] shadow-[5px_5px_0_#ed9daa] transition hover:-translate-y-1">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'paper-cut' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#b9d9cd]/60 bg-gradient-to-r from-[#294a56] via-[#497b77] to-[#936f86] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Quicksand'] text-xl font-extrabold text-[#fff2bf]">✿ PAPER CUT aktif untuk klien ini!</p>
            <p className="mt-1 text-xs leading-relaxed text-white/85">Diorama potongan cardstock, lengkungan kertas bertingkat, font bulat, matahari berputar, awan bergerak dan layer bernafas otomatis. Section serta animasi master ORIGINAL tetap aktif. Isi cerita, lalu unggah ilustrasi milik klien di Editor Website; sistem tidak otomatis mengubah foto menjadi paper cut.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-[14px_10px_16px_8px] border-2 border-[#badbce] bg-[#f9e6a2] px-5 py-2.5 text-sm font-extrabold text-[#315260] shadow-[5px_5px_0_#e6a5b3] transition hover:-translate-y-1">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'pixel-retro' && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-[#8d85e8] bg-gradient-to-r from-[#171a3e] via-[#29265c] to-[#234c61] p-4 shadow-[6px_6px_0_#665bc1] sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Press_Start_2P'] text-sm leading-relaxed text-[#ffe38a]">★ PIXEL RETRO READY!</p>
            <p className="mt-3 text-xs leading-relaxed text-white/85">Panggung game 16-bit, layar karakter, kartu quest, font arcade, bintang berkedip, koin melompat dan kamera pixel bergerak otomatis. Seluruh section serta animasi master ORIGINAL tetap aktif. Ganti cerita dan unggah karakter pixel milik klien melalui Editor Website; tidak ada konversi foto otomatis.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 border-2 border-[#fff2b4] bg-[#ffe38a] px-5 py-2.5 font-['Press_Start_2P'] text-[9px] leading-relaxed text-[#1a2040] shadow-[5px_5px_0_#b88be8] transition hover:-translate-y-1">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'miniature-world' && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#a9e8d0]/45 bg-gradient-to-r from-[#153944] via-[#245e63] to-[#654e43] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['DM_Serif_Display'] text-2xl text-[#f9e2bc]">✳ MINIATURE WORLD aktif!</p>
            <p className="mt-2 text-xs leading-relaxed text-white/85">Koleksi diorama miniatur, kamera makro bergerak, orbit panggung, cahaya dan kartu karya hidup otomatis. Section serta animasi master ORIGINAL tetap aktif. Lengkapi cerita dan unggah ilustrasi miniatur milik klien melalui Editor Website; sistem tidak otomatis membuat miniatur dari foto.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 rounded-full border border-[#ebd6a9] bg-[#ade4c9] px-5 py-2.5 text-sm font-extrabold text-[#163f46] shadow-[0_8px_18px_#041d285c] transition hover:-translate-y-1 hover:bg-[#d5f1df]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'documentary' && (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#d8af76]/50 bg-gradient-to-r from-[#151a19] via-[#303830] to-[#3e352c] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Manrope'] text-xl font-black tracking-tight text-[#f4dbb7]">◉ DOCUMENTARY aktif!</p>
            <p className="mt-2 text-xs leading-relaxed text-white/85">Tampilan seperti film dokumenter, foto observasional, filmstrip, efek grain, dan gerak kamera otomatis. Seluruh fitur ORIGINAL tetap ada. Unggah foto kegiatan nyata milik klien dan tulis pengalaman yang benar-benar terjadi; ilustrasi AI demo bukan bukti kegiatan.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 border border-[#ebc890] bg-[#e0b778] px-5 py-2.5 text-sm font-extrabold text-[#171a18] transition hover:-translate-y-1 hover:bg-[#f4d8a7]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'minimalist' && (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#b7c8bb]/60 bg-gradient-to-r from-[#f0f2ed] via-[#e3eae1] to-[#cbd8cb] p-4 text-[#24392c] sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Manrope'] text-xl font-black tracking-tight">MINIMALIST aktif!</p>
            <p className="mt-2 text-xs leading-relaxed text-[#415749]">Profil dengan tipografi tegas, ruang lega, karya berurutan, dan animasi foto sangat halus tanpa kontrol. Seluruh fungsi ORIGINAL tetap ada. Isi fakta pengalaman klien dan unggah foto yang memiliki izin pakai; visual AI pada demo bukan foto Teh Vini.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 border border-[#284737] bg-[#254334] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#42644e]">Buka Editor Website</button>
        </div>
      )}

      {selectedTemplateId === 'futuristic-neon' && (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-[#4bdcf2]/50 bg-gradient-to-r from-[#0c162e] via-[#172746] to-[#31234f] p-4 sm:p-5">
          <div className="max-w-2xl">
            <p className="font-['Manrope'] text-xl font-black tracking-tight text-[#a0eff9]">✦ FUTURISTIC NEON aktif!</p>
            <p className="mt-2 text-xs leading-relaxed text-[#e4e9ff]">Studio masa depan dengan cahaya cyan–ungu, HUD, foto bernapas, orbit dan sapuan scan bergerak otomatis. Seluruh fungsi ORIGINAL tetap ada. Isi prestasi dan karya sebenarnya, lalu unggah foto berizin milik klien. Visual AI di demo hanyalah konsep, bukan foto asli Teh Vini.</p>
          </div>
          <button type="button" onClick={onEditWebsite} className="min-h-10 border border-[#5bdfed] bg-[#80e7f4] px-5 py-2.5 text-sm font-extrabold text-[#09182a] transition hover:bg-[#c0f8fc]">Buka Editor Website</button>
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
