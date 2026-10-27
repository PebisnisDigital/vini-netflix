import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

test('data Satria mengganti seluruh konten tanpa identitas klien lain', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createPortfolioFromBrief, validateBrief } = await server.ssrLoadModule('/src/data/clientModel.ts');
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
    const content = JSON.stringify(page);
    for (const forbidden of ['Teh Vini', 'Cuanify ID', 'BADAI', 'PROMPTIONAL']) assert.equal(content.includes(forbidden), false, `${forbidden} tidak boleh bocor`);
    assert.ok(validateBrief({ ...sample, slug: 'vini' }).length > 0);
    assert.ok(validateBrief({ ...sample, projects: [] }).length > 0);
  } finally { await server.close(); }
});
