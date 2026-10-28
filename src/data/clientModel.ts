import * as vini from './portfolio';
import * as sushmita from './sushmitaOriginal';

/** Satu sumber data untuk setiap halaman portofolio, tanpa teks klien lain. */
export type PortfolioContent = {
  profile: typeof vini.profile & {
    heroMeta?: string[];
    floating?: { text: string; sub: string }[];
    aboutFacts?: { k: string; v: string; s: string }[];
    websiteLabel?: string;
    theme?: ClientTheme;
  };
  projects: vini.Project[];
  experience: vini.Experience[];
  education: vini.Education[];
  achievements: vini.Achievement[];
  certifications: vini.Certification[];
  skillCategories: vini.SkillCategory[];
  skillEvidence: Record<string, string[]>;
  seasons: vini.Season[];
  topPicks: vini.TopPick[];
  introSlides: vini.IntroSlide[];
  viewerProfiles: typeof vini.viewerProfiles;
  sectionMeta: typeof vini.sectionMeta;
};

export type ClientTheme = { accent: string; background: string };
export const DEFAULT_THEME: ClientTheme = { accent: '#e5132b', background: '#07070a' };

/** Data master asli dari repo Sushmita, hanya untuk kanvas contoh Studio. */
export const sushmitaContent: PortfolioContent = {
  profile: {
    ...sushmita.profile,
    links: { ...sushmita.profile.links, website: '' },
    websiteLabel: 'SUSHMITA DASARI',
  },
  projects: sushmita.projects,
  experience: sushmita.experience,
  education: sushmita.education,
  achievements: sushmita.achievements,
  certifications: sushmita.certifications,
  skillCategories: sushmita.skillCategories,
  skillEvidence: sushmita.skillEvidence,
  seasons: sushmita.seasons,
  topPicks: sushmita.topPicks,
  introSlides: sushmita.introSlides,
  viewerProfiles: sushmita.viewerProfiles.map((p) => ({ ...p, id: p.id === 'sushmita' ? 'vini' : p.id })) as typeof vini.viewerProfiles,
  sectionMeta: sushmita.sectionMeta,
};

export const viniContent: PortfolioContent = {
  profile: { ...vini.profile, websiteLabel: 'PROMPTIONAL' },
  projects: vini.projects,
  experience: vini.experience,
  education: vini.education,
  achievements: vini.achievements,
  certifications: vini.certifications,
  skillCategories: vini.skillCategories,
  skillEvidence: vini.skillEvidence,
  seasons: vini.seasons,
  topPicks: vini.topPicks,
  introSlides: vini.introSlides,
  viewerProfiles: vini.viewerProfiles,
  sectionMeta: vini.sectionMeta,
};

export type ClientBrief = {
  slug: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  tagline: string[];
  interests: string[];
  photo: { src: string; alt: string; srcSet?: string };
  email?: string;
  links?: { website?: string; linkedin?: string; github?: string };
  experiences: { company: string; role: string; period: string; description: string }[];
  education?: { school: string; degree: string; place: string; period: string; score?: string }[];
  projects: { title: string; year: string; description: string; category: string; tags: string[]; website?: string; image?: string }[];
  skills: string[];
  highlights?: { title: string; description: string; category?: string }[];
  theme?: ClientTheme;
};

/** Isi awal proyek baru: mengikuti naskah portofolio Sushmita dari repo referensi. */
export function sushmitaExampleBrief(): ClientBrief {
  return {
    slug: '', // URL klien baru harus ditentukan sendiri, tidak boleh mengambil URL Sushmita.
    name: sushmita.profile.displayName,
    role: sushmita.profile.role,
    location: sushmita.profile.location,
    bio: sushmita.profile.intro,
    tagline: [...sushmita.profile.tagline],
    interests: [...sushmita.profile.interests],
    photo: { src: '', alt: sushmita.profile.portrait.alt },
    email: sushmita.profile.email,
    links: { ...sushmita.profile.links, website: '' },
    projects: sushmita.projects.map((p) => ({
      title: p.title, year: p.year, description: p.logline, category: p.genre,
      tags: [...p.stack], website: p.github || '', image: '',
    })),
    experiences: sushmita.experience.map((e) => ({
      company: e.company, role: e.role, period: e.period, description: e.points.join('\n'),
    })),
    education: sushmita.education.map((e) => ({ ...e })),
    skills: sushmita.skillCategories.flatMap((group) => group.skills.map((skill) => skill.name)),
    highlights: sushmita.achievements.map((a) => ({ title: a.title, description: a.detail, category: a.org })),
  };
}

/** Jangan mengizinkan data pribadi atau proyek contoh ikut tayang sebagai milik klien. */
export function findUnreplacedSushmitaExamples(brief: ClientBrief): string[] {
  const example = sushmitaExampleBrief();
  const leftover: string[] = [];
  if (brief.name.trim().toLowerCase() === example.name.toLowerCase()) leftover.push('nama');
  if (brief.role.trim() === example.role) leftover.push('profesi');
  if (brief.location.trim() === example.location) leftover.push('lokasi');
  if (brief.bio.trim() === example.bio.trim()) leftover.push('cerita diri');
  if (brief.email?.trim().toLowerCase() === example.email?.toLowerCase()) leftover.push('email');
  if (brief.links?.linkedin === example.links?.linkedin || brief.links?.github === example.links?.github) leftover.push('tautan profil');
  if (brief.projects.some((project) => example.projects.some((item) => item.title === project.title))) leftover.push('judul karya');
  if (brief.projects.some((project) => example.projects.some((item) => item.description === project.description))) leftover.push('deskripsi karya');
  if (brief.experiences.some((item) => example.experiences.some((sample) => sample.company === item.company))) leftover.push('pengalaman');
  if (brief.education?.some((item) => example.education?.some((sample) => sample.school === item.school))) leftover.push('pendidikan');
  if (brief.skills.some((skill) => example.skills.includes(skill))) leftover.push('keahlian');
  if (brief.highlights?.some((item) => example.highlights?.some((sample) => sample.title === item.title))) leftover.push('pencapaian');
  if (brief.tagline.some((line) => example.tagline.includes(line))) leftover.push('headline');
  if (brief.interests.some((interest) => example.interests.includes(interest))) leftover.push('minat');
  return leftover;
}

export const RESERVED_SLUGS = new Set(['vini', 'formulir', 'studio', 'admin', 'api', 'assets', 'demo', 'preview', 'index', 'favicon', 'robots', 'sitemap']);

export function normalizeSlug(value: string) {
  return value.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function validUrl(url: string) {
  try { return ['http:', 'https:'].includes(new URL(url).protocol); } catch { return false; }
}

/** Dipakai formulir, validasi build, dan pemuatan halaman. */
export function validateBrief(value: unknown): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['Data klien harus berupa objek.'];
  const b = value as Partial<ClientBrief>;
  const errors: string[] = [];
  if (typeof b.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.slug) || RESERVED_SLUGS.has(b.slug)) errors.push('Nama URL tidak valid atau sudah dipakai sistem.');
  for (const [key, label] of [['name', 'Nama'], ['role', 'Profesi'], ['location', 'Lokasi'], ['bio', 'Cerita singkat']] as const) {
    if (typeof b[key] !== 'string' || b[key]!.trim().length < 3) errors.push(`${label} wajib diisi (minimal 3 karakter).`);
  }
  if (!Array.isArray(b.tagline) || !b.tagline.some((s) => typeof s === 'string' && s.trim())) errors.push('Isi minimal satu kalimat sorotan.');
  if (!Array.isArray(b.interests)) errors.push('Daftar minat tidak valid.');
  if (!b.photo || typeof b.photo.src !== 'string' || !/^\/clients\/[a-z0-9-]+\/[a-zA-Z0-9._-]+\.(?:png|jpe?g|webp|avif)$/.test(b.photo.src)) errors.push('Path foto harus /clients/nama-url/nama-foto.webp (atau PNG/JPG/AVIF).');
  if (b.photo && typeof b.photo.src === 'string' && typeof b.slug === 'string' && !b.photo.src.startsWith(`/clients/${b.slug}/`)) errors.push('Foto harus berada di folder klien yang sama.');
  if (!Array.isArray(b.projects) || b.projects.length === 0) errors.push('Minimal satu karya/aktivitas untuk portofolio.');
  else b.projects.forEach((p, i) => {
    if (!p || typeof p.title !== 'string' || !p.title.trim() || typeof p.description !== 'string' || !p.description.trim()) errors.push(`Karya ${i + 1} perlu judul dan deskripsi.`);
    if (p?.website && !validUrl(p.website)) errors.push(`Link karya ${i + 1} tidak valid.`);
    if (p?.image && (typeof p.image !== 'string' || !p.image.startsWith(`/clients/${b.slug}/`) || !/\.(?:png|jpe?g|webp|avif)$/i.test(p.image))) errors.push(`Foto karya ${i + 1} harus dalam folder klien.`);
    if (p && !Array.isArray(p.tags)) errors.push(`Karya ${i + 1}: kata kunci harus berupa daftar.`);
  });
  if (!Array.isArray(b.experiences)) errors.push('Daftar pengalaman tidak valid.');
  if (b.education && !Array.isArray(b.education)) errors.push('Daftar pendidikan tidak valid.');
  if (Array.isArray(b.education)) b.education.forEach((e, i) => { if (!e.school?.trim() || !e.degree?.trim()) errors.push(`Pendidikan ${i + 1} perlu sekolah dan jurusan/gelar.`); });
  if (!Array.isArray(b.skills)) errors.push('Daftar keahlian tidak valid.');
  if (b.highlights && !Array.isArray(b.highlights)) errors.push('Daftar pencapaian tidak valid.');
  if (Array.isArray(b.highlights)) b.highlights.forEach((h, i) => { if (!h.title?.trim() || !h.description?.trim()) errors.push(`Sorotan ${i + 1} perlu judul dan penjelasan.`); });
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.push('Format email tidak valid.');
  if (b.theme && (!/^#[0-9a-fA-F]{6}$/.test(b.theme.accent) || !/^#[0-9a-fA-F]{6}$/.test(b.theme.background))) errors.push('Warna tema harus menggunakan kode hex 6 digit.');
  for (const [label, url] of Object.entries(b.links ?? {})) if (url && !validUrl(url)) errors.push(`Link ${label} harus diawali https://.`);
  return errors;
}

const palettes: vini.Palette[] = [
  { from: '#260815', via: '#792342', to: '#08080d', accent: '#ff547e' },
  { from: '#121831', via: '#31527e', to: '#08090e', accent: '#72c5ff' },
  { from: '#172011', via: '#426e2b', to: '#090b07', accent: '#a4e675' },
  { from: '#28160b', via: '#76552b', to: '#0b0808', accent: '#ffbd6f' },
];

export function createPortfolioFromBrief(brief: ClientBrief, options: { draft?: boolean } = {}): PortfolioContent {
  const errors = options.draft ? [] : validateBrief(brief);
  if (errors.length) throw new Error(`Data ${brief.slug || 'klien'} belum siap: ${errors.join(' ')}`);
  const name = brief.name.trim();
  const tags = brief.tagline.filter(Boolean);
  const projects: vini.Project[] = brief.projects.map((p, i) => ({
    id: `${i + 1}-${normalizeSlug(p.title)}`, title: p.title, image: p.image, year: p.year || 'Karya', genre: p.category || 'Portofolio',
    logline: p.description, stack: p.tags ?? [], build: [p.description],
    features: (p.tags?.length ? p.tags : [p.category || 'Karya']).filter(Boolean), metrics: [],
    github: p.website, palette: { ...palettes[i % palettes.length], accent: brief.theme?.accent || palettes[i % palettes.length].accent }, motif: (['shield', 'flow', 'tenants'] as const)[i % 3],
  }));
  const experience: vini.Experience[] = brief.experiences.map((e) => ({
    company: e.company, role: e.role, period: e.period, place: brief.location, points: [e.description],
  }));
  const highlights: vini.Achievement[] = (brief.highlights ?? []).filter((a) => a.title && a.description).map((a, i) => ({
    id: `sorotan-${i + 1}`, title: a.title, org: a.category || 'Perjalanan', detail: a.description, laurel: 'SOROTAN',
  }));
  const achievements = highlights.length ? highlights : projects.slice(0, 4).map((p) => ({
    id: `karya-${p.id}`, title: p.title, org: p.genre, detail: p.logline, laurel: 'KARYA',
  }));
  const skillCategories: vini.SkillCategory[] = [{
    id: 'keahlian', title: 'Keahlian Saya', subtitle: 'Bidang yang saya tekuni',
    skills: (brief.skills.length ? brief.skills : [brief.role]).map((name) => ({ name, mono: name.slice(0, 2).toUpperCase() })),
  }];
  const seasons: vini.Season[] = [
    { number: 1, title: 'Perkenalan', period: 'Cerita awal', synopsis: brief.bio, episodes: [{
      code: 'S01 E01', title: `Kenalan dengan ${name}`, description: brief.bio, tags: tags.slice(0, 3), runtime: 'Cerita saya', palette: palettes[0],
    }] },
    { number: 2, title: 'Pengalaman & Karya', period: 'Perjalanan', synopsis: `Perjalanan dan karya ${name}.`, episodes: projects.map((p, i) => ({
      code: `S02 E${String(i + 1).padStart(2, '0')}`, title: p.title, description: p.logline, tags: p.stack.slice(0, 3), runtime: p.year, palette: p.palette,
    })) },
  ];
  const topPicks: vini.TopPick[] = [
    ...projects.map((p) => ({ label: p.genre, title: p.title, detail: p.logline, palette: p.palette })),
    ...brief.skills.map((s, i) => ({ label: 'Keahlian', title: s, detail: `Bidang yang ditekuni ${name}`, palette: palettes[i % palettes.length] })),
  ];
  const introSlides: vini.IntroSlide[] = [
    { kicker: 'Kenalan', title: `Halo, Saya ${name}`, lines: [brief.role, brief.location], chips: tags.slice(0, 3) },
    { kicker: 'Cerita saya', title: 'Perjalanan Saya', lines: [brief.bio], chips: brief.interests.slice(0, 3) },
    ...projects.slice(0, 4).map((p) => ({ kicker: 'Karya', title: p.title, lines: [p.logline], chips: p.stack.slice(0, 3) })),
  ];
  const viewerProfiles: typeof vini.viewerProfiles = vini.viewerProfiles.map((p) => p.id === 'vini'
    ? { ...p, name, blurb: 'Tonton semua ceritanya' }
    : p.id === 'developer' ? { ...p, name: 'Penasaran Karya', blurb: 'Lihat karya dan keahlian' } : p);
  const sectionMeta: typeof vini.sectionMeta = {
    ...vini.sectionMeta,
    about: { ...vini.sectionMeta.about, meta: `Kenalan dengan ${name}` },
    journey: { ...vini.sectionMeta.journey, meta: `${seasons.length} Musim · ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episode` },
    originals: { ...vini.sectionMeta.originals, meta: `${projects.length} Karya Pilihan` },
    picks: { ...vini.sectionMeta.picks, card: 'Pilihan Karya', meta: `${topPicks.length} sorotan` },
    skills: { ...vini.sectionMeta.skills, meta: `${skillCategories.length} Bidang` },
    moments: { ...vini.sectionMeta.moments, meta: `${achievements.length} Sorotan` },
  };
  return {
    profile: {
      fullName: name.toUpperCase(), displayName: name, firstName: name.toUpperCase(), seriesTag: 'THE SERIES',
      originalLabel: `KISAH ORIGINAL ${name.toUpperCase()}`, role: brief.role,
      tagline: tags, intro: brief.bio, location: brief.location, email: brief.email || '',
      links: { linkedin: brief.links?.linkedin || '', github: brief.links?.github || '', website: brief.links?.website || '' },
      resumePdf: '', portrait: { src: brief.photo.src, srcSet: brief.photo.srcSet || '', alt: brief.photo.alt || `Foto ${name}` },
      interests: brief.interests, heroMeta: [brief.location, brief.role, `${projects.length} Karya`],
      floating: projects.slice(0, 3).map((p) => ({ text: p.title, sub: p.genre })),
      aboutFacts: [
        { k: 'Peran', v: brief.role, s: 'Aktivitas utama' },
        { k: 'Karya', v: String(projects.length), s: 'Karya dan inisiatif' },
        { k: 'Keahlian', v: String(brief.skills.length), s: 'Bidang yang ditekuni' },
        { k: 'Asal', v: brief.location, s: 'Lokasi' },
      ],
      websiteLabel: brief.links?.website && validUrl(brief.links.website) ? new URL(brief.links.website).hostname : undefined,
      theme: brief.theme,
    },
    projects, experience, education: (brief.education ?? []).map((e) => ({ school: e.school, degree: e.degree, place: e.place, period: e.period, score: e.score || '' })), achievements, certifications: [], skillCategories,
    skillEvidence: {}, seasons, topPicks, introSlides, viewerProfiles, sectionMeta,
  };
}

/** Fallback khusus kanvas: bentuk portofolio yang sama, tanpa menganggap draft kosong sudah siap dipublikasikan. */
export function createCanvasPortfolio(brief: ClientBrief): PortfolioContent {
  // Sebelum disentuh, proyek baru menampilkan seluruh contoh original, termasuk
  // lima musim, sepuluh sorotan, sertifikasi, animasi, dan foto Sushmita.
  const example = sushmitaExampleBrief();
  if (!brief.slug && JSON.stringify(brief) === JSON.stringify(example)) return sushmitaContent;
  const slug = normalizeSlug(brief.slug) || 'contoh';
  const safe: ClientBrief = {
    ...brief,
    slug,
    name: brief.name.trim() || 'NAMA KLIEN',
    role: brief.role.trim() || 'PROFESI KLIEN',
    location: brief.location.trim() || 'Kota, Indonesia',
    bio: brief.bio.trim() || 'Tulis cerita singkat tentang diri dan perjalanan klien. Gunakan Panel Edit untuk mengubahnya di Studio.',
    tagline: brief.tagline.length ? brief.tagline : ['CERITA', 'KARYA', 'PERJALANAN'],
    photo: { ...brief.photo, src: brief.photo.src || '/assets/portrait-720.webp', alt: brief.photo.alt || 'Foto utama klien' },
    projects: brief.projects.length ? brief.projects.map((p, i) => ({ ...p, title: p.title || `KARYA ${i + 1}`, description: p.description || 'Ceritakan karya unggulan klien di sini.' })) : [{ title: 'KARYA PERTAMA', description: 'Ceritakan karya unggulan klien di sini.', category: 'Portofolio', year: String(new Date().getFullYear()), tags: [], image: '' }],
    experiences: brief.experiences || [], skills: brief.skills || [], interests: brief.interests || [],
  };
  return createPortfolioFromBrief(safe, { draft: true });
}
