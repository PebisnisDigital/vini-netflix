import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Image as ImageIcon, Play, ShieldCheck } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './tni-profession.css';

/**
 * Tema profesi yang terinspirasi warna dan pola seragam TNI, bukan situs resmi.
 * Pangkat, kesatuan, lencana, serta prestasi tidak pernah dibuat otomatis.
 */
export default function TniProfessionHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects, experience } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const hasPortrait = Boolean(profile.portrait.src && profile.portrait.src !== '/assets/portrait-720.webp');
  const isDemo = profile.clientSlug === 'contoh-tni' || profile.displayName === 'Profil TNI Demo';

  return (
    <section id="top" className="tni-hero" aria-label={`Profil profesi ${profile.displayName}`}>
      <div className="tni-horizon" aria-hidden="true"><span /><span /><span /></div>
      <div className="tni-grid-overlay" aria-hidden="true" />
      <div className="tni-light-beam" aria-hidden="true" />

      <div className="tni-content">
        <div className="tni-topline">
          <span><ShieldCheck size={15} aria-hidden="true" /> PESONAFLIX <b>/</b> GAYA PROFESI</span>
          <span>{isDemo ? 'DEMO DESAIN · BUKAN PROFIL RESMI' : 'PROFIL PERSONAL · BUKAN SITUS RESMI TNI'}</span>
        </div>

        <div className="tni-main-grid">
          <div className="tni-copy">
            <motion.p className="tni-overline" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <span className="tni-overline-bar" /> PROFESI / PENGABDIAN / PERJALANAN
            </motion.p>
            <motion.h1 data-studio-edit="name" className="tni-display-name" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, delay: .13 }}>
              {profile.displayName}
            </motion.h1>
            <motion.p data-studio-edit="role" className="tni-role" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .28 }}>
              {profile.role}
            </motion.p>
            <motion.p data-studio-edit="tagline" className="tni-quote" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .39 }}>
              {profile.tagline[1] || profile.tagline[0] || 'Setiap perjalanan memiliki cerita yang layak dikenalkan.'}
            </motion.p>
            <motion.p data-studio-edit="bio" className="tni-description" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .51 }}>
              {profile.intro}
            </motion.p>
            <motion.div className="tni-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .64 }}>
              <button type="button" onClick={() => scrollTo('#originals')} className="tni-action-primary">LIHAT KARYA <ArrowUpRight size={17} aria-hidden="true" /></button>
              <button type="button" onClick={onPlay} className="tni-action-secondary"><Play size={14} aria-hidden="true" /> TONTON KISAH</button>
            </motion.div>
            <div className="tni-focus-row" aria-label="Bidang yang ditampilkan pada profil">
              {profile.interests.slice(0, 3).map((interest, index) => <span key={`${index}-${interest}`}><b>{String(index + 1).padStart(2, '0')}</b>{interest}</span>)}
            </div>
          </div>

          <motion.div className="tni-portrait-frame" initial={{ opacity: 0, x: 36, scale: .98 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 1.1, delay: .2 }}>
            <div className="tni-portrait-stripes" aria-hidden="true" />
            <div className="tni-portrait-stage">
              {hasPortrait ? (
                <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" fetchPriority="high" decoding="async" />
              ) : (
                <div className="tni-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Unggah foto klien memakai pakaian profesi melalui Studio">
                  <ImageIcon size={60} strokeWidth={1} aria-hidden="true" />
                  <strong>FOTO PROFIL</strong>
                  <span>UNGGAH FOTO PEMILIK WEBSITE</span>
                </div>
              )}
              <div className="tni-photo-vignette" aria-hidden="true" />
            </div>
            <div className="tni-portrait-label"><span>01 / PORTRAIT</span><span>{isDemo ? 'ILUSTRASI FIKSI · TANPA ATRIBUT RESMI' : 'FOTO MILIK PEMILIK PROFIL'}</span></div>
            <div className="tni-orbit tni-orbit-one" aria-hidden="true" />
            <div className="tni-orbit tni-orbit-two" aria-hidden="true" />
          </motion.div>
        </div>

        <div className="tni-summary-line">
          <div><small>01 / BIDANG PROFESI</small><strong data-studio-edit="role">{profile.role}</strong></div>
          <div><small>02 / JEJAK KARYA</small><strong>{String(projects.length).padStart(2, '0')} <em>Kisah</em></strong></div>
          <div><small>03 / RIWAYAT</small><strong>{String(experience.length).padStart(2, '0')} <em>Peran</em></strong></div>
          <button type="button" onClick={() => scrollTo('#about')}>KENALI SAYA <ArrowDownRight size={21} aria-hidden="true" /></button>
        </div>

        <div className="tni-work-grid">
          <div className="tni-work-intro"><span>PORTOFOLIO / PILIHAN</span><h2>Rekam <i>jejak.</i></h2><p>Pengalaman, kegiatan, dan karya yang ditulis berdasarkan data pemilik profil.</p></div>
          {projects.slice(0, 2).map((project, index) => <button type="button" className="tni-work-card" key={project.id} onClick={() => onOpenProject(project)}>
            <span className="tni-work-image">{project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <ImageIcon size={36} aria-hidden="true" />}</span>
            <span className="tni-work-caption"><small>ARSIP {String(index + 1).padStart(2, '0')} / {project.genre}</small><strong>{project.title}</strong><ArrowUpRight size={19} aria-hidden="true" /></span>
          </button>)}
        </div>
      </div>
    </section>
  );
}
