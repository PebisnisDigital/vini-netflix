import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BookOpen, Image as ImageIcon, Play, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './vintage-heritage.css';

/** An archival visual language; only client-supplied data represents accomplishments. */
export default function VintageHeritageHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects, experience } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const noPortrait = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptPhoto = /buatan AI|konsep|ilustrasi|bukan foto asli|fiksi/i.test(profile.portrait.alt);

  return (
    <section id="top" className="heritage-hero" aria-label={`Arsip karya ${profile.displayName}`}>
      <div className="heritage-ambient" aria-hidden="true"><span /><span /><span /></div>
      <div className="heritage-shell">
        <div className="heritage-masthead">
          <span><BookOpen size={14} aria-hidden="true" /> PESONAFLIX / CATATAN KARYA</span>
          <span className="heritage-masthead-center">JEJAK • CERITA • KARYA</span>
          <span>EDISI <b>016</b> / HERITAGE</span>
        </div>

        <div className="heritage-main-grid">
          <div className="heritage-story-column">
            <motion.div className="heritage-kicker" initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72 }}>
              <span className="heritage-kicker-mark">✳</span> SEBUAH CERITA TENTANG KARYA
            </motion.div>
            <motion.h1 className="heritage-name" data-studio-edit="name" initial={{ opacity: 0, y: 23 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .12 }}>
              {profile.displayName}
            </motion.h1>
            <motion.p className="heritage-role" data-studio-edit="role" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .25 }}>
              {profile.role}
            </motion.p>
            <div className="heritage-ornament" aria-hidden="true"><span /><i>✦</i><span /></div>
            <motion.p className="heritage-manifesto" data-studio-edit="tagline" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .82, delay: .35 }}>
              {profile.tagline[1] || profile.tagline[0] || 'Sebuah cerita akan lebih berarti ketika karyanya dapat dilihat.'}
            </motion.p>
            <motion.p className="heritage-intro" data-studio-edit="bio" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .86, delay: .45 }}>
              {profile.intro}
            </motion.p>
            <motion.div className="heritage-actions" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .55 }}>
              <button type="button" className="heritage-action-main" onClick={() => scrollTo('#originals')}>LIHAT KARYA <ArrowUpRight size={17} aria-hidden="true" /></button>
              <button type="button" className="heritage-action-story" onClick={onPlay}><Play size={14} aria-hidden="true" /> DENGAR CERITA</button>
            </motion.div>
            <div className="heritage-focus">
              <span className="heritage-small-title">BIDANG YANG SAYA TEKUNI</span>
              <div>{profile.interests.slice(0, 3).map((interest, index) => <span key={interest}><b>{String(index + 1).padStart(2, '0')}</b>{interest}</span>)}</div>
            </div>
          </div>

          <motion.div className="heritage-portrait-column" initial={{ opacity: 0, y: 25, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.3, delay: .25 }}>
            <div className="heritage-paper-underlay" aria-hidden="true" />
            <div className="heritage-photo-mat">
              <div className="heritage-photo-window">
                {noPortrait ? (
                  <div className="heritage-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat foto klien; unggah melalui Studio">
                    <ImageIcon size={54} strokeWidth={1} aria-hidden="true" />
                    <strong>FOTO / KARYA ANDA</strong>
                    <span>UNGGAH MELALUI PESONAFLIX STUDIO</span>
                  </div>
                ) : (
                  <img className="heritage-photo" data-studio-edit="portrait" src={profile.portrait.src} alt={profile.portrait.alt} decoding="async" fetchPriority="high" />
                )}
                <div className="heritage-film-overlay" aria-hidden="true" />
              </div>
              <div className="heritage-portrait-credit"><span>PLATE NO. 016</span><span>{conceptPhoto ? 'KONSEP AI • BUKAN FOTO ASLI' : 'FOTO PROFIL'}</span></div>
            </div>
            <div className="heritage-wax-seal" aria-hidden="true"><span>✦</span><small>EST.</small><b>16</b></div>
            <div className="heritage-photo-note" aria-hidden="true"><Sparkles size={15} /> STORY IN THE MAKING</div>
          </motion.div>
        </div>

        <div className="heritage-ledger" aria-label="Data profil dari portofolio">
          <div><span>01 / KARYA TERCATAT</span><strong>{String(projects.length).padStart(2, '0')}</strong><small>Portofolio</small></div>
          <div><span>02 / PENGALAMAN</span><strong>{String(experience.length).padStart(2, '0')}</strong><small>Peran</small></div>
          <div><span>03 / DOMISILI</span><strong className="heritage-ledger-location">{profile.location || 'Indonesia'}</strong><small>Berbasis di</small></div>
          <button type="button" onClick={() => scrollTo('#about')}><span>KENALI LEBIH DEKAT</span><ArrowDownRight size={21} aria-hidden="true" /></button>
        </div>

        <div className="heritage-collection">
          <div className="heritage-collection-heading">
            <span className="heritage-small-title">ARSIP PILIHAN / VOLUME I</span>
            <h2>Jejak yang <em>tertinggal.</em></h2>
            <p>Setiap karya menyimpan cerita. Buka catatan ini untuk melihat pekerjaan dan proses di baliknya.</p>
          </div>
          <div className="heritage-folio-grid">
            {projects.slice(0, 3).map((project, index) => (
              <button key={project.id} type="button" className="heritage-folio" onClick={() => onOpenProject(project)} aria-label={`Buka karya ${project.title}`}>
                <span className="heritage-folio-top"><span>ARSIP {String(index + 1).padStart(2, '0')}</span><ArrowUpRight size={16} aria-hidden="true" /></span>
                <span className="heritage-folio-image">{project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <ImageIcon size={36} aria-hidden="true" />}</span>
                <span className="heritage-folio-footer"><strong>{project.title}</strong><small>{project.genre}</small></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
