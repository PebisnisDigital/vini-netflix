import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/components/StudioTemplateGallery.tsx', import.meta.url), 'utf8');
const editorSource = readFileSync(new URL('../src/components/StudioEditor.tsx', import.meta.url), 'utf8');

test('studio memisahkan gaya kreatif dan profesi dalam grid ringkas lima kolom di desktop', () => {
  assert.match(source, /grid-cols-2[^"\n]*md:grid-cols-3[^"\n]*lg:grid-cols-5/);
  assert.match(source, /visibleTemplates\.map\(\(item\) =>/);
  assert.match(source, /Gaya Kreatif/);
  assert.match(source, /Gaya Profesi/);
  assert.match(editorSource, /templateCatalog\.length\} Gaya/);
  assert.doesNotMatch(source, /selectedTemplateId === 'chibi-3d' &&/);
  assert.match(source, /onClick=\{onEditWebsite\}/);
  assert.match(source, /onClick=\{\(\) => selectTemplate\(item\.id\)\}/);
  assert.match(source, /href=\{item\.demoUrl\}/);
});

test('setelah gaya berhasil dipilih muncul dialog dengan pintasan ke Web Editor', () => {
  assert.match(source, /if \(onApplyTemplate\(id\)\) setNewlySelectedId\(id\)/);
  assert.match(source, /role="dialog" aria-modal="true"/);
  assert.match(source, /Gaya berhasil dipilih/);
  assert.match(source, /onEditWebsite\(\)/);
  assert.match(source, /Buka Web Editor/);
  assert.match(source, /Lihat Gaya Lain/);
  assert.match(editorSource, /!window\.confirm\([^\n]*\)\) return false;/);
});
