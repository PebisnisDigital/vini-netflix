import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, BriefcaseBusiness,
  Check, ChevronLeft, ChevronRight, Clapperboard, FileImage, HeartHandshake,
  Image as ImageIcon, Menu, MessageCircle, MonitorPlay, PencilRuler, Play,
  QrCode, Share2, ShieldCheck, Smartphone, Sparkles, Star, Users, WandSparkles, X,
} from 'lucide-react';
import { getPortfolioServiceWhatsappUrl } from '../data/portfolioServiceCTA';

const whatsapp = getPortfolioServiceWhatsappUrl('https://pesonaflix.vercel.app/');
const mitraWhatsapp = 'https://wa.me/6282137523626?text=' +
  encodeURIComponent('Halo Teh Vini, saya ingin bertanya tentang program mitra PESONAFLIX dengan komisi 50%.');

function Rail({ title, children, autoPlay = false, className = '' }: {
  title: string; children: ReactNode; autoPlay?: boolean; className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const pauseUntil = useRef(0);
  const [active, setActive] = useState(0);

  function step() {
    const rail = railRef.current;
    if (!rail) return 320;
    const card = rail.firstElementChild as HTMLElement | null;
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || '16') : 320;
  }
  function move(direction: number, fromUser = true) {
    const rail = railRef.current;
    if (!rail) return;
    if (fromUser) pauseUntil.current = Date.now() + 12000;
    const atEnd = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 10;
    const atStart = rail.scrollLeft <= 10;
    if (direction > 0 && atEnd) rail.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction < 0 && atStart) rail.scrollTo({ left: rail.scrollWidth, behavior: 'smooth' });
    else rail.scrollBy({ left: direction * step(), behavior: 'smooth' });
  }
  useEffect(() => {
    if (!autoPlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && Date.now() >= pauseUntil.current) move(1, false);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  return (
    <div className={'lp-rail-shell ' + className}>
      <div className="lp-rail-control">
        <span className="lp-rail-hint"><span className="lp-live-dot" /> Geser untuk jelajahi</span>
        <div className="lp-rail-buttons">
          <button type="button" className="lp-circle-btn" aria-label={'Geser ' + title + ' ke kiri'} onClick={() => move(-1)}><ChevronLeft size={21} /></button>
          <button type="button" className="lp-circle-btn" aria-label={'Geser ' + title + ' ke kanan'} onClick={() => move(1)}><ChevronRight size={21} /></button>
        </div>
      </div>
      <div ref={railRef} className="lp-rail" role="region" aria-roledescription="carousel" aria-label={title} tabIndex={0}
        onScroll={() => { if (railRef.current) setActive(Math.round(railRef.current.scrollLeft / Math.max(step(), 1))); }}
        onMouseEnter={() => { pauseUntil.current = Date.now() + 12000; }}
        onFocusCapture={() => { pauseUntil.current = Date.now() + 12000; }}
        onPointerDown={() => { pauseUntil.current = Date.now() + 12000; }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        }}>
        {children}
      </div>
      <div className="lp-rail-indicator" aria-hidden="true"><span style={{ transform: 'translateX(' + Math.min(active, 5) * 18 + 'px)' }} /></div>
    </div>
  );
}

function Heading({ eyebrow, title, accent, description, aside }: {
  eyebrow: string; title: string; accent?: string; description?: string; aside?: ReactNode;
}) {
  return <div className="lp-section-heading"><div><p className="lp-eyebrow">{eyebrow}</p>
    <h2>{title} {accent && <span>{accent}</span>}</h2>
    {description && <p className="lp-section-description">{description}</p>}</div>{aside}</div>;
}

function WhatsAppButton({ label = 'Mau Dibuatin', href = whatsapp }: { label?: string; href?: string }) {
  return <a className="lp-cta-button" href={href} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /><span>{label}</span><ArrowRight size={19} /></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ['#tentang', 'Apa Itu'], ['#layanan', 'Layanan'], ['#contoh', 'Contoh'],
    ['#mitra', 'Mitra 50%'], ['#cara', 'Cara Pesan'],
  ];
  return <header className="lp-header">
    <a href="#beranda" className="lp-brand" aria-label="PESONAFLIX, kembali ke atas">PESONA<span>FLIX</span></a>
    <nav aria-label="Navigasi PESONAFLIX" className={'lp-nav ' + (open ? 'is-open' : '')}>
      {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="lp-nav-mobile-cta" href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Mau Dibuatin <ArrowUpRight size={17} /></a>
    </nav>
    <a className="lp-header-cta" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Mau Dibuatin <ArrowRight size={17} /></a>
    <button className="lp-menu-toggle" aria-expanded={open} aria-label={open ? 'Tutup menu' : 'Buka menu'} type="button" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>;
}

const offerings = [
  { icon: MonitorPlay, title: 'Web Personal Bergaya Serial', copy: 'Cerita diri, pengalaman, karya dan keahlian dibuat seperti halaman serial.', image: '/landing/portfolio-device.webp', alt: 'Contoh website personal sinematik pada laptop dan ponsel' },
  { icon: ImageIcon, title: 'Foto & Gambar Profesional', copy: 'Foto profil, ilustrasi aktivitas dan materi visual ditata dengan menarik.', image: '/clients/iis/karya-ipa.webp', alt: 'Contoh karya pembelajaran dalam portofolio guru' },
  { icon: PencilRuler, title: 'Kartu Karya yang Bisa Diedit', copy: 'Konten proyek, pengalaman, prestasi, dan keahlian bisa diperbarui.', image: '/clients/citra/edukasi-kesehatan.webp', alt: 'Contoh kegiatan edukasi perawat' },
  { icon: Smartphone, title: 'Nyaman di HP & Laptop', copy: 'Tampil responsif dan mudah dibuka melalui satu tautan pribadi.', image: '/landing/about-studio.webp', alt: 'Perempuan menggunakan laptop' },
];
const examples = [
  { name: 'TEH VINI', role: 'DIGITAL MARKETER', quote: 'Dari ide kecil, berdampak besar.', photo: '/assets/teh-vini-1100.webp', link: '/vini', style: 'vini', tag: 'PROFIL CONTOH' },
  { name: 'IIS', role: 'GURU SMP', quote: 'Setiap anak punya cerita belajar.', photo: '/clients/iis/foto-utama.webp', link: '/iis', style: 'iis', tag: 'DEMO FIKTIF' },
  { name: 'CITRA', role: 'PERAWAT', quote: 'Merawat dengan empati, sepenuh hati.', photo: '/clients/citra/foto-utama.webp', link: '/citra', style: 'citra', tag: 'DEMO FIKTIF' },
];
const bonuses = [
  { icon: FileImage, title: 'Poster Promosi Personal', copy: 'Contoh materi visual untuk mengenalkan link portofolio di status dan media sosial.', tone: 'rose' },
  { icon: QrCode, title: 'QR ke Portofolio', copy: 'Konsep QR untuk memudahkan orang membuka web dari kartu atau poster.', tone: 'blue' },
  { icon: BookOpen, title: 'Panduan Berbagi Link', copy: 'Ide mengenalkan portofolio ke rekan kerja, calon klien, dan jejaring.', tone: 'gold' },
  { icon: Share2, title: 'Materi Siap Dibagikan', copy: 'Contoh caption singkat untuk menceritakan karya dan pengalamanmu.', tone: 'purple' },
];
const sampleReviews = [
  { quote: 'Web saya terlihat lebih rapi dan profesional. Mudah dibagikan saat memperkenalkan diri.', from: 'Contoh redaksi pemilik usaha', tone: 'rose' },
  { quote: 'Portofolio saya terasa seperti cerita, bukan daftar pengalaman yang membosankan.', from: 'Contoh redaksi kreator', tone: 'blue' },
  { quote: 'Karya dan kegiatan mengajar saya punya tempat tersendiri yang enak dilihat.', from: 'Contoh redaksi guru', tone: 'gold' },
  { quote: 'Kalau ada pencapaian baru, bagian cerita profesional saya bisa diperbarui.', from: 'Contoh redaksi pekerja', tone: 'purple' },
];

export default function LandingPage() {
  return (
    <div className="lp-page">
      <Header />
      <main>
        <section id="beranda" className="lp-hero" aria-labelledby="lp-hero-title">
          <div className="lp-hero-background" aria-hidden="true" />
          <div className="lp-hero-people" aria-hidden="true">
            <img className="lp-hero-person lp-hero-iis" src="/clients/iis/foto-utama.webp" alt="" />
            <img className="lp-hero-person lp-hero-citra" src="/clients/citra/foto-utama.webp" alt="" />
            <img className="lp-hero-person lp-hero-vini" src="/assets/teh-vini-1100.webp" alt="" />
            <span className="lp-person-label lp-person-label-iis"><b>IIS</b><small>GURU SMP</small></span>
            <span className="lp-person-label lp-person-label-citra"><b>CITRA</b><small>PERAWAT</small></span>
            <span className="lp-person-label lp-person-label-vini"><b>TEH VINI</b><small>DIGITAL MARKETER</small></span>
          </div>
          <div className="lp-container lp-hero-inner">
            <div className="lp-hero-copy">
              <p className="lp-eyebrow">WEB PORTOFOLIO ALA SERIAL</p>
              <h1 id="lp-hero-title">BUKAN CUMA CV.<br />INI CERITA <span>KAMU.</span></h1>
              <p className="lp-hero-subtitle">Profesi apa pun layak punya panggung sendiri.</p>
              <p className="lp-hero-description">Tampilkan perjalanan, karya, dan pencapaianmu dalam bentuk website portofolio yang sinematik, personal, dan berkesan — seperti serial favoritmu.</p>
              <div className="lp-hero-actions"><WhatsAppButton /><a className="lp-secondary-button" href="#contoh"><Play size={17} fill="currentColor" /> Lihat Contoh</a></div>
              <div className="lp-hero-points"><span><BadgeCheck /> Tampilan profesional</span><span><Share2 /> Mudah dibagikan</span><span><Star /> Lebih berkesan</span></div>
            </div>
          </div>
          <a className="lp-scroll-cue" href="#tentang">Jelajahi ceritanya <ArrowDown size={15} /></a>
        </section>

        <section id="tentang" className="lp-section lp-about">
          <div className="lp-container lp-about-grid">
            <div className="lp-about-image"><img src="/landing/about-studio.webp" alt="Ilustrasi wanita menyusun portofolio personal menggunakan laptop" loading="lazy" /><span><Clapperboard size={16} /> YOUR STORY · YOUR SERIES</span></div>
            <div className="lp-about-copy"><p className="lp-eyebrow">KENALAN DULU, YUK</p><h2>APA ITU <span>PESONAFLIX?</span></h2>
              <p>PESONAFLIX adalah layanan pembuatan web portofolio personal bergaya serial. Cerita diri, profesi, pengalaman, karya, dan keahlian dirangkum dalam satu tautan yang berkesan.</p>
              <h3>KENAPA MENARIK?</h3>
              <div className="lp-benefits">
                <div><BriefcaseBusiness /><strong>Lebih Profesional</strong><span>Menampilkan diri dengan rapi dan meyakinkan.</span></div>
                <div><Share2 /><strong>Mudah Dibagikan</strong><span>Satu link untuk karya, profil dan pengalaman.</span></div>
                <div><Sparkles /><strong>Lebih Berkesan</strong><span>Seperti serial favorit, ceritamu makin hidup.</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="layanan" className="lp-section lp-container lp-offerings">
          <Heading eyebrow="SEMUA DIKEMAS UNTUKMU" title="YANG KAMI" accent="BUATKAN" description="Web, foto, kartu cerita, dan pengalaman personal dalam satu layanan." />
          <Rail title="Layanan PESONAFLIX" autoPlay>
            {offerings.map(({ icon: Icon, ...item }) => <article className="lp-offer-card" key={item.title}>
              <div className="lp-offer-image"><img src={item.image} alt={item.alt} loading="lazy" /><span><Icon size={20} /></span></div>
              <div className="lp-offer-info"><h3>{item.title}</h3><p>{item.copy}</p></div>
            </article>)}
          </Rail>
        </section>

        <section id="web" className="lp-section lp-web">
          <div className="lp-container lp-web-grid">
            <div><p className="lp-eyebrow">01 / WEB PERSONAL</p><h2>WEB PRIBADI,<br /><span>RASA SERIAL.</span></h2>
              <p>Bukan cuma nama dan biodata. Ada cerita pembuka, perjalanan, karya, keahlian, hingga momen berharga yang disusun dalam kartu sinematik.</p>
              <ul className="lp-checklist"><li><Check /> Halaman personal dengan namamu</li><li><Check /> Desain ala Netflix yang nyaman di HP</li><li><Check /> Kartu karya, prestasi, dan pengalaman</li><li><Check /> Konten bisa diperbarui saat diperlukan</li></ul>
              <a className="lp-text-link" href="/vini" target="_blank" rel="noopener noreferrer">Coba portofolio Teh Vini <ArrowUpRight size={18} /></a>
            </div>
            <a className="lp-web-image" href="/vini" target="_blank" rel="noopener noreferrer" aria-label="Buka contoh web portofolio Teh Vini"><img src="/landing/portfolio-device.webp" alt="Ilustrasi web bergaya serial di laptop dan ponsel" loading="lazy" /><span><Play size={16} fill="currentColor" /> Buka contoh web <ArrowUpRight size={16} /></span></a>
          </div>
        </section>

        <section id="foto" className="lp-section lp-container lp-photos">
          <Heading eyebrow="02 / FOTO DAN VISUAL" title="GAMBARNYA JUGA" accent="DIBIKIN MENARIK" description="Foto dan gambar pendukung dipilih, diolah, dan ditata sebagai bagian dari kisah profesionalmu." />
          <Rail title="Contoh visual profesi">
            <article className="lp-photo-card lp-photo-portrait"><img src="/assets/teh-vini-1100.webp" alt="Contoh foto profil Teh Vini" loading="lazy" /><div><strong>FOTO PROFIL</strong><span>Karakter personal menonjol</span></div></article>
            <article className="lp-photo-card"><img src="/clients/iis/karya-literasi.webp" alt="Contoh ilustrasi kegiatan literasi guru" loading="lazy" /><div><strong>FOTO KEGIATAN</strong><span>Cerita profesi terasa hidup</span></div></article>
            <article className="lp-photo-card"><img src="/clients/citra/pelayanan-pasien.webp" alt="Contoh ilustrasi pelayanan perawat" loading="lazy" /><div><strong>KARTU PENGALAMAN</strong><span>Karya dan momen lebih berkesan</span></div></article>
            <article className="lp-photo-card lp-photo-portrait lp-photo-iis"><img src="/clients/iis/foto-utama.webp" alt="Contoh potret ilustratif seorang guru" loading="lazy" /><div><strong>VISUAL PROFESI</strong><span>Dibuat sesuai bidangmu</span></div></article>
          </Rail>
          <p className="lp-disclaimer">*Foto contoh Iis dan Citra adalah ilustrasi AI untuk profil demo fiktif. Hasil klien akan disesuaikan dengan materi dan persetujuan yang diberikan.</p>
        </section>

        <section id="mitra" className="lp-section lp-affiliate">
          <div className="lp-affiliate-background" aria-hidden="true" />
          <div className="lp-container lp-affiliate-inner">
            <p className="lp-eyebrow">03 / PELUANG MITRA</p><h2>JADI MITRA,<br />DAPAT KOMISI <span>50%</span></h2>
            <p>Rekomendasikan PESONAFLIX ke teman, rekan kerja, atau komunitasmu. Kalau rekomendasimu menghasilkan pesanan yang berhasil, kamu berpeluang menerima komisi 50% sesuai ketentuan program.</p>
            <div className="lp-affiliate-points"><span><Users size={18} /> Rekomendasikan jasa</span><span><HeartHandshake size={18} /> Pesanan berhasil</span><span><BadgeCheck size={18} /> Komisi 50%</span></div>
            <WhatsAppButton label="Tanya Program Mitra" href={mitraWhatsapp} />
            <small>Detail harga, syarat program, dan pembayaran komisi dikonfirmasi langsung bersama Teh Vini.</small>
          </div>
        </section>

        <section id="bonus" className="lp-section lp-container lp-bonuses">
          <Heading eyebrow="04 / TAMBAHAN UNTUKMU" title="BONUS" accent="EKSTRA" description="Contoh materi tambahan yang dapat melengkapi webmu. Isi bonus final akan dikonfirmasi saat memesan." />
          <Rail title="Contoh bonus PESONAFLIX">
            {bonuses.map(({ icon: Icon, ...item }, index) => <article className={'lp-bonus-card lp-tone-' + item.tone} key={item.title}>
              <div className="lp-bonus-art"><Icon size={68} strokeWidth={1.3} /></div><div className="lp-bonus-body"><small>CONTOH BONUS 0{index + 1}</small><h3>{item.title}</h3><p>{item.copy}</p></div>
            </article>)}
          </Rail>
        </section>

        <section id="contoh" className="lp-section lp-container lp-examples">
          <Heading eyebrow="05 / SUDAH ADA CONTOHNYA" title="LIHAT" accent="PORTOFOLIONYA" description="Klik cover-nya untuk menjelajahi halaman asli. Ini demo website yang bisa dibuka." aside={<a className="lp-text-link lp-heading-link" href="/vini" target="_blank" rel="noopener noreferrer">Mulai dari Vini <ArrowUpRight size={18} /></a>} />
          <Rail title="Contoh website PESONAFLIX" autoPlay>
            {examples.map((person) => <a className={'lp-example-card lp-example-' + person.style} href={person.link} target="_blank" rel="noopener noreferrer" key={person.name}>
              <span className="lp-example-tag">{person.tag}</span><img src={person.photo} alt={'Foto ' + person.name + ', contoh web ' + person.role.toLowerCase()} loading="lazy" />
              <div className="lp-example-info"><h3>{person.name}</h3><strong>{person.role}</strong><p>“{person.quote}”</p><span className="lp-example-open"><Play size={15} fill="currentColor" /> Buka Web <ArrowUpRight size={15} /></span></div>
            </a>)}
          </Rail>
          <p className="lp-disclaimer">Iis dan Citra merupakan tokoh demo fiktif; data pekerjaan, pendidikan, dan prestasinya hanya simulasi.</p>
        </section>

        <section id="ulasan" className="lp-section lp-reviews"><div className="lp-container">
          <Heading eyebrow="06 / GAMBARAN PENGALAMAN" title="CONTOH" accent="TESTIMONI" description="Simulasi bagaimana ulasan bisa ditampilkan. Ini belum merupakan ulasan pelanggan sungguhan." />
          <p className="lp-review-notice"><ShieldCheck size={18} /> SEMUA KUTIPAN DI BAWAH HANYA CONTOH REDAKSI, BUKAN TESTIMONI NYATA.</p>
          <Rail title="Simulasi testimoni" autoPlay>
            {sampleReviews.map((review, index) => <article className={'lp-review-card lp-tone-' + review.tone} key={review.from}>
              <div className="lp-review-stars" aria-hidden="true">{[1, 2, 3, 4, 5].map(n => <Star size={14} fill="currentColor" key={n} />)}</div>
              <p>“{review.quote}”</p>
              <div className="lp-review-by"><span>{index + 1}</span><div><strong>Simulasi ulasan {index + 1}</strong><small>{review.from}</small></div></div>
            </article>)}
          </Rail>
        </div></section>

        <section id="cara" className="lp-section lp-container lp-steps">
          <Heading eyebrow="07 / MUDAH DARI AWAL" title="CARA" accent="PESAN" description="Cukup cerita lewat WhatsApp. Tim PESONAFLIX yang menyiapkan websitenya." />
          <div className="lp-steps-grid">
            <div><span>01</span><MessageCircle size={34} /><h3>Ceritakan di WA</h3><p>Sampaikan profesi, cerita diri, kebutuhan, dan foto yang ingin digunakan.</p></div>
            <div><span>02</span><WandSparkles size={34} /><h3>Kami Buatkan</h3><p>Tim menyusun cerita, kartu, dan visual sesuai materi yang disepakati.</p></div>
            <div><span>03</span><MonitorPlay size={34} /><h3>Web Siap Tayang</h3><p>Setelah diperiksa dan disetujui, halamanmu siap dibagikan.</p></div>
          </div>
        </section>

        <section id="pesan" className="lp-final">
          <div className="lp-container lp-final-grid"><div className="lp-final-portrait"><img src="/assets/teh-vini-1100.webp" alt="Teh Vini mengajak membuat web portofolio personal" loading="lazy" /></div>
            <div className="lp-final-content"><p className="lp-eyebrow">KISAHMU LAYAK DITAMPILKAN</p><p className="lp-final-brand">PESONA<span>FLIX</span></p><h2>MAU JUGA<br /><span>DIBUATIN?</span></h2><p>Saatnya cerita kamu punya panggung sendiri.</p><WhatsAppButton /><small><MessageCircle size={15} /> Chat langsung dengan Teh Vini</small></div>
          </div>
        </section>
      </main>
      <footer className="lp-footer"><div className="lp-container"><div className="lp-footer-top"><a href="#beranda" className="lp-brand">PESONA<span>FLIX</span></a><nav aria-label="Navigasi footer"><a href="#tentang">Tentang</a><a href="#layanan">Layanan</a><a href="#contoh">Contoh</a><a href="#mitra">Mitra</a><a href="#pesan">Kontak</a></nav></div><div className="lp-footer-bottom"><span>© 2026 PESONAFLIX. Semua profesi punya cerita.</span><span>Profil demo dan contoh testimoni ditandai sebagai simulasi.</span><a href="/studio">Studio</a></div></div></footer>
    </div>
  );
}
