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

test('template KOMIK POP memakai aset klien sendiri, palet bawaan, dan tidak membocorkan demo VINI6', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, COMIC_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'dina', name: 'Dina Permata', role: 'Kreator Edukasi', location: 'Malang',
      bio: 'Mengajar lewat materi bergambar yang mudah dipahami anak.', tagline: ['Belajar lewat komik'], interests: ['Kelas Kreatif'],
      photo: { src: '/clients/dina/hero-komik.webp', alt: 'Ilustrasi komik Dina Permata' },
      experiences: [], projects: [{ title: 'Komik Anak', year: '2026', description: 'Komik sederhana untuk belajar.', category: 'Pendidikan', tags: ['Edukasi'], image: '/clients/dina/karya.webp' }],
      skills: ['Ilustrasi Edukasi'], whatsapp: '081234567890', templateId: 'komik-pop', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'komik-pop');
    assert.equal(content.profile.displayName, 'Dina Permata');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-DINA');
    assert.equal(content.profile.portrait.src, '/clients/dina/hero-komik.webp');
    assert.equal(content.projects[0].image, '/clients/dina/karya.webp');
    assert.deepEqual(effectiveTheme(content.profile), COMIC_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'komik-pop', theme: DEFAULT_THEME }), COMIC_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'komik-pop', theme: { accent: '#aabbcc', background: '#192a3b' } }), { accent: '#aabbcc', background: '#192a3b' });
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini6/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini6.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
  } finally { await server.close(); }
});

test('template EDITORIAL PREMIUM menjaga identitas, foto, dan karya klien tanpa membocorkan demo VINI7', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, EDITORIAL_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'ratna', name: 'Ratna Kusuma', role: 'Konsultan UMKM', location: 'Surabaya',
      bio: 'Mendampingi pengusaha lokal membangun usaha yang dikenal pelanggan.', tagline: ['Cerita di balik usaha'], interests: ['Bisnis'],
      photo: { src: '/clients/ratna/foto-editorial.webp', alt: 'Foto editorial Ratna' },
      experiences: [], projects: [{ title: 'Branding UMKM', year: '2026', description: 'Kelas pengembangan usaha.', category: 'Bisnis', tags: ['UMKM'], image: '/clients/ratna/karya.webp' }],
      skills: ['Konsultasi'], whatsapp: '081234567890', templateId: 'editorial-premium', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'editorial-premium');
    assert.equal(content.profile.displayName, 'Ratna Kusuma');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-RATNA');
    assert.equal(content.profile.portrait.src, '/clients/ratna/foto-editorial.webp');
    assert.equal(content.projects[0].image, '/clients/ratna/karya.webp');
    assert.deepEqual(effectiveTheme(content.profile), EDITORIAL_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'editorial-premium', theme: DEFAULT_THEME }), EDITORIAL_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'editorial-premium', theme: { accent: '#997744', background: '#1a1a19' } }), { accent: '#997744', background: '#1a1a19' });
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini7/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini7.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('template DOODLE memakai data dan aset klien tanpa menyalin identitas demo VINI8', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, DOODLE_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'rani', name: 'Rani Wulandari', role: 'Guru Kreatif', location: 'Bogor',
      bio: 'Membuat materi belajar bergambar untuk anak-anak.', tagline: ['Belajar boleh seru'], interests: ['Edukasi'],
      photo: { src: '/clients/rani/sketsa-hero.webp', alt: 'Ilustrasi sketsa Rani' },
      experiences: [], projects: [{ title: 'Buku Gambar', year: '2026', description: 'Materi visual anak.', category: 'Pendidikan', tags: ['Doodle'], image: '/clients/rani/buku.webp' }],
      skills: ['Ilustrasi Edukasi'], whatsapp: '081234567890', templateId: 'doodle', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'doodle');
    assert.equal(content.profile.displayName, 'Rani Wulandari');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-RANI');
    assert.equal(content.profile.portrait.src, '/clients/rani/sketsa-hero.webp');
    assert.equal(content.projects[0].image, '/clients/rani/buku.webp');
    assert.deepEqual(effectiveTheme(content.profile), DOODLE_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'doodle', theme: DEFAULT_THEME }), DOODLE_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'doodle', theme: { accent: '#c37940', background: '#1b3149' } }), { accent: '#c37940', background: '#1b3149' });
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini8/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini8.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('template STORYBOOK memakai cerita dan gambar klien, bukan identitas demo VINI9', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, STORYBOOK_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'nina', name: 'Nina Maharani', role: 'Pendongeng Anak', location: 'Semarang',
      bio: 'Menghidupkan cerita anak lewat ilustrasi dan kelas membaca.', tagline: ['Setiap anak punya cerita'], interests: ['Dongeng'],
      photo: { src: '/clients/nina/buku-hero.webp', alt: 'Ilustrasi cerita Nina' },
      experiences: [], projects: [{ title: 'Taman Dongeng', year: '2026', description: 'Kelas membaca anak.', category: 'Pendidikan', tags: ['Cerita'], image: '/clients/nina/taman.webp' }],
      skills: ['Mendongeng'], whatsapp: '081234567890', templateId: 'storybook', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'storybook');
    assert.equal(content.profile.displayName, 'Nina Maharani');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-NINA');
    assert.equal(content.profile.portrait.src, '/clients/nina/buku-hero.webp');
    assert.equal(content.projects[0].image, '/clients/nina/taman.webp');
    assert.deepEqual(effectiveTheme(content.profile), STORYBOOK_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'storybook', theme: DEFAULT_THEME }), STORYBOOK_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'storybook', theme: { accent: '#a34c38', background: '#203a32' } }), { accent: '#a34c38', background: '#203a32' });
    const serialized = JSON.stringify(content);
    for (const forbidden of ['/clients/vini9/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(serialized.includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini9.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('template SCRAPBOOK menjaga data pribadi klien dan tidak meminjam foto demo VINI10', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, SCRAPBOOK_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'dini', name: 'Dini Kusuma', role: 'Kreator Kelas Craft', location: 'Solo',
      bio: 'Membuat jurnal, kelas kerajinan, dan aktivitas belajar kreatif.', tagline: ['Album karya saya'], interests: ['Craft'],
      photo: { src: '/clients/dini/portrait-craft.webp', alt: 'Foto Dini di studio kerajinan' },
      experiences: [], projects: [{ title: 'Jurnal Kreatif', year: '2026', description: 'Pelatihan craft untuk pemula.', category: 'Pendidikan', tags: ['Craft'], image: '/clients/dini/jurnal.webp' }],
      skills: ['Kerajinan'], whatsapp: '081234567890', templateId: 'scrapbook', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'scrapbook');
    assert.equal(content.profile.displayName, 'Dini Kusuma');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-DINI');
    assert.equal(content.profile.portrait.src, '/clients/dini/portrait-craft.webp');
    assert.equal(content.projects[0].image, '/clients/dini/jurnal.webp');
    assert.deepEqual(effectiveTheme(content.profile), SCRAPBOOK_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'scrapbook', theme: DEFAULT_THEME }), SCRAPBOOK_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'scrapbook', theme: { accent: '#df7945', background: '#243939' } }), { accent: '#df7945', background: '#243939' });
    for (const forbidden of ['/clients/vini10/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(JSON.stringify(content).includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini10.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('template PAPER CUT menjaga identitas klien dan tidak meminjam ilustrasi demo VINI11', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, PAPERCUT_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'rani', name: 'Rani Rahma', role: 'Guru Kreatif', location: 'Bogor',
      bio: 'Mengajarkan karya kertas dan ilustrasi digital kepada murid.', tagline: ['Bermain sambil belajar'], interests: ['Papercraft'],
      photo: { src: '/clients/rani/rani-paper-art.webp', alt: 'Ilustrasi karya Rani' },
      experiences: [], projects: [{ title: 'Buku Lipat', year: '2026', description: 'Belajar membuat buku pop-up.', category: 'Craft', tags: ['Kertas'], image: '/clients/rani/buku-lipat.webp' }],
      skills: ['Kerajinan Kertas'], whatsapp: '081234567890', templateId: 'paper-cut', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'paper-cut');
    assert.equal(content.profile.displayName, 'Rani Rahma');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-RANI');
    assert.equal(content.profile.portrait.src, '/clients/rani/rani-paper-art.webp');
    assert.equal(content.projects[0].image, '/clients/rani/buku-lipat.webp');
    assert.deepEqual(effectiveTheme(content.profile), PAPERCUT_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'paper-cut', theme: DEFAULT_THEME }), PAPERCUT_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'paper-cut', theme: { accent: '#b6427b', background: '#203951' } }), { accent: '#b6427b', background: '#203951' });
    for (const forbidden of ['/clients/vini11/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(JSON.stringify(content).includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini11.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('PIXEL RETRO menjaga data, tema dan isolasi aset demo VINI12 untuk klien baru', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, PIXEL_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'nadia', name: 'Nadia Putri', role: 'Guru Informatika', location: 'Depok',
      bio: 'Mengajar coding melalui permainan digital untuk pelajar.', tagline: ['Coding bisa menyenangkan'], interests: ['Game', 'Edukasi'],
      photo: { src: '/clients/nadia/foto-pixel-nadia.webp', alt: 'Ilustrasi pixel Nadia milik klien' },
      experiences: [], projects: [{ title: 'Game Hitung', year: '2026', description: 'Game berhitung karya Nadia.', category: 'Edukasi', tags: ['Game'], image: '/clients/nadia/game-hitung.webp' }],
      skills: ['Coding'], whatsapp: '081234567890', templateId: 'pixel-retro', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'pixel-retro');
    assert.equal(content.profile.displayName, 'Nadia Putri');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-NADIA');
    assert.equal(content.profile.portrait.src, '/clients/nadia/foto-pixel-nadia.webp');
    assert.equal(content.projects[0].image, '/clients/nadia/game-hitung.webp');
    assert.deepEqual(effectiveTheme(content.profile), PIXEL_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'pixel-retro', theme: DEFAULT_THEME }), PIXEL_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'pixel-retro', theme: { accent: '#dc812a', background: '#101a30' } }), { accent: '#dc812a', background: '#101a30' });
    for (const forbidden of ['/clients/vini12/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(JSON.stringify(content).includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini12.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('MINIATURE WORLD menjaga data klien dan tidak meminjam diorama demo VINI13', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, MINIATURE_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'laila', name: 'Laila Putri', role: 'Pemilik Toko Roti', location: 'Bogor',
      bio: 'Membangun toko roti rumahan dengan resep keluarga.', tagline: ['Dapur kecil, cerita besar'], interests: ['Roti', 'UMKM'],
      photo: { src: '/clients/laila/diorama-toko-laila.webp', alt: 'Diorama toko roti milik Laila' },
      experiences: [], projects: [{ title: 'Dapur Laila', year: '2026', description: 'Roti rumahan khas keluarga.', category: 'UMKM', tags: ['Roti'], image: '/clients/laila/diorama-dapur.webp' }],
      skills: ['Baking'], whatsapp: '081234567890', templateId: 'miniature-world', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'miniature-world');
    assert.equal(content.profile.displayName, 'Laila Putri');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-LAILA');
    assert.equal(content.profile.portrait.src, '/clients/laila/diorama-toko-laila.webp');
    assert.equal(content.projects[0].image, '/clients/laila/diorama-dapur.webp');
    assert.deepEqual(effectiveTheme(content.profile), MINIATURE_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'miniature-world', theme: DEFAULT_THEME }), MINIATURE_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'miniature-world', theme: { accent: '#c96a4b', background: '#182d36' } }), { accent: '#c96a4b', background: '#182d36' });
    for (const forbidden of ['/clients/vini13/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(JSON.stringify(content).includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini13.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli Teh Vini/);
  } finally { await server.close(); }
});

test('DOCUMENTARY menjaga identitas, aset dan kisah klien tanpa meminjam foto konsep VINI14', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief, effectiveTheme, DEFAULT_THEME, DOCUMENTARY_THEME } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const brief = {
      slug: 'rani', name: 'Rani Putri', role: 'Pendiri UMKM Batik', location: 'Solo',
      bio: 'Mendokumentasikan perjalanan membangun usaha batik rumahan.', tagline: ['Selembar kain punya kisah'], interests: ['Batik', 'Bisnis'],
      photo: { src: '/clients/rani/foto-rani.webp', alt: 'Foto kegiatan milik Rani' },
      experiences: [], projects: [{ title: 'Usaha Batik Rani', year: '2026', description: 'Proses belajar membatik bersama keluarga.', category: 'UMKM', tags: ['Batik'], image: '/clients/rani/proses-batik.webp' }],
      skills: ['Batik'], whatsapp: '081234567890', templateId: 'documentary', identityMode: 'photo',
    };
    assert.deepEqual(validateBrief(brief, { requireWhatsapp: true }), []);
    const content = createPortfolioFromBrief(brief);
    assert.equal(content.profile.templateId, 'documentary');
    assert.equal(content.profile.displayName, 'Rani Putri');
    assert.equal(content.profile.whatsapp, '081234567890');
    assert.equal(content.profile.referralCode, 'PSN-RANI');
    assert.equal(content.profile.portrait.src, '/clients/rani/foto-rani.webp');
    assert.equal(content.projects[0].image, '/clients/rani/proses-batik.webp');
    assert.deepEqual(effectiveTheme(content.profile), DOCUMENTARY_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'documentary', theme: DEFAULT_THEME }), DOCUMENTARY_THEME);
    assert.deepEqual(effectiveTheme({ templateId: 'documentary', theme: { accent: '#a5844a', background: '#1a1c19' } }), { accent: '#a5844a', background: '#1a1c19' });
    for (const forbidden of ['/clients/vini14/', 'Teh Vini', 'BADAI', 'PROMPTIONAL']) assert.equal(JSON.stringify(content).includes(forbidden), false);
    const demo = JSON.parse(await readFile(new URL('../src/data/clients/vini14.json', import.meta.url), 'utf8'));
    assert.deepEqual(validateBrief(demo, { requireWhatsapp: true }), []);
    assert.equal(createPortfolioFromBrief(demo).profile.whatsapp, '62881022445869');
    assert.match(demo.photo.alt, /bukan foto asli/);
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
