import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { strFromU8, unzipSync } from 'fflate';

const sample = {
  slug: 'satria', name: 'Satria Putra', role: 'Fotografer', location: 'Bandung',
  bio: 'Fotografer produk dan pembuat konten.', tagline: ['Fotografi produk'], interests: ['Desain'],
  photo: { src: '/clients/satria/foto-utama.png', alt: 'Foto Satria' },
  email: '', links: {}, experiences: [], education: [], highlights: [],
  projects: [{ title: 'Katalog Produk', year: '2026', description: 'Koleksi foto untuk merek lokal.', category: 'Foto', tags: ['Produk'], image: '/clients/satria/karya-1.webp' }],
  skills: ['Fotografi'],
};

test('satu ZIP menyiapkan JSON dan foto pada path repo yang sesuai', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createClientPackage } = await server.ssrLoadModule('/src/data/clientPackage.ts');
    const portraitBytes = Uint8Array.from([137, 80, 78, 71, 10]);
    const projectBytes = Uint8Array.from([82, 73, 70, 70, 10]);
    const portrait = new File([portraitBytes], 'asli-portrait.PNG', { type: 'image/png' });
    const project = new File([projectBytes], 'nama karya.WEBP', { type: 'image/webp' });
    const result = unzipSync(await createClientPackage(sample, portrait, { 0: project }));
    assert.deepEqual(Object.keys(result).sort(), [
      'PANDUAN.txt', 'public/clients/satria/foto-utama.png',
      'public/clients/satria/karya-1.webp', 'src/data/clients/satria.json',
    ]);
    const json = JSON.parse(strFromU8(result['src/data/clients/satria.json']));
    assert.deepEqual(json, sample);
    assert.deepEqual(result['public/clients/satria/foto-utama.png'], portraitBytes);
    assert.deepEqual(result['public/clients/satria/karya-1.webp'], projectBytes);
    assert.match(strFromU8(result['PANDUAN.txt']), /npm run verify/);
    await assert.rejects(createClientPackage({ ...sample, slug: 'vini' }, portrait, { 0: project }), /Nama URL tidak valid/);
    await assert.rejects(createClientPackage(sample, null, { 0: project }), /Foto utama wajib/);
    await assert.rejects(createClientPackage(sample, portrait, {}), /Foto karya 1 belum dipilih/);
    await assert.rejects(createClientPackage(sample, new File(['not-image'], 'bad.txt', { type: 'text/plain' }), { 0: project }), /Format gambar tidak didukung/);
    await assert.rejects(createClientPackage(sample, new File([], 'empty.png', { type: 'image/png' }), { 0: project }), /ukuran foto/);
  } finally { await server.close(); }
});
