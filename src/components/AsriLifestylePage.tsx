import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, Mail, Menu, MessageCircle, X } from 'lucide-react';
import { usePortfolio } from '../data/PortfolioContext';
import { normalizeClientWhatsapp } from '../utils/clientWhatsapp.mjs';
import './asri-lifestyle.css';

const visualHero = '/clients/asriwahyuni/hero-editorial.webp';
const travelPhoto = '/clients/asriwahyuni/momen-travel.webp';

const focusAreas: { number: string; projectIndex: number; heading: string; category: string; summary: string; image?: string }[] = [
  { number: '01', projectIndex: 0, heading: 'Travel & Lifestyle', category: 'CONTENT CREATION', summary: 'Cerita perjalanan, kuliner, dan keseharian seorang ibu—diolah menjadi konten yang inspiratif.', image: travelPhoto },
  { number: '02', projectIndex: 2, heading: 'beRAni', category: 'SOCIAL MEDIA SERVICES', summary: 'Brand jasa optimasi media sosial yang Ayu bangun sebagai ruang pengembangan bisnis dan kolaborasi.' },
  { number: '03', projectIndex: 3, heading: 'Food Business', category: 'ENTREPRENEURSHIP', summary: 'Eksplorasi ide dan peluang usaha di dunia kuliner yang berjalan berdampingan dengan karya digital.' },
];

const skills = ['Digital Marketing', 'Pendamping UMKM', 'MICE'];

export default function AsriLifestylePage({ editorMode = false }: { editorMode?: boolean }) {
  const { profile, projects } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const whatsapp = normalizeClientWhatsapp(profile.whatsapp);
  const contactUrl = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent('Halo Ayu, saya melihat website profil Anda dan ingin berdiskusi tentang kolaborasi.')}` : '';
  const longAbout = profile.aboutMe?.trim() || profile.intro;
  const photo = profile.portrait.src === '/clients/asriwahyuni/foto-profesional.webp' ? visualHero : profile.portrait.src;

  return <div className={`ayu-page${editorMode ? ' ayu-page--editor' : ''}`} id="home">
    <header className="ayu-site-header ayu-container">
      <a className="ayu-site-logo" href="#home" aria-label="Kembali ke awal profil Asri Wahyuni">AYU<span>.</span></a>
      <nav className="ayu-desktop-nav" aria-label="Navigasi utama">
        <a href="#about">About Me</a>
        <a href="#work">What I Do</a>
        <a href="#expertise">Expertise</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="ayu-menu-toggle" type="button" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={23} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
      </button>
    </header>
    {menuOpen && <nav className="ayu-mobile-nav ayu-container" aria-label="Navigasi seluler">
      {[['About Me', '#about'], ['What I Do', '#work'], ['Expertise', '#expertise'], ['Contact', '#contact']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}
    </nav>}

    <main>
      <section className="ayu-hero ayu-container" aria-labelledby="ayu-hero-headline">
        <div className="ayu-hero-inner">
          <div className="ayu-hero-label"><span data-studio-edit="name">{profile.displayName.toUpperCase()}.</span><span>PERSONAL BRAND</span></div>
          <div className="ayu-hero-image-wrap">
            <img data-studio-edit="portrait" src={photo} alt={profile.portrait.alt} className="ayu-hero-image" fetchPriority="high" />
          </div>
          <div className="ayu-hero-content">
            <div className="ayu-hero-number">01 / HOME</div>
            <h1 id="ayu-hero-headline" data-studio-edit="tagline">{profile.tagline[1] || 'Creativity. Business. Opportunities.'}</h1>
            <p className="ayu-hero-role" data-studio-edit="role">{profile.role}</p>
            <p className="ayu-hero-copy" data-studio-edit="bio">{profile.intro}</p>
            <a className="ayu-primary-button" href="#about">EXPLORE MY PROFILE <ArrowDown size={21} aria-hidden="true" /></a>
            <p className="ayu-image-note">Visual konseptual berbantuan AI</p>
          </div>
        </div>
      </section>

      <section className="ayu-section ayu-container ayu-about" id="about" aria-labelledby="ayu-about-heading">
        <div className="ayu-section-title"><span className="ayu-section-count">02 / THE PERSON</span><h2 id="ayu-about-heading">About Me</h2></div>
        <div className="ayu-about-grid">
          <div className="ayu-about-intro">
            <span className="ayu-small-label">HELLO, I'M AYU.</span>
            <h3>Bukan sekadar membuat konten. <em>Saya membangun cerita.</em></h3>
            <div className="ayu-about-portrait"><img src={profile.portrait.src} alt="Potret Asri Wahyuni, akrab disapa Ayu" loading="lazy" data-studio-edit="portrait" /></div>
          </div>
          <div className="ayu-about-story" data-studio-edit={profile.aboutMe ? 'aboutme' : 'bio'}>
            {longAbout.split(/\n\s*\n/).filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            <a className="ayu-text-link" href="#work">Lihat perjalanan kreatif <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="ayu-section ayu-work" id="work" aria-labelledby="ayu-work-heading">
        <div className="ayu-container">
          <div className="ayu-section-title"><span className="ayu-section-count">03 / WHAT I DO</span><h2 id="ayu-work-heading">Creative work.<br /><em>Real opportunities.</em></h2><p>Konten, strategi digital, dan bisnis yang saling membuka pintu baru.</p></div>
          <div className="ayu-work-grid">
            {focusAreas.map((area, i) => <article key={area.number} className={`ayu-work-card ayu-work-card--${i + 1}`}>
              {area.image && <div className="ayu-work-image"><img src={area.image} alt="Ayu dalam perjalanan, dokumentasi aktivitas travel" loading="lazy" /></div>}
              <div className="ayu-work-card-content">
                <div className="ayu-work-overline"><span>{area.number}</span><span>{area.category}</span></div>
                <h3 data-studio-edit={`project:${area.projectIndex}:title`}>{projects[area.projectIndex]?.title || area.heading}</h3>
                <p data-studio-edit={`project:${area.projectIndex}:description`}>{projects[area.projectIndex]?.logline || area.summary}</p>
                <a href={i === 0 ? '#about' : contactUrl || '#contact'} target={i === 0 || !contactUrl ? undefined : '_blank'} rel={i === 0 || !contactUrl ? undefined : 'noopener noreferrer'}>
                  {i === 0 ? 'Kenali Ceritanya' : 'Diskusi Kolaborasi'} <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="ayu-section ayu-container ayu-expertise" id="expertise" aria-labelledby="ayu-expertise-heading">
        <div className="ayu-section-title"><span className="ayu-section-count">04 / EXPERTISE</span><h2 id="ayu-expertise-heading">Always learning.<br /><em>Always growing.</em></h2></div>
        <div className="ayu-expertise-grid">
          <div><p className="ayu-expertise-lead">Lebih dari satu tahun di dunia bisnis dan digital marketing.</p><p>Pengalaman dan sertifikasi kompetensi menjadi bekal Ayu untuk mengembangkan karya, usaha, dan peluang kolaborasi.</p></div>
          <div className="ayu-cert-list"><div className="ayu-cert-title">SERTIFIKASI KOMPETENSI BNSP</div>{skills.map((skill, i) => <div className="ayu-cert-row" key={skill}><span>0{i + 1}</span><strong>{skill}</strong><CheckCircle2 size={20} aria-hidden="true" /></div>)}</div>
        </div>
      </section>

      <section className="ayu-contact" id="contact" aria-labelledby="ayu-contact-heading">
        <div className="ayu-container ayu-contact-grid">
          <div><span className="ayu-small-label">05 / LET'S CONNECT</span><h2 id="ayu-contact-heading">Good ideas<br />start with <em>hello.</em></h2><p>Punya ide konten, ingin berdiskusi tentang beRAni, atau melihat peluang kolaborasi? Ceritakan ke Ayu.</p></div>
          <div className="ayu-contact-actions">{contactUrl && <a href={contactUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={22} /> Chat via WhatsApp <ArrowRight size={19} /></a>}{profile.email && <a href={`mailto:${profile.email}`}><Mail size={22} /> {profile.email} <ArrowUpRight size={19} /></a>}</div>
        </div>
      </section>
    </main>
    <footer className="ayu-footer ayu-container"><span>ASRI WAHYUNI · AYU</span><a href="#home">Back to top ↑</a><span>© {new Date().getFullYear()} PERSONAL BRAND</span></footer>
  </div>;
}
