import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Camera, Heart, Paperclip, Play, Sparkles } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './scrapbook.css';

/** Kolase kenangan personal yang sepenuhnya memakai data dan aset klien aktif. */
export default function ScrapbookHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsPhoto = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const conceptPhoto = /buatan AI|bukan foto asli|karakter fiksi|foto konsep/i.test(profile.portrait.alt);
  const featured = projects.slice(0, 2);

  return (
    <section id="top" className="scrapbook-hero" aria-label={`Album perjalanan ${profile.displayName}`}>
      <div className="scrapbook-paper-grid" aria-hidden="true" />
      <span className="scrapbook-background-sticker scrapbook-background-sticker-a" aria-hidden="true">✿</span>
      <span className="scrapbook-background-sticker scrapbook-background-sticker-b" aria-hidden="true">✳</span>
      <svg className="scrapbook-drawn-trail" viewBox="0 0 250 135" fill="none" aria-hidden="true">
        <path d="M9 17C35 14 37 96 93 75S142 14 175 46s19 72 65 39m-23-12 23 12-10 19" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="420" />
      </svg>

      <div className="scrapbook-layout">
        <div className="scrapbook-copy-paper">
          <span className="scrapbook-washi scrapbook-copy-tape" aria-hidden="true" />
          <motion.p className="scrapbook-eyebrow" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .65, delay: .15 }}>
            <Paperclip size={15} aria-hidden="true" /> PESONAFLIX MEMORY BOOK <span>VOL. 01</span>
          </motion.p>
          <motion.p className="scrapbook-hello" initial={{ opacity: 0, rotate: -7, y: 15 }} animate={{ opacity: 1, rotate: -4, y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 12, delay: .22 }}>
            Cerita saya, nih!
          </motion.p>
          <motion.h1 data-studio-edit="name" className="scrapbook-name" initial={{ opacity: 0, x: -26, y: 23 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: .8, delay: .33 }}>
            {profile.displayName}
          </motion.h1>
          <motion.p data-studio-edit="role" className="scrapbook-role" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .52 }}>
            <span aria-hidden="true">✦</span> {profile.role}
          </motion.p>
          <motion.p data-studio-edit="tagline" className="scrapbook-quote" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .64 }}>
            “{profile.tagline[1] || profile.tagline[0] || 'Dari keseharian, muncul karya yang punya cerita.'}”
          </motion.p>
          <motion.p data-studio-edit="bio" className="scrapbook-intro" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .76 }}>
            {profile.intro}
          </motion.p>
          <motion.div className="scrapbook-actions" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .89 }}>
            <button type="button" className="scrapbook-play-button" onClick={onPlay}><Play size={15} fill="currentColor" aria-hidden="true" /> Kenalan Yuk</button>
            <button type="button" className="scrapbook-works-button" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={17} aria-hidden="true" /></button>
          </motion.div>
          <div className="scrapbook-paper-footnote"><Heart size={15} fill="currentColor" aria-hidden="true" /><span>Semua potongan punya makna.</span><span>01 / 10</span></div>
        </div>

        <div className="scrapbook-collage" aria-label="Kolase foto dan karya">
          <span className="scrapbook-collage-paper scrapbook-paper-yellow" aria-hidden="true" />
          <span className="scrapbook-collage-paper scrapbook-paper-mint" aria-hidden="true" />
          <span className="scrapbook-sticker scrapbook-sticker-star" aria-hidden="true">✹</span>
          <span className="scrapbook-sticker scrapbook-sticker-flower" aria-hidden="true">❀</span>
          <motion.div className="scrapbook-photo-primary" initial={{ opacity: 0, scale: .83, rotate: -13, y: 30 }} animate={{ opacity: 1, scale: 1, rotate: -7, y: 0 }} transition={{ type: 'spring', stiffness: 70, damping: 13, delay: .28 }}>
            <span className="scrapbook-washi scrapbook-tape-primary" aria-hidden="true" />
            <div className="scrapbook-photo-window">
              {needsPhoto ? (
                <div className="scrapbook-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat foto atau ilustrasi SCRAPBOOK klien; unggah gambar milik klien melalui Studio">
                  <Camera size={68} strokeWidth={1.2} aria-hidden="true" />
                  <span>FOTO KLIEN<br />DI SINI ♡</span>
                </div>
              ) : (
                <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" decoding="async" fetchPriority="high" />
              )}
            </div>
            <p>{conceptPhoto ? 'foto konsep · karakter fiksi' : 'ini kisah saya ♡'}</p>
          </motion.div>

          {featured.map((project, index) => (
            <motion.button type="button" key={project.id} className={`scrapbook-photo-small scrapbook-photo-small-${index + 1}`} aria-label={`Buka kenangan karya ${project.title}`} onClick={() => onOpenProject(project)} initial={{ opacity: 0, scale: .8, rotate: index === 0 ? 15 : -15 }} animate={{ opacity: 1, scale: 1, rotate: index === 0 ? 9 : -9 }} transition={{ type: 'spring', stiffness: 85, damping: 15, delay: .64 + index * .15 }} whileHover={{ y: -10, scale: 1.03 }}>
              <span className="scrapbook-washi scrapbook-tape-small" aria-hidden="true" />
              {project.image ? <img src={project.image} alt={`Gambar karya ${project.title}`} loading="lazy" decoding="async" /> : <span className="scrapbook-photo-empty" aria-hidden="true"><Camera size={34} /></span>}
              <span>{project.title} <ArrowUpRight size={13} aria-hidden="true" /></span>
            </motion.button>
          ))}

          <div className="scrapbook-note-sticky" aria-hidden="true"><Sparkles size={18} /> Ide kecil,<br />cerita besar!</div>
          <span className="scrapbook-postmark" aria-hidden="true">MADE WITH<br />HEART ♥</span>
        </div>
      </div>

      <motion.div className="scrapbook-memory-strip" initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: 1.12 }}>
        <div className="scrapbook-memory-head"><span>✦ BUKTI BUKAN JANJI</span><strong>Ini yang sudah saya buat</strong></div>
        {featured.map((project, index) => <button key={project.id} type="button" className={`scrapbook-memory-ticket scrapbook-ticket-${index + 1}`} onClick={() => onOpenProject(project)} aria-label={`Lihat detail karya ${project.title}`}><span>0{index + 1}</span><strong>{project.title}</strong><ArrowUpRight size={16} aria-hidden="true" /></button>)}
        <button type="button" className="scrapbook-next" onClick={() => scrollTo('#about')} aria-label="Lanjut menjelajah album"><ArrowDown size={21} /></button>
      </motion.div>
    </section>
  );
}
