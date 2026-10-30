import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Image as ImageIcon, Play } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './minimalist.css';

/** Reputasi dibangun dari peran, pekerjaan dan karya nyata; isi mengikuti data klien aktif. */
export default function MinimalistHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects, experience } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const noPortrait = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptPhoto = /buatan AI|konsep|ilustrasi|bukan foto asli|fiksi/i.test(profile.portrait.alt);

  return (
    <section id="top" className="minimalist-hero" aria-label={`Profil profesional ${profile.displayName}`}>
      <div className="minimalist-page-shell">
        <div className="minimalist-hero-meta" aria-hidden="true">
          <span>PROFIL / <b>01</b></span><span>PERSONAL WORK &amp; IDENTITY</span><span>{profile.location || 'INDONESIA'}</span>
        </div>

        <div className="minimalist-hero-grid">
          <div className="minimalist-copy">
            <motion.p className="minimalist-kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .1 }}>
              <span className="minimalist-live-dot" aria-hidden="true" /> PERKENALKAN, SAYA
            </motion.p>
            <motion.h1 data-studio-edit="name" className="minimalist-name" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .19 }}>{profile.displayName}</motion.h1>
            <motion.p data-studio-edit="role" className="minimalist-role" initial={{ opacity: 0, y: 23 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .36 }}>{profile.role}</motion.p>
            <motion.p data-studio-edit="tagline" className="minimalist-statement" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .46 }}>{profile.tagline[1] || profile.tagline[0] || 'Kerja yang baik layak diperlihatkan dengan jelas.'}</motion.p>
            <motion.p data-studio-edit="bio" className="minimalist-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .55 }}>{profile.intro}</motion.p>

            <motion.div className="minimalist-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .67 }}>
              <button type="button" className="minimalist-primary" onClick={() => scrollTo('#originals')}>Lihat Portofolio <ArrowUpRight size={17} aria-hidden="true" /></button>
              <button type="button" className="minimalist-secondary" onClick={onPlay}><Play size={14} fill="currentColor" aria-hidden="true" /> Kenali Saya</button>
            </motion.div>

            <div className="minimalist-focus" aria-label="Bidang yang ditekuni">
              <span>FOKUS KERJA</span>
              <div>{profile.interests.slice(0, 3).map((interest) => <small key={interest}>{interest}</small>)}</div>
            </div>
          </div>

          <motion.div className="minimalist-photo-frame" initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: .32 }}>
            <span className="minimalist-image-index" aria-hidden="true">FIG. 01 — PROFILE</span>
            {noPortrait ? (
              <div className="minimalist-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Unggah foto profesional milik klien di Studio">
                <ImageIcon size={61} strokeWidth={1} aria-hidden="true" />
                <strong>FOTO ANDA<br />DI SINI</strong>
                <span>UNGGAH MELALUI STUDIO</span>
              </div>
            ) : (
              <img data-studio-edit="portrait" className="minimalist-photo" src={profile.portrait.src} alt={profile.portrait.alt} decoding="async" fetchPriority="high" />
            )}
            <div className="minimalist-photo-caption"><span>{conceptPhoto ? 'VISUAL KONSEPTUAL AI · BUKAN FOTO ASLI' : 'FOTO PROFIL'}</span><span>PESONAFLIX</span></div>
          </motion.div>
        </div>

        <div className="minimalist-facts">
          <div><strong>{String(projects.length).padStart(2, '0')}</strong><span>KARYA PILIHAN</span></div>
          <div><strong>{String(experience.length).padStart(2, '0')}</strong><span>PERAN &amp; PENGALAMAN</span></div>
          <div><strong>{profile.location}</strong><span>BERKARYA DARI</span></div>
          <button type="button" onClick={() => scrollTo('#about')} aria-label="Lanjut ke cerita lengkap"><span>KENALI LEBIH DEKAT</span><ArrowDownRight size={24} aria-hidden="true" /></button>
        </div>

        <div className="minimalist-work-index">
          <div className="minimalist-work-heading"><span>02 / SELECTED WORK</span><h2>Karya yang berbicara.</h2><p>Bukan sekadar gelar. Berikut hal yang saya kerjakan dan bisa Anda lihat lebih dekat.</p></div>
          <div className="minimalist-work-list">
            {projects.slice(0, 3).map((project, index) => (
              <button className="minimalist-project-row" type="button" key={project.id} onClick={() => onOpenProject(project)} aria-label={`Buka karya ${project.title}`}>
                <span className="minimalist-project-number">{String(index + 1).padStart(2, '0')}</span>
                {project.image ? <span className="minimalist-project-thumb"><img src={project.image} alt="" loading="lazy" decoding="async" /></span> : <span className="minimalist-project-thumb minimalist-project-empty" aria-hidden="true"><ImageIcon size={20} /></span>}
                <span className="minimalist-project-info"><strong>{project.title}</strong><small>{project.genre}</small></span>
                <ArrowUpRight className="minimalist-project-arrow" size={20} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
