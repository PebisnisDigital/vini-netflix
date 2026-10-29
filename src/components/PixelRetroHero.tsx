import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Camera, Gamepad2, Play, Sparkles, Trophy, Zap } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './pixel-retro.css';

/** Panggung game 16-bit; karakter dan karya selalu diambil dari klien aktif. */
export default function PixelRetroHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsArt = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptArt = /buatan AI|bukan foto asli|karakter fiksi|ilustrasi konsep/i.test(profile.portrait.alt);
  const featured = projects.slice(0, 2);

  return (
    <section id="top" className="pixel-hero" aria-label={`Petualangan karya ${profile.displayName}`}>
      <div className="pixel-grid-backdrop" aria-hidden="true" />
      <div className="pixel-stars" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>
      <div className="pixel-landscape" aria-hidden="true" />

      <div className="pixel-hud" aria-hidden="true">
        <span><Gamepad2 size={16} /> PESONAFLIX ARCADE</span>
        <span className="pixel-hud-level">STAGE 11 <i /> 16-BIT WORLD</span>
        <span className="pixel-hud-live"><span /> ONLINE</span>
      </div>

      <div className="pixel-layout">
        <div className="pixel-copy">
          <motion.div className="pixel-level-label" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .1 }}>
            <span>01</span><span>PLAYER PROFILE UNLOCKED</span><Zap size={15} fill="currentColor" aria-hidden="true" />
          </motion.div>
          <motion.p className="pixel-ready-label" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .55, delay: .22 }}>
            PRESS START TO EXPLORE <span aria-hidden="true">▮</span>
          </motion.p>
          <motion.h1 data-studio-edit="name" className="pixel-name" initial={{ opacity: 0, y: 23 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .32 }}>
            {profile.displayName}
          </motion.h1>
          <motion.div data-studio-edit="role" className="pixel-role" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .42 }}>
            <span className="pixel-role-marker" aria-hidden="true">▶</span>{profile.role}
          </motion.div>
          <motion.p data-studio-edit="tagline" className="pixel-tagline" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .53 }}>
            {profile.tagline[1] || profile.tagline[0] || 'Setiap langkah membuka dunia baru.'}
          </motion.p>
          <motion.p data-studio-edit="bio" className="pixel-bio" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .65 }}>{profile.intro}</motion.p>
          <motion.div className="pixel-actions" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .8 }}>
            <button type="button" className="pixel-start" onClick={onPlay}><Play size={16} fill="currentColor" aria-hidden="true" /> MULAI CERITA</button>
            <button type="button" className="pixel-quests" onClick={() => scrollTo('#originals')}>LIHAT KARYA <ArrowUpRight size={16} aria-hidden="true" /></button>
          </motion.div>
          <div className="pixel-player-note"><span className="pixel-life" aria-label="Tiga hati">♥ ♥ ♥</span><span>PLAYER 01 · CERITA NYATA</span><Sparkles size={14} aria-hidden="true" /></div>
        </div>

        <div className="pixel-scene" aria-label="Panggung game pixel retro">
          <div className="pixel-scene-echo" aria-hidden="true" />
          <div className="pixel-window-top"><span className="pixel-window-dots" aria-hidden="true">■ ■ ■</span><span>CHARACTER SELECT</span><span>LV. 01</span></div>
          <motion.div className="pixel-character-window" initial={{ opacity: 0, scale: .87, y: 25 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 76, damping: 13, delay: .3 }}>
            {needsArt ? (
              <div className="pixel-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat karakter pixel klien; unggah ilustrasi klien melalui Studio">
                <Camera size={62} strokeWidth={1.25} aria-hidden="true" /><span>YOUR HERO<br />HERE</span><small>UPLOAD PIXEL ART</small>
              </div>
            ) : (
              <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" decoding="async" fetchPriority="high" />
            )}
            <div className="pixel-screen-glass" aria-hidden="true" />
          </motion.div>
          <div className="pixel-scene-bottom"><span className="pixel-signal"><i /> HP <b>■■■■■</b></span><span>{conceptArt ? 'DEMO CHARACTER · FICTIONAL' : 'READY PLAYER ONE'}</span></div>
          <div className="pixel-coin pixel-coin-a" aria-hidden="true">★</div>
          <div className="pixel-coin pixel-coin-b" aria-hidden="true">✦</div>
          <div className="pixel-cloud pixel-cloud-one" aria-hidden="true" />
          <div className="pixel-cloud pixel-cloud-two" aria-hidden="true" />
        </div>
      </div>

      <motion.div className="pixel-gallery" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .98 }}>
        <div className="pixel-gallery-heading"><span><Trophy size={17} aria-hidden="true" /> QUEST LOG</span><strong>KARYA PILIHAN</strong><small>SELECT YOUR NEXT QUEST</small></div>
        {featured.map((project, index) => (
          <button type="button" key={project.id} onClick={() => onOpenProject(project)} className="pixel-quest-card" aria-label={`Buka karya ${project.title}`}>
            <div className="pixel-quest-image">{project.image ? <img src={project.image} alt={`Ilustrasi karya ${project.title}`} loading="lazy" decoding="async" /> : <Camera size={32} aria-hidden="true" />}</div>
            <div className="pixel-quest-text"><span>QUEST 0{index + 1} · {project.genre}</span><strong>{project.title}</strong></div>
            <span className="pixel-card-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
        <button type="button" className="pixel-scroll-cue" onClick={() => scrollTo('#about')} aria-label="Lanjut melihat profil"><ArrowDown size={19} aria-hidden="true" /></button>
      </motion.div>
    </section>
  );
}
