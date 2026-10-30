import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { Tilt } from './fx';
import { ProjectArt } from './Poster';

export default function ProjectCard({ project, index, onOpen, duplicate = false }: { project: Project; index: number; onOpen: () => void; duplicate?: boolean }) {
  const { profile } = usePortfolio();
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
