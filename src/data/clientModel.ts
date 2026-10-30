import * as vini from './portfolio';
import * as sushmita from './sushmitaOriginal';
import { portfolioServiceCTA } from './portfolioServiceCTA';
import { clientReferralCode, normalizeClientWhatsapp } from '../utils/clientWhatsapp.mjs';
import { canApplyIdentityMode, canApplyTemplate, getIdentityMode, getTemplate, type IdentityMode, type TemplateId } from './templateCatalog.mjs';

/** Satu sumber data untuk setiap halaman portofolio, tanpa teks klien lain. */
export type PortfolioContent = {
  profile: typeof vini.profile & {
    heroMeta?: string[];
    floating?: { text: string; sub: string }[];
    aboutFacts?: { k: string; v: string; s: string }[];
    websiteLabel?: string;
    theme?: ClientTheme;
    designVariant?: 'chibi-cinema';
    templateId?: TemplateId;
    identityMode?: IdentityMode;
    whatsapp?: string;
    referralCode?: string;
    clientSlug?: string;
  };
  projects: vini.Project[];
  experience: vini.Experience[];
  education: vini.Education[];
  achievements: vini.Achievement[];
  certifications: vini.Certification[];
  skillCategories: vini.SkillCategory[];
  skillEvidence: Record<string, string[]>;
  skillsHeading?: string;
  skillsAside?: string;
  skillsKicker?: string;
  seasons: vini.Season[];
  topPicks: vini.TopPick[];
  picksHeading?: string;
  picksKicker?: string;
  journeyHeading?: string;
  journeyAside?: string;
  journeyKicker?: string;
  introSlides: vini.IntroSlide[];
  viewerProfiles: typeof vini.viewerProfiles;
  sectionMeta: typeof vini.sectionMeta;
  watchCards?: WatchCard[];
};

export type ClientTheme = { accent: string; background: string };
export type WatchCard = { target: vini.SectionId; title: string; subtitle: string; image?: string };
export type PickCard = { label: string; title: string; detail: string; image?: string; palette?: vini.Palette };
export const DEFAULT_THEME: ClientTheme = { accent: '#e5132b', background: '#07070a' };
export const CHIBI_THEME: ClientTheme = { accent: '#ff1746', background: '#100309' };
export const ANIME_THEME: ClientTheme = { accent: '#ff5ca3', background: '#0a1024' };
export const CLAY_THEME: ClientTheme = { accent: '#ff876f', background: '#18223e' };
export const COMIC_THEME: ClientTheme = { accent: '#f52983', background: '#081b42' };
export const EDITORIAL_THEME: ClientTheme = { accent: '#ddb780', background: '#0d0c0c' };
export const DOODLE_THEME: ClientTheme = { accent: '#f6c94d', background: '#17334d' };
export const STORYBOOK_THEME: ClientTheme = { accent: '#d68e8b', background: '#263b32' };
export const SCRAPBOOK_THEME: ClientTheme = { accent: '#e7848c', background: '#263e44' };
export const PAPERCUT_THEME: ClientTheme = { accent: '#f3a9b7', background: '#213e4c' };
export const PIXEL_THEME: ClientTheme = { accent: '#69e8d8', background: '#10162c' };
export const MINIATURE_THEME: ClientTheme = { accent: '#95d9c2', background: '#102b35' };
export const DOCUMENTARY_THEME: ClientTheme = { accent: '#d6aa6c', background: '#111516' };
export const MINIMALIST_THEME: ClientTheme = { accent: '#365c4d', background: '#f6f6f3' };
export const FUTURISTIC_THEME: ClientTheme = { accent: '#4bdcf2', background: '#080b1a' };

/** Preset visual mengikuti gaya. Warna pilihan klien tetap lebih tinggi prioritasnya. */
export function effectiveTheme(data: { theme?: ClientTheme; templateId?: TemplateId; designVariant?: 'chibi-cinema' }): ClientTheme {
  const chibi = data.templateId === 'chibi-3d' || data.designVariant === 'chibi-cinema';
  const anime = data.templateId === 'anime';
  const clay = data.templateId === 'clay-3d';
  const comic = data.templateId === 'komik-pop';
  const editorial = data.templateId === 'editorial-premium';
  const doodle = data.templateId === 'doodle';
  const storybook = data.templateId === 'storybook';
  const scrapbook = data.templateId === 'scrapbook';
  const papercut = data.templateId === 'paper-cut';
  const pixel = data.templateId === 'pixel-retro';
  const miniature = data.templateId === 'miniature-world';
  const documentary = data.templateId === 'documentary';
  const minimalist = data.templateId === 'minimalist';
  const futuristic = data.templateId === 'futuristic-neon';
  const defaultOriginal = data.theme?.accent.toLowerCase() === DEFAULT_THEME.accent && data.theme?.background.toLowerCase() === DEFAULT_THEME.background;
  if (chibi && (!data.theme || defaultOriginal)) return CHIBI_THEME;
  if (anime && (!data.theme || defaultOriginal)) return ANIME_THEME;
  if (clay && (!data.theme || defaultOriginal)) return CLAY_THEME;
  if (comic && (!data.theme || defaultOriginal)) return COMIC_THEME;
  if (editorial && (!data.theme || defaultOriginal)) return EDITORIAL_THEME;
  if (doodle && (!data.theme || defaultOriginal)) return DOODLE_THEME;
  if (storybook && (!data.theme || defaultOriginal)) return STORYBOOK_THEME;
  if (scrapbook && (!data.theme || defaultOriginal)) return SCRAPBOOK_THEME;
  if (papercut && (!data.theme || defaultOriginal)) return PAPERCUT_THEME;
  if (pixel && (!data.theme || defaultOriginal)) return PIXEL_THEME;
  if (miniature && (!data.theme || defaultOriginal)) return MINIATURE_THEME;
  if (documentary && (!data.theme || defaultOriginal)) return DOCUMENTARY_THEME;
  if (minimalist && (!data.theme || defaultOriginal)) return MINIMALIST_THEME;
  if (futuristic && (!data.theme || defaultOriginal)) return FUTURISTIC_THEME;
  return data.theme || DEFAULT_THEME;
}

const sushmitaWatchCards: WatchCard[] = sushmita.viewerProfiles[0].order.map((target) => ({
  target, title: sushmita.sectionMeta[target].card, subtitle: sushmita.sectionMeta[target].meta, image: '',
}));

/** Data master asli dari repo Sushmita, hanya untuk kanvas contoh Studio. */
export const sushmitaContent: PortfolioContent = {
  profile: {
    ...sushmita.profile,
    links: { ...sushmita.profile.links, website: '' },
    websiteLabel: 'SUSHMITA DASARI',
    heroMeta: [sushmita.profile.location, sushmita.profile.role, `${sushmita.projects.length} Karya Pilihan`, 'AI & Machine Learning'],
    floating: sushmita.projects.map((project) => ({ text: project.title, sub: project.genre })),
    aboutFacts: [
      { k: 'Peran', v: sushmita.profile.role, s: 'Full-Stack Development' },
      { k: 'Pendidikan', v: 'B.Tech AI & ML', s: 'Aditya Engineering College' },
      { k: 'Karya', v: String(sushmita.projects.length), s: 'Proyek unggulan' },
      { k: 'Asal', v: sushmita.profile.location, s: 'Lokasi' },
    ],
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
  watchCards: sushmitaWatchCards,
};

export const viniContent: PortfolioContent = {
  profile: { ...vini.profile, websiteLabel: 'PROMPTIONAL', whatsapp: portfolioServiceCTA.whatsappNumber, referralCode: clientReferralCode('vini'), clientSlug: 'vini' },
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
  whatsapp?: string;
  links?: { website?: string; linkedin?: string; github?: string };
  experiences: { company: string; role: string; period: string; description: string }[];
  education?: { school: string; degree: string; place: string; period: string; score?: string }[];
  projects: { title: string; year: string; description: string; category: string; tags: string[]; website?: string; image?: string }[];
  skills: string[];
  skillCategories?: vini.SkillCategory[];
  skillsHeading?: string;
  skillsAside?: string;
  skillsKicker?: string;
  highlights?: { title: string; description: string; category?: string }[];
  watchCards?: WatchCard[];
  pickCards?: PickCard[];
  picksHeading?: string;
  picksKicker?: string;
  seasons?: vini.Season[];
  journeyHeading?: string;
  journeyAside?: string;
  journeyKicker?: string;
  theme?: ClientTheme;
  /** Tampilan pilihan klien, tanpa mengubah template Netflix milik klien lain. */
  designVariant?: 'chibi-cinema';
  /** ID gaya katalog Studio; status belum aktif tidak boleh diterbitkan. */
  templateId?: TemplateId;
  /** Foto asli, avatar AI, atau tanpa wajah; independen dari gaya. */
  identityMode?: IdentityMode;
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
    whatsapp: '',
    templateId: 'original',
    identityMode: 'photo',
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
    skillCategories: sushmita.skillCategories.map((group) => ({ ...group, skills: group.skills.map((skill) => ({ ...skill, evidence: [...(sushmita.skillEvidence[skill.name] ?? [])] })) })),
    highlights: sushmita.achievements.map((a) => ({ title: a.title, description: a.detail, category: a.org })),
    watchCards: sushmitaWatchCards.map((card) => ({ ...card })),
    pickCards: sushmita.topPicks.map((card) => ({ label: card.label, title: card.title, detail: card.detail, image: '', palette: { ...card.palette } })),
    seasons: sushmita.seasons.map((season) => ({ ...season, episodes: season.episodes.map((episode) => ({ ...episode, tags: [...episode.tags], palette: { ...episode.palette } })) })),
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
  if (brief.skillCategories?.some((category) => example.skillCategories?.some((sample) => sample.title === category.title) || category.skills.some((skill) => example.skills.includes(skill.name)))) leftover.push('kategori atau kartu keahlian');
  if (brief.skillCategories?.some((category) => category.skills.some((skill) => skill.evidence?.some((item) => Object.values(sushmita.skillEvidence).some((examples) => examples.includes(item)))))) leftover.push('keterangan contoh keahlian');
  if (brief.highlights?.some((item) => example.highlights?.some((sample) => sample.title === item.title))) leftover.push('pencapaian');
  if (brief.pickCards?.some((item) => example.pickCards?.some((sample) => sample.title === item.title))) leftover.push('kartu pilihan');
  if (brief.seasons?.some((season) => season.episodes.some((episode) => example.seasons?.some((sample) => sample.episodes.some((item) => item.title === episode.title))))) leftover.push('episode perjalanan');
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
export function validateBrief(value: unknown, options: { requireWhatsapp?: boolean } = {}): string[] {
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
  if (!Array.isArray(b.skills) || b.skills.length > 100) errors.push('Daftar keahlian tidak valid (maksimal 100).');
  if (b.skillCategories !== undefined) {
    if (!Array.isArray(b.skillCategories) || b.skillCategories.length < 1 || b.skillCategories.length > 12) errors.push('Kategori keahlian harus berjumlah 1–12.');
    else {
      const categoryIds = new Set<string>();
      if (b.skillCategories.reduce((sum, group) => sum + (Array.isArray(group?.skills) ? group.skills.length : 0), 0) > 100) errors.push('Jumlah total kartu keahlian maksimal 100.');
      b.skillCategories.forEach((category, i) => {
        if (!category || typeof category.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(category.id) || categoryIds.has(category.id)) errors.push(`ID kategori keahlian ${i + 1} tidak valid atau sama.`);
        categoryIds.add(category?.id);
        if (!category || typeof category.title !== 'string' || !category.title.trim() || category.title.length > 100 || typeof category.subtitle !== 'string' || category.subtitle.length > 250) errors.push(`Kategori keahlian ${i + 1} membutuhkan judul dan subjudul yang valid.`);
        if (!Array.isArray(category?.skills) || category.skills.length < 1 || category.skills.length > 40) errors.push(`Kategori keahlian ${i + 1} harus memiliki 1–40 kartu.`);
        else category.skills.forEach((skill, j) => {
          if (!skill || typeof skill.name !== 'string' || !skill.name.trim() || skill.name.length > 100 || typeof skill.mono !== 'string' || !skill.mono.trim() || skill.mono.length > 8 || (skill.note !== undefined && (typeof skill.note !== 'string' || skill.note.length > 100))) errors.push(`Kartu keahlian ${i + 1}.${j + 1} tidak valid.`);
          if (skill?.evidence !== undefined && (!Array.isArray(skill.evidence) || skill.evidence.length > 15 || skill.evidence.some((line) => typeof line !== 'string' || line.length > 250))) errors.push(`Keterangan kartu keahlian ${i + 1}.${j + 1} tidak valid.`);
        });
      });
    }
  }
  for (const key of ['skillsHeading', 'skillsAside', 'skillsKicker'] as const) if (b[key] !== undefined && (typeof b[key] !== 'string' || !b[key].trim())) errors.push(`Teks ${key} tidak valid.`);
  if (b.highlights && !Array.isArray(b.highlights)) errors.push('Daftar pencapaian tidak valid.');
  if (Array.isArray(b.highlights)) b.highlights.forEach((h, i) => { if (!h.title?.trim() || !h.description?.trim()) errors.push(`Sorotan ${i + 1} perlu judul dan penjelasan.`); });
  if (b.watchCards !== undefined) {
    if (!Array.isArray(b.watchCards) || b.watchCards.length < 1 || b.watchCards.length > 30) errors.push('Kartu Lanjutkan Menjelajah harus berjumlah 1–30.');
    else b.watchCards.forEach((card, i) => {
      if (!card || typeof card.title !== 'string' || !card.title.trim() || typeof card.subtitle !== 'string' || !card.subtitle.trim()) errors.push(`Kartu jelajah ${i + 1} memerlukan judul dan keterangan.`);
      if (!card || !['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'].includes(card.target)) errors.push(`Tujuan kartu jelajah ${i + 1} tidak valid.`);
      if (card?.image && (typeof card.image !== 'string' || !card.image.startsWith(`/clients/${b.slug}/`) || !/\.(?:png|jpe?g|webp|avif)$/i.test(card.image))) errors.push(`Foto jelajah ${i + 1} harus berada dalam folder klien.`);
    });
  }
  if (b.pickCards !== undefined) {
    if (!Array.isArray(b.pickCards) || b.pickCards.length < 1 || b.pickCards.length > 30) errors.push('Kartu Pilihan harus berjumlah 1–30.');
    else b.pickCards.forEach((card, i) => {
      if (!card || !['label', 'title', 'detail'].every((key) => typeof card[key as keyof PickCard] === 'string' && String(card[key as keyof PickCard]).trim())) errors.push(`Kartu pilihan ${i + 1} memerlukan label, judul, dan deskripsi.`);
      if (card?.image && (typeof card.image !== 'string' || !card.image.startsWith(`/clients/${b.slug}/`) || !/\.(?:png|jpe?g|webp|avif)$/i.test(card.image))) errors.push(`Foto pilihan ${i + 1} harus berada dalam folder klien.`);
      if (card?.palette && !['from', 'via', 'to', 'accent'].every((key) => /^#[0-9a-fA-F]{6}$/.test(String(card.palette?.[key as keyof vini.Palette] ?? '')))) errors.push(`Warna kartu pilihan ${i + 1} tidak valid.`);
    });
  }
  if (b.picksHeading !== undefined && (typeof b.picksHeading !== 'string' || !b.picksHeading.trim())) errors.push('Judul bagian Pilihan wajib diisi.');
  if (b.picksKicker !== undefined && (typeof b.picksKicker !== 'string' || !b.picksKicker.trim())) errors.push('Keterangan bagian Pilihan wajib diisi.');
  if (b.seasons !== undefined) {
    if (!Array.isArray(b.seasons) || b.seasons.length < 1 || b.seasons.length > 10) errors.push('Musim harus berjumlah 1–10.');
    else b.seasons.forEach((season, i) => {
      if (!season || typeof season.title !== 'string' || !season.title.trim() || typeof season.period !== 'string' || !season.period.trim() || typeof season.synopsis !== 'string' || !season.synopsis.trim()) errors.push(`Musim ${i + 1} wajib memiliki judul, periode, dan ringkasan.`);
      if (!Array.isArray(season?.episodes) || season.episodes.length < 1 || season.episodes.length > 15) errors.push(`Episode musim ${i + 1} harus berjumlah 1–15.`);
      else season.episodes.forEach((episode, j) => {
        if (!episode || !['title', 'description', 'runtime'].every((key) => typeof episode[key as keyof vini.Episode] === 'string' && String(episode[key as keyof vini.Episode]).trim()) || !Array.isArray(episode.tags)) errors.push(`Episode ${i + 1}.${j + 1} wajib memiliki judul, durasi, deskripsi, dan tag yang valid.`);
        if (episode?.image && (typeof episode.image !== 'string' || !episode.image.startsWith(`/clients/${b.slug}/`) || !/\.(?:png|jpe?g|webp|avif)$/i.test(episode.image))) errors.push(`Foto episode ${i + 1}.${j + 1} harus dalam folder klien.`);
        if (!episode?.palette || !['from', 'via', 'to', 'accent'].every((key) => /^#[a-f0-9]{6}$/i.test(String(episode.palette[key as keyof vini.Palette] || '')))) errors.push(`Warna episode ${i + 1}.${j + 1} tidak valid.`);
      });
    });
  }
  for (const key of ['journeyHeading', 'journeyAside', 'journeyKicker'] as const) if (b[key] !== undefined && (typeof b[key] !== 'string' || !b[key].trim())) errors.push(`Teks ${key} tidak valid.`);
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.push('Format email tidak valid.');
  if (b.whatsapp !== undefined && typeof b.whatsapp !== 'string') errors.push('Nomor WhatsApp pemilik website tidak valid.');
  else if (b.whatsapp?.trim() && !normalizeClientWhatsapp(b.whatsapp)) errors.push('Nomor WhatsApp harus berupa nomor seluler Indonesia yang valid (contoh: 08... atau 628...).');
  if (options.requireWhatsapp && !normalizeClientWhatsapp(b.whatsapp)) errors.push('Nomor WhatsApp pemilik website wajib diisi untuk tombol referral.');
  if (b.theme && (!/^#[0-9a-fA-F]{6}$/.test(b.theme.accent) || !/^#[0-9a-fA-F]{6}$/.test(b.theme.background))) errors.push('Warna tema harus menggunakan kode hex 6 digit.');
  if (b.designVariant !== undefined && b.designVariant !== 'chibi-cinema') errors.push('Pilihan gaya website tidak dikenal.');
  if (b.templateId !== undefined && !getTemplate(b.templateId)) errors.push('Template website tidak dikenal.');
  else if (b.templateId !== undefined && !canApplyTemplate(b.templateId)) errors.push('Template ini baru tersedia sebagai demo atau rencana. Belum dapat diterbitkan untuk klien.');
  if (b.identityMode !== undefined && !getIdentityMode(b.identityMode)) errors.push('Mode identitas tidak dikenal.');
  else if (b.identityMode !== undefined && !canApplyIdentityMode(b.identityMode)) errors.push('Mode avatar AI dan FACELESS belum siap diterbitkan.');
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
  // Pertahankan kelompok dan simbol persis seperti master Sushmita, termasuk
  // pada draft lama yang hanya menyimpan daftar keahlian datar.
  const originalNames = sushmita.skillCategories.flatMap((group) => group.skills.map((skill) => skill.name));
  const isUneditedOldSample = !brief.skillCategories && JSON.stringify(brief.skills) === JSON.stringify(originalNames);
  const skillCategories: vini.SkillCategory[] = brief.skillCategories?.length
    ? brief.skillCategories.map((group) => ({ ...group, skills: group.skills.map((skill) => ({ ...skill, evidence: skill.evidence ? [...skill.evidence] : undefined })) }))
    : isUneditedOldSample
      ? sushmita.skillCategories.map((group) => ({ ...group, skills: group.skills.map((skill) => ({ ...skill, evidence: [...(sushmita.skillEvidence[skill.name] ?? [])] })) }))
      : [{ id: 'keahlian', title: 'Keahlian Saya', subtitle: 'Bidang yang saya tekuni', skills: (brief.skills.length ? brief.skills : [brief.role]).map((name) => ({ name, mono: name.slice(0, 2).toUpperCase() })) }];
  const skillNames = skillCategories.flatMap((category) => category.skills.map((skill) => skill.name));
  const seasonEpisodes = (number: number, records: { title: string; description: string; tags: string[]; runtime: string; palette: vini.Palette }[]): vini.Season['episodes'] =>
    records.map((record, i) => ({ ...record, code: `S${String(number).padStart(2, '0')} E${String(i + 1).padStart(2, '0')}` }));
  const generatedSeasons: vini.Season[] = [
    { number: 1, title: 'Perkenalan', period: 'Cerita Awal', synopsis: brief.bio, episodes: seasonEpisodes(1, [
      { title: `Kenalan dengan ${name}`, description: brief.bio, tags: tags.slice(0, 3), runtime: 'Cerita Saya', palette: palettes[0] },
    ]) },
    { number: 2, title: 'Pendidikan', period: 'Masa Belajar', synopsis: `Perjalanan belajar ${name}.`, episodes: seasonEpisodes(2,
      (brief.education?.length ? brief.education : [{ school: 'Belajar Sepanjang Hayat', degree: brief.role, place: brief.location, period: 'Perjalanan' }]).map((school, i) => ({
        title: school.degree, description: `${school.school} — ${school.place}`, tags: [school.school, school.degree].filter(Boolean), runtime: school.period, palette: palettes[i % palettes.length],
      }))) },
    { number: 3, title: 'Pengalaman', period: 'Perjalanan Karier', synopsis: `Pengalaman dan aktivitas ${name}.`, episodes: seasonEpisodes(3,
      (experience.length ? experience : [{ company: 'Perjalanan Saya', role: brief.role, place: brief.location, period: 'Kini', points: [brief.bio] }]).map((job, i) => ({
        title: job.role, description: `${job.company} — ${job.points.join(' ')}`, tags: [job.company, job.role], runtime: job.period, palette: palettes[(i + 1) % palettes.length],
      }))) },
    { number: 4, title: 'Karya Pilihan', period: 'Hasil Perjalanan', synopsis: `Karya yang telah dibuat ${name}.`, episodes: seasonEpisodes(4,
      projects.map((project) => ({ title: project.title, description: project.logline, tags: project.stack.slice(0, 3), runtime: project.year, palette: project.palette }))) },
    { number: 5, title: 'Langkah Berikutnya', period: 'Sekarang', synopsis: `Bidang yang ingin terus dikembangkan ${name}.`, episodes: seasonEpisodes(5, [
      { title: 'Cerita Selanjutnya', description: `Terus bertumbuh melalui ${brief.interests.length ? brief.interests.join(', ') : brief.role}.`, tags: brief.interests.slice(0, 3), runtime: 'Berlanjut', palette: palettes[3] },
    ]) },
  ];
  const seasons: vini.Season[] = (brief.seasons ?? generatedSeasons).map((season, i) => ({ ...season, number: i + 1, episodes: season.episodes.map((episode, j) => ({ ...episode, code: `S${String(i + 1).padStart(2, '0')} E${String(j + 1).padStart(2, '0')}` })) }));
  const highlightsForPicks: vini.TopPick[] = [
    ...projects.map((p) => ({ label: p.genre, title: p.title, detail: p.logline, palette: p.palette })),
    ...achievements.map((a, i) => ({ label: a.org, title: a.title, detail: a.detail, palette: palettes[i % palettes.length] })),
    ...skillNames.map((s, i) => ({ label: 'Keahlian', title: s, detail: `Bidang yang ditekuni ${name}`, palette: palettes[i % palettes.length] })),
    ...brief.interests.map((interest, i) => ({ label: 'Minat', title: interest, detail: `Hal yang diminati ${name}`, palette: palettes[(i + 2) % palettes.length] })),
  ];
  const topPicks: vini.TopPick[] = brief.pickCards?.map((card, i) => ({
    label: card.label, title: card.title, detail: card.detail, image: card.image || '', palette: card.palette ?? palettes[i % palettes.length],
  })) ?? highlightsForPicks.slice(0, 10);
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
  const watchCards: WatchCard[] = brief.watchCards ?? vini.viewerProfiles[0].order.map((target) => ({
    target, title: sectionMeta[target].card, subtitle: sectionMeta[target].meta, image: '',
  }));
  return {
    profile: {
      fullName: name.toUpperCase(), displayName: name, firstName: name.toUpperCase(), seriesTag: 'THE SERIES',
      originalLabel: `KISAH ORIGINAL ${name.toUpperCase()}`, role: brief.role,
      tagline: tags, intro: brief.bio, location: brief.location, email: brief.email || '',
      whatsapp: brief.whatsapp || '', referralCode: clientReferralCode(brief.slug), clientSlug: brief.slug,
      links: { linkedin: brief.links?.linkedin || '', github: brief.links?.github || '', website: brief.links?.website || '' },
      resumePdf: '', portrait: { src: brief.photo.src, srcSet: brief.photo.srcSet || '', alt: brief.photo.alt || `Foto ${name}` },
      interests: brief.interests, heroMeta: [brief.location, brief.role, `${projects.length} Karya`],
      floating: projects.slice(0, 3).map((p) => ({ text: p.title, sub: p.genre })),
      aboutFacts: [
        { k: 'Peran', v: brief.role, s: 'Aktivitas utama' },
        { k: 'Karya', v: String(projects.length), s: 'Karya dan inisiatif' },
        { k: 'Keahlian', v: String(skillNames.length), s: 'Bidang yang ditekuni' },
        { k: 'Asal', v: brief.location, s: 'Lokasi' },
      ],
      websiteLabel: brief.links?.website && validUrl(brief.links.website) ? new URL(brief.links.website).hostname : undefined,
      theme: brief.theme,
      designVariant: brief.designVariant,
      templateId: brief.templateId || 'original',
      identityMode: brief.identityMode || 'photo',
    },
    projects, experience, education: (brief.education ?? []).map((e) => ({ school: e.school, degree: e.degree, place: e.place, period: e.period, score: e.score || '' })), achievements, certifications: [], skillCategories,
    skillEvidence: {}, skillsHeading: brief.skillsHeading, skillsAside: brief.skillsAside, skillsKicker: brief.skillsKicker, seasons, journeyHeading: brief.journeyHeading, journeyAside: brief.journeyAside, journeyKicker: brief.journeyKicker, topPicks, picksHeading: brief.picksHeading, picksKicker: brief.picksKicker, introSlides, viewerProfiles, sectionMeta, watchCards,
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
