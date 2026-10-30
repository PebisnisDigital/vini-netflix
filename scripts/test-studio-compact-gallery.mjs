import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/components/StudioTemplateGallery.tsx', import.meta.url), 'utf8');

test('studio menampilkan seluruh gaya dalam satu grid ringkas lima kolom di desktop', () => {
  assert.match(source, /grid-cols-2[^"\n]*md:grid-cols-3[^"\n]*lg:grid-cols-5/);
  assert.match(source, /templateCatalog\.map\(\(item\) =>/);
  assert.doesNotMatch(source, /templateCatalog\.filter\(\(item\) => item\.family/);
  assert.doesNotMatch(source, /selectedTemplateId === 'chibi-3d' &&/);
  assert.match(source, /onClick=\{onEditWebsite\}/);
  assert.match(source, /onClick=\{\(\) => onApplyTemplate\(item\.id\)\}/);
  assert.match(source, /href=\{item\.demoUrl\}/);
});
