import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';

test('data Satria mengganti seluruh konten tanpa identitas klien lain', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createCanvasPortfolio, createPortfolioFromBrief, validateBrief } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const sample = {
      slug: 'satria', name: 'Satria', role: 'Fotografer', location: 'Jakarta',
      bio: 'Fotografer potret dan produk di Jakarta.', tagline: ['Fotografi potret'], interests: ['Foto'],
      photo: { src: '/clients/satria/foto-utama.webp', alt: 'Satria' },
      experiences: [{ company: 'Studio Satria', role: 'Fotografer', period: '2022—Sekarang', description: 'Fotografi produk' }],
      education: [{ school: 'Sekolah Seni', degree: 'Fotografi', place: 'Jakarta', period: '2018', score: '' }],
      projects: [{ title: 'Foto Produk', year: '2026', description: 'Potret produk lokal', category: 'Fotografi', tags: ['Foto'], image: '/clients/satria/karya-1.webp' }],
      skills: ['Fotografi'], links: {}, whatsapp: '081234567890',
    };
    assert.deepEqual(validateBrief(sample), []);
    assert.deepEqual(validateBrief(sample, { requireWhatsapp: true }), []);
    assert.ok(validateBrief({ ...sample, whatsapp: '' }, { requireWhatsapp: true }).some((message) => message.includes('WhatsApp')));
    const page = createPortfolioFromBrief(sample);
    assert.equal(page.profile.displayName, 'Satria');
    assert.equal(page.profile.whatsapp, sample.whatsapp);
    assert.equal(page.profile.referralCode, 'PSN-SATRIA');
    assert.equal(page.profile.clientSlug, 'satria');
    assert.equal(page.profile.portrait.src, sample.photo.src);
    assert.equal(page.projects[0].image, '/clients/satria/karya-1.webp');
    assert.equal(page.education[0].school, 'Sekolah Seni');
    assert.equal(page.viewerProfiles[0].name, 'Satria');
    assert.equal(page.watchCards.length, 7);
    const content = JSON.stringify(page);
    for (const forbidden of ['Teh Vini', 'Cuanify ID', 'BADAI', 'PROMPTIONAL']) assert.equal(content.includes(forbidden), false, `${forbidden} tidak boleh bocor`);
    assert.ok(validateBrief({ ...sample, slug: 'vini' }).length > 0);
    assert.ok(validateBrief({ ...sample, projects: [] }).length > 0);
    const themed = createPortfolioFromBrief({ ...sample, theme: { accent: '#14c5b8', background: '#040f12' } });
    assert.equal(themed.profile.theme.accent, '#14c5b8');
    assert.equal(themed.projects[0].palette.accent, '#14c5b8');
    assert.ok(validateBrief({ ...sample, theme: { accent: 'red', background: '#040f12' } }).length > 0);
    const watchCards = [{ target: 'moments', title: 'Cerita Saya', subtitle: 'Sorotan perjalanan', image: '/clients/satria/jelajah-1.webp' }];
    const withWatch = createPortfolioFromBrief({ ...sample, watchCards });
    assert.deepEqual(withWatch.watchCards, watchCards);
    assert.deepEqual(validateBrief({ ...sample, watchCards }), []);
    assert.ok(validateBrief({ ...sample, watchCards: [] }).length > 0);
    assert.ok(validateBrief({ ...sample, watchCards: [{ ...watchCards[0], target: '#bahaya' }] }).length > 0);
    assert.ok(validateBrief({ ...sample, watchCards: [{ ...watchCards[0], image: '/clients/orang-lain/jelajah-1.webp' }] }).length > 0);
    const pickCards = [{ label: 'TERBARU', title: 'Foto Pilihan', detail: 'Karya pilihan pelanggan', image: '/clients/satria/pilihan-1.webp', palette: { from: '#123456', via: '#234567', to: '#345678', accent: '#abcdef' } }];
    const withPicks = createPortfolioFromBrief({ ...sample, pickCards, picksHeading: 'Pilihan Satria', picksKicker: 'Cerita pilihan' });
    assert.equal(withPicks.topPicks.length, 1);
    assert.equal(withPicks.topPicks[0].image, pickCards[0].image);
    assert.equal(withPicks.topPicks[0].title, 'Foto Pilihan');
    assert.equal(withPicks.picksHeading, 'Pilihan Satria');
    assert.deepEqual(validateBrief({ ...sample, pickCards }), []);
    assert.ok(validateBrief({ ...sample, pickCards: [] }).length > 0);
    assert.ok(validateBrief({ ...sample, pickCards: [{ ...pickCards[0], image: '/clients/orang-lain/pilihan-1.webp' }] }).length > 0);
    assert.ok(validateBrief({ ...sample, pickCards: [{ ...pickCards[0], palette: { ...pickCards[0].palette, accent: 'red' } }] }).length > 0);
    const seasons = [{ number: 1, title: 'Perjalanan Foto', period: '2026', synopsis: 'Berkarya di Bandung', episodes: [{ code: 'S01 E01', title: 'Mulai Berkarya', runtime: '2026', description: 'Belajar fotografi', tags: ['Foto'], image: '/clients/satria/musim-1-episode-1.webp', palette: { from: '#111111', via: '#222222', to: '#333333', accent: '#ff2244' } }] }];
    const withSeasons = createPortfolioFromBrief({ ...sample, seasons, journeyHeading: 'Perjalanan Satria' });
    assert.equal(withSeasons.seasons.length, 1);
    assert.equal(withSeasons.seasons[0].episodes[0].image, seasons[0].episodes[0].image);
    assert.equal(withSeasons.journeyHeading, 'Perjalanan Satria');
    assert.deepEqual(validateBrief({ ...sample, seasons }), []);
    assert.ok(validateBrief({ ...sample, seasons: [] }).length);
    assert.ok(validateBrief({ ...sample, seasons: [{ ...seasons[0], episodes: [] }] }).length);
    assert.ok(validateBrief({ ...sample, seasons: [{ ...seasons[0], episodes: [{ ...seasons[0].episodes[0], image: '/clients/lain/musim-1-episode-1.webp' }] }] }).length);
    const skillCategories = [
      { id: 'foto', title: 'Fotografi', subtitle: 'Studio dan komposisi', skills: [{ name: 'Foto Produk', mono: 'FP', note: 'Utama', evidence: ['Portofolio UMKM'] }] },
      { id: 'editing', title: 'Editing', subtitle: 'Sentuhan akhir', skills: [{ name: 'Warna', mono: 'WR' }] },
    ];
    const groupedSkills = createPortfolioFromBrief({ ...sample, skillCategories, skills: skillCategories.flatMap((group) => group.skills.map((skill) => skill.name)), skillsHeading: 'Keahlian Satria' });
    assert.equal(groupedSkills.skillCategories.length, 2);
    assert.equal(groupedSkills.skillCategories[0].skills[0].note, 'Utama');
    assert.deepEqual(groupedSkills.skillCategories[0].skills[0].evidence, ['Portofolio UMKM']);
    assert.equal(groupedSkills.skillsHeading, 'Keahlian Satria');
    assert.deepEqual(validateBrief({ ...sample, skillCategories }), []);
    assert.ok(validateBrief({ ...sample, skillCategories: [] }).length);
    assert.ok(validateBrief({ ...sample, skillCategories: [...skillCategories, { ...skillCategories[0] }] }).length);
    assert.ok(validateBrief({ ...sample, skillCategories: [{ ...skillCategories[0], skills: [] }] }).length);
    assert.ok(validateBrief({ ...sample, skillCategories: [{ ...skillCategories[0], skills: [{ name: 'Foto', mono: 'SANGATPANJANG' }] }] }).length);
    const unfinished = createCanvasPortfolio({ ...sample, slug: '', name: '', role: '', location: '', bio: '', tagline: [], projects: [{ ...sample.projects[0], title: '', description: '' }], photo: { src: '', alt: '' } });
    assert.equal(unfinished.profile.displayName, 'NAMA KLIEN');
    assert.equal(unfinished.projects[0].title, 'KARYA 1');
  } finally { await server.close(); }
});

test('vini2 adalah demo chibi yang tetap memakai data dan WhatsApp Teh Vini', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = JSON.parse(await readFile(new URL('../src/data/clients/vini2.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const page = createPortfolioFromBrief(brief);
    assert.equal(page.profile.designVariant, 'chibi-cinema');
    assert.equal(page.profile.clientSlug, 'vini2');
    assert.equal(page.profile.referralCode, 'PSN-VINI2');
    assert.equal(page.profile.whatsapp, '62881022445869');
    assert.equal(page.profile.portrait.src, '/clients/vini2/hero-chibi.webp');
    assert.equal(page.projects[0].image, '/clients/vini2/poster-badai.webp');
    assert.equal(page.projects[1].image, '/clients/vini2/poster-promptional.webp');
    assert.ok(validateBrief({ ...brief, designVariant: 'not-a-real-template' }).some((message) => message.includes('gaya')));
  } finally { await server.close(); }
});

test('template CHIBI dapat dipakai klien baru tanpa membawa identitas demo', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, CHIBI_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'maya', name: 'Maya Putri', role: 'Mentor UMKM', location: 'Bandung',
      bio: 'Membantu pemilik usaha belajar membuat konten produk.', tagline: ['Belajar Konten'], interests: ['UMKM'],
      photo: { src: '/clients/maya/foto-utama.webp', alt: 'Ilustrasi karakter Maya Putri' },
      experiences: [], projects: [{ title: 'Kelas Konten', year: '2026', description: 'Belajar membuat foto produk.', category: 'Edukasi', tags: ['UMKM'] }],
      skills: ['Konten Produk'], whatsapp: '081234567890', templateId: 'chibi-3d', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'chibi-3d');
    assert.equal(content.profile.portrait.src, '/clients/maya/foto-utama.webp');
    assert.equal(content.profile.displayName, 'Maya Putri');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-MAYA');
    assert.equal(effectiveTheme(content.profile).accent, CHIBI_THEME.accent);
    assert.deepEqual(effectiveTheme({ templateId: 'original' }), DEFAULT_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'chibi-3d', theme: { accent: '#1188ff', background: '#070f21' } }), { accent: '#1188ff', background: '#070f21' });
    assert.deepEqual(effectiveTheme({ templateId: 'original', theme: DEFAULT_THEME }), DEFAULT_THEME);
    assert.deepEqual(effectiveTheme({ designVariant: 'chibi-cinema' }), CHIBI_THEME);
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini2/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
  } finally { await server.close(); }
});

test('template ANIME memakai identitas dan karya klien sendiri, bukan demo VINI4', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, ANIME_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'nina', name: 'Nina Putri', role: 'Guru Kreatif', location: 'Semarang',
      bio: 'Berbagi media pembelajaran menarik untuk keluarga dan guru.', tagline: ['Mengajar dengan ceria'], interests: ['Pendidikan'],
      photo: { src: '/clients/nina/karakter-anime.webp', alt: 'Ilustrasi karakter anime Nina Putri' },
      experiences: [], projects: [{ title: 'Cerita Huruf', year: '2026', description: 'Game belajar huruf.', category: 'Belajar', tags: ['Edukasi'], image: '/clients/nina/cerita-huruf.webp' }],
      skills: ['Media Pembelajaran'], whatsapp: '081234567890', templateId: 'anime', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'anime');
    assert.equal(content.profile.displayName, 'Nina Putri');
    assert.equal(content.profile.displayName.trim().split(/\s+/)[0], 'Nina');
    assert.equal(content.profile.portrait.src, '/clients/nina/karakter-anime.webp');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-NINA');
    assert.equal(content.projects[0].image, '/clients/nina/cerita-huruf.webp');
    assert.deepEqual(effectiveTheme(content.profile), ANIME_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'anime', theme: DEFAULT_THEME }), ANIME_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'anime', theme: { accent: '#1888cc', background: '#121525' } }), { accent: '#1888cc', background: '#121525' });
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini4/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
  } finally { await server.close(); }
});

test('template CLAY 3D memakai data dan nomor WhatsApp klien tanpa meminjam ilustrasi VINI5', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, CLAY_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'aisyah', name: 'Aisyah Putri', role: 'Pengajar Anak', location: 'Yogyakarta',
      bio: 'Mendampingi keluarga membuat mainan belajar kreatif.', tagline: ['Belajar dengan menyenangkan'], interests: ['Parenting'],
      photo: { src: '/clients/aisyah/karakter-clay.webp', alt: 'Karakter clay Aisyah Putri' },
      experiences: [], projects: [{ title: 'Mainan Alfabet', year: '2026', description: 'Boneka clay untuk belajar huruf.', category: 'Pendidikan', tags: ['Edu'], image: '/clients/aisyah/alfabet.webp' }],
      skills: ['Permainan Edukasi'], whatsapp: '081234567890', templateId: 'clay-3d', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'clay-3d');
    assert.equal(content.profile.displayName, 'Aisyah Putri');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-AISYAH');
    assert.equal(content.profile.portrait.src, '/clients/aisyah/karakter-clay.webp');
    assert.equal(content.projects[0].image, '/clients/aisyah/alfabet.webp');
    assert.deepEqual(effectiveTheme(content.profile), CLAY_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'clay-3d', theme: DEFAULT_THEME }), CLAY_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'clay-3d', theme: { accent: '#aabbcc', background: '#192a3b' } }), { accent: '#aabbcc', background: '#192a3b' });
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini5/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
  } finally { await server.close(); }
});

test('proyek baru memakai contoh Sushmita yang lengkap tanpa membuatnya siap terbit', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createCanvasPortfolio, findUnreplacedSushmitaExamples, sushmitaExampleBrief } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const example = sushmitaExampleBrief();
    const canvas = createCanvasPortfolio(example);
    assert.equal(canvas.profile.displayName, 'Sushmita Dasari');
    assert.equal(canvas.profile.portrait.src, '/assets/portrait-720.webp');
    assert.equal(canvas.projects.length, 3);
    assert.equal(canvas.seasons.length, 5);
    assert.equal(canvas.skillCategories.length, 7);
    assert.equal(example.skillCategories.length, 7);
    assert.equal(example.skillCategories[0].title, 'Languages');
    assert.equal(example.skillCategories[0].skills[0].mono, 'Jv');
    assert.equal(example.seasons.length, 5);
    assert.equal(canvas.topPicks.length, 10);
    assert.equal(example.pickCards.length, 10);
    assert.equal(canvas.certifications.length, 16);
    assert.equal(canvas.watchCards.length, 7);
    assert.equal(canvas.watchCards[0].title, 'About Me');
    assert.equal(example.slug, '');
    assert.equal(example.photo.src, '');
    assert.ok(findUnreplacedSushmitaExamples(example).length >= 4);
    const adapted = createCanvasPortfolio({ ...example, name: 'Satria', slug: 'satria', email: '', links: {}, photo: { src: '', alt: 'Foto Satria' } });
    assert.equal(adapted.profile.displayName, 'Satria');
    assert.equal(adapted.profile.portrait.src, '/assets/portrait-720.webp');
    assert.equal(adapted.skillCategories.length, 7, 'Kategori asli tetap ada setelah nama klien diganti');
    const changed = { ...example, name: 'Satria', skillCategories: example.skillCategories.map((group, i) => i === 0 ? { ...group, title: 'Keterampilan Saya', skills: [{ ...group.skills[0], name: 'Keahlian Baru', mono: 'KB' }] } : group) };
    assert.equal(createCanvasPortfolio(changed).skillCategories[0].skills[0].name, 'Keahlian Baru');
    assert.ok(findUnreplacedSushmitaExamples(example).includes('kategori atau kartu keahlian'));
  } finally { await server.close(); }
});
