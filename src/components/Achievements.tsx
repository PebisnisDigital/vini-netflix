import { useRef } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../data/PortfolioContext';
import { useAutoRail } from '../hooks/useAutoRail';
import { EASE, SectionHeading, Tilt } from './fx';
import { RailButtons } from './Rail';

function Laurel({ side }: { side: 'l' | 'r' }) {
  return (
    <svg viewBox="0 0 30 64" className={`h-14 w-auto text-[#d9b46a] ${side === 'r' ? '-scale-x-100' : ''}`} aria-hidden>
      <path d="M26 62C10 52 4 36 8 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[10, 18, 26, 34, 42, 50].map((y, i) => (
        <ellipse key={y} cx={i < 2 ? 9 : 8 + i * 1.6} cy={y} rx="5" ry="2.2" fill="currentColor" opacity="0.85" transform={`rotate(-40 ${8 + i * 1.6} ${y})`} />
      ))}
    </svg>
  );
}

export default function Achievements() {
  const { achievements, certifications } = usePortfolio();
  const momentsRail = useRef<HTMLDivElement>(null);
  const certificateRail = useRef<HTMLDivElement>(null);
  const { pause } = useAutoRail(momentsRail, { itemCount: achievements.length, speed: 96 });
  const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));

  return (
    <>
      <SectionHeading kicker="Jejak Berkarya" title="Momen Penting" />

      <div className="group/rail relative">
        <div ref={momentsRail} className="rail gutter flex gap-4 overflow-x-auto py-7 [perspective:1400px]">
        {[0, 1, 2].flatMap((copy) => achievements.map((a) => (
          <motion.div
            key={`${copy}-${a.id}`}
            aria-hidden={copy !== 1}
            className="w-[82vw] shrink-0 snap-start sm:w-[52vw] md:w-[42vw] lg:w-[32vw] xl:w-[24vw] 2xl:w-[22vw]"
            initial={false}
          >
            <Tilt max={8} className="group h-full rounded-2xl">
              <article className="relative flex h-full min-h-[340px] flex-col items-center overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#2a1f10,#0d0b08_60%,#07070a)] px-5 pb-6 pt-8 text-center ring-1 ring-[#d9b46a]/20 transition duration-500 group-hover:ring-[#d9b46a]/60">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b46a]/70 to-transparent" />
                <div aria-hidden className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#d9b46a]/10 blur-3xl transition duration-700 group-hover:bg-[#d9b46a]/25" />
                <div className="relative flex items-center gap-1">
                  <Laurel side="l" />
                  <div className="px-1">
                    <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.24em] text-[#d9b46a]">{a.laurel}</p>
                  </div>
                  <Laurel side="r" />
                </div>
                <h3 className="relative mt-6 font-display text-[1.75rem] leading-tight text-bone">{a.title}</h3>
                <p className="relative mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b46a]">{a.org}</p>
                <p className="relative mt-4 text-[13px] leading-relaxed text-bone/70">{a.detail}</p>
                {a.link && (
                  <a
                    href={a.link}
                    tabIndex={copy === 1 ? 0 : -1}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="relative mt-auto inline-flex min-h-10 items-center gap-1 pt-5 text-xs font-semibold tracking-wide text-bone underline decoration-[#d9b46a]/60 underline-offset-4 hover:decoration-[#d9b46a]"
                  >
                    Lihat karyanya ↗
                  </a>
                )}
              </article>
            </Tilt>
          </motion.div>
        )))}
        </div>
        <RailButtons rail={momentsRail} onNavigate={pause} />
      </div>

      {/* Hanya tampilkan sertifikasi jika ada data yang sudah dikonfirmasi. */}
      {certifications.length > 0 && <div className="mt-16">
        <div className="gutter mb-2 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-sans text-lg font-semibold text-bone sm:text-2xl">
            Tersertifikasi <span className="text-mist">· {certifications.length} sertifikat</span>
          </h3>
          <p className="text-xs text-smoke">{issuers.join(' · ')}</p>
        </div>
        <div className="group/rail relative">
          <div ref={certificateRail} className="rail gutter flex snap-x gap-3 overflow-x-auto py-5">
            {certifications.map((c, i) => (
              <motion.a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="group relative flex w-[230px] shrink-0 snap-start flex-col justify-between rounded-xl bg-ink-2 p-4 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: EASE }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">{c.issuer}</span>
                  <span className="text-sm text-smoke transition group-hover:text-bone">↗</span>
                </div>
                <p className="mt-6 text-sm font-medium leading-snug text-bone">{c.name}</p>
              </motion.a>
            ))}
          </div>
          <RailButtons rail={certificateRail} />
        </div>
      </div>}
    </>
  );
}
