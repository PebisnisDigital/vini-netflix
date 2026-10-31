import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Clapperboard, Mail, Menu, MessageCircle, Play, X } from 'lucide-react';
import { usePortfolio } from '../data/PortfolioContext';
import type { Project } from '../data/portfolio';
import './electronic-tiger.css';

const navigation = [
  { id: 'et-about', label: 'Our Studio' },
  { id: 'et-portfolio', label: 'Portfolio' },
  { id: 'et-brands', label: 'Our Brands' },
  { id: 'et-team', label: 'Our Team' },
  { id: 'et-contact', label: 'Contact' },
];

const brandIndex = [
  { code: '01', name: 'Noah & Inna™', className: 'et-brand-noah', anchor: 'et-noah', short: 'Faith. Character. Learning. Life Skills.' },
  { code: '02', name: 'The Evan AI', className: 'et-brand-evan', anchor: 'et-evan', short: 'Grow more capable, confident & intentional.' },
  { code: '03', name: 'Obsidian AI Films Studio', className: 'et-brand-oafs', anchor: 'et-oafs', short: 'Where AI creates. Stories endure.' },
];

const projectLinks = (index: number, project: Project, website: string) => {
  if (index === 0) return [
    { label: 'Watch Videos', url: project.github || 'https://www.youtube.com/@noahinna', icon: 'play' },
    { label: 'Listen to Songs', url: 'https://suno.com/@electronictigercreativestudio', icon: 'external' },
    { label: 'Official Website', url: website || 'https://www.noahinna.com', icon: 'external' },
  ];
  return [{ label: index === 1 ? 'Watch The Evan AI' : 'Explore OAFS Films', url: project.github || '', icon: 'play' }];
};

function SplitDescription({ text, projectIndex }: { text: string; projectIndex: number }) {
  const paragraphs = text.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  return (
    <div data-studio-edit={`project:${projectIndex}`} className="et-brand-copy">
      {paragraphs.map((paragraph, i) => (
        i === 0
          ? <p className="et-brand-manifesto" key={i}>{paragraph}</p>
          : <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}

function StudioImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img className={className} src={src} alt={alt} loading="lazy" decoding="async" />;
}

export default function ElectronicTigerStudio({ editorMode = false }: { editorMode?: boolean }) {
  const { profile, projects } = usePortfolio();
  const [mobileMenu, setMobileMenu] = useState(false);
  const brands = projects.filter((project) => project.genre !== 'Our Team').slice(0, 3);
  const team = projects.filter((project) => project.genre === 'Our Team');
  const paragraphs = profile.intro.split(/\n\s*\n/).filter(Boolean);
  const heroName = profile.displayName.trim().toUpperCase();
  const standardStudioName = heroName === 'ELECTRONIC TIGER CREATIVE STUDIO';
  const heroTagline = profile.tagline[0] || 'Ideas Into Creations. Creativity Without Boundaries.';
  const taglineBreak = heroTagline.indexOf('. ');
  const taglineOpening = taglineBreak < 0 ? heroTagline : heroTagline.slice(0, taglineBreak + 1);
  const taglineClosing = taglineBreak < 0 ? '' : heroTagline.slice(taglineBreak + 2);
  const contactWhatsApp = profile.whatsapp?.replace(/\D/g, '');
  const siteOrigin = profile.links.website || 'https://www.noahinna.com';
  const currentYear = new Date().getFullYear();

  return (
    <div className="et-studio">
      <div className="et-grain" aria-hidden="true" />
      <header className="et-header">
        <a className="et-wordmark" href="#et-home" aria-label="Electronic Tiger Creative Studio home">
          <span className="et-wordmark-icon">ET<span>✳</span></span>
          <span>ELECTRONIC TIGER<small>CREATIVE STUDIO</small></span>
        </a>
        <nav className="et-desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
        </nav>
        <a className="et-header-cta" href="#et-contact">LET'S CONNECT <ArrowUpRight size={15}/></a>
        <button className="et-menu-toggle" type="button" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu((value) => !value)}>
          {mobileMenu ? <X size={23}/> : <Menu size={23}/>}
        </button>
      </header>

      {mobileMenu && <nav className="et-mobile-nav" aria-label="Mobile navigation">
        {navigation.map((item) => <a key={item.id} href={`#${item.id}`} onClick={() => setMobileMenu(false)}>{item.label}</a>)}
      </nav>}

      <main>
        <section className="et-hero" id="et-home">
          <div className="et-hero-halo et-hero-halo-one" aria-hidden="true" />
          <div className="et-hero-halo et-hero-halo-two" aria-hidden="true" />
          <div className="et-container et-hero-grid">
            <motion.div className="et-hero-content" initial={editorMode ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="et-eyebrow" data-studio-edit="role"><span className="et-star">✳</span> {profile.role.toUpperCase()}</p>
              <h1 data-studio-edit="name">{standardStudioName ? <>ELECTRONIC<br/><span>TIGER</span><small>CREATIVE STUDIO</small></> : heroName}</h1>
              <div className="et-hero-rule" />
              <p className="et-hero-tagline" data-studio-edit="tagline">{taglineOpening}{taglineClosing && <><br/><em>{taglineClosing}</em></>}</p>
              <p className="et-hero-caption">We build original brands, meaningful stories, and imaginative digital experiences at the intersection of creativity and technology.</p>
              <div className="et-hero-actions">
                <a className="et-button et-button-gold" href="#et-portfolio">Explore Our Creations <ArrowUpRight size={18}/></a>
                <a className="et-text-button" href="#et-about">Discover the studio <ArrowDown size={16}/></a>
              </div>
            </motion.div>
            <motion.div className="et-hero-art" initial={editorMode ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: 0.15 }}>
              <div className="et-hero-orbit et-orbit-outer"/>
              <div className="et-hero-orbit et-orbit-inner"/>
              <div className="et-hero-logo" data-studio-edit="portrait">
                <StudioImage src={profile.portrait.src} alt={profile.portrait.alt} className="et-logo-image"/>
              </div>
              <div className="et-hero-satellite et-satellite-noah" aria-hidden="true">
                <StudioImage src={brands[0]?.image || '/clients/noahinna/noah-inna-brand.webp'} alt=""/>
              </div>
              <div className="et-hero-satellite et-satellite-film" aria-hidden="true">
                <StudioImage src={brands[2]?.image || '/clients/noahinna/obsidian-ai-brand.webp'} alt=""/>
              </div>
              <span className="et-orbit-note et-note-left">IMAGINE · CREATE</span>
              <span className="et-orbit-note et-note-right">INNOVATE · INSPIRE</span>
            </motion.div>
          </div>
          <div className="et-hero-bottom et-container"><span>ORIGINAL IDEAS. DISTINCTIVE WORLDS.</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <section className="et-section et-about" id="et-about">
          <div className="et-container">
            <div className="et-section-heading">
              <span className="et-section-index">01 / WHO WE ARE</span>
              <h2>Ideas deserve to become<br/><em>extraordinary creations.</em></h2>
            </div>
            <div className="et-about-grid">
              <div className="et-about-lead">
                <span className="et-gold-label">ABOUT ELECTRONIC TIGER CREATIVE STUDIO</span>
                <p>We don't just create content.<br/><strong>We build brands, stories, and ideas that have the power to endure.</strong></p>
                <div className="et-about-mark">ET<span>✳</span></div>
              </div>
              <div className="et-about-copy" data-studio-edit="bio">
                {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
            <div className="et-verb-strip">
              {['IMAGINE', 'CREATE', 'INNOVATE', 'INSPIRE'].map((verb, i) => <span key={verb}><small>0{i + 1}</small>{verb}</span>)}
            </div>
          </div>
        </section>

        <section className="et-section et-portfolio" id="et-portfolio">
          <div className="et-container">
            <div className="et-heading-row">
              <div className="et-section-heading">
                <span className="et-section-index">02 / THE CREATIVE UNIVERSE</span>
                <h2>Three worlds.<br/><em>One shared vision.</em></h2>
              </div>
              <p>Each creation has its own audience, personality, and purpose. Together, they express our belief in the power of meaningful ideas.</p>
            </div>
            <div className="et-portfolio-grid">
              {brands.map((project, i) => <motion.a className={`et-portfolio-card ${brandIndex[i]?.className || ''}`} href={`#${brandIndex[i]?.anchor || 'et-brands'}`} key={project.id}
                initial={editorMode ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <div data-studio-edit={`project:${i}`} className="et-portfolio-image">
                  <StudioImage src={project.image || ''} alt={`${project.title} brand artwork`}/>
                </div>
                <div className="et-portfolio-card-copy">
                  <span>CREATION {brandIndex[i]?.code || i + 1} <ArrowUpRight size={20}/></span>
                  <h3>{project.title}</h3>
                  <p>{project.genre}</p>
                  <small>{brandIndex[i]?.short || project.year}</small>
                </div>
              </motion.a>)}
            </div>
          </div>
        </section>

        <section className="et-section et-brand-universe" id="et-brands">
          <div className="et-container">
            <div className="et-section-heading et-centered">
              <span className="et-section-index">03 / BEHIND THE CREATIONS</span>
              <h2>Discover our <em>brands.</em></h2>
              <p>Every brand starts with a story worth telling.</p>
            </div>
            {brands.map((project, i) => <article id={brandIndex[i]?.anchor} className={`et-brand-feature ${i % 2 === 1 ? 'et-reversed' : ''}`} key={project.id}>
              <div className="et-feature-visual" data-studio-edit={`project:${i}`}>
                <span className="et-feature-number">{brandIndex[i]?.code}</span>
                <div className="et-feature-image">
                  <StudioImage src={project.image || ''} alt={`${project.title} official visual`}/>
                </div>
                <span className="et-feature-genre">{project.year}</span>
              </div>
              <div className="et-feature-content">
                <span className="et-gold-label">CREATIVE WORLD / {brandIndex[i]?.code}</span>
                <h3>{project.title}</h3>
                <p className="et-feature-category">{project.genre}</p>
                <SplitDescription text={project.logline} projectIndex={i}/>
                {i === 0 && project.stack.length > 0 && <div className="et-pillars">
                  <p className="et-gold-label">THE NOAH & INNA 7 PILLARS OF SUCCESS™</p>
                  <ol>{project.stack.map((item, index) => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol>
                </div>}
                <div className="et-feature-links">
                  {projectLinks(i, project, siteOrigin).filter((link) => link.url).map((link) => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.icon === 'play' ? <Play size={14} fill="currentColor"/> : <ArrowUpRight size={16}/>} {link.label}
                  </a>)}
                </div>
              </div>
            </article>)}
          </div>
        </section>

        <section className="et-ecosystem">
          <div className="et-container et-ecosystem-grid">
            <div>
              <span className="et-section-index">THE BIG PICTURE</span>
              <h2>One creative studio.<br/><em>Limitless possibilities.</em></h2>
              <p>Electronic Tiger Creative Studio is the creative home for three distinct worlds — educational entertainment, personal growth, and cinematic AI storytelling.</p>
              <div className="et-ecosystem-list">
                <span><b>01</b> NOAH & INNA™ <small>EDUCATION & ENTERTAINMENT</small></span>
                <span><b>02</b> THE EVAN AI <small>PERSONAL GROWTH & LEARNING</small></span>
                <span><b>03</b> OAFS <small>CINEMA & AI FILMMAKING</small></span>
              </div>
            </div>
            <div className="et-ecosystem-art">
              <StudioImage src="/clients/noahinna/brand-ecosystem.webp" alt="Diagram of Electronic Tiger Creative Studio and its three brands: Noah & Inna, The Evan AI, and OAFS"/>
            </div>
          </div>
        </section>

        <section className="et-section et-team" id="et-team">
          <div className="et-container">
            <div className="et-heading-row">
              <div className="et-section-heading">
                <span className="et-section-index">04 / THE PEOPLE BEHIND THE VISION</span>
                <h2>Meet <em>our team.</em></h2>
              </div>
              <p>Three minds working together to turn ideas into creative worlds.</p>
            </div>
            <div className="et-team-grid">
              {team.map((member, i) => <motion.div key={member.id} className="et-team-card"
                initial={editorMode ? false : { opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, delay: i * 0.1 }}>
                <div className="et-team-art" data-studio-edit={`project:${projects.indexOf(member)}`}>
                  {member.image && <StudioImage src={member.image} alt={`Illustrated studio artwork accompanying ${member.title}`}/>}
                  <span className="et-team-number">0{i + 1}</span>
                </div>
                <div className="et-team-info">
                  <h3>{member.title}</h3>
                  <p>{member.year}</p>
                  <small>Illustrated studio portrait</small>
                </div>
              </motion.div>)}
            </div>
            <p className="et-team-note">Team artwork is illustrative. Portraits can be replaced with verified photographs when available.</p>
          </div>
        </section>

        <section className="et-contact" id="et-contact">
          <div className="et-container et-contact-grid">
            <div>
              <span className="et-section-index">05 / CONNECT WITH US</span>
              <h2>Let's create<br/><em>something meaningful.</em></h2>
              <p>Have an idea, a creative collaboration, or simply want to connect? We'd love to hear from you.</p>
              <div className="et-contact-actions">
                {profile.email && <a className="et-button et-button-gold" href={`mailto:${profile.email}`}><Mail size={18}/> Email Our Studio</a>}
                {contactWhatsApp && <a className="et-button et-button-outline" href={`https://wa.me/${contactWhatsApp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> WhatsApp</a>}
              </div>
              {profile.email && <a className="et-email-plain" href={`mailto:${profile.email}`}>{profile.email}</a>}
            </div>
            <div className="et-contact-seal">
              <Clapperboard size={30}/>
              <span>IMAGINE.</span><span>CREATE.</span><span>INNOVATE.</span><span>INSPIRE.</span>
              <div>ET ✳</div>
            </div>
          </div>
        </section>
      </main>
      <footer className="et-footer">
        <div className="et-container">
          <a className="et-wordmark" href="#et-home"><span className="et-wordmark-icon">ET<span>✳</span></span><span>ELECTRONIC TIGER<small>CREATIVE STUDIO</small></span></a>
          <p>Ideas Into Creations. Creativity Without Boundaries.</p>
          <div><span>© {currentYear} Electronic Tiger Creative Studio</span><a href="#et-home">BACK TO TOP ↑</a></div>
        </div>
      </footer>
    </div>
  );
}
