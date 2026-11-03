import { ArrowUpRight, Globe2, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../data/PortfolioContext';

/** Tautan ditarik dari field proyek Studio, bukan daftar URL hardcoded. */
export default function YudhiAffiliations() {
  const { profile, projects } = usePortfolio();
  const affiliations = projects
    .map((project, studioIndex) => ({ project, studioIndex }))
    .filter(({ project }) => project.genre === 'Jejaring & Afiliasi' && project.github);

  if (!affiliations.length) return null;

  return (
    <section id="affiliations" aria-labelledby="yudhi-affiliations-heading" className="relative overflow-hidden bg-[#0a1824] py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute -right-32 -top-40 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,#b6413230,transparent_65%)]" aria-hidden="true" />
      <div className="gutter relative mx-auto max-w-[1440px]">
        <div className="mb-9 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#e3b28a]">
              <span className="h-px w-8 bg-[#e3b28a]" /> CONNECTED WORLDS · {affiliations.length} LINKS
            </p>
            <h2 id="yudhi-affiliations-heading" className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.06] tracking-tight">
              JEJARING <span className="text-[#e6a88c]">&</span> AFILIASI
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#b7c7d0] sm:text-base">
              Perusahaan, layanan geospasial, dan inisiatif usaha yang tautannya dibagikan Yudhi. Jelajahi situs masing-masing untuk mengenal bidang dan kegiatannya.
            </p>
          </div>
          {profile.links.linkedin && (
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-full border border-white/30 px-5 text-sm font-semibold text-white transition hover:border-[#e6a88c] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6a88c]">
              <Linkedin size={17} aria-hidden="true" /> Lihat LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {affiliations.map(({ project, studioIndex }, index) => {
            const url = project.github!;
            const domain = new URL(url).hostname.replace(/^www\./, '');
            return (
              <motion.a
                key={project.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                data-studio-edit={`project:${studioIndex}`}
                aria-label={`Kunjungi ${project.title} di ${domain}`}
                className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-2xl border border-[#c7d9dc25] bg-[linear-gradient(145deg,#1b3747,#102530_60%,#14232b)] p-6 transition-colors hover:border-[#e6a88c99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6a88c] sm:p-7"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: .55, delay: Math.min(index * .06, .3) }}
              >
                <div className="mb-8 flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e6a88c44] bg-[#e6a88c12] text-[#e6a88c]"><Globe2 size={22} aria-hidden="true" /></span>
                  <ArrowUpRight size={22} className="text-[#c1d0d8] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#e6a88c]" aria-hidden="true" />
                </div>
                <span data-studio-edit={`project:${studioIndex}:title`} className="font-sans text-xl font-bold leading-snug text-white sm:text-2xl">{project.title}</span>
                <span className="mt-2 text-[12px] font-medium tracking-wide text-[#e6a88c]">{domain}</span>
                <p data-studio-edit={`project:${studioIndex}:description`} className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#b6c7cf]">{project.logline}</p>
                <span className="mt-auto pt-6 text-xs font-bold uppercase tracking-[0.16em] text-white/80 transition-colors group-hover:text-[#e6a88c]">Kunjungi situs ↗</span>
              </motion.a>
            );
          })}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[#8da3b0]">
          Daftar ini mengikuti tautan yang disampaikan pemilik profil; pencantuman tidak otomatis menyatakan kepemilikan atau jabatan pada setiap organisasi.
        </p>
      </div>
    </section>
  );
}
