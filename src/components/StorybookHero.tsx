import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, BookOpen, Feather, Play } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './storybook.css';

/** Buku cerita interaktif yang memakai data, karya, dan gambar milik klien aktif. */
export default function StorybookHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsArtwork = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptArt = /buatan AI|bukan foto asli|karakter fiksi/i.test(profile.portrait.alt);

  return (
    <section id="top" className="storybook-hero" aria-label={`Buku cerita ${profile.displayName}`}>
      <span className="storybook-floating-leaf storybook-leaf-a" aria-hidden="true">❦</span>
      <span className="storybook-floating-leaf storybook-leaf-b" aria-hidden="true">❧</span>

      <div className="storybook-book-spread">
        <div className="storybook-left-page">
          <div className="storybook-leaf-stamp" aria-hidden="true">✿</div>
          <motion.div className="storybook-edition" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }}>
            <span><BookOpen size={15} aria-hidden="true" /> PESONAFLIX STORIES</span>
            <span>BUKU 01 · HALAMAN 01</span>
          </motion.div>
          <motion.p className="storybook-prelude" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, delay: .27 }}>
            Di balik setiap karya, selalu ada cerita...
          </motion.p>
          <motion.h1 data-studio-edit="name" className="storybook-name" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, delay: .39, ease: [.2, .75, .2, 1] }}>
            {profile.displayName}
          </motion.h1>
          <motion.div data-studio-edit="role" className="storybook-role" initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .59 }}>
            <span aria-hidden="true">✦</span> {profile.role} <span aria-hidden="true">✦</span>
          </motion.div>
          <motion.p className="storybook-tagline" data-studio-edit="tagline" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .7 }}>
            “{profile.tagline[1] || profile.tagline[0] || 'Kisah yang layak dibagikan selalu dimulai dari keberanian mencoba.'}”
          </motion.p>
          <motion.p className="storybook-bio" data-studio-edit="bio" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .8 }}>
            {profile.intro}
          </motion.p>
          <motion.div className="storybook-actions" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .95 }}>
            <button className="storybook-button-read" type="button" onClick={onPlay}><Play size={14} fill="currentColor" aria-hidden="true" /> Baca Kisah</button>
            <button className="storybook-button-works" type="button" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={17} aria-hidden="true" /></button>
          </motion.div>
          <div className="storybook-folio"><Feather size={18} aria-hidden="true" /><span>Ditulis lewat karya &amp; perjalanan</span><span>01</span></div>
        </div>

        <div className="storybook-image-page">
          {needsArtwork ? (
            <div className="storybook-art-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat ilustrasi Storybook klien; unggah gambar sendiri dari Studio">
              <svg aria-hidden="true" viewBox="0 0 220 260" fill="none"><path d="M25 59q55-28 89 8 34-36 80-8v145q-45-18-80 18-35-36-89-18Z" fill="#f7edda" stroke="#7b947b" strokeWidth="5" strokeLinejoin="round"/><path d="M114 68v154M37 80q38-15 62 9M130 89q22-24 51-9M37 104q36-9 62 7M131 111q28-16 52-7" stroke="#b5b297" strokeWidth="3" strokeLinecap="round"/><path d="M116 24q20 25 0 43-20-19 0-43Z" fill="#d89a7d"/><path d="M69 40q21 12 22 26-22 4-22-26Z" fill="#aac1a0"/><path d="M162 41q-13 8-17 24 17 9 17-24Z" fill="#b6a8bd"/></svg>
              <p>HALAMAN ILUSTRASI KLIEN</p>
              <small>UNGGAH GAMBAR STORYBOOK</small>
            </div>
          ) : (
            <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" fetchPriority="high" decoding="async" />
          )}
          <span className="storybook-image-label" aria-hidden="true">{conceptArt ? 'ILUSTRASI KONSEP · BUKAN FOTO ASLI' : 'CERITA DI BALIK SOSOK'}</span>
          <span className="storybook-firefly storybook-firefly-a" aria-hidden="true" />
          <span className="storybook-firefly storybook-firefly-b" aria-hidden="true" />
          <span className="storybook-firefly storybook-firefly-c" aria-hidden="true" />
          <div className="storybook-page-curl" aria-hidden="true" />
        </div>
        <div className="storybook-book-gutter" aria-hidden="true" />
      </div>

      <motion.div className="storybook-chapters" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .95, delay: 1.1 }}>
        <div className="storybook-chapters-heading"><span>✦ BUKA BAB BERIKUTNYA</span><strong>Kisah yang sudah jadi karya</strong></div>
        {projects.slice(0, 2).map((project, index) => (
          <motion.button type="button" key={project.id} onClick={() => onOpenProject(project)} className={`storybook-chapter-card storybook-chapter-card-${index + 1}`} whileHover={{ y: -5, rotate: 0 }} aria-label={`Buka bab karya ${project.title}`}>
            {project.image ? <img src={project.image} alt="" loading="lazy" decoding="async" /> : <span className="storybook-chapter-empty" aria-hidden="true">❦</span>}
            <span><small>BAB {String(index + 2).padStart(2, '0')}</small><strong>{project.title}</strong></span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </motion.button>
        ))}
        <button type="button" className="storybook-scroll" onClick={() => scrollTo('#about')} aria-label="Lanjut membaca cerita"><ArrowDown size={22} aria-hidden="true" /></button>
      </motion.div>
    </section>
  );
}
