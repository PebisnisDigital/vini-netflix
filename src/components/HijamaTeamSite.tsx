import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check,
  ChevronDown, CircleHelp, Clock3, ExternalLink, HeartHandshake, Leaf,
  MapPin, Menu, MessageCircle, Play, ShieldCheck, ShoppingBag, Users, X,
} from 'lucide-react';
import { usePortfolio } from '../data/PortfolioContext';
import './hijama-team.css';

const whatsappNumber = '6589567799';
const whatsappUrl = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
const bookingUrl = whatsappUrl('Assalamualaikum Nur Ain. Saya lihat laman rasmi HijamaTeam dan ingin bertanya tentang rawatan bekam serta slot janji temu.');
const pricingUrl = whatsappUrl('Assalamualaikum Nur Ain. Boleh kongsikan harga terkini dan pilihan rawatan bekam di HijamaTeam?');
const youtubeUrl = 'https://www.youtube.com/@hijamateam';
const facebookUrl = 'https://www.facebook.com/ainhassan/';
const shopeeUrl = 'https://sg.shp.ee/BxLda9LH';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Blk%20429%20Bukit%20Panjang%20Ring%20Road%20%2307-715%20Singapore%20670429';

const navigation = [
  { title: 'Tentang Kami', href: '#tentang' },
  { title: 'Rawatan', href: '#rawatan' },
  { title: 'Pusat Ilmu', href: '#ilmu' },
  { title: 'Pasukan', href: '#pasukan' },
  { title: 'Lokasi', href: '#lokasi' },
];

const principles = [
  { icon: Users, number: '01', title: 'Ruang yang berasingan', description: 'Sesi untuk lelaki dan wanita dijalankan di bilik rawatan berasingan, dengan perhatian terhadap privasi pelanggan.' },
  { icon: ShieldCheck, number: '02', title: 'Amalan kebersihan', description: 'HijamaTeam menyatakan bahawa peralatan mereka melalui proses pensterilan dan lancet digunakan sekali sahaja.' },
  { icon: HeartHandshake, number: '03', title: 'Komunikasi peribadi', description: 'Tanyakan pilihan sesi, keadaan kesihatan dan persediaan terlebih dahulu sebelum menetapkan tarikh kunjungan.' },
];

const questions = [
  {
    question: 'Apakah itu bekam darah (hijamah)?',
    answer: 'Bekam darah, atau wet cupping, ialah amalan tradisional yang menggunakan sedutan cawan pada kulit serta tusukan kecil untuk mengeluarkan sedikit darah. Ia berbeza daripada bekam kering yang tidak melibatkan tusukan kulit.',
  },
  {
    question: 'Adakah bekam boleh menyembuhkan semua penyakit?',
    answer: 'Tidak. Keberkesanan bekam bagi kebanyakan keadaan kesihatan belum disokong bukti saintifik yang kukuh. Ia tidak patut menggantikan pemeriksaan, ubat atau rawatan yang disyorkan oleh doktor.',
  },
  {
    question: 'Apakah perkara yang perlu dimaklumkan sebelum sesi?',
    answer: 'Beritahu terapis jika anda mempunyai penyakit sedia ada, masalah pendarahan, anemia, masalah kulit, sedang hamil atau mengambil ubat termasuk pencair darah. Dapatkan nasihat doktor dahulu jika anda tidak pasti sama ada prosedur ini sesuai.',
  },
  {
    question: 'Adakah terdapat kesan sampingan?',
    answer: 'Bekam boleh meninggalkan tanda atau perubahan warna kulit sementara. Kesan lain yang boleh berlaku termasuk parut, luka, jangkitan dan kehilangan darah. Kebersihan peralatan serta saringan keadaan kesihatan amat penting.',
  },
  {
    question: 'Bagaimanakah cara membuat janji temu?',
    answer: 'Hubungi Nur Ain melalui WhatsApp di +65 8956 7799. Nyatakan rawatan yang ingin ditanyakan serta tarikh pilihan. Harga, masa dan ketersediaan slot akan disahkan terus oleh pasukan HijamaTeam.',
  },
];

function SectionIntro({ eyebrow, title, children, light = false }: { eyebrow: string; title: string; children?: React.ReactNode; light?: boolean }) {
  return <div className={`ht-section-intro${light ? ' ht-intro-light' : ''}`}>
    <p className="ht-kicker"><span className="ht-kicker-line" />{eyebrow}</p>
    <h2>{title}</h2>
    {children && <p className="ht-section-summary">{children}</p>}
  </div>;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return <a href="#utama" className={`ht-brand${footer ? ' ht-brand-footer' : ''}`} aria-label="HijamaTeam — Kembali ke atas">
    <span className="ht-brand-symbol" aria-hidden="true"><span>H</span><i /></span>
    <span className="ht-brand-type"><strong>HIJAMA<span>TEAM</span></strong><small>BEKAM DARAH · SINGAPURA</small></span>
  </a>;
}

export default function HijamaTeamSite({ editorMode = false }: { editorMode?: boolean }) {
  const { profile, projects } = usePortfolio();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return <div className="ht-site">
    <div className="ht-topline"><span><span className="ht-live-dot" /> BERKHIDMAT DI SINGAPURA SEJAK 2009</span><a href={bookingUrl} target="_blank" rel="noopener noreferrer">HUBUNGI NUR AIN <ArrowUpRight size={13} /></a></div>

    <header className="ht-header">
      <div className="ht-shell ht-header-inner">
        <Brand />
        <nav className="ht-desktop-nav" aria-label="Navigasi utama">
          {navigation.map((item) => <a href={item.href} key={item.href}>{item.title}</a>)}
        </nav>
        <a className="ht-nav-book" href={bookingUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Buat Janji Temu <ArrowUpRight size={16} /></a>
        <button className="ht-mobile-toggle" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      {menuOpen && <nav className="ht-mobile-nav" aria-label="Navigasi mudah alih">
        {navigation.map((item) => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.title}<ArrowUpRight size={15} /></a>)}
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Buat Janji Temu <MessageCircle size={16} /></a>
      </nav>}
    </header>

    <main>
      <section className="ht-hero" id="utama">
        <div className="ht-hero-image"><img src={profile.portrait.src} alt={profile.portrait.alt} fetchPriority="high" /></div>
        <div className="ht-hero-overlay" />
        <div className="ht-shell ht-hero-content">
          <motion.div initial={editorMode ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="ht-hero-eyebrow"><span>✦</span> SEJAK 2009 <span className="ht-eyebrow-rule" /> BUKIT PANJANG, SINGAPURA</p>
            <h1>Tradisi bekam.<br /><em>Diiringi</em> <span>perhatian.</span></h1>
            <p className="ht-hero-description" data-studio-edit="bio">Kenali perkhidmatan bekam darah oleh HijamaTeam — sebuah pasukan keluarga yang berkongsi pengalaman, maklumat dan ruang rawatan untuk lelaki serta wanita.</p>
            <div className="ht-hero-actions">
              <a className="ht-button ht-button-gold" href={bookingUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Buat Janji Temu <ArrowUpRight size={18} /></a>
              <a className="ht-button ht-button-ghost" href="#rawatan">Terokai Rawatan <ArrowDown size={18} /></a>
            </div>
          </motion.div>
        </div>
        <div className="ht-hero-caption"><span>01 — HIJAMATEAM</span><span>GAMBAR ILUSTRASI PERALATAN BEKAM</span></div>
        <div className="ht-hero-scroll" aria-hidden="true">TATAL KE BAWAH <span /></div>
      </section>

      <div className="ht-credentials-bar">
        <div className="ht-shell ht-credentials-inner">
          <div><strong>2009</strong><span>BERMULANYA PERKHIDMATAN</span></div>
          <div><Users size={23} /><span>TERAPIS LELAKI & WANITA</span></div>
          <div><MapPin size={23} /><span>BUKIT PANJANG, SINGAPURA</span></div>
          <a href="#tentang">KENALI KAMI <ArrowUpRight size={16} /></a>
        </div>
      </div>

      <section className="ht-about ht-section" id="tentang">
        <div className="ht-shell ht-about-grid">
          <div className="ht-about-visual">
            <div className="ht-about-art" aria-hidden="true"><span className="ht-art-ring ht-ring-one" /><span className="ht-art-ring ht-ring-two" /><span className="ht-art-monogram">H<span>✦</span></span></div>
            <div className="ht-about-year"><span>SEJAK</span><strong>2009</strong><small>SINGAPURA</small></div>
            <p>Tradisi yang dipelajari. Pengalaman yang dikongsi.</p>
          </div>
          <div className="ht-about-copy">
            <SectionIntro eyebrow="01 / TENTANG HIJAMATEAM" title="Sebuah pasukan keluarga. Sebuah kisah yang bermula sejak 2009." light />
            <p data-studio-edit="bio">HijamaTeam ialah jenama yang dibangunkan oleh <strong>Hassan Bin Sulaiman</strong> dan anak perempuannya, <strong>Nur Ain Binte Hassan</strong>. Kedua-duanya memperkenalkan perkhidmatan bekam darah kepada pelanggan di Singapura.</p>
            <p>Nama “Hijama” membawa maksud bekam. Bagi pasukan ini, rawatan juga melibatkan penerangan yang jelas, komunikasi terbuka dan kerjasama pelanggan dalam penjagaan diri.</p>
            <a className="ht-inline-link" href="#pasukan">Kenali pasukan kami <ArrowUpRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="ht-services ht-section" id="rawatan">
        <div className="ht-shell">
          <div className="ht-services-heading">
            <SectionIntro eyebrow="02 / PERKHIDMATAN KAMI" title="Pilihan rawatan bekam darah.">Setiap kunjungan bermula dengan perbincangan. Sila sahkan harga, tempoh dan kesesuaian sesi dengan pasukan kami sebelum datang.</SectionIntro>
            <a className="ht-inline-link ht-link-light" href={pricingUrl} target="_blank" rel="noopener noreferrer">Tanya Harga Terkini <ArrowUpRight size={18} /></a>
          </div>
          <div className="ht-services-grid">
            {projects.slice(0, 3).map((project, index) => <motion.article className="ht-service-card" key={project.id} data-studio-edit={`project:${index}`} initial={editorMode ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ delay: index * 0.1, duration: 0.55 }}>
              <div className="ht-service-top"><span>RAWATAN 0{index + 1}</span><span className="ht-service-icon"><Leaf size={23} strokeWidth={1.25} /></span></div>
              <div className="ht-service-line-art" aria-hidden="true"><span /><span /><span /></div>
              <h3>{project.title}</h3>
              <p>{project.logline}</p>
              <a href={whatsappUrl(`Assalamualaikum Nur Ain. Saya ingin bertanya tentang ${project.title} di HijamaTeam.`)} target="_blank" rel="noopener noreferrer">Tanya Rawatan <ArrowUpRight size={18} /></a>
            </motion.article>)}
          </div>
          <p className="ht-service-note"><CircleHelp size={16} /> Rawatan berasaskan janji temu. Maklumat harga dan slot dipastikan secara langsung melalui WhatsApp.</p>
        </div>
      </section>

      <section className="ht-care ht-section">
        <div className="ht-shell">
          <div className="ht-care-heading"><SectionIntro eyebrow="03 / PENDEKATAN KAMI" title="Perkara kecil yang membawa makna besar." light /> <p>Ketahui apa yang boleh anda jangkakan apabila menghubungi HijamaTeam, daripada susunan bilik hingga amalan penggunaan peralatan.</p></div>
          <div className="ht-care-grid">
            {principles.map((item) => <div className="ht-care-item" key={item.number}><span className="ht-care-count">{item.number}</span><item.icon size={34} strokeWidth={1.35} /><h3>{item.title}</h3><p>{item.description}</p></div>)}
          </div>
          <div className="ht-process"><span>LANGKAH MUDAH</span><div><CalendarDays size={19} /> Hubungi kami</div><ArrowRight size={17} /><div><MessageCircle size={19} /> Bincang keperluan</div><ArrowRight size={17} /><div><Check size={19} /> Sahkan janji temu</div></div>
        </div>
      </section>

      <section className="ht-knowledge ht-section" id="ilmu">
        <div className="ht-shell ht-knowledge-grid">
          <div className="ht-knowledge-copy">
            <SectionIntro eyebrow="04 / PUSAT ILMU BEKAM" title="Lebih faham sebelum mencuba.">Maklumat yang jelas membantu anda bertanya soalan yang tepat dan membuat keputusan berdasarkan keadaan kesihatan sendiri.</SectionIntro>
            <div className="ht-knowledge-tile"><BookOpen size={27} strokeWidth={1.4} /><div><strong>Ilmu dahulu, keputusan kemudian.</strong><p>Bekam mempunyai risiko dan tidak menggantikan rawatan perubatan. Dapatkan nasihat doktor jika mempunyai masalah kesihatan atau sedang mengambil ubat.</p></div></div>
            <a className="ht-button ht-button-gold ht-video-button" href={youtubeUrl} target="_blank" rel="noopener noreferrer"><Play size={17} fill="currentColor" /> Tonton Video <ArrowUpRight size={17} /></a>
          </div>
          <div className="ht-faq" aria-label="Soalan lazim tentang bekam">
            <div className="ht-faq-heading"><span>SOALAN LAZIM</span><span>01 — 05</span></div>
            {questions.map((item, index) => <details key={item.question} className="ht-faq-item" open={index === 0}><summary><span className="ht-faq-number">0{index + 1}</span><span>{item.question}</span><ChevronDown size={21} /></summary><p>{item.answer}</p></details>)}
            <p className="ht-evidence-note">Rujukan keselamatan: <a href="https://www.nccih.nih.gov/health/cupping" target="_blank" rel="noopener noreferrer">NCCIH — Cupping <ExternalLink size={12}/></a></p>
          </div>
        </div>
      </section>

      <section className="ht-social ht-section">
        <div className="ht-shell ht-social-grid">
          <a className="ht-social-panel ht-social-video" href={youtubeUrl} target="_blank" rel="noopener noreferrer"><span className="ht-social-kind">HIJAMATEAM DI YOUTUBE <ArrowUpRight size={19} /></span><span className="ht-social-play"><Play size={30} fill="currentColor" /></span><h3>Ilmu bekam dalam bentuk video.</h3><p>Terokai penerangan, demonstrasi dan perkongsian daripada saluran HijamaTeam.</p><strong>Tonton Video <ArrowRight size={17}/></strong></a>
          <a className="ht-social-panel ht-social-shop" href={shopeeUrl} target="_blank" rel="noopener noreferrer"><span className="ht-social-kind">KEDAI DALAM TALIAN <ArrowUpRight size={19} /></span><span className="ht-shop-icon"><ShoppingBag size={36} strokeWidth={1.3}/></span><h3>Terokai kedai HijamaTeam.</h3><p>Lihat pilihan produk yang disenaraikan di kedai Shopee HijamaTeam. Semak butiran produk sebelum membeli.</p><strong>Buka Shopee <ArrowRight size={17}/></strong></a>
        </div>
      </section>

      <section className="ht-team ht-section" id="pasukan">
        <div className="ht-shell">
          <div className="ht-team-heading"><SectionIntro eyebrow="05 / PASUKAN HIJAMATEAM" title="Dua generasi. Satu komitmen." light /><p>Di sebalik nama HijamaTeam ialah gabungan bapa dan anak yang memperkenalkan perkhidmatan bekam darah di Singapura.</p></div>
          <div className="ht-team-grid">
            <article className="ht-team-card"><div className="ht-team-avatar ht-team-hassan" aria-label="Monogram H; bukan foto sebenar"><span>H</span></div><div><span>TERAPIS LELAKI</span><h3>Hassan Bin Sulaiman</h3><p>Pengasas bersama HijamaTeam, terlibat dalam perjalanan perkhidmatan sejak 2009.</p></div></article>
            <article className="ht-team-card"><div className="ht-team-avatar ht-team-ain" aria-label="Monogram NA; bukan foto sebenar"><span>NA</span></div><div><span>TERAPIS WANITA · HUBUNGAN PELANGGAN</span><h3>Nur Ain Binte Hassan</h3><p>Ahli pasukan HijamaTeam dan orang hubungan untuk pertanyaan serta janji temu.</p><a href={bookingUrl} target="_blank" rel="noopener noreferrer">Hubungi Nur Ain <ArrowUpRight size={16}/></a></div></article>
          </div>
        </div>
      </section>

      <section className="ht-location ht-section" id="lokasi">
        <div className="ht-shell ht-location-grid">
          <div>
            <SectionIntro eyebrow="06 / LOKASI & TEMPAHAN" title="Jumpa kami di Bukit Panjang.">Sesi rawatan dijalankan di Singapura. Sila hubungi Nur Ain dahulu untuk menyemak slot sebelum berkunjung.</SectionIntro>
            <div className="ht-address"><MapPin size={27} strokeWidth={1.3}/><div><strong>Lokasi Rawatan</strong><p>Blk 429 Bukit Panjang Ring Road<br/>#07-715, Singapore 670429</p></div></div>
            <div className="ht-address"><Clock3 size={27} strokeWidth={1.3}/><div><strong>Masa Kunjungan</strong><p>Mengikut slot janji temu yang disahkan oleh pasukan HijamaTeam.</p></div></div>
            <a className="ht-inline-link ht-link-light" href={mapsUrl} target="_blank" rel="noopener noreferrer">Lihat Arah Lokasi <ArrowUpRight size={17}/></a>
          </div>
          <div className="ht-location-card">
            <span className="ht-location-stamp">HUBUNGI KAMI</span>
            <MessageCircle size={40} strokeWidth={1.1}/>
            <h3>Mulakan dengan sebuah pertanyaan.</h3>
            <p>Tanyakan harga, jenis rawatan, persediaan atau masa yang sesuai untuk datang. Nur Ain ialah orang hubungan anda.</p>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/> WhatsApp Nur Ain <ArrowUpRight size={19}/></a>
            <span className="ht-location-phone">+65 8956 7799</span>
          </div>
        </div>
      </section>
    </main>

    <footer className="ht-footer">
      <div className="ht-shell">
        <div className="ht-footer-main"><div><Brand footer /><p>Perkhidmatan bekam darah dan perkongsian ilmu di Bukit Panjang, Singapura sejak 2009.</p></div><div className="ht-footer-links"><div><span>TEROKAI</span><a href="#tentang">Tentang Kami</a><a href="#rawatan">Rawatan</a><a href="#ilmu">Pusat Ilmu</a><a href="#lokasi">Lokasi</a></div><div><span>IKUTI KAMI</span><a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube <ArrowUpRight size={13}/></a><a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook Nur Ain <ArrowUpRight size={13}/></a><a href={shopeeUrl} target="_blank" rel="noopener noreferrer">Shopee <ArrowUpRight size={13}/></a></div></div></div>
        <p className="ht-footer-health">Penafian: Maklumat di laman ini adalah untuk pendidikan dan pertanyaan perkhidmatan sahaja, bukan diagnosis atau pengganti rawatan perubatan. Keberkesanan bekam bagi pelbagai keadaan belum dapat dipastikan; prosedur ini boleh membawa risiko. Berbincanglah dengan doktor tentang penjagaan kesihatan anda.</p>
        <div className="ht-footer-bottom"><span>© {currentYear} HijamaTeam. Hak cipta terpelihara.</span><span>DIHASILKAN UNTUK HIJAMATEAM</span><a href="#utama">Kembali ke atas ↑</a></div>
      </div>
    </footer>
    <a className="ht-floating-wa" href={bookingUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Nur Ain untuk janji temu"><MessageCircle size={26} fill="currentColor" strokeWidth={1.7} /><span>WhatsApp</span></a>
  </div>;
}
