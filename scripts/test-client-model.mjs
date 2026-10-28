import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

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
      skills: ['Fotografi'], links: {},
    };
    assert.deepEqual(validateBrief(sample), []);
    const page = createPortfolioFromBrief(sample);
    assert.equal(page.profile.displayName, 'Satria');
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
    const unfinished = createCanvasPortfolio({ ...sample, slug: '', name: '', role: '', location: '', bio: '', tagline: [], projects: [{ ...sample.projects[0], title: '', description: '' }], photo: { src: '', alt: '' } });
    assert.equal(unfinished.profile.displayName, 'NAMA KLIEN');
    assert.equal(unfinished.projects[0].title, 'KARYA 1');
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
    assert.equal(canvas.topPicks.length, 10);
    assert.equal(canvas.certifications.length, 16);
    assert.equal(canvas.watchCards.length, 7);
    assert.equal(canvas.watchCards[0].title, 'About Me');
    assert.equal(example.slug, '');
    assert.equal(example.photo.src, '');
    assert.ok(findUnreplacedSushmitaExamples(example).length >= 4);
    const adapted = createCanvasPortfolio({ ...example, name: 'Satria', slug: 'satria', email: '', links: {}, photo: { src: '', alt: 'Foto Satria' } });
    assert.equal(adapted.profile.displayName, 'Satria');
    assert.equal(adapted.profile.portrait.src, '/assets/portrait-720.webp');
  } finally { await server.close(); }
});
