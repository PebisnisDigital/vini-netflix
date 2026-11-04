import { useState, type ReactNode } from 'react';
import {
  ArrowDown, ArrowRight, BookOpen, Check, ChevronDown,
  Clock3, ExternalLink, HeartHandshake, Info, LockKeyhole,
  Leaf, MapPin, Menu, MessageCircle, Phone, Play, ShieldCheck,
  ShoppingBag, Sparkles, X,
} from 'lucide-react';
import './hijama-team.css';

const whatsapp = 'https://wa.me/6589567799?text=' + encodeURIComponent('Assalamualaikum HIJAMATEAM. Saya ingin bertanya tentang perkhidmatan bekam darah dan temujanji.');
const packageWhatsapp = (packageName: string) => 'https://wa.me/6589567799?text=' + encodeURIComponent(`Assalamualaikum HIJAMATEAM. Saya ingin bertanya tentang pakej ${packageName} dan jadual temujanji.`);
const mapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Block 429 Bukit Panjang Ring Road #07-715 Singapore 670429');

const packages = [
  { name: 'Bekam Setengah Badan', detail: 'Bahagian setengah badan', cups: '±17 cawan', duration: '30–40 minit', price: 'S$60', recommended: true },
  { name: 'Bekam Setengah Badan + Tangan', detail: 'Setengah badan dan tangan', cups: '±25 cawan', duration: '40–50 minit', price: 'S$70', recommended: false },
  { name: 'Bekam Badan & Kaki', detail: 'Bahagian badan dan kaki', cups: '±41 cawan', duration: '60–75 minit', price: 'S$110', recommended: false },
];

const articles = [
  {
    number: '01', topic: 'ASAS BEKAM', title: 'Pengenalan kepada bekam', time: '3 minit bacaan',
    text: 'Bekam merupakan amalan tradisional yang menggunakan cawan khas untuk menghasilkan sedutan pada permukaan kulit. Terdapat beberapa kaedah bekam dengan proses yang berbeza. Memahami kaedah, langkah dan perkara keselamatan membantu anda membuat pertanyaan yang lebih jelas sebelum mempertimbangkan sesuatu sesi.',
  },
  {
    number: '02', topic: 'WARISAN', title: 'Sejarah dan tradisi bekam', time: '3 minit bacaan',
    text: 'Amalan menggunakan cawan dan sedutan telah dikenali dalam pelbagai tradisi masyarakat. Istilah hijamah lazim digunakan dalam konteks Arab, manakala bekam ialah istilah yang biasa digunakan dalam bahasa Melayu. Sejarah dan amalan tradisi wajar difahami sebagai warisan budaya, bukan bukti bahawa sesuatu kaedah boleh merawat penyakit.',
  },
  {
    number: '03', topic: 'ILMU & SUNNAH', title: 'Bekam dalam konteks Sunnah', time: '4 minit bacaan',
    text: 'Bekam mempunyai tempat dalam perbincangan tentang amalan dan riwayat Islam. Menghormati konteks Sunnah tidak bermakna setiap orang sesuai menjalani prosedur. Pertimbangan kesihatan dan keselamatan tetap penting, khususnya jika anda mempunyai keadaan perubatan atau mengambil ubat tertentu.',
  },
  {
    number: '04', topic: 'KENALI JENIS', title: 'Jenis-jenis bekam', time: '3 minit bacaan',
    text: 'Bekam kering menggunakan sedutan pada kulit tanpa cucukan kecil. Bekam darah pula melibatkan sedutan serta cucukan-cucukan kecil pada permukaan kulit, maka ia mempunyai pertimbangan kebersihan dan keselamatan tambahan. Tanya penyedia perkhidmatan tentang jenis prosedur, peralatan dan kesesuaian sebelum membuat keputusan.',
  },
  {
    number: '05', topic: 'LANGKAH PROSEDUR', title: 'Bagaimana bekam darah dilakukan?', time: '4 minit bacaan',
    text: 'Bekam darah melibatkan penggunaan cawan khas untuk menghasilkan sedutan pada permukaan kulit. Prosedur ini turut melibatkan cucukan-cucukan kecil pada permukaan kulit menggunakan alat pencucuk automatik (lancing device) dan jarum kecil steril (disposable lancet) yang digunakan sekali sahaja. Penerangan dan peluang bertanya amat penting sebelum sesi bermula.',
  },
  {
    number: '06', topic: 'PERALATAN', title: 'Alat yang digunakan', time: '3 minit bacaan',
    text: 'Antara peralatan yang diterangkan oleh HIJAMATEAM ialah cawan khas, alat pencucuk automatik (lancing device) dan jarum kecil steril (disposable lancet). Jarum kecil steril digunakan sekali sahaja dan dibuang selepas penggunaan. Anda boleh bertanya tentang pengendalian peralatan, kebersihan permukaan dan pelupusan bahan terpakai.',
  },
  {
    number: '07', topic: 'KEUTAMAAN', title: 'Kebersihan dan keselamatan', time: '4 minit bacaan',
    text: 'Prosedur yang melibatkan kulit dan darah mempunyai risiko, termasuk perubahan warna kulit, pendarahan serta jangkitan. Penggunaan peralatan sesuai, kebersihan tangan, pengendalian bahan terpakai dan penerangan risiko perlu diberikan perhatian. Jangan teruskan sesi jika anda mempunyai keraguan tentang keselamatan; dapatkan nasihat profesional kesihatan terlebih dahulu.',
  },
  {
    number: '08', topic: 'SEBELUM SESI', title: 'Persediaan sebelum bekam', time: '3 minit bacaan',
    text: 'Sebelum membuat temujanji, maklumkan jika anda mempunyai penyakit atau keadaan kesihatan tertentu, masalah pendarahan, keadaan kulit, sejarah pengsan, atau sedang mengambil ubat. Jangan berhenti mengambil ubat yang dipreskripsikan semata-mata untuk menjalani bekam. Dapatkan nasihat profesional kesihatan jika anda tidak pasti tentang kesesuaian prosedur.',
  },
  {
    number: '09', topic: 'SELEPAS SESI', title: 'Penjagaan selepas bekam', time: '3 minit bacaan',
    text: 'Ikuti arahan penjagaan kawasan kulit yang diberikan selepas sesi. Pastikan kawasan yang terlibat bersih, elakkan menggaru atau mengganggunya dan perhatikan sebarang tanda luar biasa. Jika berlaku pendarahan berterusan, kemerahan yang merebak, bengkak, demam atau sakit yang semakin kuat, dapatkan penilaian perubatan dengan segera.',
  },
  {
    number: '10', topic: 'SOALAN & JAWAPAN', title: 'Soalan lazim mengenai bekam', time: '3 minit bacaan',
    text: 'Antara soalan yang wajar ditanya ialah: Apakah langkah-langkah sesi? Adakah peralatan digunakan sekali sahaja? Berapakah harga dan tempohnya? Apakah risiko dan siapa yang mungkin tidak sesuai? HIJAMATEAM mengalu-alukan pertanyaan sebelum tempahan, tanpa menjanjikan hasil kesihatan tertentu.',
  },
];

const faq = [
  { q: 'Apakah bekam darah?', a: 'Bekam darah ialah prosedur menggunakan cawan khas untuk sedutan pada kulit serta cucukan-cucukan kecil menggunakan alat pencucuk automatik dan jarum kecil steril yang digunakan sekali sahaja.' },
  { q: 'Adakah semua orang sesuai menjalani bekam?', a: 'Tidak. Kesesuaian bergantung pada keadaan individu. Jika anda mempunyai masalah kesihatan, mengambil ubat atau berasa ragu-ragu, dapatkan nasihat profesional kesihatan sebelum membuat temujanji.' },
  { q: 'Adakah bekam menggantikan rawatan doktor?', a: 'Tidak. Bekam bukan pengganti pemeriksaan, nasihat atau rawatan perubatan. Jangan hentikan rawatan atau ubat yang telah disarankan oleh doktor.' },
  { q: 'Bagaimana dengan kebersihan peralatan?', a: 'HIJAMATEAM menerangkan penggunaan jarum kecil steril (disposable lancet) yang digunakan sekali sahaja dan dibuang selepas penggunaan. Anda dialu-alukan bertanya lanjut tentang kebersihan dan pengendalian peralatan sebelum sesi.' },
  { q: 'Berapakah harga perkhidmatan?', a: 'Bekam Setengah Badan berharga S$60, Bekam Setengah Badan + Tangan S$70, dan Bekam Badan & Kaki S$110. Pemeriksaan darah termasuk dalam setiap pakej tanpa caj berasingan. Jumlah cawan dan tempoh sesi adalah anggaran.' },
  { q: 'Bagaimana cara membuat temujanji?', a: 'Hubungi Nur Ain melalui WhatsApp di +65 8956 7799. Nyatakan pertanyaan anda serta tarikh dan masa yang diingini. Waktu operasi ialah setiap hari, 9.00 pagi hingga 8.00 malam, tertakluk kepada ketersediaan temujanji.' },
];

function Mark({ light = false }: { light?: boolean }) {
  return <a className={`ht-mark ${light ? 'ht-mark--light' : ''}`} href="#utama" aria-label="HIJAMATEAM, ke bahagian utama">
    <img className="ht-mark__logo" src="/clients/hijamateam/logo-rasmi.webp" width="1085" height="475" alt="Logo rasmi HIJAMATEAM" />
    <span className="ht-mark__tagline">Mengenali Bekam, Menghayati Sunnah.</span>
  </a>;
}

function WhatsAppButton({ children, href = whatsapp, outlined = false }: { children: ReactNode; href?: string; outlined?: boolean }) {
  return <a className={`ht-button ${outlined ? 'ht-button--outline' : ''}`} href={href} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" />{children}<ArrowRight size={16} aria-hidden="true" /></a>;
}

export default function HijamaTeamSite(_props: { editorMode?: boolean } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const nav = [
    { label: 'Tentang Kami', href: '#tentang' },
    { label: 'Perkhidmatan', href: '#perkhidmatan' },
    { label: 'Proses & Keselamatan', href: '#proses' },
    { label: 'Pusat Ilmu', href: '#ilmu' },
    { label: 'Hubungi Kami', href: '#hubungi' },
  ];

  return <div className="hijamateam-site" id="utama">
    <div className="ht-topline"><span><span className="ht-topline__dot" /> Berkhidmat di Bukit Panjang, Singapura sejak 2009</span><span>Setiap hari · 9.00 pagi – 8.00 malam</span></div>
    <header className="ht-header">
      <div className="ht-container ht-header__inner">
        <Mark />
        <nav className="ht-desktop-nav" aria-label="Navigasi utama">{nav.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
        <div className="ht-header__actions"><a className="ht-header__wa" href={whatsapp} target="_blank" rel="noopener noreferrer">Buat Pertanyaan <ArrowRight size={15} /></a><button className="ht-menu-button" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </div>
      {menuOpen && <nav className="ht-mobile-nav" aria-label="Navigasi mudah alih">{nav.map(item => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowRight size={16}/></a>)}</nav>}
    </header>

    <main>
      <section className="ht-hero" aria-labelledby="ht-hero-title">
        <div className="ht-hero__image" role="img" aria-label="Ilustrasi suasana ruang perkhidmatan dengan peralatan cawan bekam dan tuala bersih" />
        <div className="ht-hero__veil" />
        <div className="ht-container ht-hero__inner">
          <div className="ht-hero__content">
            <div className="ht-eyebrow ht-eyebrow--light"><span className="ht-eyebrow__line" /> SELAMAT DATANG KE HIJAMATEAM</div>
            <h1 id="ht-hero-title">Mengenali Bekam,<br /><em>Menghayati Sunnah.</em></h1>
            <p>Sejak 2009, kami memperkenalkan bekam darah melalui penerangan yang jelas, proses yang teratur serta perhatian terhadap kebersihan, keselamatan dan keselesaan pelanggan.</p>
            <div className="ht-hero__buttons"><WhatsAppButton>Tempah Temujanji</WhatsAppButton><a className="ht-text-button" href="#ilmu">Terokai Pusat Ilmu <ArrowDown size={17} /></a></div>
            <div className="ht-hero__line"><span>01 / 03</span><span className="ht-hero__rule"/><span>JENAMA · PERKHIDMATAN · ILMU</span></div>
          </div>
        </div>
        <div className="ht-hero__caption">Imej ilustrasi — bukan foto premis sebenar</div>
      </section>

      <section className="ht-trust" aria-label="Keutamaan HIJAMATEAM"><div className="ht-container ht-trust__grid">
        <div><Clock3 size={26} /><span><strong>Sejak tahun 2009</strong><small>Pengalaman perkhidmatan bekam</small></span></div>
        <div><ShieldCheck size={26} /><span><strong>Kebersihan & keselamatan</strong><small>Perkara utama dalam penerangan kami</small></span></div>
        <div><BookOpen size={26} /><span><strong>Pusat ilmu bekam</strong><small>Maklumat sebelum membuat keputusan</small></span></div>
        <div><MapPin size={26} /><span><strong>Bukit Panjang</strong><small>Singapura 670429</small></span></div>
      </div></section>

      <section className="ht-section ht-about" id="tentang" aria-labelledby="ht-about-title"><div className="ht-container ht-about__grid">
        <div className="ht-about__visual"><div className="ht-about__arch"><img className="ht-about__portrait" src="/clients/hijamateam/foto-perkongsian.webp" alt="Potret yang dikongsi oleh HIJAMATEAM, memegang botol kecil" loading="lazy" width="822" height="822" /><span className="ht-about__arch-label">KOLEKSI HIJAMATEAM<br/>SINGAPURA</span></div><div className="ht-about__note"><Leaf size={22}/><span>Pengalaman disertai penerangan yang teliti.</span></div></div>
        <div className="ht-about__copy"><div className="ht-eyebrow">KISAH KAMI <span className="ht-eyebrow__line" /></div><h2 id="ht-about-title">Lebih daripada<br /><em>sebuah perkhidmatan.</em></h2><p>HIJAMATEAM ialah jenama perkhidmatan bekam darah yang diperkenalkan oleh <strong>Hassan dan Nur Ain</strong> di Bukit Panjang, Singapura. Perjalanan ini bermula pada tahun 2009.</p><p>Kami percaya setiap pelanggan berhak memahami prosedur sebelum membuat keputusan. Oleh itu, kami memberi perhatian kepada penerangan, pertanyaan, pengendalian peralatan dan pengalaman pelanggan yang tenang serta teratur.</p><div className="ht-about__quote">“Kami mahu anda mengenali prosesnya dahulu, kemudian membuat pilihan dengan maklumat yang jelas.”</div><a className="ht-inline-link" href="#perkhidmatan">Kenali perkhidmatan kami <ArrowRight size={17}/></a></div>
      </div></section>

      <section className="ht-privacy" aria-labelledby="ht-privacy-title"><div className="ht-container ht-privacy__grid">
        <div className="ht-privacy__symbol" aria-hidden="true"><LockKeyhole size={55} strokeWidth={1.15}/><span>PRIVASI · KESELESAAN · HORMAT</span></div>
        <div><div className="ht-eyebrow">KESELESAAN PELANGGAN <span className="ht-eyebrow__line" /></div><h2 id="ht-privacy-title">Ruang yang menjaga <em>privasi anda.</em></h2><p>Di HIJAMATEAM, kami memahami bahawa privasi merupakan perkara penting sepanjang sesi bekam. Kami menyediakan <strong>bilik rawatan yang berasingan untuk pelanggan lelaki dan wanita</strong>.</p><p>Susunan ini membantu pelanggan menjalani sesi dalam ruang yang lebih privasi, selesa dan bersesuaian dengan keperluan masing-masing. Setiap pelanggan dilayan dengan penuh keselesaan dan rasa hormat.</p><div className="ht-privacy__values"><span><LockKeyhole size={17}/> Ruang berasingan</span><span><HeartHandshake size={17}/> Keselesaan & hormat</span></div></div>
      </div></section>

      <section className="ht-section ht-services" id="perkhidmatan" aria-labelledby="ht-services-title"><div className="ht-container">
        <div className="ht-section-heading ht-section-heading--split"><div><div className="ht-eyebrow">SENARAI PAKEJ & HARGA <span className="ht-eyebrow__line" /></div><h2 id="ht-services-title">Pilih pakej bekam <em>anda.</em></h2></div><p>Tiga pilihan pakej bekam darah dengan harga dalam Dolar Singapura. Sila hubungi kami untuk mengesahkan jadual.</p></div>
        <div className="ht-package-grid">{packages.map((item, index) => <article className={`ht-package-card${item.recommended ? ' ht-package-card--recommended' : ''}`} key={item.name}>
          <div className="ht-package-card__top"><span>PAKEJ {String(index + 1).padStart(2, '0')}</span>{item.recommended && <span className="ht-package-card__badge">DISYORKAN</span>}</div>
          <h3>{item.name}</h3><p className="ht-package-card__detail">{item.detail}</p>
          <div className="ht-package-card__price">{item.price}<span> / sesi</span></div>
          <div className="ht-package-card__features"><div><Check size={17}/><span><strong>{item.cups}</strong> (anggaran)</span></div><div><Clock3 size={17}/><span><strong>{item.duration}</strong> (anggaran)</span></div><div><Check size={17}/><span>Pemeriksaan darah termasuk</span></div></div>
          <a href={packageWhatsapp(item.name)} target="_blank" rel="noopener noreferrer">Tanya Pakej Ini <ArrowRight size={17}/></a>
        </article>)}</div>
        <div className="ht-package-notes"><div className="ht-package-notes__heading"><Info size={21}/><strong>Maklumat penting tentang pakej</strong></div><ul><li>Pemeriksaan darah telah termasuk dalam harga setiap pakej. Tiada caj pemeriksaan darah berasingan.</li><li>Jumlah cawan dan tempoh sesi adalah anggaran dan boleh berubah.</li><li>Kawasan atau titik bekam ditentukan berdasarkan perbincangan bersama pelanggan dan kesesuaian sesi.</li></ul></div>
        <div className="ht-services__footnote"><ShieldCheck size={18}/><p>Bekam diterangkan sebagai amalan tradisional. Kami tidak menjanjikan penyembuhan atau hasil kesihatan tertentu.</p></div>
      </div></section>

      <section className="ht-section ht-process" id="proses" aria-labelledby="ht-process-title"><div className="ht-container">
        <div className="ht-section-heading ht-section-heading--center"><div className="ht-eyebrow">KETAHUI SEBELUM BERMULA</div><h2 id="ht-process-title">Memahami <em>proses bekam darah.</em></h2><p>Penerangan ringkas untuk membantu anda mengetahui apa yang boleh ditanya dan dijangkakan.</p></div>
        <div className="ht-process-grid">
          <div className="ht-process-step"><span>01</span><h3>Pertanyaan awal</h3><p>Hubungi kami, nyatakan pertanyaan serta keadaan kesihatan yang mungkin menjejaskan kesesuaian.</p></div>
          <div className="ht-process-step"><span>02</span><h3>Penerangan prosedur</h3><p>Ketahui langkah, peralatan yang digunakan dan pertimbangan kebersihan sebelum meneruskan sesi.</p></div>
          <div className="ht-process-step"><span>03</span><h3>Proses bekam darah</h3><p>Cawan khas menghasilkan sedutan pada kulit, diikuti cucukan-cucukan kecil dengan peralatan yang sesuai.</p></div>
          <div className="ht-process-step"><span>04</span><h3>Penjagaan selepas sesi</h3><p>Ikuti arahan penjagaan kulit dan dapatkan penilaian perubatan jika terdapat tanda yang membimbangkan.</p></div>
        </div>
        <div className="ht-equipment"><div className="ht-equipment__label"><span>ISTILAH PERALATAN</span><h3>Peralatan yang perlu anda kenali.</h3></div><div className="ht-equipment__items"><div><Check size={17}/><span><strong>Alat pencucuk automatik</strong><small>(lancing device)</small></span></div><div><Check size={17}/><span><strong>Jarum kecil steril</strong><small>(disposable lancet) · digunakan sekali sahaja dan dibuang selepas penggunaan</small></span></div><div><Check size={17}/><span><strong>Cawan khas</strong><small>Menghasilkan sedutan pada permukaan kulit</small></span></div></div></div>
        <details className="ht-process-photo"><summary><span><strong>Lihat foto proses bekam darah</strong><small>Foto ini menunjukkan darah. Buka hanya jika anda selesa melihatnya.</small></span><ChevronDown size={21}/></summary><figure><img src="/clients/hijamateam/foto-proses-bekam.webp" alt="Foto jarak dekat cawan bekam yang mengandungi darah semasa proses bekam" width="1536" height="1536" loading="lazy"/><figcaption>Foto yang dikongsi oleh HIJAMATEAM untuk memperlihatkan peralatan dan proses. Bukan bukti penyembuhan penyakit.</figcaption></figure></details>
      </div></section>

      <section className="ht-safety" aria-labelledby="ht-safety-title"><div className="ht-container ht-safety__grid"><div><div className="ht-eyebrow ht-eyebrow--light">MAKLUMAT PENTING</div><h2 id="ht-safety-title">Keselamatan sentiasa <em>diutamakan.</em></h2></div><div><p>Tidak semua orang sesuai menjalani bekam. Jika anda mempunyai keadaan kesihatan tertentu atau mempunyai keraguan tentang keselamatan prosedur, dapatkan nasihat profesional kesihatan terlebih dahulu.</p><p className="ht-safety__strong">Bekam bukan pengganti pemeriksaan, nasihat atau rawatan perubatan.</p><a href="#ilmu">Baca panduan keselamatan <ArrowRight size={17}/></a></div></div></section>

      <section className="ht-section ht-knowledge" id="ilmu" aria-labelledby="ht-knowledge-title"><div className="ht-container">
        <div className="ht-section-heading ht-section-heading--split"><div><div className="ht-eyebrow">PUSAT ILMU HIJAMATEAM <span className="ht-eyebrow__line" /></div><h2 id="ht-knowledge-title">Belajar dahulu.<br /><em>Buat keputusan dengan yakin.</em></h2></div><p>Ruang rujukan dalam bahasa Melayu mengenai tradisi, prosedur, peralatan dan penjagaan berkaitan bekam.</p></div>
        <div className="ht-article-grid">{articles.slice(0, showAllArticles ? articles.length : 6).map(article => <details className="ht-article" key={article.number}><summary><div className="ht-article__top"><span>{article.topic}</span><BookOpen size={20}/></div><strong className="ht-article__number">{article.number}</strong><h3>{article.title}</h3><div className="ht-article__bottom"><span>{article.time}</span><span className="ht-article__circle"><ArrowRight size={19}/></span></div></summary><div className="ht-article__content"><p>{article.text}</p><a href={whatsapp} target="_blank" rel="noopener noreferrer">Ada pertanyaan? Hubungi kami <ArrowRight size={15}/></a></div></details>)}</div>
        <div className="ht-knowledge__actions"><button className="ht-button ht-button--light" type="button" onClick={() => setShowAllArticles(v => !v)}>{showAllArticles ? 'Tunjukkan Artikel Utama' : 'Lihat Semua 10 Artikel'} <ArrowRight size={17}/></button></div>
        <p className="ht-knowledge__disclaimer">Maklumat disediakan untuk pendidikan umum, bukan diagnosis, nasihat perubatan peribadi atau jaminan keberkesanan prosedur.</p>
      </div></section>

      <section className="ht-section ht-faq" id="soalan" aria-labelledby="ht-faq-title"><div className="ht-container ht-faq__grid"><div><div className="ht-eyebrow">SOALAN LAZIM</div><h2 id="ht-faq-title">Ada yang ingin<br /><em>anda tanyakan?</em></h2><p>Mulakan dengan maklumat yang anda perlukan. Kami sedia menerima pertanyaan lanjut.</p><WhatsAppButton outlined>Tanya Sekarang</WhatsAppButton></div><div className="ht-faq__list">{faq.map((item,i)=><details key={item.q}><summary><span>{String(i+1).padStart(2,'0')}</span>{item.q}<ChevronDown size={19}/></summary><p>{item.a}</p></details>)}</div></div></section>

      <section className="ht-section ht-social" aria-labelledby="ht-social-title">
        <div className="ht-container">
          <div className="ht-eyebrow">BERHUBUNG & TEROKAI</div>
          <h2 id="ht-social-title">Lebih dekat dengan <em>HIJAMATEAM.</em></h2>
          <div className="ht-social__grid">
            <a href="https://www.youtube.com/@hijamateam" target="_blank" rel="noopener noreferrer"><Play size={28}/><span><strong>Saluran YouTube</strong><small>Video & perkongsian HIJAMATEAM</small></span><ExternalLink size={18}/></a>
            <a href="https://www.facebook.com/ainhassan/" target="_blank" rel="noopener noreferrer"><span className="ht-social__letter">f</span><span><strong>Facebook Nur Ain</strong><small>Ikuti perkongsian & perkembangan</small></span><ExternalLink size={18}/></a>
            <a href="https://sg.shp.ee/BxLda9LH" target="_blank" rel="noopener noreferrer"><ShoppingBag size={28}/><span><strong>Kedai Shopee</strong><small>Lawati kedai dalam talian</small></span><ExternalLink size={18}/></a>
            <a href="https://hijamateam.wordpress.com/" target="_blank" rel="noopener noreferrer"><BookOpen size={28}/><span><strong>Blog</strong><small>Perkongsian maklumat bekam darah oleh Nur Ain</small></span><ExternalLink size={18}/></a>
          </div>
        </div>
      </section>

      <section className="ht-contact" id="hubungi" aria-labelledby="ht-contact-title">
        <div className="ht-container ht-contact__grid">
          <div>
            <div className="ht-eyebrow ht-eyebrow--light">KAMI DI BUKIT PANJANG</div>
            <h2 id="ht-contact-title">Pertanyaan anda<br /><em>bermula di sini.</em></h2>
            <p>Hubungi Nur Ain melalui WhatsApp untuk pertanyaan, pilihan sesi, harga terkini dan ketersediaan temujanji.</p>
            <WhatsAppButton>Hubungi Nur Ain</WhatsAppButton>
          </div>
          <div className="ht-contact__card">
            <div className="ht-contact__card-top"><span>MAKLUMAT PERHUBUNGAN</span><Sparkles size={21}/></div>
            <figure className="ht-contact__location-photo">
              <img className="ht-contact__building" src="/clients/hijamateam/lokasi-blok-429-terkini.webp" alt="Bangunan sebenar Blok 429 di Bukit Panjang, Singapura" width="1536" height="2048" loading="lazy" />
              <img className="ht-contact__building-sign" src="/clients/hijamateam/papan-alamat-blok-429.webp" alt="Papan alamat 429 Bukit Panjang Ring Road pada bangunan" width="1536" height="2048" loading="lazy" />
              <figcaption>Blok 429 · Bukit Panjang Ring Road</figcaption>
            </figure>
            <div className="ht-contact__row"><MapPin size={22}/><div><strong>Alamat Kami</strong><p>Block 429 Bukit Panjang Ring Road<br/>#07-715<br/>Singapore 670429</p><a href={mapLink} target="_blank" rel="noopener noreferrer">Lihat dalam Google Maps <ExternalLink size={15}/></a></div></div>
            <div className="ht-contact__row"><Clock3 size={22}/><div><strong>Waktu Operasi</strong><p>Setiap hari<br/>9.00 pagi – 8.00 malam</p></div></div>
            <div className="ht-contact__row"><Phone size={22}/><div><strong>Hubungi Kami</strong><p>Nur Ain: <a href="tel:+6589567799">+65 8956 7799</a><br/>Hassan: <a href="tel:+6589267799">+65 8926 7799</a></p></div></div>
          </div>
        </div>
      </section>
    </main>

    <footer className="ht-footer"><div className="ht-container ht-footer__top"><div><Mark light/><p>Memperkenalkan bekam darah dengan penerangan yang jelas, berlandaskan kesedaran tentang kebersihan, keselamatan dan pilihan pelanggan.</p></div><div><strong>Jelajah</strong><a href="#tentang">Tentang Kami</a><a href="#perkhidmatan">Perkhidmatan</a><a href="#ilmu">Pusat Ilmu</a><a href="#soalan">Soalan Lazim</a></div><div><strong>Berhubung</strong><a href="https://www.youtube.com/@hijamateam" target="_blank" rel="noopener noreferrer">YouTube</a><a href="https://www.facebook.com/ainhassan/" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://sg.shp.ee/BxLda9LH" target="_blank" rel="noopener noreferrer">Shopee</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div><div className="ht-container ht-footer__bottom"><span>© {new Date().getFullYear()} HIJAMATEAM. Hak cipta terpelihara.</span><span>Bekam bukan pengganti pemeriksaan, nasihat atau rawatan perubatan.</span></div></footer>
    <a className="ht-mobile-booking" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/> Tempah Temujanji <ArrowRight size={18}/></a>
  </div>;
}
