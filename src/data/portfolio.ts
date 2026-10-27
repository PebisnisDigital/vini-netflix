/**
 * Central portfolio data — generated from Sushmita's resume (Sushmita_dasari.pdf).
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Nothing here should be added unless it appears on the resume.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'TEH VINI',
  displayName: 'TEH VINI',
  firstName: 'TEH VINI',
  seriesTag: 'THE SERIES',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'KARYA ORIGINAL TEH VINI',
  role: 'Pengembang Full-Stack',
  tagline: ['Pengembang Full-Stack', 'AI / ML', 'Java'],
  intro:
    'Mahasiswi B.Tech Kecerdasan Buatan & Machine Learning (CGPA 9,10) sekaligus pengembang full-stack yang membangun platform berbasis AI, sistem pembayaran, dan SaaS multi-tenant dengan Java, Python, React, Node.js, serta Docker.',
  location: 'Surampalem, Andhra Pradesh',
  email: 'sushmitadasari17@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/sushmita-dasari-227a40284/',
    github: 'https://github.com/Sushmitadasari',
  },
  resumePdf: '/assets/Sushmita_Dasari_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Potret untuk portofolio TEH VINI',
  },
  interests: ['Desain Sistem', 'Komputasi Awan (AWS)', 'Machine Learning'],
};

export const education = [
  {
    school: 'Aditya Engineering College',
    place: 'Surampalem',
    degree: 'Sarjana Teknologi — Kecerdasan Buatan dan Machine Learning',
    period: 'Oktober 2023 – Sekarang',
    score: 'CGPA 9.10',
  },
  {
    school: 'Sri Chaitanya Junior College',
    place: 'Kakinada',
    degree: 'BIEAP — MPC',
    period: 'Juni 2021 – Mei 2023',
    score: 'Nilai 925/1000',
  },
];

export const experience = [
  {
    company: 'Technical Hub Pvt Ltd',
    role: 'Peserta Pelatihan',
    place: 'Surampalem, AP',
    period: 'Mei 2025 – Juni 2026',
    points: [
      'Menyelesaikan satu tahun pelatihan intensif pengembangan full-stack, mencakup frontend, backend, integrasi basis data, dan alur deployment.',
      'Mengembangkan aplikasi web responsif dan fungsional, mulai dari antarmuka pengguna, logika server, hingga koneksi basis data.',
      'Meluncurkan dan mengelola aplikasi web dengan kontrol versi, debugging, serta praktik pengembangan dari awal hingga akhir.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /** Omit when the repository isn't public — the GitHub button is hidden instead of linking to a 404. */
  github?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'policyguard-ai',
    title: 'PolicyGuard AI',
    year: '2026',
    genre: 'AI • NLP • LLM',
    logline: 'Platform analisis kebijakan berbasis AI untuk web, ekstensi peramban, aplikasi seluler, dan desktop.',
    stack: ['Python', 'NLP', 'LLM', 'REST API'],
    build: [
      'Membangun platform analisis kebijakan berbasis AI di web, ekstensi peramban, seluler, dan desktop. Memproses lebih dari 500 dokumen dengan akurasi 92% dan mengurangi waktu tinjauan manual sebesar 60% pada 8 kategori.',
      'Merancang tanya jawab berbasis LLM, ekstraksi informasi penting, serta integrasi REST API untuk lebih dari 10 jenis dokumen agar analisis berlangsung secara langsung dan pengambilan keputusan 45% lebih cepat.',
    ],
    features: [
      'Tanya jawab dokumen kebijakan dengan LLM',
      'Ekstraksi informasi penting',
      'Integrasi REST API untuk 10+ jenis dokumen',
      'Aplikasi web, ekstensi peramban, seluler, dan desktop',
      'Analisis kebijakan secara langsung',
    ],
    metrics: [
      { value: '500+', label: 'dokumen kebijakan diproses' },
      { value: '92%', label: 'akurasi' },
      { value: '60%', label: 'pengurangan tinjauan manual' },
      { value: '45%', label: 'keputusan lebih cepat' },
      { value: '8', label: 'kategori kebijakan' },
    ],
    // The resume links to https://github.com/Sushmitadasari/PolicyGuard-AI, which is not public yet (404).
    // Add `github: 'https://github.com/Sushmitadasari/PolicyGuard-AI',` back once the repo is public.
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'shield',
  },
  {
    id: 'payment-gateway',
    title: 'Sistem Gerbang Pembayaran',
    year: '2026',
    genre: 'Full-Stack • Fintech • Mikroservis',
    logline: 'Gerbang pembayaran UPI dan kartu yang dibangun dengan pengelolaan status transaksi yang ketat.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'React', 'Docker'],
    build: [
      'Membangun gerbang pembayaran UPI dan kartu yang menangani lebih dari 1.000 transaksi dengan uptime 99,8% serta status pembayaran yang terkontrol (diproses → berhasil/gagal).',
      'Arsitektur mikroservis berbasis Docker memangkas persiapan deployment sebesar 70%; optimasi backend membuat respons API 40% lebih cepat dan kapasitas pemrosesan menjadi tiga kali lipat.',
    ],
    features: [
      'Pembayaran UPI dan kartu',
      'Pengelolaan status transaksi (diproses → berhasil/gagal)',
      'Arsitektur mikroservis berbasis Docker',
      'Optimasi backend untuk trafik tinggi',
    ],
    metrics: [
      { value: '1.000+', label: 'transaksi diproses' },
      { value: '99,8%', label: 'waktu aktif sistem' },
      { value: '70%', label: 'pengurangan persiapan deployment' },
      { value: '40%', label: 'respons API lebih cepat' },
      { value: '3×', label: 'kapasitas saat trafik tinggi' },
    ],
    github: 'https://github.com/Sushmitadasari/Payment-gateway-system-Project',
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'flow',
  },
  {
    id: 'multi-tenant-saas',
    title: 'Platform SaaS Multi-Tenant',
    year: '2026',
    genre: 'SaaS • Security • DevOps',
    logline: 'SaaS multi-tenant dengan basis data bersama, isolasi tenant yang ketat, dan empat tingkat akses JWT/RBAC.',
    stack: ['Node.js', 'React', 'PostgreSQL', 'Docker Compose'],
    build: [
      'Merancang basis data bersama untuk lebih dari 50 tenant aktif dengan isolasi tenant_id dan empat tingkat akses JWT/RBAC. Hasilnya, tidak ada insiden akses ilegal pada lebih dari 200 pengguna.',
      'Menerapkan deployment satu perintah dengan Docker Compose dan memangkas persiapan lingkungan dari 45 menit menjadi kurang dari 2 menit.',
    ],
    features: [
      'Basis data bersama untuk banyak tenant',
      'Isolasi tenant_id yang ketat',
      'Empat tingkat akses JWT / RBAC',
      'Deployment Docker Compose satu perintah',
    ],
    metrics: [
      { value: '50+', label: 'tenant aktif bersamaan' },
      { value: '200+', label: 'pengguna' },
      { value: '0', label: 'insiden akses ilegal' },
      { value: '45 m → <2 m', label: 'waktu persiapan lingkungan' },
    ],
    github: 'https://github.com/Sushmitadasari/Multi-Tenant-SaaS-Platform',
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'tenants',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'algouniversity',
    title: 'Fellow Teknologi',
    org: 'AlgoUniversity',
    detail: 'Terpilih melalui seleksi nasional yang kompetitif untuk pendalaman DSA, optimasi algoritma, dan pemrograman kompetitif.',
    laurel: 'Seleksi Nasional',
  },
  {
    id: 'flipkart-grid',
    title: 'Semifinalis',
    org: 'Flipkart GRiD 7.0',
    detail: 'Berkompetisi bersama talenta teknik terkemuka tingkat nasional.',
    laurel: 'Semifinalis',
    link: 'https://drive.google.com/file/d/16pXA2hssyJqlYMr27wfi6U4bjKDLvh9f/view?usp=drive_link',
  },
  {
    id: 'branch-topper',
    title: 'Peringkat Tertinggi AI & ML',
    org: 'B.Tech AI & ML',
    detail: 'Meraih SGPA 9,24 pada semester tersebut.',
    laurel: 'Terbaik di Jurusan',
  },
  {
    id: 'competitive-coding',
    title: '850+ Soal Diselesaikan',
    org: 'LeetCode • GFG • CodeChef',
    detail: 'LeetCode: 350+ soal DSA (rating tertinggi 1442). GFG: 300+ soal (rating 1436). CodeChef: 200+ soal.',
    laurel: 'Pemrograman Kompetitif',
  },
  {
    id: 'hackerrank',
    title: 'Lencana 5 Bintang',
    org: 'HackerRank',
    detail: 'Memperoleh lencana 5 bintang untuk C, Python, Java, dan SQL.',
    laurel: 'Empat Bahasa',
  },
];

export type Certification = { issuer: string; name: string; link: string };

export const certifications: Certification[] = [
  { issuer: 'NPTEL', name: 'Database Management System', link: 'https://drive.google.com/file/d/1MqkJHchXeaGD4S8mzPmEGxEYddAsxAjN/view?usp=drive_link' },
  { issuer: 'NPTEL', name: 'Fundamentals of Artificial Intelligence', link: 'https://drive.google.com/file/d/1GqyUQ-lrE-bHaN457t6fIdssgGG4HMXf/view?usp=drive_link' },
  { issuer: 'NPTEL', name: 'Deep Learning', link: 'https://drive.google.com/file/d/1PWSRP5SQDPzkoTCF3A24eIJoSpTwgsff/view?usp=sharing' },
  { issuer: 'AWS', name: 'AWS Certified AI Practitioner', link: 'https://drive.google.com/file/d/1h8e5p0a9T6f5gBaOP2ROfwWHZfkkspGn/view?usp=drive_link' },
  { issuer: 'AWS', name: 'AWS Academy Graduate – Cloud Foundations', link: 'https://www.credly.com/badges/2d4810f9-3dbe-444d-99b9-61312ea5e7df/public_url' },
  { issuer: 'MongoDB', name: 'MongoDB Certified Associate Developer', link: 'https://www.credly.com/badges/fd3362bd-743a-4c4d-a68e-b1fdc5d46811/public_url' },
  { issuer: 'GitHub', name: 'GitHub Foundations', link: 'https://drive.google.com/file/d/1o0fkCAMRWTg1oMwxlqu6t6wnOpBv66Vq/view?usp=sharing' },
  { issuer: 'Pearson', name: 'IT Specialist – HTML and CSS', link: 'https://www.credly.com/badges/e4a55298-e396-41d8-a032-283aafe9fab7/public_url' },
  { issuer: 'Oracle', name: 'Java Certified Foundations Associate', link: 'https://drive.google.com/file/d/1g-yyceHtLg_k2RWiOIJqH0MMcGlaH90P/view?usp=sharing' },
  { issuer: 'Oracle', name: 'Oracle Certified Foundations Associate – Database', link: 'https://drive.google.com/file/d/10-DzabbcH2vHrI6bAohoT8czKRZMa2kV/view?usp=drive_link' },
  { issuer: 'Cisco', name: 'HTML Essentials', link: 'https://www.credly.com/badges/eb27ca95-3b2a-4948-bef9-0385d1d49055/public_url' },
  { issuer: 'Cisco', name: 'CSS Essentials', link: 'https://www.credly.com/badges/3b37497f-6a61-4889-af3c-ed337a460a0b/public_url' },
  { issuer: 'Cisco', name: 'JavaScript Essentials 1', link: 'https://www.credly.com/badges/9cdd4d55-6ecc-463f-b254-811ccdd0539c/public_url' },
  { issuer: 'Cisco', name: 'JavaScript Essentials 2', link: 'https://www.credly.com/badges/0e1b036e-4318-4c8e-b750-2aca77314442/public_url' },
  { issuer: 'Cisco', name: 'Python Essentials 1', link: 'https://www.credly.com/badges/0e21e3eb-d8ef-4770-95d7-dcbd6f8696b1/public_url' },
  { issuer: 'Udemy', name: 'Microsoft Azure Hands-On Training (AZ-900, AZ-104, AZ-305)', link: 'https://drive.google.com/file/d/1KrXClhY0nJ3Acxs7DioNf4Q1rpaMvgPT/view?usp=sharing' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Bahasa Pemrograman',
    subtitle: 'Java sebagai bahasa utama',
    skills: [
      { name: 'Java', mono: 'Jv', note: 'Utama' },
      { name: 'Python', mono: 'Py' },
      { name: 'C', mono: 'C' },
      { name: 'C++', mono: 'C+' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Antarmuka dan platform web',
    skills: [
      { name: 'React', mono: 'Re' },
      { name: 'HTML', mono: 'Ht' },
      { name: 'CSS', mono: 'Cs' },
      { name: 'JavaScript', mono: 'Js' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'Logika di sisi server',
    skills: [
      { name: 'Node.js', mono: 'No' },
      { name: 'Express.js', mono: 'Ex' },
    ],
  },
  {
    id: 'infra',
    title: 'Infrastruktur & Alat',
    subtitle: 'Deployment dan arsitektur',
    skills: [
      { name: 'Docker', mono: 'Dk' },
      { name: 'Docker Compose', mono: 'Dc' },
      { name: 'REST APIs', mono: 'Ap' },
      { name: 'Microservices', mono: 'Ms' },
      { name: 'JWT Auth', mono: 'Jw' },
      { name: 'Git / GitHub', mono: 'Gt' },
      { name: 'Postman', mono: 'Pm' },
    ],
  },
  {
    id: 'databases',
    title: 'Basis Data',
    subtitle: 'Indeks • Normalisasi',
    skills: [
      { name: 'PostgreSQL', mono: 'Pg' },
      { name: 'MongoDB', mono: 'Mg' },
      { name: 'MySQL', mono: 'My' },
    ],
  },
  {
    id: 'fundamentals',
    title: 'Dasar Ilmu Komputer',
    subtitle: 'Fondasi teknis',
    skills: [
      { name: 'DSA', mono: 'Ds' },
      { name: 'OS', mono: 'Os' },
      { name: 'CN', mono: 'Cn' },
      { name: 'DBMS', mono: 'Db' },
      { name: 'OOPs', mono: 'Oo' },
      { name: 'Collections', mono: 'Co' },
      { name: 'Multithreading', mono: 'Mt' },
    ],
  },
  {
    id: 'interests',
    title: 'Minat',
    subtitle: 'Bab berikutnya dalam serial',
    skills: [
      { name: 'Desain Sistem', mono: 'Sd' },
      { name: 'Komputasi Awan (AWS)', mono: 'Aw' },
      { name: 'Machine Learning', mono: 'Ml' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects, certifications or achievements on the resume.
 */
export const skillEvidence: Record<string, string[]> = {
  Java: ['Oracle Java Certified Foundations Associate', 'HackerRank 5 bintang'],
  Python: ['PolicyGuard AI', 'Cisco Python Essentials 1', 'HackerRank 5 bintang'],
  C: ['HackerRank 5 bintang'],
  React: ['Sistem Gerbang Pembayaran', 'Platform SaaS Multi-Tenant'],
  HTML: ['Pearson IT Specialist – HTML and CSS', 'Cisco HTML Essentials'],
  CSS: ['Pearson IT Specialist – HTML and CSS', 'Cisco CSS Essentials'],
  JavaScript: ['Cisco JavaScript Essentials 1 & 2'],
  'Node.js': ['Sistem Gerbang Pembayaran', 'Platform SaaS Multi-Tenant'],
  'Express.js': ['Sistem Gerbang Pembayaran'],
  Docker: ['Sistem Gerbang Pembayaran'],
  'Docker Compose': ['Platform SaaS Multi-Tenant'],
  'REST APIs': ['PolicyGuard AI'],
  Microservices: ['Sistem Gerbang Pembayaran'],
  'JWT Auth': ['Platform SaaS Multi-Tenant'],
  'Git / GitHub': ['GitHub Foundations'],
  PostgreSQL: ['Sistem Gerbang Pembayaran', 'Platform SaaS Multi-Tenant'],
  MongoDB: ['MongoDB Certified Associate Developer'],
  DBMS: ['NPTEL Database Management System', 'Oracle Database Foundations'],
  DSA: ['AlgoUniversity Fellow Teknologi', '850+ soal diselesaikan'],
  'Komputasi Awan (AWS)': ['AWS Certified AI Practitioner', 'AWS Academy Cloud Foundations'],
  'Machine Learning': ['B.Tech AI & ML', 'NPTEL Deep Learning'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'Awal Perjalanan',
    period: '2021 – 2023',
    synopsis: 'Masa pendidikan di Sri Chaitanya Junior College, Kakinada — Matematika, Fisika, dan Kimia.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'Membangun Fondasi',
        description: 'Menempuh BIEAP, MPC di Sri Chaitanya Junior College, Kakinada, dan lulus dengan nilai 925/1000.',
        tags: ['MPC', 'BIEAP'],
        runtime: 'Jun 2021 – Mei 2023',
        palette: amber,
      },
    ],
  },
  {
    number: 2,
    title: 'Memasuki Dunia AI & ML',
    period: '2023 – Sekarang',
    synopsis: 'Menempuh B.Tech bidang Kecerdasan Buatan dan Machine Learning di Aditya Engineering College, Surampalem.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'Menjadi Insinyur',
        description: 'Pendidikan Sarjana Teknologi di bidang Kecerdasan Buatan dan Machine Learning — CGPA 9,10.',
        tags: ['B.Tech', 'AI & ML', 'CGPA 9.10'],
        runtime: 'Okt 2023 – Sekarang',
        palette: violet,
      },
      {
        code: 'S02 E02',
        title: 'Peringkat Teratas',
        description: 'Meraih peringkat tertinggi di jurusan AI & ML dengan SGPA 9,24 pada semester tersebut.',
        tags: ['9,24 SGPA', 'Terbaik di Jurusan'],
        runtime: 'Satu semester',
        palette: crimson,
      },
      {
        code: 'S02 E03',
        title: 'Pemecah Masalah',
        description: 'Menyelesaikan 350+ soal LeetCode (rating puncak 1442), 300+ GFG (1436), 200+ CodeChef, serta meraih lencana 5 bintang HackerRank dalam C, Python, Java, dan SQL.',
        tags: ['DSA', 'LeetCode', 'GFG', 'CodeChef', 'HackerRank'],
        runtime: '850+ soal',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'Belajar Membangun',
    period: '2025 – 2026',
    synopsis: 'Satu tahun pelatihan intensif pengembangan full-stack sebagai peserta di Technical Hub Pvt Ltd.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'Masa Pelatihan',
        description: 'Pelatihan full-stack intensif meliputi frontend, backend, integrasi basis data, dan proses deployment.',
        tags: ['FSD', 'Frontend', 'Backend', 'Basis Data'],
        runtime: 'Mei 2025 – Jun 2026',
        palette: ocean,
      },
      {
        code: 'S03 E02',
        title: 'Menjadi Pengembang',
        description: 'Mengembangkan aplikasi web responsif, mulai dari antarmuka, logika server, sampai koneksi basis data.',
        tags: ['React', 'Node.js', 'Express.js'],
        runtime: 'Technical Hub',
        palette: violet,
      },
      {
        code: 'S03 E03',
        title: 'Meluncurkan Karya',
        description: 'Meluncurkan dan mengelola aplikasi web dengan kontrol versi, debugging, serta pengembangan menyeluruh.',
        tags: ['Git / GitHub', 'Deployment'],
        runtime: 'Technical Hub',
        palette: jade,
      },
    ],
  },
  {
    number: 4,
    title: 'Membangun Produk Nyata',
    period: '2026',
    synopsis: 'Tiga karya orisinal — platform AI, gerbang pembayaran, dan SaaS multi-tenant — ditambah pengakuan tingkat nasional.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'Perancang Solusi AI',
        description: 'PolicyGuard AI — tanya jawab berbasis LLM dan ekstraksi informasi dari 500+ dokumen kebijakan dengan akurasi 92%.',
        tags: ['Python', 'NLP', 'LLM'],
        runtime: '2026',
        palette: crimson,
      },
      {
        code: 'S04 E02',
        title: 'Merancang Arsitektur',
        description: 'Sistem Gerbang Pembayaran dan Platform SaaS Multi-Tenant — pengelolaan status, mikroservis, isolasi tenant, dan RBAC.',
        tags: ['Node.js', 'PostgreSQL', 'Docker'],
        runtime: '2026',
        palette: amber,
      },
      {
        code: 'S04 E03',
        title: 'Pengakuan Nasional',
        description: 'Terpilih sebagai Fellow Teknologi di AlgoUniversity dan mencapai semifinal Flipkart GRiD 7.0.',
        tags: ['AlgoUniversity', 'Flipkart GRiD 7.0'],
        runtime: 'Tingkat nasional',
        palette: ocean,
      },
    ],
  },
  {
    number: 5,
    title: 'Lanjut ke Mana?',
    period: 'Sedang tayang',
    synopsis: 'Berbagai minat baru membuka arah cerita berikutnya.',
    episodes: [
      {
        code: 'S05 E01',
        title: 'Bab Berikutnya',
        description: 'Mendalami desain sistem, komputasi awan (AWS), dan Machine Learning.',
        tags: ['Desain Sistem', 'AWS', 'Machine Learning'],
        runtime: 'Dalam proses',
        palette: violet,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Bahasa utama', title: 'Java', detail: 'Bahasa utama dalam CV • Bersertifikat Oracle', palette: amber },
  { label: 'Karya AI orisinal', title: 'PolicyGuard AI', detail: '500+ dokumen • Akurasi 92%', palette: crimson },
  { label: 'Panggung terbesar', title: 'Flipkart GRiD 7.0', detail: 'Semifinalis', palette: ocean },
  { label: 'Seleksi nasional', title: 'AlgoUniversity', detail: 'Fellow Teknologi', palette: violet },
  { label: 'Prestasi akademik', title: 'Peringkat Jurusan', detail: 'SGPA 9,24 di AI & ML', palette: jade },
  { label: 'Sertifikasi cloud', title: 'AWS AI Practitioner', detail: 'Sertifikasi AWS', palette: amber },
  { label: 'Soal diselesaikan', title: '850+', detail: 'LeetCode 350+ • GFG 300+ • CodeChef 200+', palette: crimson },
  { label: 'Perjalanan belajar', title: '1 Tahun FSD', detail: 'Technical Hub Pvt Ltd', palette: ocean },
  { label: 'Sertifikasi basis data', title: 'MongoDB', detail: 'Sertifikasi Pengembang Associate', palette: jade },
  { label: 'Fokus saat ini', title: 'Desain Sistem', detail: 'Bersama AWS & Machine Learning', palette: violet },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Pendidikan',
    title: 'B.Tech · AI & ML',
    lines: ['Aditya Engineering College, Surampalem', 'Oktober 2023 – Sekarang'],
    chips: ['CGPA 9.10'],
  },
  {
    kicker: 'Keahlian',
    title: 'Java yang utama.',
    lines: ['Python, C, C++ · React, Node.js, Express.js', 'PostgreSQL, MongoDB, MySQL · Docker, REST, JWT'],
    chips: ['Java', 'Python', 'React', 'Node.js', 'Docker', 'PostgreSQL'],
  },
  {
    kicker: 'Pelatihan',
    title: 'Perjalanan Belajar',
    lines: ['Satu tahun pelatihan pengembangan full-stack intensif', 'Peserta · Technical Hub Pvt Ltd · Mei 2025 – Juni 2026', 'Frontend · Backend · Basis Data · Deployment'],
  },
  {
    kicker: 'Proyek',
    title: 'Tiga Karya Orisinal',
    lines: ['PolicyGuard AI — 500+ dokumen, akurasi 92%', 'Gerbang Pembayaran — 1.000+ transaksi, uptime 99,8%', 'SaaS Multi-Tenant — 50+ tenant, tanpa akses ilegal'],
  },
  {
    kicker: 'Pencapaian',
    title: 'Momen Terbaik',
    lines: ['Fellow Teknologi — AlgoUniversity', 'Semifinalis — Flipkart GRiD 7.0', 'Peringkat Jurusan AI & ML — SGPA 9,24'],
  },
  {
    kicker: 'Tersertifikasi',
    title: '16 Sertifikasi',
    lines: ['AWS · MongoDB · Oracle · GitHub · Pearson', 'NPTEL · Cisco · Udemy'],
  },
  {
    kicker: 'Misi saat ini',
    title: 'Sedang dipelajari',
    lines: ['Desain Sistem · Komputasi Awan (AWS) · Machine Learning'],
  },
];

export type ProfileId = 'sushmita' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'sushmita',
    name: 'Teh Vini',
    blurb: 'Seluruh serial sesuai urutan',
    color: '#e5132b',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Rekruter',
    blurb: 'CV, pencapaian, dan keahlian lebih dulu',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks'],
  },
  {
    id: 'developer',
    name: 'Pengembang',
    blurb: 'Proyek, teknologi, dan GitHub lebih dulu',
    color: '#46e3a8',
    order: ['originals', 'skills', 'journey', 'moments', 'about', 'picks', 'story'],
  },
  {
    id: 'creative',
    name: 'Kreator',
    blurb: 'Alur cerita dan sorotan lebih dulu',
    color: '#ffb547',
    order: ['journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'Tentang', card: 'Tentang Saya', meta: 'Episode Perdana • Pendidikan & pelatihan', palette: violet },
  journey: { nav: 'Perjalanan', card: 'Perjalanan Saya', meta: `${seasons.length} Musim • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episode`, palette: amber },
  originals: { nav: 'Karya', card: 'Proyek Saya', meta: `${projects.length} Karya Orisinal • 2026`, palette: crimson },
  picks: { nav: 'Pilihan', card: 'Pilihan Teratas', meta: '10 sorotan dari CV', palette: jade },
  skills: { nav: 'Keahlian', card: 'Keahlian Saya', meta: `${skillCategories.length} Kategori`, palette: ocean },
  moments: { nav: 'Pencapaian', card: 'Pencapaian Saya', meta: `${achievements.length} Momen • ${certifications.length} Sertifikasi`, palette: crimson },
  story: { nav: 'CV', card: 'Cerita Lengkap', meta: 'CV • Lihat & unduh', palette: violet },
};
