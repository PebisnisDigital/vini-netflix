import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Camera, Clapperboard, Play, ScanLine } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './documentary.css';

/** Bab pembuka dokumenter: isi dan gambar selalu berasal dari klien yang sedang diedit. */
export default function DocumentaryHero({ onPlay, onOpenProject }: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const needsPhoto = !profile.portrait.src || profile.portrait.src === '/assets/portrait-720.webp';
  const illustrative = /ilustrasi|buatan ai|bukan foto asli|fiksi/i.test(profile.portrait.alt);
  const featured = projects.slice(0, 2);

  return (
    <section id="top" className="documentary-hero" aria-label={`Film dokumenter tentang ${profile.displayName}`}>
      <div className="documentary-projector-glow" aria-hidden="true" />
      <div className="documentary-marquee" aria-hidden="true">
        <div className="documentary-marquee-track">PESONAFLIX DOCUMENTARY <i /> KISAH DI BALIK KARYA <i /> DIBUAT DENGAN HATI <i /> PESONAFLIX DOCUMENTARY <i /> KISAH DI BALIK KARYA <i /> DIBUAT DENGAN HATI <i /></div>
      </div>

      <div className="documentary-film">
        <div className="documentary-film-image">
          {needsPhoto ? (
            <div className="documentary-photo-placeholder" data-studio-edit="portrait" role="img" aria-label="Tempat foto dokumenter klien, unggah foto melalui Studio">
              <Camera size={74} strokeWidth={1} aria-hidden="true" />
              <strong>MASUKKAN<br />FOTO CERITA ANDA</strong>
              <span>GANTI FOTO DI STUDIO</span>
            </div>
          ) : (
            <img src={profile.portrait.src} alt={profile.portrait.alt} data-studio-edit="portrait" fetchPriority="high" decoding="async" />
          )}
        </div>
        <div className="documentary-film-shade" aria-hidden="true" />
        <div className="documentary-film-grain" aria-hidden="true" />
        <div className="documentary-viewfinder documentary-viewfinder-a" aria-hidden="true" />
        <div className="documentary-viewfinder documentary-viewfinder-b" aria-hidden="true" />
        <div className="documentary-frame-top">
          <span><Clapperboard size={15} aria-hidden="true" /> PESONAFLIX <b>/</b> DOCUMENTARY</span>
          <span>CHAPTER 01 <b>—</b> THE BEGINNING</span>
        </div>

        <div className="documentary-feature-copy">
          <motion.p className="documentary-eyebrow" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .1 }}><span className="documentary-eyebrow-light" /> DI BALIK NAMA, ADA PERJALANAN</motion.p>
          <motion.h1 className="documentary-name" data-studio-edit="name" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: .24 }}>{profile.displayName}</motion.h1>
          <motion.p className="documentary-role" data-studio-edit="role" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .38 }}>{profile.role}</motion.p>
          <motion.p className="documentary-tagline" data-studio-edit="tagline" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .5 }}>{profile.tagline[1] || profile.tagline[0] || 'Setiap perjalanan punya kisah yang layak didengar.'}</motion.p>
          <motion.p className="documentary-bio" data-studio-edit="bio" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .62 }}>{profile.intro}</motion.p>
          <motion.div className="documentary-buttons" initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .75 }}>
            <button type="button" className="documentary-watch" onClick={onPlay}><Play size={15} fill="currentColor" aria-hidden="true" /> Tonton Kisah</button>
            <button type="button" className="documentary-explore" onClick={() => scrollTo('#originals')}>Lihat Karya <ArrowUpRight size={17} aria-hidden="true" /></button>
          </motion.div>
        </div>

        <div className="documentary-frame-bottom">
          <span><ScanLine size={16} aria-hidden="true" /> {illustrative ? 'VISUAL AI · BUKAN ARSIP KEGIATAN ASLI' : 'CERITA DARI PEMILIK PROFIL'}</span>
          <span>{profile.location} <b>·</b> 01 / 03</span>
        </div>
      </div>

      <div className="documentary-next-chapters">
        <div className="documentary-chapter-intro"><span>THE STORIES</span><strong>Jejak di Balik Karya</strong><small>Setiap karya punya proses. Pilih satu untuk melihat ceritanya.</small><button type="button" onClick={() => scrollTo('#about')}>Kenali Sosoknya <ArrowDownRight size={16} aria-hidden="true" /></button></div>
        {featured.map((project, index) => (
          <button className="documentary-scene-card" key={project.id} type="button" onClick={() => onOpenProject(project)} aria-label={`Buka kisah ${project.title}`}>
            <span className="documentary-scene-image">{project.image ? <img src={project.image} alt={`Cuplikan visual untuk karya ${project.title}`} loading="lazy" decoding="async" /> : <Camera size={32} aria-hidden="true" />}</span>
            <span className="documentary-scene-text"><small>SCENE 0{index + 2} <i /> {project.genre}</small><strong>{project.title}</strong></span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
