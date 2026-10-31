import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { Tilt } from './fx';
import { ProjectArt } from './Poster';

export default function ProjectCard({ project, index, onOpen, duplicate = false }: { project: Project; index: number; onOpen: () => void; duplicate?: boolean }) {
  const { profile } = usePortfolio();
  // Yanti's supplied artwork already contains publication lettering. Her titles,
  // descriptions and controls need their own surface instead of sitting on the art.
  if (profile.clientSlug === 'yantiriyantini') {
    return (
      <motion.article
        data-studio-edit={`project:${index}`}
        aria-hidden={duplicate}
        className="w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[42vw]"
        initial={false}
      >
        <div
          role="button"
          tabIndex={duplicate ? -1 : 0}
          data-cursor="view"
          onClick={onOpen}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpen();
            }
          }}
          aria-label={`Baca detail ${project.title}`}
          className="focus-ring group flex h-[35rem] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#111821] shadow-[0_24px_65px_-32px_rgba(0,0,0,0.85)] transition duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-[0_32px_70px_-26px_rgba(0,0,0,0.9)] sm:h-[34rem] lg:h-[36rem]"
        >
          <div className="relative h-[39%] shrink-0 overflow-hidden bg-[#153044]">
            {project.image && (
              <img
                src={project.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-bottom opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#111821]/70 via-transparent to-black/10" />
            <span data-studio-edit={`project:${index}:year`} className="absolute right-4 top-4 rounded-md border border-white/20 bg-[#07121b]/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {project.year}
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
            <p data-studio-edit={`project:${index}:category`} className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff849c]">
              {project.genre}
            </p>
            <h3 data-studio-edit={`project:${index}:title`} className="line-clamp-3 break-words font-sans text-[clamp(1.2rem,3vw,1.85rem)] font-bold leading-[1.22] text-white">
              {project.title}
            </h3>
            <p data-studio-edit={`project:${index}:description`} className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/65 sm:text-sm">
              {project.logline}
            </p>
            <div className="mt-auto pt-5">
              <span className="inline-flex min-h-10 items-center rounded-md bg-white px-4 text-sm font-bold text-[#111821] transition group-hover:bg-[#ffe9ed]">
                Baca Detail <span aria-hidden className="ml-2">↗</span>
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }
  return (
    <motion.article
      data-studio-edit={`project:${index}`}
      aria-hidden={duplicate}
      className="w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[42vw]"
      initial={false}
    >
      <Tilt max={5} className="group rounded-2xl">
        <div
          role="button"
          tabIndex={duplicate ? -1 : 0}
          data-cursor="view"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          aria-label={`Buka ${project.title}`}
          className="focus-ring relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] group-hover:ring-white/25 sm:aspect-[16/12] lg:aspect-auto lg:h-[66vh]"
        >
          <motion.div layoutId={duplicate ? undefined : `art-${project.id}`} className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.07]">
              <ProjectArt project={project} />
            </div>
          </motion.div>

          <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7">
            <span className="font-display text-xl leading-none text-crimson-2">{profile.displayName === 'Teh Vini' ? 'V' : profile.displayName.charAt(0).toUpperCase()}</span>
            <span className="text-[10px] font-bold tracking-[0.34em] text-bone/80">{profile.clientSlug === 'isa' ? 'PILIHAN' : profile.clientSlug === 'yantiriyantini' ? 'PUBLIKASI' : 'ORISINAL'}</span>
          </div>
          <span data-studio-edit={`project:${index}:year`} className="absolute right-5 top-5 rounded border border-white/30 px-1.5 py-px text-[10px] font-bold text-bone sm:right-7 sm:top-7">{project.year}</span>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 [transform:translateZ(40px)]">
            <p data-studio-edit={`project:${index}:category`} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{project.genre}</p>
            <motion.h3 data-studio-edit={`project:${index}:title`} layoutId={duplicate ? undefined : `title-${project.id}`} className="font-display break-words text-[clamp(1.6rem,3.6vw,2.7rem)] leading-tight text-bone">
              {project.title}
            </motion.h3>
            <p data-studio-edit={`project:${index}:description`} className="mt-3 max-w-md text-sm leading-relaxed text-bone/75 sm:text-[15px]">{project.logline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-bone/90 backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="flex min-h-11 items-center gap-2 rounded-md bg-bone px-5 text-sm font-bold text-ink transition group-hover:bg-white">▶ {profile.clientSlug === 'yantiriyantini' ? 'Lihat Detail' : 'Lihat Proyek'}</span>
              {project.github && (
                <a
                  href={project.github}
                  tabIndex={duplicate ? -1 : 0}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  onClick={(e) => e.stopPropagation()}
                  className="flex min-h-11 items-center gap-2 rounded-md border border-white/25 bg-black/30 px-4 text-sm font-semibold text-bone backdrop-blur transition hover:border-bone"
                >
                  Kunjungi ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
