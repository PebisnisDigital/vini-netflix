import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { sourceForPublicSlug, publicSlugForSource, updatePrimaryClientAlias, validateClientAliasRegistry, validClientSlug } from '../src/data/clientAliases.mjs';
import { cmsDescriptor } from '../server/publishing.mjs';

test('URL baru menunjuk ke halaman yang sama tanpa memutus URL lama', () => {
  const sources = ['vini2', 'vini4', 'iis'];
  const empty = { primaryBySource: {}, aliasToSource: {} };
  assert.deepEqual(validateClientAliasRegistry(empty, sources), []);
  const first = updatePrimaryClientAlias(empty, 'vini2', 'vinicontoh');
  assert.deepEqual(validateClientAliasRegistry(first, sources), []);
  assert.equal(sourceForPublicSlug(first, 'vinicontoh'), 'vini2');
  assert.equal(sourceForPublicSlug(first, 'vini2'), 'vini2');
  assert.equal(publicSlugForSource(first, 'vini2'), 'vinicontoh');
  assert.deepEqual(empty, { primaryBySource: {}, aliasToSource: {} }, 'Tidak mengubah objek lama');

  const second = updatePrimaryClientAlias(first, 'vini2', 'viniterbaru');
  assert.deepEqual(validateClientAliasRegistry(second, sources), []);
  assert.equal(sourceForPublicSlug(second, 'vinicontoh'), 'vini2', 'Link lama tetap berfungsi');
  assert.equal(sourceForPublicSlug(second, 'viniterbaru'), 'vini2');
  assert.equal(publicSlugForSource(second, 'vini2'), 'viniterbaru');

  const restore = updatePrimaryClientAlias(second, 'vini2', 'vini2');
  assert.deepEqual(validateClientAliasRegistry(restore, sources), []);
  assert.equal(publicSlugForSource(restore, 'vini2'), 'vini2');
  assert.equal(sourceForPublicSlug(restore, 'viniterbaru'), 'vini2');
});

test('Nama bentrok, link sistem, dan peta alias rusak ditolak', () => {
  for (const name of ['', 'vini', 'studio', 'api', '../vini', 'VINI BARU', 'foo/bar', 'a'.repeat(61)]) assert.equal(validClientSlug(name), false, name);
  assert.equal(validClientSlug('vinicontoh'), true);
  const sources = ['vini2', 'vini4'];
  assert.ok(validateClientAliasRegistry({ primaryBySource: { vini2: 'vini4' }, aliasToSource: { vini4: 'vini2' } }, sources).length);
  assert.ok(validateClientAliasRegistry({ primaryBySource: { vini2: 'contoh' }, aliasToSource: { contoh: 'vini4' } }, sources).length);
  assert.ok(validateClientAliasRegistry({ primaryBySource: {}, aliasToSource: { contoh: 'klien-asing' } }, sources).length);
  assert.ok(validateClientAliasRegistry({ primaryBySource: {}, aliasToSource: { studio: 'vini2' } }, sources).length);
});

test('Status penerbitan hanya mengenali PR CMS dan PR alias yang cocok', () => {
  assert.deepEqual(cmsDescriptor({ body: 'PERSONALFLIX_ALIAS:vini2:vinicontoh\n\nPreview', head: { ref: 'cms/alias-vini2-a123' } }), { kind: 'alias', slug: 'vinicontoh', job: 'auto-publish-alias' });
  assert.deepEqual(cmsDescriptor({ body: 'PERSONALFLIX_CMS:citra\n\nPreview', head: { ref: 'cms/citra-a123' } }), { kind: 'client', slug: 'citra', job: 'auto-publish-cms' });
  assert.equal(cmsDescriptor({ body: 'PERSONALFLIX_ALIAS:vini2:vinicontoh', head: { ref: 'feat/code-change' } }), null);
  assert.equal(cmsDescriptor({ body: 'PERSONALFLIX_ALIAS:vini2:studio', head: { ref: 'cms/alias-vini2-a123' } }), null);
});

test('Peta URL proyek tetap valid', async () => {
  const registry = JSON.parse(await readFile(new URL('../src/data/clientAliases.json', import.meta.url), 'utf8'));
  const sources = (await readdir(new URL('../src/data/clients/', import.meta.url))).filter((file) => file.endsWith('.json')).map((file) => file.slice(0, -5));
  assert.deepEqual(validateClientAliasRegistry(registry, sources), []);
});
