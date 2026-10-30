import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { templateCatalog } from '../src/data/templateCatalog.mjs';

test('setiap gaya Studio memakai isi demo sendiri, ORIGINAL saja memakai Sushmita', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { createCanvasPortfolio, sushmitaExampleBrief } = await server.ssrLoadModule('/src/data/clientModel.ts');
    const { createStudioStarterBrief, getStudioDemoBrief, withStudioDemoPreviewAssets, isUneditedStudioStarter, findUnreplacedStudioDemoFields } = await server.ssrLoadModule('/src/data/studioStyleStarters.ts');
    assert.deepEqual(createStudioStarterBrief('original'), sushmitaExampleBrief());
    assert.equal(getStudioDemoBrief('original'), null);

    for (const style of templateCatalog.filter((item) => item.id !== 'original')) {
      const demo = getStudioDemoBrief(style.id);
      const starter = createStudioStarterBrief(style.id);
      assert.ok(demo, `${style.name} punya sumber data demo`);
      assert.equal(starter.templateId, style.id);
      assert.equal(starter.name, demo.name);
      assert.equal(starter.bio, demo.bio);
      assert.deepEqual(starter.projects.map((item) => item.title), demo.projects.map((item) => item.title));
      assert.notEqual(starter.name, 'Sushmita Dasari');
      assert.equal(starter.slug, '');
      assert.equal(starter.whatsapp, '');
      assert.equal(starter.photo.src, '');
      assert.ok(starter.projects.every((item) => !item.image && !item.website));
      assert.ok(starter.watchCards?.every((item) => !item.image) ?? true);
      assert.ok(isUneditedStudioStarter(starter));
      assert.equal(isUneditedStudioStarter({ ...starter, name: 'Klien Baru' }), false);
      assert.ok(findUnreplacedStudioDemoFields(starter).length > 0);

      const bare = createCanvasPortfolio(starter);
      const preview = withStudioDemoPreviewAssets(bare, starter);
      assert.equal(preview.profile.templateId, style.id);
      assert.equal(preview.profile.portrait.src, demo.photo.src);
      assert.equal(preview.projects[0].image, demo.projects[0].image || '');
      assert.equal(starter.photo.src, '', 'gambar demo tidak disimpan ke data klien');
      if (demo.watchCards?.[0]?.image) assert.equal(preview.watchCards[0].image, demo.watchCards[0].image);

      const customPhoto = { ...starter, photo: { ...starter.photo, src: '/clients/klien-baru/foto.webp' } };
      assert.equal(withStudioDemoPreviewAssets(createCanvasPortfolio(customPhoto), customPhoto).profile.portrait.src, customPhoto.photo.src, 'foto klien tidak tertimpa oleh contoh');
    }
  } finally { await server.close(); }
});
