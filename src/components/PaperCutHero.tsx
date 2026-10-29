import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Camera, Layers3, Play, Scissors, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './paper-cut.css';

/** Diorama lapis-kertas. Semua identitas, foto, dan karya berasal dari klien aktif. */
export default function PaperCutHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsPhoto = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptArt = /buatan AI|bukan foto asli|karakter fiksi|ilustrasi konsep/i.test(profile.portrait.alt);
  const featured = projects.slice(0, 2);

  return (
    <section id="top" className="papercut-hero" aria-label={`Panggung karya ${profile.displayName}`}>
      <div className="papercut-back-fiber" aria-hidden="true" />
      <div className="papercut-floating-cloud papercut-cloud-one" aria-hidden="true" />
      <div className="papercut-floating-cloud papercut-cloud-two" aria-hidden="true" />

      <div className="papercut-layout">
        <div className="papercut-copy">
          <motion.p className="papercut-overline" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .65, delay: .1 }}>
            <Layers3 size={17} aria-hidden="true" /> PESONAFLIX <span>·</span> PAPER CUT SERIES <span className="papercut-series-tag">01/11</span>
          </motion.p>
          <motion.div className="papercut-chip" initial={{ opacity: 0, rotate: -9, scale: .8 }} animate={{ opacity: 1, rotate: -5, scale: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 13, delay: .22 }}>
            <Sparkles size={18} aria-hidden="true" /> Dari ide jadi karya!
          </motion.div>
          <motion.h1 data-studio-edit="name" className="papercut-name" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .78, delay: .32 }}>
            {profile.displayName}
          </motion.h1>
          <motion.p data-studio-edit="role" className="papercut-role" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .45 }}>{profile.role}</motion.p>
          <motion.p data-studio-edit="tagline" className="papercut-tagline" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .56 }}>
            “{profile.tagline[1] || profile.tagline[0] || 'Setiap perjalanan dimulai dari satu ide kecil.'}”
          </motion.p>
          <motion.p data-studio-edit="bio" className="papercut-bio" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .68 }}>{profile.intro}</motion.p>
          <motion.div className="papercut-actions" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .67, delay: .82 }}>
            <button type="button" className="papercut-button-primary" onClick={onPlay}><Play size={15} fill="currentColor" aria-hidden="true" /> Kenalan Yuk</button>
            <button type="button" className="papercut-button-secondary" onClick={() => scrollTo('#originals')}>Jelajahi Karya <ArrowUpRight size={17} aria-hidden="true" /></button>
          </motion.div>
          <div className="papercut-copy-footnote"><Scissors size={16} aria-hidden="true" /><span>Disusun satu lapis demi satu lapis.</span><span>✦</span></div>
        </div>

        <div className="papercut-stage" aria-label="Ilustrasi diorama lapisan kertas">
          <div className="papercut-stage-shadow" aria-hidden="true" />
          <div className="papercut-arch papercut-arch-back" aria-hidden="true" />
          <div className="papercut-arch papercut-arch-middle" aria-hidden="true" />
          <div className="papercut-arch papercut-arch-front" aria-hidden="true" />
          <div className="papercut-sun" aria-hidden="true"><span>✳</span></div>
          <span className="papercut-butterfly papercut-butterfly-one" aria-hidden="true">✦</span>
          <span className="papercut-butterfly papercut-butterfly-two" aria-hidden="true">✿</span>
          <motion.div className="papercut-portrait-frame" initial={{ opacity: 0, scale: .83, y: 43 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 72, damping: 14, delay: .28 }}>
            <div className="papercut-portrait-window">
              {needsPhoto ? (
                <div className="papercut-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat ilustrasi PAPER CUT klien; unggah gambar klien melalui Studio">
                  <Camera size={67} strokeWidth={1.25} aria-hidden="true" />
                  <span>ILUSTRASI<br />KLIEN</span>
                  <small>UNGGAH DI STUDIO</small>
                </div>
              ) : (
                <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" decoding="async" fetchPriority="high" />
              )}
            </div>
          </motion.div>
          <span className="papercut-stage-label">{conceptArt ? 'ilustrasi konsep · karakter fiksi' : 'dibuat dengan sepenuh hati ♡'}</span>
          <div className="papercut-leaf papercut-leaf-left" aria-hidden="true" />
          <div className="papercut-leaf papercut-leaf-right" aria-hidden="true" />
        </div>
      </div>

      <motion.div className="papercut-gallery" initial={{ opacity: 0, y: 27 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: 1 }}>
        <div className="papercut-gallery-heading"><span>✦ DIPOTONG DARI CERITA NYATA</span><strong>Karya yang saya bangun</strong></div>
        {featured.map((project, index) => (
          <button type="button" key={project.id} className={`papercut-project-card papercut-card-${index + 1}`} onClick={() => onOpenProject(project)} aria-label={`Buka karya ${project.title}`}>
            <div className="papercut-project-picture">
              {project.image ? <img src={project.image} alt={`Ilustrasi karya ${project.title}`} loading="lazy" decoding="async" /> : <span className="papercut-project-placeholder" aria-hidden="true"><Camera size={30} /></span>}
            </div>
            <span className="papercut-project-caption"><small>0{index + 1} · {project.genre}</small><strong>{project.title}</strong></span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </button>
        ))}
        <button type="button" className="papercut-scroll-cue" onClick={() => scrollTo('#about')} aria-label="Lanjut melihat profil"><ArrowDown size={22} aria-hidden="true" /></button>
      </motion.div>
    </section>
  );
}
