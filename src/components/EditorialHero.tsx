import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Play } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './editorial.css';

/** Sampul majalah eksklusif yang selalu membaca identitas dan karya klien aktif. */
export default function EditorialHero({
  onPlay,
  onOpenProject,
}: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsPhoto = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptArt = /buatan AI|bukan foto asli/i.test(profile.portrait.alt);

  return (
    <section id="top" className="editorial-hero" aria-label={`Edisi pribadi ${profile.displayName}`}>
      <div className="editorial-page-frame" aria-hidden="true" />
      <div className="editorial-hero-image">
        {needsPhoto ? (
          <div className="editorial-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat foto editorial klien; unggah foto sendiri lewat Studio">
            <span className="editorial-placeholder-monogram" aria-hidden="true">P.</span>
            <span className="editorial-placeholder-caption">YOUR PORTRAIT<br />BELONGS HERE</span>
          </div>
        ) : (
          <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" fetchPriority="high" decoding="async" />
        )}
        <div className="editorial-photo-wash" aria-hidden="true" />
        <div className="editorial-image-caption" aria-hidden="true">
          <span>{conceptArt ? 'VISUAL KONSEP · BUATAN AI' : 'THE PERSON BEHIND THE WORK'}</span>
          <span className="editorial-caption-index">NO. 01 / THE EDITION</span>
        </div>
      </div>

      <div className="editorial-paper">
        <motion.div className="editorial-masthead" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .1 }}>
          <span className="editorial-brand-word">PESONA<span className="editorial-brand-dot">.</span>FLIX</span>
          <span>PERSONAL EDITION · VOL. 01</span>
        </motion.div>
        <div className="editorial-story-area">
          <motion.p className="editorial-overline" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .26 }}>
            <span className="editorial-overline-dash" aria-hidden="true" /> BEHIND THE NAME
          </motion.p>
          <motion.h1 className="editorial-name" data-studio-edit="name" initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .37, ease: [.2,.7,.2,1] }}>
            {profile.displayName}
          </motion.h1>
          <motion.div className="editorial-position" data-studio-edit="role" initial={{ opacity: 0, y: 19 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: .55 }}>
            {profile.role}<span className="editorial-role-asterisk" aria-hidden="true">✳</span>
          </motion.div>
          <div className="editorial-strapline">
            <motion.p data-studio-edit="tagline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .7 }}>
              “{profile.tagline[1] || profile.tagline[0] || 'Mengenal lebih dekat sosok di balik karya.'}”
            </motion.p>
          </div>
          <motion.p className="editorial-intro" data-studio-edit="bio" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .82 }}>
            {profile.intro}
          </motion.p>
          <motion.div className="editorial-actions" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .94 }}>
            <button type="button" onClick={onPlay} className="editorial-btn-dark"><Play size={15} fill="currentColor" aria-hidden="true" /> Kenali Saya</button>
            <button type="button" className="editorial-btn-plain" onClick={() => scrollTo('#originals')}>Jelajahi Karya <ArrowUpRight size={17} aria-hidden="true" /></button>
          </motion.div>
        </div>
        <div className="editorial-paper-bottom"><span>AN EDITION OF STORIES & IDEAS</span><span>{profile.location || 'INDONESIA'}</span></div>
      </div>

      <motion.div className="editorial-hero-bottom" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}>
        <div className="editorial-footer-lead"><span>CURATED STORIES</span><span aria-hidden="true">01 — 02</span></div>
        <div className="editorial-feature-list">
          {projects.slice(0, 2).map((project, index) => (
            <motion.button key={project.id} type="button" className="editorial-feature" onClick={() => onOpenProject(project)} whileHover={{ y: -4 }} transition={{ duration: .3 }} aria-label={`Buka karya ${project.title}`}>
              <span className="editorial-feature-index">{String(index + 1).padStart(2, '0')}</span>
              {project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="editorial-feature-empty" aria-hidden="true">{index + 1}</span>}
              <span className="editorial-feature-label">{project.title}<ArrowUpRight size={13} aria-hidden="true" /></span>
            </motion.button>
          ))}
        </div>
        <button type="button" className="editorial-scroll-link" onClick={() => scrollTo('#about')} aria-label="Jelajahi cerita selanjutnya"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={20} aria-hidden="true" /></button>
      </motion.div>
    </section>
  );
}
