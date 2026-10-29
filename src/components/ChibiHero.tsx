import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import './chibi.css';

/** Alternatif poster-film yang hanya digunakan oleh klien bergaya chibi. */
export default function ChibiHero({
  onPlay,
  onOpenProject,
}: {
  onPlay: () => void;
  onOpenProject: (project: Project) => void;
}) {
  const { profile, projects } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const showcased = projects.slice(0, 2);
  const needsChibiArtwork = profile.portrait.src === '/assets/portrait-720.webp' && profile.templateId === 'chibi-3d';

  return (
    <section id="top" className="chibi-hero" aria-label={`Kisah ${profile.displayName}`}>
      <div className="chibi-hero-art">
        {needsChibiArtwork ? (
          <div className="chibi-art-placeholder" data-studio-edit="portrait" role="img" aria-label="Area ilustrasi chibi klien. Unggah gambar lewat tombol Foto Utama di editor.">
            <span className="chibi-art-placeholder-face" aria-hidden="true"><span /></span>
            <span className="chibi-art-placeholder-copy">UNGGAH KARAKTER CHIBI</span>
          </div>
        ) : <img data-studio-edit="portrait" src={profile.portrait.src} alt={profile.portrait.alt} fetchPriority="high" decoding="async" />}
      </div>

      <div className="chibi-hero-copy">
        <motion.p
          className="chibi-kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.65 }}
        >
          KISAH {profile.displayName.toUpperCase()}
        </motion.p>
        <motion.h1
          data-studio-edit="name"
          className="chibi-title"
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.36, duration: 0.9, type: 'spring', stiffness: 110, damping: 16 }}
        >
          {profile.displayName}
        </motion.h1>
        <motion.p
          data-studio-edit="role"
          className="chibi-role"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {profile.role}
        </motion.p>
        <motion.p
          data-studio-edit="bio"
          className="chibi-intro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {profile.intro}
        </motion.p>

        <motion.div
          className="chibi-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}
        >
          <button type="button" className="chibi-cta-primary" onClick={onPlay}>
            <Play size={18} fill="currentColor" strokeWidth={2.6} aria-hidden="true" />
            Kenalan Yuk
            <ArrowRight size={19} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button type="button" className="chibi-cta-secondary" onClick={() => scrollTo('#originals')}>
            Lihat Karya
            <ArrowRight size={19} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </motion.div>

        {showcased.length > 0 && (
          <div className="chibi-posters" aria-label={`Karya pilihan ${profile.displayName}`}>
            {showcased.map((project, index) => (
              <motion.button
                key={project.id}
                type="button"
                className="chibi-poster"
                onClick={() => onOpenProject(project)}
                aria-label={`Buka cerita karya ${project.title}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.94 + index * 0.12, duration: 0.75 }}
                whileHover={{ y: -8, rotate: index === 0 ? -1 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={project.image} alt={`Poster cerita ${project.title}`} loading="lazy" decoding="async" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
