import { Play, ArrowUpRight, BookOpenText, GraduationCap, Award, ShoppingBag } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';

/** Galeri bertema dari data karya klien agar setiap gambar tetap bisa diedit di Studio. */
const groups = [
  {
    category: 'Kegiatan Sekolah',
    number: '01',
    title: 'Momen di Sekolah',
    description: 'Kegiatan bersama anak-anak, pembiasaan, dan kunjungan edukatif.',
    Icon: GraduationCap,
  },
  {
    category: 'Media Belajar',
    number: '02',
    title: 'Media Belajar & Video',
    description: 'Poster visual dan animasi singkat yang membuat topik belajar lebih dekat dengan dunia anak.',
    Icon: BookOpenText,
  },
  {
    category: 'Sertifikat & Piagam',
    number: '03',
    title: 'Sertifikat & Penghargaan',
    description: 'Jejak apresiasi dan pengembangan diri yang dilampirkan pemilik profil.',
    Icon: Award,
  },
  {
    category: 'Usaha Sampingan',
    number: '04',
    title: 'Cerita Usaha Kecil-Kecilan',
    description: 'Di luar sekolah, Munasifah juga menjalankan kegiatan jualan dalam skala kecil.',
    Icon: ShoppingBag,
  },
] as const;

export default function MunasifahShowcase({ onOpen }: { onOpen: (p: Project) => void }) {
  const { projects } = usePortfolio();

  return (
    <div className="gutter pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div className="mb-12 max-w-3xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-crimson-2">PORTOFOLIO PENDIDIK · RA MASYITHOH 13 KRAPYAK</p>
        <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] text-bone">CERITA DARI KELAS</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist">
          Dokumentasi kegiatan belajar, media visual, video edukasi, sertifikat, dan cerita usaha kecil-kecilan Munasifah. Pilih foto untuk membaca keterangannya atau putar video langsung di halaman ini.
        </p>
      </div>

      <div className="space-y-16">
        {groups.map(({ category, number, title, description, Icon }) => {
          const items = projects.filter((project) =>
            category === 'Media Belajar'
              ? project.genre === 'Media Belajar' || project.genre === 'Video Belajar'
              : project.genre === category,
          );
          if (!items.length) return null;
          const isCertificate = category === 'Sertifikat & Piagam';

          return (
            <section key={category} aria-label={title}>
              <div className="mb-6 flex flex-wrap items-start gap-4 border-b border-white/15 pb-5 sm:items-end">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-crimson-2">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">BAGIAN {number} / {String(items.length).padStart(2, '0')} DOKUMENTASI</p>
                  <h3 className="text-2xl font-bold tracking-tight text-bone sm:text-3xl">{title}</h3>
                  <p className="mt-1 text-sm text-mist">{description}</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project) => {
                  const isVideo = project.genre === 'Video Belajar' && /\.mp4(?:\?|$)/i.test(project.github ?? '');
                  const content = (
                    <>
                      <div className={`relative aspect-[4/3] overflow-hidden rounded-t-xl ${isCertificate ? 'bg-white' : 'bg-[#17343b]'}`}>
                        {isVideo ? (
                          <video
                            src={project.github}
                            poster={project.image}
                            controls
                            playsInline
                            preload="none"
                            aria-label={project.title}
                            className="h-full w-full object-contain"
                          >
                            Browser Anda tidak mendukung video HTML5.
                          </video>
                        ) : project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.035] ${isCertificate ? 'object-contain' : 'object-cover'}`}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-mist">Dokumentasi</div>
                        )}
                        {isVideo && (
                          <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-semibold text-white">
                            <Play size={13} aria-hidden="true" /> PUTAR VIDEO
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">{project.year} · {project.genre}</p>
                        <h4 className="mt-2 text-lg font-semibold leading-snug text-bone">{project.title}</h4>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">{project.logline}</p>
                        <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold text-bone/80">
                          {isVideo ? 'Video 40 detik · dapat diputar di sini' : isCertificate ? 'Lihat sertifikat' : 'Lihat dokumentasi'}
                          {!isVideo && <ArrowUpRight size={16} aria-hidden="true" />}
                        </div>
                      </div>
                    </>
                  );

                  return isVideo ? (
                    <article key={project.id} className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-white/[0.035]">
                      {content}
                    </article>
                  ) : (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => onOpen(project)}
                      aria-label={`Buka dokumentasi ${project.title}`}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-white/[0.035] text-left transition hover:-translate-y-1 hover:border-crimson-2/60 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson-2"
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
