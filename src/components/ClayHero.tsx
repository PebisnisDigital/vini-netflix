import { motion } from 'framer-motion';
import { ArrowUpRight, Clapperboard, Play, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './clay.css';

/** Panggung stop-motion clay yang menerima data dan gambar setiap klien sendiri. */
export default function ClayHero({
  onPlay,
  onOpenProject,
}: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const isUnchangedSamplePortrait = profile.portrait.src === '/assets/portrait-720.webp';
  const needsArtwork = !profile.portrait.src || isUnchangedSamplePortrait;

  return (
    <section id="top" className="clay-hero" aria-label={`Panggung cerita ${profile.displayName}`}>
      <div className="clay-set" aria-hidden="true">
        <span className="clay-set-dot clay-set-dot-one" />
        <span className="clay-set-dot clay-set-dot-two" />
        <span className="clay-set-dot clay-set-dot-three" />
        <span className="clay-set-arch" />
      </div>

      <div className={`clay-visual ${needsArtwork ? 'clay-visual-empty' : ''}`}>
        {needsArtwork ? (
          <div className="clay-art-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat gambar karakter CLAY milik klien. Unggah dari panel Foto Utama.">
            <div className="clay-placeholder-figure" aria-hidden="true">
              <span className="clay-placeholder-head"><i /><i /><b /></span>
              <span className="clay-placeholder-body" />
              <span className="clay-placeholder-shadow" />
            </div>
            <p>UNGGAH KARAKTER CLAY</p>
          </div>
        ) : (
          <img data-studio-edit="portrait" src={profile.portrait.src} alt={profile.portrait.alt} fetchPriority="high" decoding="async" />
        )}
      </div>

      <div className="clay-hero-gradient" aria-hidden="true" />

      <div className="clay-hero-content">
        <motion.div className="clay-episode-chip" initial={{ opacity: 0, y: 15, rotate: -7 }} animate={{ opacity: 1, y: 0, rotate: -3 }} transition={{ duration: .7, delay: .2 }}>
          <Clapperboard size={17} strokeWidth={2.5} aria-hidden="true" /> CERITA DARI DUNIA KECIL
        </motion.div>
        <motion.p className="clay-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .32 }}>
          KENALAN DENGAN
        </motion.p>
        <motion.h1 className="clay-headline" data-studio-edit="name" initial={{ opacity: 0, y: 26, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .86, delay: .42, type: 'spring', stiffness: 95, damping: 14 }}>
          {profile.displayName}
        </motion.h1>
        <motion.p className="clay-role" data-studio-edit="role" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .53 }}>
          <Sparkles size={17} aria-hidden="true" /> {profile.role}
        </motion.p>
        <motion.p className="clay-tagline" data-studio-edit="tagline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 }}>
          {profile.tagline[1] || profile.tagline[0] || 'Setiap orang punya cerita yang berharga.'}
        </motion.p>
        <motion.p className="clay-intro" data-studio-edit="bio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .68 }}>
          {profile.intro}
        </motion.p>
        <motion.div className="clay-hero-buttons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}>
          <button type="button" className="clay-main-button" onClick={onPlay}><Play size={16} fill="currentColor" aria-hidden="true" /> Kenalan Yuk</button>
          <button type="button" className="clay-soft-button" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={19} aria-hidden="true" /></button>
        </motion.div>
        <motion.div className="clay-reel-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} aria-label="Film cerita pribadi">
          <span className="clay-reel-icon" aria-hidden="true">✦</span>
          <span>BUATAN HATI · PUNYA CERITA</span>
        </motion.div>
      </div>

      {projects.length > 0 && (
        <div className="clay-highlight-strip" aria-label="Karya unggulan">
          {projects.slice(0, 2).map((project, index) => (
            <motion.button key={project.id} className="clay-highlight-card" type="button" onClick={() => onOpenProject(project)} initial={{ opacity: 0, y: 34, rotate: index ? 4 : -4 }} animate={{ opacity: 1, y: 0, rotate: index ? 3 : -3 }} transition={{ duration: .74, delay: 1 + index * .16 }} whileHover={{ y: -12, rotate: 0 }}>
              {project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="clay-highlight-fallback" aria-hidden="true">✳</span>}
              <span className="clay-highlight-label">{project.title}</span>
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}
