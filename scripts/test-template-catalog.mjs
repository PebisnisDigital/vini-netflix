import assert from 'node:assert/strict';
import { test } from 'node:test';
import { templateCatalog, identityModes, getTemplate, canApplyTemplate, canApplyIdentityMode, resolveTemplateId } from '../src/data/templateCatalog.mjs';
import { validatePublishPayload } from '../server/publishing.mjs';

test('katalog studio menyimpan tepat 16 gaya unik dan metadata palet yang valid', () => {
  assert.equal(templateCatalog.length, 16);
  assert.equal(new Set(templateCatalog.map((item) => item.id)).size, 16);
  for (const item of templateCatalog) {
    assert.ok(item.name && item.description && item.audience && item.backdrop && item.motion);
    assert.equal(item.fonts.length, 2);
    assert.equal(item.colors.length, 3);
    assert.ok(item.colors.every((color) => /^#[\da-f]{6}$/i.test(color)));
    assert.ok(['available', 'demo', 'planned'].includes(item.status));
    if (item.demoUrl) assert.match(item.demoUrl, /^\/[a-z0-9-]+$/);
  }
  assert.equal(getTemplate('original').status, 'available');
  assert.equal(getTemplate('chibi-3d').status, 'available');
  assert.equal(getTemplate('anime').status, 'available');
  assert.equal(getTemplate('clay-3d').status, 'available');
  assert.equal(getTemplate('komik-pop').status, 'available');
  assert.equal(getTemplate('komik-pop').demoUrl, '/vini6');
  assert.equal(getTemplate('editorial-premium').status, 'available');
  assert.equal(getTemplate('editorial-premium').demoUrl, '/vini7');
  assert.equal(templateCatalog.filter((item) => canApplyTemplate(item.id)).length, 6);
  assert.equal(canApplyTemplate('clay-3d'), true);
  assert.equal(canApplyTemplate('komik-pop'), true);
  assert.equal(canApplyTemplate('editorial-premium'), true);
});

test('FACELESS adalah mode identitas independen, belum dapat dipublikasikan', () => {
  assert.deepEqual(identityModes.map((mode) => mode.id), ['photo', 'avatar', 'faceless']);
  assert.equal(canApplyIdentityMode('photo'), true);
  assert.equal(canApplyIdentityMode('avatar'), false);
  assert.equal(canApplyIdentityMode('faceless'), false);
});

test('contoh gaya lama tetap dikenali tanpa memaksa migrasi JSON', () => {
  assert.equal(resolveTemplateId({ slug: 'vini2', designVariant: 'chibi-cinema' }), 'chibi-3d');
  assert.equal(resolveTemplateId({ slug: 'vini3' }), 'chibi-3d');
  assert.equal(resolveTemplateId({ slug: 'vini4' }), 'anime');
  assert.equal(resolveTemplateId({ slug: 'vini5' }), 'original');
  assert.equal(resolveTemplateId({ slug: 'satria' }), 'original');
  assert.equal(resolveTemplateId({ slug: 'satria', templateId: 'original' }), 'original');
  assert.equal(resolveTemplateId({ slug: 'satria', templateId: 'chibi-3d' }), 'chibi-3d');
  assert.equal(resolveTemplateId({ slug: 'satria', templateId: 'anime' }), 'anime');
  assert.equal(resolveTemplateId({ slug: 'satria', templateId: 'clay-3d' }), 'clay-3d');
  assert.equal(resolveTemplateId({ slug: 'satria', templateId: 'komik-pop' }), 'komik-pop');
  assert.equal(resolveTemplateId({ slug: 'satria', templateId: 'editorial-premium' }), 'editorial-premium');
});

const example = {
  slug: 'satria', name: 'Satria', role: 'Fotografer', location: 'Bandung', bio: 'Punya pengalaman fotografi produk.',
  tagline: ['Fotografi produk'], interests: [], skills: [], experiences: [], whatsapp: '081234567890',
  photo: { src: '/clients/satria/foto-utama.webp', alt: 'Satria' },
  projects: [{ title: 'Karya', description: 'Foto produk UMKM', year: '2026', category: 'Produk', tags: [], image: '/clients/satria/karya.webp' }],
};
const errors = (brief) => validatePublishPayload({ brief, assets: [], mode: 'create' });

test('publikasi menerima enam gaya aktif dan memblokir gaya yang belum siap', () => {
  assert.deepEqual(errors({ ...example, templateId: 'original', identityMode: 'photo' }), []);
  assert.deepEqual(errors({ ...example, templateId: 'chibi-3d', identityMode: 'photo' }), []);
  assert.deepEqual(errors({ ...example, templateId: 'anime', identityMode: 'photo' }), []);
  assert.deepEqual(errors({ ...example, templateId: 'clay-3d', identityMode: 'photo' }), []);
  assert.deepEqual(errors({ ...example, templateId: 'komik-pop', identityMode: 'photo' }), []);
  assert.deepEqual(errors({ ...example, templateId: 'editorial-premium', identityMode: 'photo' }), []);
  assert.ok(errors({ ...example, templateId: 'doodle' }).some((line) => line.includes('belum siap')));
  assert.ok(errors({ ...example, templateId: 'tidak-ada' }).some((line) => line.includes('tidak dikenal')));
  assert.ok(errors({ ...example, identityMode: 'faceless' }).some((line) => line.includes('belum siap')));
  assert.ok(errors({ ...example, identityMode: 'alien' }).some((line) => line.includes('tidak dikenal')));
  assert.deepEqual(errors({ ...example, designVariant: 'chibi-cinema' }), []);
});
