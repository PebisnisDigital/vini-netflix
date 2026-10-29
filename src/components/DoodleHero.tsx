import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, PencilLine, Play, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './doodle.css';

/** Lembar sketsa hidup: semua identitas, ilustrasi dan karya berasal dari klien aktif. */
export default function DoodleHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsArtwork = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptArt = /buatan AI|bukan foto asli|karakter fiksi/i.test(profile.portrait.alt);

  return (
    <section id="top" className="doodle-hero" aria-label={`Buku sketsa pribadi ${profile.displayName}`}>
      <div className="doodle-grid-paper" aria-hidden="true" />
      <div className="doodle-spiral" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} />)}</div>
      <div className="doodle-art" aria-label={needsArtwork ? 'Area ilustrasi klien' : undefined}>
        {needsArtwork ? (
          <div className="doodle-art-placeholder" data-studio-edit="portrait" role="img" aria-label="Unggah ilustrasi Doodle klien sendiri lewat Studio">
            <svg aria-hidden="true" viewBox="0 0 260 270" fill="none"><path d="M36 207C6 180 20 102 79 88c-7-49 21-71 53-70 47 2 56 44 43 76 58 4 83 78 34 118" stroke="#2466ba" strokeWidth="8" strokeLinecap="round" strokeDasharray="13 15"/><circle cx="111" cy="108" r="47" fill="#ffe49a" stroke="#2466ba" strokeWidth="6"/><path d="M90 106q7 9 14 0m24 0q7 9 14 0m-40 19q21 22 41-1" stroke="#2466ba" strokeWidth="5" strokeLinecap="round"/><path d="M63 242c12-50 40-68 72-68 39 0 64 25 77 68" fill="#c3e6dc" stroke="#2466ba" strokeWidth="6" strokeLinecap="round"/><path d="M14 49l17 7m-7-20-8 18m199 23 14-12m-3 21-19-7" stroke="#f59f85" strokeWidth="6" strokeLinecap="round"/></svg>
            <span>UNGGAH ILUSTRASI<br />DOODLE KLIEN</span>
          </div>
        ) : (
          <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" fetchPriority="high" decoding="async" />
        )}
        <span className="doodle-art-note" aria-hidden="true">{conceptArt ? 'ILUSTRASI KONSEP · BUKAN FOTO ASLI' : 'HALAMAN 01 · KENALAN DULU'}</span>
      </div>

      <svg className="doodle-arrow-drawing" viewBox="0 0 180 110" fill="none" aria-hidden="true"><path d="M10 14C45 6 65 75 113 67c20-4 25-18 36-31m-35 0 35 0 1 31" stroke="#2466ba" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="260" /></svg>
      <span className="doodle-star doodle-star-one" aria-hidden="true">✳</span>
      <span className="doodle-star doodle-star-two" aria-hidden="true">✦</span>
      <span className="doodle-sun" aria-hidden="true">☼</span>

      <div className="doodle-copy">
        <motion.p className="doodle-kicker" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .1 }}>
          <PencilLine size={18} aria-hidden="true" /> CATATAN ORANG KREATIF <span>✦</span> VOL. 01
        </motion.p>
        <motion.p className="doodle-hello" initial={{ opacity: 0, rotate: -5, x: -20 }} animate={{ opacity: 1, rotate: -3, x: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 13, delay: .2 }}>
          Halo! Kenalan yuk...
        </motion.p>
        <motion.h1 data-studio-edit="name" className="doodle-name" initial={{ opacity: 0, y: 38, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -1 }} transition={{ type: 'spring', stiffness: 95, damping: 13, delay: .34 }}>
          {profile.displayName}<span className="doodle-name-underline" aria-hidden="true" />
        </motion.h1>
        <motion.div data-studio-edit="role" className="doodle-role" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 120, delay: .53 }}>
          <span aria-hidden="true">✿</span> {profile.role}
        </motion.div>
        <motion.p className="doodle-quote" data-studio-edit="tagline" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .68 }}>
          “{profile.tagline[1] || profile.tagline[0] || 'Berawal dari satu ide, lalu menjadi cerita.'}”
        </motion.p>
        <motion.p data-studio-edit="bio" className="doodle-bio" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .78 }}>
          {profile.intro}
        </motion.p>
        <motion.div className="doodle-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .91 }}>
          <button type="button" className="doodle-cta-primary" onClick={onPlay}><Play size={16} fill="currentColor" aria-hidden="true" /> Kenali Saya</button>
          <button type="button" className="doodle-cta-secondary" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={17} aria-hidden="true" /></button>
        </motion.div>
        <motion.p className="doodle-footnote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: 1.1 }}><Sparkles size={15} aria-hidden="true" /> Karya kecil. Cerita besar. Semua ada prosesnya.</motion.p>
      </div>

      <div className="doodle-page-bottom">
        <span>THE DOODLE CHRONICLES <i aria-hidden="true">✽</i> {profile.location || 'INDONESIA'}</span>
        <button type="button" onClick={() => scrollTo('#about')}>LANJUT BACA <ArrowDown size={14} aria-hidden="true" /></button>
      </div>

      <motion.div className="doodle-projects" initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: 1.05 }}>
        <div className="doodle-projects-label"><span>✎</span><strong>Intip dua karya saya</strong><small>CORETAN YANG JADI NYATA</small></div>
        {projects.slice(0, 2).map((project, index) => (
          <motion.button type="button" key={project.id} className={`doodle-project-card doodle-project-card-${index + 1}`} onClick={() => onOpenProject(project)} whileHover={{ y: -7, rotate: index === 0 ? -3 : 3 }} aria-label={`Lihat karya ${project.title}`}>
            {project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="doodle-project-empty" aria-hidden="true">✿</span>}
            <span>{project.title}<ArrowUpRight size={13} aria-hidden="true" /></span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
