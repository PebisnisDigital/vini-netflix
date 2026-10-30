import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Cpu, Image as ImageIcon, Play, RadioTower, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './futuristic-neon.css';

/** Digital portfolio: data and credibility are real; the holographic stage is visual storytelling. */
export default function FuturisticNeonHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects, experience } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const noPortrait = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptPhoto = /buatan AI|konsep|ilustrasi|bukan foto asli|fiksi/i.test(profile.portrait.alt);

  return (
    <section id="top" className="neon-hero" aria-label={`Profil digital ${profile.displayName}`}>
      <div className="neon-atmosphere" aria-hidden="true"><span /><span /><span /></div>
      <div className="neon-shell">
        <div className="neon-system-line" aria-hidden="true">
          <span><RadioTower size={14} /> PERSONAL SIGNAL <b>016</b></span>
          <span>CREATOR / BUILDER / MENTOR</span>
          <span className="neon-system-status"><i /> PROFILE ONLINE</span>
        </div>

        <div className="neon-hero-layout">
          <div className="neon-copy">
            <motion.p className="neon-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
              <span aria-hidden="true">✦</span> HALO, INI DUNIA DIGITAL SAYA
            </motion.p>
            <motion.h1 className="neon-display-name" data-studio-edit="name" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .12 }}>
              {profile.displayName}
            </motion.h1>
            <motion.div className="neon-role-line" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .24 }}>
              <span className="neon-role-bracket" aria-hidden="true">[</span><p data-studio-edit="role">{profile.role}</p><span className="neon-role-bracket" aria-hidden="true">]</span>
            </motion.div>
            <motion.p className="neon-claim" data-studio-edit="tagline" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .32 }}>
              {profile.tagline[1] || profile.tagline[0] || 'Tunjukkan karya, jelaskan keahlian, buka peluang baru.'}
            </motion.p>
            <motion.p className="neon-bio" data-studio-edit="bio" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .42 }}>{profile.intro}</motion.p>

            <motion.div className="neon-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .55 }}>
              <button type="button" className="neon-action-primary" onClick={() => scrollTo('#originals')}>JELAJAH KARYA <ArrowUpRight size={17} aria-hidden="true" /></button>
              <button type="button" className="neon-action-secondary" onClick={onPlay}><Play size={15} aria-hidden="true" /> KENALI SAYA</button>
            </motion.div>

            <div className="neon-specialties" aria-label="Fokus keahlian">
              <span className="neon-tiny-label">// BIDANG YANG DIKERJAKAN</span>
              <div>{profile.interests.slice(0, 3).map((interest) => <span key={interest}>{interest}</span>)}</div>
            </div>
          </div>

          <motion.div className="neon-visual" initial={{ opacity: 0, x: 30, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1.1, delay: .27 }}>
            <div className="neon-corner neon-corner-tl" aria-hidden="true" /><div className="neon-corner neon-corner-tr" aria-hidden="true" />
            <div className="neon-corner neon-corner-bl" aria-hidden="true" /><div className="neon-corner neon-corner-br" aria-hidden="true" />
            <div className="neon-image-stage">
              {noPortrait ? (
                <div className="neon-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Unggah foto atau visual milik klien melalui Studio">
                  <ImageIcon size={58} strokeWidth={1.1} aria-hidden="true" />
                  <strong>VISUAL PROFIL ANDA</strong>
                  <span>UNGGAH DI PESONAFLIX STUDIO</span>
                </div>
              ) : (
                <img className="neon-photo" data-studio-edit="portrait" src={profile.portrait.src} alt={profile.portrait.alt} decoding="async" fetchPriority="high" />
              )}
              <span className="neon-scanline" aria-hidden="true" />
              <span className="neon-orbit neon-orbit-a" aria-hidden="true" /><span className="neon-orbit neon-orbit-b" aria-hidden="true" />
              <div className="neon-hud-top" aria-hidden="true"><Cpu size={14} /><span>PROFILE / ACTIVE</span><i /></div>
              <div className="neon-hud-bottom" aria-hidden="true"><span>FIG 016 / HUMAN × TECHNOLOGY</span><Sparkles size={15} /></div>
            </div>
            <div className="neon-image-caption"><span>{conceptPhoto ? 'VISUAL AI FIKSI — BUKAN FOTO ASLI' : 'FOTO PROFIL'}</span><span>© PESONAFLIX</span></div>
          </motion.div>
        </div>

        <div className="neon-fact-bar" aria-label="Ringkasan profil">
          <div><span>01 / PORTOFOLIO</span><strong>{String(projects.length).padStart(2, '0')} <small>KARYA</small></strong></div>
          <div><span>02 / PENGALAMAN</span><strong>{String(experience.length).padStart(2, '0')} <small>PERAN</small></strong></div>
          <div><span>03 / DOMISILI</span><strong className="neon-location">{profile.location || 'Indonesia'}</strong></div>
          <button type="button" onClick={() => scrollTo('#about')}><span>LIHAT CERITA SAYA</span><ArrowDownRight size={24} aria-hidden="true" /></button>
        </div>

        <div className="neon-works">
          <div className="neon-works-head"><span className="neon-tiny-label">// SELECTED PROJECTS</span><h2>Karya nyata.<br /><em>Jejak digital.</em></h2><p>Profil yang meyakinkan lahir dari pekerjaan yang bisa dijelaskan, bukan efek visual semata.</p></div>
          <div className="neon-work-cards">
            {projects.slice(0, 3).map((project, index) => (
              <button type="button" className="neon-work-card" key={project.id} onClick={() => onOpenProject(project)} aria-label={`Buka karya ${project.title}`}>
                <span className="neon-work-top"><span>TRANSMISSION {String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={17} aria-hidden="true" /></span>
                <span className="neon-work-image">{project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <ImageIcon size={36} aria-hidden="true" />}</span>
                <span className="neon-work-info"><strong>{project.title}</strong><small>{project.genre}</small></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
