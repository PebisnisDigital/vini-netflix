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
const evidenceBase = '/clients/asriwahyuni/';

const expertiseAreas = [
  { title: 'Digital Marketing', description: 'Strategi media sosial, pengembangan konten, pemasaran digital, dan komunikasi brand.', image: `${evidenceBase}founder-community.webp`, position: '20% 23%' },
  { title: 'Content Creation', description: 'Travel, food, lifestyle, storytelling, dan proses produksi konten.', image: `${evidenceBase}behind-scenes.webp`, position: '52% 47%' },
  { title: 'UMKM Development', description: 'Pendampingan, edukasi pemasaran, dan pengembangan potensi usaha UMKM.', image: `${evidenceBase}narasumber-umkm.webp`, position: '48% 34%' },
  { title: 'Business & MICE', description: 'Pengembangan kemitraan, networking, komunitas, dan peluang kolaborasi di bidang event.', image: `${evidenceBase}komunitas-instagram.webp`, position: '50% 80%' },
];

const proofGallery = [
  { label: 'CONTENT CREATION', title: 'Di Balik Proses Produksi', description: 'Dokumentasi Ayu berkegiatan di depan laptop saat proses pengambilan gambar.', image: `${evidenceBase}behind-scenes.webp`, alt: 'Ayu bekerja di laptop bersama anak dan kru kamera saat pembuatan konten.' },
  { label: 'MEDIA COVERAGE', title: 'Liputan 9 Juta Views', description: 'Cuplikan artikel 23 Januari 2026 tentang tayangan konten keluarga Ayu.', image: `${evidenceBase}media-9-juta-views.webp`, alt: 'Cuplikan artikel media mengenai Asri Wahyuni dan capaian 9 juta views konten keluarga.' },
  { label: 'COMMUNITY BUILDING', title: 'Tiga Komunitas Perempuan', description: 'Poster komunitas yang dibagikan Ayu: AWC, Rumah Kawan Bunda, dan Wanita Cerdas Tangerang.', image: `${evidenceBase}founder-community.webp`, alt: 'Poster founder tiga komunitas perempuan beserta identitas dan akun media sosialnya.' },
  { label: 'UMKM DEVELOPMENT', title: 'Narasumber Pengembangan Usaha', description: 'Sertifikat kegiatan pengembangan usaha kelompok perempuan dari Pemerintah Kota Tangerang.', image: `${evidenceBase}narasumber-umkm.webp`, alt: 'Sertifikat Pemerintah Kota Tangerang untuk Asri Wahyuni sebagai narasumber pengembangan usaha kelompok perempuan.' },
  { label: 'SOCIAL COMMUNITY', title: 'Jejak Komunitas di Media Sosial', description: 'Dokumentasi akun komunitas dan kegiatan yang dibagikan Ayu.', image: `${evidenceBase}komunitas-instagram.webp`, alt: 'Tangkapan layar akun Instagram About Woman Community, Rumah Kawan Bunda, dan Wanita Cerdas Tangerang.' },
];

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
        <a href="#proof">Highlights</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="ayu-menu-toggle" type="button" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={23} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
      </button>
    </header>
    {menuOpen && <nav className="ayu-mobile-nav ayu-container" aria-label="Navigasi seluler">
      {[['About Me', '#about'], ['What I Do', '#work'], ['Expertise', '#expertise'], ['Highlights', '#proof'], ['Contact', '#contact']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}
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
        <div className="ayu-section-title"><span className="ayu-section-count">04 / PROFESSIONAL EXPERTISE</span><h2 id="ayu-expertise-heading">Professional <em>Expertise.</em></h2><p>Bidang yang Ayu tekuni dan tawarkan untuk kolaborasi.</p></div>
        <div className="ayu-expertise-list">
          {expertiseAreas.map(area => <article className="ayu-expertise-item" key={area.title}>
            <a className="ayu-expertise-thumbnail" href={area.image} target="_blank" rel="noopener noreferrer" aria-label={`Lihat dokumentasi ${area.title}`} title={`Lihat dokumentasi ${area.title}`}><img src={area.image} alt={`Dokumentasi bidang ${area.title} Ayu`} style={{ objectPosition: area.position }} loading="lazy" /></a>
            <div><h3>{area.title}</h3><p>{area.description}</p></div>
          </article>)}
        </div>
        <div className="ayu-expertise-grid ayu-expertise-bottom">
          <div><p className="ayu-expertise-lead">Lebih dari satu tahun di dunia bisnis dan digital marketing.</p><p>Pengalaman dan sertifikasi kompetensi menjadi bekal Ayu untuk mengembangkan karya, usaha, dan peluang kolaborasi.</p></div>
          <div className="ayu-cert-list"><div className="ayu-cert-title">SERTIFIKASI KOMPETENSI BNSP</div>{skills.map((skill, i) => <div className="ayu-cert-row" key={skill}><span>0{i + 1}</span><strong>{skill}</strong><CheckCircle2 size={20} aria-hidden="true" /></div>)}</div>
        </div>
      </section>

      <section className="ayu-section ayu-proof" id="proof" aria-labelledby="ayu-proof-heading">
        <div className="ayu-container">
          <div className="ayu-section-title"><span className="ayu-section-count">05 / REAL MOMENTS</span><h2 id="ayu-proof-heading">Business & <em>Ventures.</em></h2><p>Dokumentasi langsung dari perjalanan konten, komunitas, dan pengembangan usaha Ayu. Ketuk gambar untuk melihat versi lengkapnya.</p></div>
          <div className="ayu-proof-grid">
            {proofGallery.map((proof, index) => <a className={`ayu-proof-card${index === 0 ? ' ayu-proof-card--featured' : ''}`} href={proof.image} target="_blank" rel="noopener noreferrer" key={proof.title} aria-label={`Buka foto: ${proof.title}`}>
              <div className="ayu-proof-photo"><img src={proof.image} alt={proof.alt} loading="lazy" /></div>
              <div className="ayu-proof-content"><span>{proof.label}</span><h3>{proof.title}</h3><p>{proof.description}</p><span className="ayu-proof-open">Lihat foto <ArrowUpRight size={16} aria-hidden="true" /></span></div>
            </a>)}
          </div>
        </div>
      </section>

      <section className="ayu-contact" id="contact" aria-labelledby="ayu-contact-heading">
        <div className="ayu-container ayu-contact-grid">
          <div><span className="ayu-small-label">06 / LET'S CONNECT</span><h2 id="ayu-contact-heading">Good ideas<br />start with <em>hello.</em></h2><p>Punya ide konten, ingin berdiskusi tentang beRAni, atau melihat peluang kolaborasi? Ceritakan ke Ayu.</p></div>
          <div className="ayu-contact-actions">{contactUrl && <a href={contactUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={22} /> Chat via WhatsApp <ArrowRight size={19} /></a>}{profile.email && <a href={`mailto:${profile.email}`}><Mail size={22} /> {profile.email} <ArrowUpRight size={19} /></a>}</div>
        </div>
      </section>
    </main>
    <footer className="ayu-footer ayu-container"><span>ASRI WAHYUNI · AYU</span><a href="#home">Back to top ↑</a><span>© {new Date().getFullYear()} PERSONAL BRAND</span></footer>
  </div>;
}
