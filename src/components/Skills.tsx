import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Skill } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { EASE, SectionHeading } from './fx';

const HUES = ['#ff3d5a', '#4cc9ff', '#46e3a8', '#ffb547', '#b98bff', '#ff8a5c', '#7ee0ff'];

const NINIK_UMROH_POSTERS: Record<string, string> = {
  Safara: '/clients/ninikwardhani/safara-hotel.webp',
  Safawi: '/clients/ninikwardhani/safawi-hotel.webp',
  Sukari: '/clients/ninikwardhani/sukari-hotel.webp',
  Majol: '/clients/ninikwardhani/majol-hotel.webp',
};

const NINIK_PAYMENT_POSTERS: Record<string, { src: string; alt: string; caption: string }> = {
  Cash: {
    src: '/clients/ninikwardhani/cash-alur-pendaftaran.webp',
    alt: 'Poster alur pendaftaran Umroh, booking tempat dan pelunasan Samira Travel',
    caption: 'Alur booking & pelunasan',
  },
  Tabungan: {
    src: '/clients/ninikwardhani/tabungan-umroh.webp',
    alt: 'Poster program Tabungan Umroh Samira Travel',
    caption: 'Program Tabungan Umroh',
  },
  'Umroh dulu, bayar belakangan': {
    src: '/clients/ninikwardhani/bayar-belakangan.webp',
    alt: 'Poster Umroh dulu bayar belakangan bersama Samira Travel',
    caption: 'Berangkat dulu, bayar setelah pulang',
  },
  'DP Rp1.500.000': {
    src: '/clients/ninikwardhani/dp-perlengkapan.webp',
    alt: 'Poster perlengkapan Umroh dengan uang muka Rp1,5 juta',
    caption: 'Rincian perlengkapan DP Rp1,5 juta',
  },
};

export default function Skills() {
  const { skillCategories, skillsHeading, skillsAside, skillsKicker, profile } = usePortfolio();
  const [cat, setCat] = useState(0);
  const activeIndex = Math.min(cat, Math.max(0, skillCategories.length - 1));
  const category = skillCategories[activeIndex];
  const hue = profile.clientSlug === 'ninikwardhani' ? ['#1268bd', '#0a4f9d', '#c59a37'][activeIndex % 3] : HUES[activeIndex % HUES.length];

  if (!category) return null;

  return (
    <>
      <SectionHeading kicker={skillsKicker || 'Kategori'} kickerEditId="skills:kicker" title={skillsHeading || 'Dunia Keahlian Saya'} titleEditId="skills:heading" aside={<p data-studio-edit="skills:aside" className="max-w-xs text-sm text-mist">{skillsAside || 'Arahkan kursor atau ketuk keahlian untuk melihat penerapannya dalam karya dan aktivitas saya.'}</p>} />

      <div className="gutter grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        {/* genre list */}
        <div className="rail -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0" role="tablist" aria-label="Kategori keahlian">
          {skillCategories.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              data-studio-edit={`skill-category:${i}`}
              aria-selected={i === activeIndex}
              onClick={() => setCat(i)}
              className={`group relative shrink-0 rounded-lg px-4 py-3 text-left transition lg:px-5 ${i === activeIndex ? 'text-bone' : 'text-smoke hover:text-bone'}`}
            >
              {i === activeIndex && <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10" transition={{ duration: 0.45, ease: EASE }} />}
              {i === activeIndex && <motion.span layoutId="skill-bar" className="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded lg:block" style={{ background: hue }} />}
              <span className="relative block font-display text-2xl tracking-wide lg:text-3xl">{c.title}</span>
              <span className="relative hidden text-xs text-smoke lg:block">
                {c.skills.length} {profile.clientSlug === 'ninikwardhani' ? 'pilihan' : 'keahlian'} · {c.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* skill cards */}
        <div className="min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div key={category.id} initial="hidden" animate="show" exit="exit" transition={{ staggerChildren: 0.05 }}>
              <motion.p
                className="mb-5 text-sm text-mist"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}
              >
                <span data-studio-edit={`skill-category:${activeIndex}:title`} className="font-semibold text-bone">{category.title}</span> — <span data-studio-edit={`skill-category:${activeIndex}:subtitle`}>{category.subtitle}</span>
              </motion.p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {category.skills.map((s, i) => (
                  <SkillCard key={`${category.id}-${i}`} skill={s} hue={hue} categoryIndex={activeIndex} skillIndex={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function SkillCard({ skill, hue, categoryIndex, skillIndex }: { skill: Skill; hue: string; categoryIndex: number; skillIndex: number }) {
  const { skillEvidence, profile } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const paymentPoster = profile.clientSlug === 'ninikwardhani' ? NINIK_PAYMENT_POSTERS[skill.name] : undefined;
  const poster = profile.clientSlug === 'ninikwardhani' ? (NINIK_UMROH_POSTERS[skill.name] ?? paymentPoster?.src) : undefined;
  const posterAlt = paymentPoster?.alt ?? `Informasi hotel Paket ${skill.name} Samira Travel`;
  const evidence = skill.evidence ?? skillEvidence[skill.name];

  useEffect(() => {
    if (!showPoster) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowPoster(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showPoster]);

  return (
    <>
    <motion.button
      type="button"
      data-studio-edit={`skill:${categoryIndex}:${skillIndex}`}
      onHoverStart={() => { if (!poster) setOpen(true); }}
      onHoverEnd={() => { if (!poster) setOpen(false); }}
      onClick={() => poster ? setShowPoster(true) : setOpen((o) => !o)}
      aria-label={poster ? `Lihat poster ${skill.name}` : undefined}
      aria-expanded={poster ? showPoster : open}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.94, filter: 'blur(6px)' },
        show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
        exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
      }}
      whileHover={{ y: -6 }}
      className={`group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl bg-ink-2 text-left ring-1 ring-white/10 transition-shadow duration-500 hover:ring-white/20 ${poster ? 'p-2 sm:p-3' : 'p-4'}`}
      style={{ boxShadow: open ? `0 18px 50px -12px ${hue}55, 0 0 0 1px ${hue}66` : undefined }}
    >
      <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-60" style={{ background: hue }} />
      {poster ? (
        <img src={poster} alt={posterAlt} loading="lazy" decoding="async" className="relative block h-auto w-full rounded-lg object-contain shadow-sm" />
      ) : (
      <motion.span
        className="relative flex h-12 w-12 items-center justify-center rounded-lg font-display text-2xl tracking-wide"
        style={{ background: `${hue}1f`, color: hue, boxShadow: `inset 0 0 0 1px ${hue}55` }}
        animate={open ? { rotate: [0, -8, 8, 0], scale: 1.08 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        aria-hidden
      >
        <span data-studio-edit={`skill:${categoryIndex}:${skillIndex}:mono`}>{skill.mono}</span>
      </motion.span>
      )}
      <span className={`relative flex items-center gap-2 text-[15px] font-semibold text-bone ${poster ? 'mt-2 px-1 pb-2' : 'mt-4'}`}>
        <span data-studio-edit={`skill:${categoryIndex}:${skillIndex}:name`}>{skill.name}</span>
        {skill.note && (
          <span data-studio-edit={`skill:${categoryIndex}:${skillIndex}:note`} className="rounded px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-ink" style={{ background: hue }}>
            {skill.note}
          </span>
        )}
      </span>
      {paymentPoster && (
        <span className="relative mt-1 px-1 pb-1 text-[11px] leading-snug text-mist">{paymentPoster.caption}</span>
      )}
      <AnimatePresence initial={false}>
        {!poster && open && evidence && (
          <motion.span
            className="relative mt-2 block text-[11px] leading-snug text-mist"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span data-studio-edit={`skill:${categoryIndex}:${skillIndex}:evidence`}>{evidence.join(' · ')}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
    {showPoster && poster && createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Poster ${skill.name}`}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 p-4"
        onClick={() => setShowPoster(false)}
      >
        <button type="button" onClick={() => setShowPoster(false)} className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-xl">
          Tutup ✕
        </button>
        <img
          src={poster}
          alt={posterAlt}
          className="max-h-[88vh] w-[92vw] max-w-[560px] rounded-lg object-contain shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        />
      </div>,
      document.body
    )}
    </>
  );
}
