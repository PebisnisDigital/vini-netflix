/**
 * Portofolio contoh Teh Vini.
 * Hanya berisi informasi yang telah disampaikan Teh Vini dalam percakapan.
 * Foto Teh Vini menggunakan cutout transparan yang diberikan pemilik situs.
 * Jangan tambahkan angka hasil, gelar, sertifikat, atau tautan kontak tanpa konfirmasi.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'TEH VINI',
  displayName: 'Teh Vini',
  firstName: 'TEH VINI',
  seriesTag: 'THE SERIES',
  originalLabel: 'KISAH ORIGINAL TEH VINI',
  role: 'CEO Cuanify ID • Mentor Digital',
  tagline: ['Founder Pebisnis.Digital', 'Komunitas BADAI', 'WhatsApp Marketing'],
  intro:
    'Saya Vini, seorang ibu rumah tangga dari Bandung yang jatuh cinta pada dunia bisnis digital dan AI. Kini saya mengelola Cuanify ID, membangun Pebisnis.Digital, dan mendampingi para pemula belajar pemasaran WhatsApp serta membuat karya dengan AI. Saya percaya teknologi harus terasa dekat, bahkan bagi orang yang baru mulai.',
  location: 'Bandung, Jawa Barat',
  // Kontak pribadi belum disetujui untuk dipublikasikan. Jangan memakai milik pembuat template.
  email: '',
  links: {
    linkedin: '',
    github: '',
    website: 'https://promptional.vercel.app/',
  },
  resumePdf: '',
  // Aset unik milik Teh Vini, terpisah dari aset foto klien lainnya.
  portrait: {
    src: '/assets/teh-vini-720.webp',
    srcSet: '/assets/teh-vini-420.webp 420w, /assets/teh-vini-720.webp 720w, /assets/teh-vini-1100.webp 1100w',
    alt: 'Foto Teh Vini tersenyum dengan hijab hitam dan gestur hati di tangan',
  },
  interests: ['AI untuk kreator', 'Bisnis digital', 'Edukasi pemula', 'Otomasi pemasaran'],
};

export type Education = { school: string; place: string; degree: string; period: string; score: string };
// Pendidikan formal belum diberikan. Bagian ini disembunyikan, bukan diisi data orang lain.
export const education: Education[] = [];

export type Experience = { company: string; role: string; place: string; period: string; points: string[] };
export const experience: Experience[] = [
  {
    company: 'Cuanify ID',
    role: 'CEO',
    place: 'Indonesia',
    period: 'Saat ini',
    points: [
      'Mengelola rintisan Cuanify ID dan mengembangkan ide produk serta layanan digital.',
      'Mengeksplorasi AI untuk konten, edukasi, pemasaran, dan kebutuhan pelaku usaha kecil.',
    ],
  },
  {
    company: 'Pebisnis.Digital',
    role: 'Founder & Mentor',
    place: 'Online',
    period: 'Aktif',
    points: [
      'Menyusun materi bisnis digital yang mudah dipahami para pemula.',
      'Membagikan strategi WhatsApp Marketing dan membawakan kelas belajar melalui WhatsApp.',
    ],
  },
  {
    company: 'Komunitas BADAI',
    role: 'Pengelola Komunitas',
    place: 'Online',
    period: '2026 – Sekarang',
    points: [
      'Mengembangkan komunitas Belajar Apa Aja Dengan AI sebagai ruang praktik dan berbagi inspirasi.',
      'Menyiapkan materi pembuatan konten dan berbagai eksperimen kreatif menggunakan AI.',
    ],
  },
];

export type Metric = { value: string; label: string };
export type Project = {
  id: string;
  title: string;
  image?: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  github?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'badai',
    title: 'BADAI',
    year: '2026',
    genre: 'Komunitas • Edukasi AI • Kreator',
    logline: 'Belajar Apa Aja Dengan AI — komunitas tempat pemula mencoba, berkarya, dan terus belajar bersama.',
    stack: ['AI Kreatif', 'Materi Praktik', 'Komunitas', 'Kelas Online'],
    build: [
      'Mengembangkan konsep BADAI sebagai tempat belajar AI yang dekat dengan kebutuhan pemula, kreator, dan UMKM.',
      'Menyusun pengalaman belajar berupa praktik membuat konten AI, video, karya kreatif, serta inspirasi pemanfaatannya.',
    ],
    features: [
      'Materi belajar AI yang berorientasi praktik',
      'Inspirasi konten visual dan video dengan AI',
      'Ruang komunitas dan pendampingan belajar',
      'Paket pembelajaran dengan masa akses tahunan',
    ],
    metrics: [
      { value: '365', label: 'hari masa akses' },
      { value: 'AI', label: 'fokus pembelajaran' },
      { value: '2', label: 'pilihan paket belajar' },
    ],
    palette: { from: '#2a0618', via: '#861f5a', to: '#09050d', accent: '#ff54aa' },
    motif: 'shield',
  },
  {
    id: 'promptional',
    title: 'PROMPTIONAL',
    year: '2026',
    genre: 'Prompt AI • Galeri Kreatif • Telegram',
    logline: 'Ruang berbagi inspirasi prompt gambar AI, dengan konten gratis dan akses galeri premium.',
    stack: ['AI Image', 'Prompt Kreatif', 'Telegram', 'Galeri Web'],
    build: [
      'Merancang pengalaman mendapatkan inspirasi prompt gratis melalui kanal digital dan bot Telegram.',
      'Mengembangkan konsep galeri member berisi kumpulan prompt untuk dieksplorasi dan dipraktikkan.',
    ],
    features: [
      'Inspirasi prompt visual untuk pengguna gratis',
      'Bot Telegram sebagai kanal distribusi',
      'Galeri prompt di website',
      'Akses premium untuk koleksi prompt',
    ],
    metrics: [
      { value: 'AI', label: 'fokus karya visual' },
      { value: 'Gratis', label: 'jalur berbagi inspirasi' },
      { value: 'Premium', label: 'akses galeri koleksi' },
    ],
    palette: { from: '#18101e', via: '#5e245c', to: '#08080d', accent: '#c98bff' },
    motif: 'flow',
  },
  {
    id: 'pebisnis-digital',
    title: 'PEBISNIS.DIGITAL',
    year: 'Aktif',
    genre: 'Edukasi Bisnis • WhatsApp • Digital Marketing',
    logline: 'Belajar bisnis digital dengan bahasa yang membumi, materi rutin, dan praktik pemasaran WhatsApp.',
    stack: ['WhatsApp Marketing', 'KULWA', 'Materi Harian', 'Edukasi Pemula'],
    build: [
      'Membangun ruang belajar bagi ibu rumah tangga, pemula, karyawan, dan pelaku UMKM yang ingin memahami pemasaran digital.',
      'Membagikan materi terjadwal, strategi komunikasi penjualan, dan pembelajaran berbasis studi kasus.',
    ],
    features: [
      'Materi edukasi bisnis digital harian',
      'Kelas belajar melalui WhatsApp (KULWA)',
      'Strategi komunikasi dan tindak lanjut calon pembeli',
      'Contoh praktik yang relevan untuk pemula dan UMKM',
    ],
    metrics: [
      { value: 'WA', label: 'kanal belajar utama' },
      { value: 'KULWA', label: 'format kelas interaktif' },
      { value: 'UMKM', label: 'salah satu audiens utama' },
    ],
    palette: { from: '#1b1502', via: '#806c0c', to: '#080808', accent: '#f4c400' },
    motif: 'tenants',
  },
];

export type Achievement = { id: string; title: string; org: string; detail: string; laurel: string; link?: string };
// Momen karya nyata, bukan penghargaan atau sertifikat yang belum terkonfirmasi.
export const achievements: Achievement[] = [
  {
    id: 'founder', title: 'Membangun Pebisnis.Digital', org: 'Pebisnis.Digital',
    detail: 'Membuat materi pembelajaran bisnis digital yang terasa dekat bagi pemula dan pelaku usaha.',
    laurel: 'MERINTIS',
  },
  {
    id: 'mentor', title: 'Mentor WhatsApp Marketing', org: 'Kelas & Komunitas',
    detail: 'Berbagi strategi jualan, pengumpulan calon pelanggan, dan praktik komunikasi pemasaran melalui WhatsApp.',
    laurel: 'BERBAGI ILMU',
  },
  {
    id: 'badai', title: 'Membangun BADAI', org: 'Komunitas BADAI',
    detail: 'Mengembangkan komunitas belajar AI dengan materi kreatif dan semangat berani mencoba.',
    laurel: 'KOMUNITAS AI',
  },
  {
    id: 'promptional', title: 'Merintis PROMPTIONAL', org: 'PROMPTIONAL',
    detail: 'Membuat konsep galeri prompt AI dan kanal distribusi inspirasi gratis melalui Telegram.',
    laurel: 'KARYA DIGITAL',
    link: 'https://promptional.vercel.app/',
  },
  {
    id: 'product', title: 'Bereksperimen dengan Produk AI', org: 'Cuanify ID',
    detail: 'Mengembangkan gagasan seperti Karyawan AI, Bikin Web AI, dan alat bantu pemasaran untuk pemula.',
    laurel: 'TERUS BELAJAR',
  },
];

export type Certification = { issuer: string; name: string; link: string };
// Belum ada daftar sertifikasi resmi Teh Vini yang diberikan.
export const certifications: Certification[] = [];

export type Skill = { name: string; mono: string; note?: string; evidence?: string[] };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };
export const skillCategories: SkillCategory[] = [
  {
    id: 'marketing', title: 'Pemasaran Digital', subtitle: 'Membangun komunikasi yang menjual',
    skills: [
      { name: 'WhatsApp Marketing', mono: 'WA', note: 'Fokus' },
      { name: 'Strategi Penjualan', mono: 'SJ' },
      { name: 'Akuisisi Leads', mono: 'AL' },
      { name: 'Follow-up', mono: 'FU' },
    ],
  },
  {
    id: 'creative', title: 'Konten Kreatif AI', subtitle: 'Mengolah ide menjadi konten',
    skills: [
      { name: 'Prompt Gambar AI', mono: 'PG' },
      { name: 'AI Influencer', mono: 'AI' },
      { name: 'Konten Edukasi', mono: 'KE' },
      { name: 'Video AI', mono: 'VA' },
    ],
  },
  {
    id: 'education', title: 'Edukasi & Mentoring', subtitle: 'Belajar bersama para pemula',
    skills: [
      { name: 'KULWA', mono: 'KW' },
      { name: 'Training Online', mono: 'TR' },
      { name: 'Materi Harian', mono: 'MH' },
      { name: 'Kelas Digital', mono: 'KD' },
    ],
  },
  {
    id: 'product', title: 'Produk Digital', subtitle: 'Dari ide menjadi produk belajar',
    skills: [
      { name: 'Komunitas Membership', mono: 'KM' },
      { name: 'Galeri Prompt', mono: 'GP' },
      { name: 'Karyawan AI', mono: 'KA' },
      { name: 'Produk Edukasi', mono: 'PE' },
    ],
  },
  {
    id: 'channels', title: 'Kanal Komunitas', subtitle: 'Menjangkau audiens di berbagai kanal',
    skills: [
      { name: 'WhatsApp', mono: 'WA' },
      { name: 'Telegram', mono: 'TG' },
      { name: 'Threads', mono: 'TH' },
      { name: 'Instagram', mono: 'IG' },
    ],
  },
  {
    id: 'systems', title: 'Sistem & Otomasi', subtitle: 'Menyederhanakan aktivitas pemasaran',
    skills: [
      { name: 'Bot Telegram', mono: 'BT' },
      { name: 'AUTOKONTAK', mono: 'AK' },
      { name: 'QRIS Digital', mono: 'QR' },
      { name: 'Sistem Follow-up', mono: 'SF' },
    ],
  },
  {
    id: 'interests', title: 'Eksplorasi', subtitle: 'Ide baru selalu punya ruang',
    skills: [
      { name: 'AI untuk UMKM', mono: 'UM' },
      { name: 'Bikin Web AI', mono: 'WB' },
      { name: 'Game Edukasi', mono: 'GE' },
      { name: 'Animasi AI', mono: 'AN' },
    ],
  },
];

export const skillEvidence: Record<string, string[]> = {
  'WhatsApp Marketing': ['Mentoring WhatsApp', 'Pebisnis.Digital'],
  'Strategi Penjualan': ['Kelas Jago Jualan WA', 'Pebisnis.Digital'],
  'Akuisisi Leads': ['Materi pemasaran WhatsApp'],
  'Follow-up': ['Strategi WhatsApp Marketing'],
  'Prompt Gambar AI': ['PROMPTIONAL', 'BADAI'],
  'AI Influencer': ['Materi BADAI'],
  'Konten Edukasi': ['BADAI', 'Pebisnis.Digital'],
  'Video AI': ['Materi BADAI'],
  KULWA: ['Kelas WhatsApp', 'Pebisnis.Digital'],
  'Training Online': ['Training Bikin Game Edukasi'],
  'Materi Harian': ['Pebisnis.Digital'],
  'Kelas Digital': ['BADAI', 'Jago Jualan WA'],
  'Komunitas Membership': ['BADAI'],
  'Galeri Prompt': ['PROMPTIONAL'],
  'Karyawan AI': ['Produk Karyawan AI'],
  'Produk Edukasi': ['Bikin Web AI', 'Jago Jualan WA'],
  WhatsApp: ['Pebisnis.Digital', 'KULWA'],
  Telegram: ['PROMPTIONAL'],
  Threads: ['Konten pemasaran'],
  Instagram: ['Konten kreatif AI'],
  'Bot Telegram': ['PROMPTIONAL'],
  AUTOKONTAK: ['Sistem AUTOKONTAK'],
  'QRIS Digital': ['Produk digital'],
  'Sistem Follow-up': ['Strategi WhatsApp Marketing'],
  'AI untuk UMKM': ['BADAI'],
  'Bikin Web AI': ['Pelatihan Bikin Web AI'],
  'Game Edukasi': ['Training Bikin Game Edukasi'],
  'Animasi AI': ['Materi kreatif BADAI'],
};

export type Episode = { code: string; title: string; description: string; tags: string[]; runtime: string; palette: Palette; image?: string };
export type Season = { number: number; title: string; period: string; synopsis: string; episodes: Episode[] };

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1, title: 'Semua Berawal dari Rasa Penasaran', period: 'Bab pertama',
    synopsis: 'Dari keseharian sebagai ibu rumah tangga hingga menemukan dunia kreatif AI dan bisnis digital.',
    episodes: [
      { code: 'S01 E01', title: 'Ibu Rumah Tangga, Banyak Ide', description: 'Teh Vini berasal dari Bandung dan mulai mengeksplorasi peluang belajar serta berkarya secara digital.', tags: ['Bandung', 'Belajar Digital'], runtime: 'Awal cerita', palette: amber },
      { code: 'S01 E02', title: 'Jatuh Cinta pada AI', description: 'Kegemaran bereksperimen dengan gambar AI membuka jalan menuju dunia prompt dan konten kreatif.', tags: ['AI Kreatif', 'Prompt'], runtime: 'Titik balik', palette: violet },
    ],
  },
  {
    number: 2, title: 'Berbagi Ilmu, Bertumbuh Bersama', period: 'Perjalanan',
    synopsis: 'Membagikan strategi bisnis digital dan WhatsApp Marketing untuk orang-orang yang ingin mulai belajar.',
    episodes: [
      { code: 'S02 E01', title: 'Pebisnis.Digital', description: 'Membangun ruang belajar bisnis digital dengan materi yang mudah dipahami pemula.', tags: ['Edukasi', 'Bisnis Digital'], runtime: 'Founder', palette: ocean },
      { code: 'S02 E02', title: 'Kelas di WhatsApp', description: 'Mengajar melalui KULWA, berbagi studi kasus, dan mendampingi peserta belajar strategi pemasaran.', tags: ['KULWA', 'WhatsApp'], runtime: 'Mentoring', palette: jade },
    ],
  },
  {
    number: 3, title: 'Dari Ide Menjadi Produk', period: 'Eksperimen digital',
    synopsis: 'Mencoba berbagai format produk digital agar materi belajar lebih dekat dengan kebutuhan pasar.',
    episodes: [
      { code: 'S03 E01', title: 'Karyawan AI', description: 'Mengeksplorasi produk asisten AI untuk membantu berbagai pekerjaan digital.', tags: ['Produk AI', 'Eksperimen'], runtime: 'Produk digital', palette: violet },
      { code: 'S03 E02', title: 'Bikin Web AI', description: 'Mengembangkan pembelajaran pembuatan website dengan bantuan AI untuk para pemula.', tags: ['Web AI', 'Belajar Praktik'], runtime: 'Pelatihan', palette: amber },
      { code: 'S03 E03', title: 'AUTOKONTAK', description: 'Mengembangkan ide sistem pendukung pengelolaan kontak dan strategi pemasaran WhatsApp.', tags: ['WhatsApp', 'Otomasi'], runtime: 'Eksperimen', palette: ocean },
    ],
  },
  {
    number: 4, title: 'Lahirnya BADAI', period: '2026',
    synopsis: 'Belajar Apa Aja Dengan AI: ruang untuk bereksperimen, membuat karya, dan tumbuh bersama.',
    episodes: [
      { code: 'S04 E01', title: 'Belajar Apa Aja Dengan AI', description: 'Mengembangkan konsep komunitas BADAI yang berfokus pada praktik dan eksplorasi AI.', tags: ['BADAI', 'Komunitas'], runtime: '2026', palette: crimson },
      { code: 'S04 E02', title: 'Karya dari AI', description: 'Menyusun materi video AI, konten visual, influencer AI, dan eksperimen kreatif lainnya.', tags: ['Konten AI', 'Kreator'], runtime: 'Terus berkembang', palette: violet },
    ],
  },
  {
    number: 5, title: 'Cerita Belum Selesai', period: 'Sekarang',
    synopsis: 'PROMPTIONAL, Cuanify ID, dan eksplorasi produk baru menjadi bagian dari bab berikutnya.',
    episodes: [
      { code: 'S05 E01', title: 'PROMPTIONAL', description: 'Membangun galeri prompt AI dengan jalur inspirasi gratis dan akses premium.', tags: ['PROMPTIONAL', 'Telegram'], runtime: '2026', palette: jade },
      { code: 'S05 E02', title: 'Cuanify ID', description: 'Melanjutkan eksplorasi produk, edukasi, dan peluang bisnis digital dengan pendekatan AI.', tags: ['Cuanify ID', 'Bisnis Digital'], runtime: 'Sekarang', palette: ocean },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette; image?: string };
export const topPicks: TopPick[] = [
  { label: 'Komunitas AI', title: 'BADAI', detail: 'Belajar Apa Aja Dengan AI', palette: crimson },
  { label: 'Kreasi prompt', title: 'PROMPTIONAL', detail: 'Inspirasi prompt gratis & premium', palette: violet },
  { label: 'Ruang belajar', title: 'Pebisnis.Digital', detail: 'Edukasi bisnis digital untuk pemula', palette: amber },
  { label: 'Keahlian utama', title: 'WhatsApp Marketing', detail: 'Strategi komunikasi penjualan', palette: jade },
  { label: 'Cara berbagi', title: 'KULWA', detail: 'Kelas belajar melalui WhatsApp', palette: ocean },
  { label: 'Produk AI', title: 'Karyawan AI', detail: 'Asisten AI untuk aktivitas digital', palette: violet },
  { label: 'Belajar membuat', title: 'Bikin Web AI', detail: 'Website dengan bantuan AI', palette: amber },
  { label: 'Alat pemasaran', title: 'AUTOKONTAK', detail: 'Ide pendukung pengelolaan kontak', palette: jade },
  { label: 'Kelas penjualan', title: 'Jago Jualan WA', detail: 'Belajar strategi jualan lewat WhatsApp', palette: crimson },
  { label: 'Eksplorasi baru', title: 'Game Edukasi', detail: 'Membuat pengalaman belajar dengan AI', palette: ocean },
];

export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };
export const introSlides: IntroSlide[] = [
  { kicker: 'Kenalan', title: 'Halo, Saya Vini', lines: ['Ibu rumah tangga dari Bandung', 'Belajar, berkarya, dan membangun bisnis digital'], chips: ['Bandung', 'Digital', 'AI'] },
  { kicker: 'Peran', title: 'Founder & Mentor', lines: ['CEO Cuanify ID', 'Founder Pebisnis.Digital', 'Mentor WhatsApp Marketing'], chips: ['Cuanify ID', 'Pebisnis.Digital'] },
  { kicker: 'Ruang belajar', title: 'Pebisnis.Digital', lines: ['Belajar bisnis digital dengan bahasa sederhana', 'Kelas dan materi WhatsApp Marketing'], chips: ['WhatsApp', 'KULWA'] },
  { kicker: 'Komunitas', title: 'BADAI', lines: ['Belajar Apa Aja Dengan AI', 'Mencoba konten visual, video, dan karya kreatif'], chips: ['BADAI', 'AI Kreatif'] },
  { kicker: 'Galeri kreatif', title: 'PROMPTIONAL', lines: ['Inspirasi prompt gambar AI', 'Dibagikan melalui kanal digital dan Telegram'], chips: ['Prompt', 'Telegram'] },
  { kicker: 'Eksperimen', title: 'Terus Membuat', lines: ['Karyawan AI · Bikin Web AI · AUTOKONTAK', 'Produk dan materi belajar untuk pemula'], chips: ['Produk Digital', 'AI'] },
  { kicker: 'Bab berikutnya', title: 'Cerita Berlanjut', lines: ['Lebih banyak ide, lebih banyak karya', 'Belajar dan bertumbuh bersama'], chips: ['Cuanify ID'] },
];

export type ProfileId = 'vini' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';
export const viewerProfiles: { id: ProfileId; name: string; blurb: string; color: string; order: SectionId[] }[] = [
  { id: 'vini', name: 'Teh Vini', blurb: 'Tonton semua ceritanya', color: '#e5132b', order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'] },
  { id: 'recruiter', name: 'Calon Mitra', blurb: 'Kenalan lewat karya dan pengalaman', color: '#4cc9ff', order: ['originals', 'story', 'moments', 'skills', 'about', 'journey', 'picks'] },
  { id: 'developer', name: 'Penasaran AI', blurb: 'Lihat karya AI dan produk digital', color: '#46e3a8', order: ['originals', 'skills', 'picks', 'journey', 'moments', 'about', 'story'] },
  { id: 'creative', name: 'Kreator', blurb: 'Mulai dari inspirasi dan ide', color: '#ffb547', order: ['picks', 'journey', 'originals', 'skills', 'about', 'moments', 'story'] },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'Tentang', card: 'Kenalan Yuk', meta: 'Episode pembuka • Tentang Teh Vini', palette: violet },
  journey: { nav: 'Perjalanan', card: 'Perjalanan Saya', meta: `${seasons.length} Musim • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episode`, palette: amber },
  originals: { nav: 'Karya', card: 'Karya & Inisiatif', meta: `${projects.length} Karya Pilihan`, palette: crimson },
  picks: { nav: 'Pilihan', card: '10 Sorotan', meta: '10 hal yang ingin saya bagikan', palette: jade },
  skills: { nav: 'Keahlian', card: 'Hal yang Saya Tekuni', meta: `${skillCategories.length} Area Eksplorasi`, palette: ocean },
  moments: { nav: 'Momen', card: 'Momen Penting', meta: `${achievements.length} Jejak Karya`, palette: crimson },
  story: { nav: 'Profil', card: 'Cerita Lengkap', meta: 'Profil • Pengalaman • Karya', palette: violet },
};
