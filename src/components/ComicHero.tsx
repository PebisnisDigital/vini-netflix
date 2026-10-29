import { motion } from 'framer-motion';
import { ArrowUpRight, Play, Zap } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './comic.css';

/** Satu panggung komik yang menampilkan identitas dan aset klien aktif, bukan data demo VINI6. */
export default function ComicHero({
  onPlay,
  onOpenProject,
}: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsArtwork = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';

  return (
    <section id="top" className="comic-hero" aria-label={`Komik cerita ${profile.displayName}`}>
      <div className="comic-halftone" aria-hidden="true" />
      <div className={`comic-hero-art ${needsArtwork ? 'comic-hero-art-empty' : ''}`}>
        {needsArtwork ? (
          <div className="comic-art-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat ilustrasi KOMIK POP milik klien. Unggah melalui Foto Utama.">
            <span className="comic-placeholder-burst" aria-hidden="true"><span>YOUR<br />STORY!</span></span>
            <p>UNGGAH ILUSTRASI KOMIK</p>
          </div>
        ) : (
          <img data-studio-edit="portrait" src={profile.portrait.src} alt={profile.portrait.alt} fetchPriority="high" decoding="async" />
        )}
      </div>
      <div className="comic-hero-shade" aria-hidden="true" />
      <span className="comic-speed-line comic-speed-one" aria-hidden="true" />
      <span className="comic-speed-line comic-speed-two" aria-hidden="true" />
      <span className="comic-speed-line comic-speed-three" aria-hidden="true" />

      <div className="comic-hero-inner">
        <motion.div className="comic-issue-label" initial={{ opacity: 0, x: -30, rotate: -9 }} animate={{ opacity: 1, x: 0, rotate: -4 }} transition={{ type: 'spring', stiffness: 160, damping: 16, delay: .18 }}>
          <span aria-hidden="true">✷</span> THE PERSONAL STORY · ISSUE #01
        </motion.div>
        <motion.p className="comic-eyebrow" initial={{ opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .31, duration: .55 }}>
          INILAH CERITA
        </motion.p>
        <motion.h1 className="comic-name" data-studio-edit="name" initial={{ opacity: 0, y: 46, rotate: 3, scale: .88 }} animate={{ opacity: 1, y: 0, rotate: -1, scale: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12, delay: .43 }}>
          {profile.displayName}
        </motion.h1>
        <motion.div className="comic-role" data-studio-edit="role" initial={{ opacity: 0, x: -40, rotate: -8 }} animate={{ opacity: 1, x: 0, rotate: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: .58 }}>
          <Zap size={16} fill="currentColor" aria-hidden="true" /> {profile.role}
        </motion.div>
        <motion.div className="comic-speech" initial={{ opacity: 0, y: 26, scale: .85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 185, damping: 15, delay: .68 }}>
          <p data-studio-edit="tagline">{profile.tagline[1] || profile.tagline[0] || 'Setiap orang punya cerita seru!'}</p>
        </motion.div>
        <motion.p className="comic-intro" data-studio-edit="bio" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8, duration: .55 }}>
          {profile.intro}
        </motion.p>
        <motion.div className="comic-actions" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .96, duration: .5 }}>
          <button type="button" className="comic-action-main" onClick={onPlay}><Play size={18} fill="currentColor" aria-hidden="true" /> Kenalan Yuk</button>
          <button type="button" className="comic-action-alt" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={19} aria-hidden="true" /></button>
        </motion.div>
        <div className="comic-hero-footer" aria-hidden="true"><span>✦</span> KISAH NYATA · GAYA KOMIK <span>✦</span></div>
      </div>

      <span className="comic-pop-sticker" aria-hidden="true">WOW!</span>
      {projects.length > 0 && (
        <div className="comic-feature-panels" aria-label="Karya pilihan">
          {projects.slice(0, 2).map((project, index) => (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project)}
              className="comic-feature-panel"
              initial={{ opacity: 0, y: 48, rotate: index === 0 ? -9 : 11, scale: .78 }}
              animate={{ opacity: 1, y: 0, rotate: index === 0 ? -5 : 5, scale: 1 }}
              transition={{ type: 'spring', stiffness: 135, damping: 13, delay: 1.08 + index * .14 }}
              whileHover={{ y: -9, rotate: 0, scale: 1.04 }}
              aria-label={`Buka karya ${project.title}`}
            >
              {project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="comic-project-fallback" aria-hidden="true">✸</span>}
              <span className="comic-feature-title">{project.title}</span>
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}
