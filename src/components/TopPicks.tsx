import { useRef } from 'react';
import { motion } from 'framer-motion';
import { topPicks } from '../data/portfolio';
import { useAutoRail } from '../hooks/useAutoRail';
import { SectionHeading } from './fx';
import { PosterBackdrop } from './Poster';
import { RailButtons } from './Rail';

export default function TopPicks() {
  const rail = useRef<HTMLDivElement>(null);
  const { pause } = useAutoRail(rail, { itemCount: topPicks.length, speed: 120 });
  return (
    <>
      <SectionHeading kicker="10 Sorotan · perjalanan & karya" title="Pilihan Teh Vini" />
      <div className="group/rail relative">
        <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-2 overflow-x-auto py-6">
          {[0, 1, 2].flatMap((copy) => topPicks.map((pick, i) => (
            <motion.div
              key={`${copy}-${pick.title}`}
              aria-hidden={copy !== 1}
              className="group relative flex h-[260px] shrink-0 snap-start items-end sm:h-[300px]"
              initial={false}
            >
              <span
                aria-hidden
                className="text-outline -mr-6 select-none font-display leading-[0.78] transition duration-500 group-hover:[-webkit-text-stroke-color:rgba(255,61,90,0.85)] sm:-mr-8"
                style={{ fontSize: i === 9 ? 'clamp(9rem, 22vw, 15rem)' : 'clamp(11rem, 26vw, 19rem)', letterSpacing: i === 9 ? '-0.06em' : 0 }}
              >
                {i + 1}
              </span>
              <div className="relative z-10 h-[85%] w-[150px] overflow-hidden rounded-lg shadow-[-12px_0_30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition duration-500 group-hover:-translate-y-2 group-hover:ring-white/30 sm:w-[180px]">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <PosterBackdrop palette={pick.palette} />
                </div>
                <div className="absolute inset-0 flex flex-col justify-between p-3.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.26em] text-bone/70">{pick.label}</span>
                  <div>
                    <p className="font-display text-[1.65rem] leading-tight text-bone">{pick.title}</p>
                    <p className="mt-1.5 text-[11px] leading-snug text-mist">{pick.detail}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )))}
        </div>
        <RailButtons rail={rail} onNavigate={pause} />
      </div>
    </>
  );
}
