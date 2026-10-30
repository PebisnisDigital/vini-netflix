import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Camera, Compass, MoveUpRight, Play, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './miniature-world.css';

/** Museum miniatur: nama, cerita, ilustrasi dan karya selalu milik klien aktif. */
export default function MiniatureWorldHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsArt = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptArt = /buatan AI|bukan foto asli|karakter fiksi|ilustrasi konsep/i.test(profile.portrait.alt);
  const featured = projects.slice(0, 2);

  return (
    <section id="top" className="miniature-hero" aria-label={`Dunia miniatur karya ${profile.displayName}`}>
      <div className="miniature-backdrop-grid" aria-hidden="true" />
      <div className="miniature-gold-glow" aria-hidden="true" />
      <div className="miniature-topline">
        <span><Compass size={17} aria-hidden="true" /> PESONAFLIX <i /> MINIATURE WORLD</span>
        <span className="miniature-topline-index">COLLECTION N° 12 · HANDCRAFTED STORIES</span>
      </div>

      <div className="miniature-layout">
        <div className="miniature-copy">
          <motion.div className="miniature-eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .58, delay: .1 }}>
            <span className="miniature-eyebrow-dot" aria-hidden="true" /> Selamat datang di dunia kecil saya
          </motion.div>
          <motion.h1 className="miniature-name" data-studio-edit="name" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .28 }}>{profile.displayName}</motion.h1>
          <motion.p className="miniature-role" data-studio-edit="role" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .67, delay: .4 }}>{profile.role}</motion.p>
          <motion.p className="miniature-tagline" data-studio-edit="tagline" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .67, delay: .52 }}>
            {profile.tagline[1] || profile.tagline[0] || 'Dari hal kecil, tumbuh cerita besar.'}
          </motion.p>
          <motion.p className="miniature-bio" data-studio-edit="bio" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .67, delay: .65 }}>{profile.intro}</motion.p>
          <motion.div className="miniature-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .78 }}>
            <button type="button" className="miniature-primary" onClick={onPlay}><Play size={15} fill="currentColor" aria-hidden="true" /> Mulai Cerita</button>
            <button type="button" className="miniature-secondary" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={18} aria-hidden="true" /></button>
          </motion.div>
          <div className="miniature-copy-footer"><span>✳</span><span>SETIAP DETAIL PUNYA CERITA</span><span className="miniature-dash" /><span>EDISI 01</span></div>
        </div>

        <div className="miniature-stage" aria-label="Panggung diorama miniatur 3D">
          <div className="miniature-stage-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="miniature-stage-spotlight" aria-hidden="true" />
          <span className="miniature-stage-tiny-star miniature-star-one" aria-hidden="true">✦</span>
          <span className="miniature-stage-tiny-star miniature-star-two" aria-hidden="true">✳</span>
          <span className="miniature-stage-tiny-star miniature-star-three" aria-hidden="true">✦</span>
          <motion.div className="miniature-picture-frame" initial={{ opacity: 0, scale: .89, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 74, damping: 14, delay: .29 }}>
            <div className="miniature-world-picture">
              {needsArt ? (
                <div className="miniature-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat diorama miniatur klien; unggah foto atau ilustrasi sendiri melalui Studio">
                  <Camera size={65} strokeWidth={1.2} aria-hidden="true" />
                  <strong>DUNIA MINI<br />KLIEN</strong>
                  <small>UNGGAH DI STUDIO</small>
                </div>
              ) : (
                <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" decoding="async" fetchPriority="high" />
              )}
            </div>
          </motion.div>
          <div className="miniature-floating-tag miniature-tag-top" aria-hidden="true"><span>01</span><strong>THE CREATOR'S<br />LITTLE UNIVERSE</strong></div>
          <div className="miniature-floating-tag miniature-tag-bottom" aria-hidden="true"><span>✷</span><strong>BIG IDEAS<br />SMALL WORLDS</strong></div>
          <div className="miniature-stage-scale"><span>↗</span><span>{conceptArt ? 'ILUSTRASI AI · KARAKTER FIKSI' : 'STORY IN EVERY DETAIL'}</span></div>
        </div>
      </div>

      <motion.div className="miniature-gallery" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .95 }}>
        <div className="miniature-gallery-heading"><span><Sparkles size={16} aria-hidden="true" /> THE COLLECTION</span><strong>Jelajahi dunia karya</strong><small>Setiap proyek membuka cerita berbeda.</small></div>
        {featured.map((project, index) => (
          <button type="button" className="miniature-project-card" key={project.id} onClick={() => onOpenProject(project)} aria-label={`Buka karya ${project.title}`}>
            <div className="miniature-project-preview">
              {project.image ? <img src={project.image} alt={`Miniatur karya ${project.title}`} loading="lazy" decoding="async" /> : <Camera size={28} aria-hidden="true" />}
              <span>0{index + 1}</span>
            </div>
            <span className="miniature-project-label"><small>{project.genre}</small><strong>{project.title}</strong></span>
            <MoveUpRight size={19} aria-hidden="true" />
          </button>
        ))}
        <button type="button" className="miniature-scroll-cue" onClick={() => scrollTo('#about')} aria-label="Lanjut melihat profil"><ArrowDown size={20} aria-hidden="true" /></button>
      </motion.div>
    </section>
  );
}
