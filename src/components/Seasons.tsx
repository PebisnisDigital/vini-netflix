import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolio } from '../data/PortfolioContext';
import { EASE, SectionHeading } from './fx';
import EpisodeCard from './EpisodeCard';
import { RailButtons } from './Rail';

export default function Seasons() {
  const { seasons, projects, profile, journeyHeading, journeyAside, journeyKicker } = usePortfolio();
  const isaProductUrl = profile.clientSlug === 'isa'
    ? projects.find((project) => project.title === 'Seribu Rempah')?.github
    : undefined;
  const [active, setActive] = useState(Math.max(0, seasons.length - 2));
  // Klien baru bisa memiliki lebih sedikit musim daripada portfolio master.
  // Clamp indeks saat data canvas diganti agar tidak merender season undefined.
  const activeIndex = Math.min(Math.max(0, active), Math.max(0, seasons.length - 1));
  const season = seasons[activeIndex];
  const rail = useRef<HTMLDivElement>(null);

  if (!season) return null;

  return (
    <>
      <SectionHeading
        kicker={journeyKicker || `${seasons.length} Musim`}
        title={journeyHeading || 'Perjalanan Saya'}
        kickerEditId="journey:kicker"
        titleEditId="journey:heading"
        aside={<p data-studio-edit="journey:aside" className="max-w-xs text-sm text-mist">{journeyAside || 'Setiap tahap perjalanan diceritakan sebagai satu musim — pilih untuk melihat episodenya.'}</p>}
      />

      {/* season selector */}
      <div className="rail gutter mb-8 flex gap-2 overflow-x-auto" role="tablist" aria-label="Daftar musim">
        {seasons.map((s, i) => (
          <button
            key={s.number}
            data-studio-edit={`season:${i}`}
            role="tab"
            aria-selected={i === activeIndex}
            type="button"
            onClick={() => {
              setActive(i);
              rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition ${i === activeIndex ? 'text-ink' : 'text-mist hover:text-bone'}`}
          >
            {i === activeIndex && <motion.span layoutId="season-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
            <span className="relative block text-[10px] font-bold tracking-[0.24em]">MUSIM {String(s.number).padStart(2, '0')}</span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={season.number}
          initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-3xl leading-tight text-bone sm:text-4xl">
              <span className="text-outline mr-3">S{String(season.number).padStart(2, '0')}</span>
              <span data-studio-edit={`season:${activeIndex}:title`}>{season.title}</span>
            </h3>
            <span className="text-sm text-mist">
              <span data-studio-edit={`season:${activeIndex}:period`}>{season.period}</span> · {season.episodes.length} Episode
            </span>
          </div>
          <p data-studio-edit={`season:${activeIndex}:synopsis`} className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75">{season.synopsis}</p>

          <div className="group/rail relative">
            <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
              {season.episodes.map((e, i) => (
                <EpisodeCard key={e.code} episode={e} index={i} seasonIndex={activeIndex}
                  productUrl={e.title === 'Cerita Seribu Rempah' ? isaProductUrl : undefined} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
