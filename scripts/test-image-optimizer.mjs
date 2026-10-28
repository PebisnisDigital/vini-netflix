import test from 'node:test';
import assert from 'node:assert/strict';
import { IMAGE_PRESETS, optimizeStudioImage } from '../src/utils/imageOptimizer.mjs';

async function withFakeBrowser(run, { width = 2400, height = 1800, makeBlob } = {}) {
  const originalBitmap = globalThis.createImageBitmap;
  const originalDocument = globalThis.document;
  const calls = { alpha: false, clear: 0, draw: 0, closed: 0, encoded: 0 };
  try {
    globalThis.createImageBitmap = async () => ({ width, height, close() { calls.closed++; } });
    globalThis.document = {
      createElement(type) {
        assert.equal(type, 'canvas');
        return {
          width: 0, height: 0,
          getContext(context, options) {
            assert.equal(context, '2d');
            calls.alpha = options.alpha === true;
            return { clearRect() { calls.clear++; }, drawImage() { calls.draw++; } };
          },
          toBlob(callback, type, quality) {
            assert.equal(type, 'image/webp');
            calls.encoded++;
            const blob = makeBlob ? makeBlob(this.width, this.height, quality) :
              new Blob([new Uint8Array(Math.ceil(this.width * this.height * quality * 0.4))], { type: 'image/webp' });
            callback(blob);
          },
        };
      },
    };
    await run(calls);
  } finally {
    globalThis.createImageBitmap = originalBitmap;
    globalThis.document = originalDocument;
  }
}

test('foto kecil JPG tetap diubah menjadi WebP sesuai batas kartu', async () => {
  await withFakeBrowser(async (calls) => {
    const input = new File([new Uint8Array(1024)], 'kegiatan.JPG', { type: 'image/jpeg' });
    const optimized = await optimizeStudioImage(input, 'card');
    assert.equal(optimized.type, 'image/webp');
    assert.equal(optimized.name, 'kegiatan.webp');
    assert.ok(optimized.size <= IMAGE_PRESETS.card.targetBytes);
    assert.ok(calls.encoded >= 1);
    assert.equal(calls.closed, 1);
  });
});

test('foto hero PNG menjaga kanvas alpha tanpa menambahkan latar belakang', async () => {
  await withFakeBrowser(async (calls) => {
    const input = new File([new Uint8Array(1000)], 'hero.png', { type: 'image/png' });
    const optimized = await optimizeStudioImage(input, 'hero');
    assert.equal(optimized.type, 'image/webp');
    assert.equal(optimized.name, 'hero.webp');
    assert.ok(optimized.size <= IMAGE_PRESETS.hero.targetBytes);
    assert.equal(calls.alpha, true);
    assert.ok(calls.clear > 0 && calls.draw > 0);
    assert.equal(calls.closed, 1);
  });
});

test('foto asli di atas 2,5 MB dikompres sebelum dikirim ke GitHub', async () => {
  await withFakeBrowser(async () => {
    const input = new File([new Uint8Array(2_700_000)], 'foto-besar.jpg', { type: 'image/jpeg' });
    const optimized = await optimizeStudioImage(input, 'work');
    assert.ok(optimized.size < input.size);
    assert.ok(optimized.size <= IMAGE_PRESETS.work.targetBytes);
  });
});

test('format salah dan konversi browser yang tidak mendukung WebP ditolak', async () => {
  await assert.rejects(() => optimizeStudioImage(new File(['hello'], 'file.txt', { type: 'text/plain' }), 'card'), /PNG, JPG, WebP, atau AVIF/);
  await withFakeBrowser(async (calls) => {
    const input = new File([new Uint8Array(1000)], 'foto.png', { type: 'image/png' });
    await assert.rejects(() => optimizeStudioImage(input, 'card'), /belum bisa mengonversi/);
    assert.equal(calls.closed, 1);
  }, { makeBlob: () => new Blob([new Uint8Array(100)], { type: 'image/png' }) });
});

test('jika target ketat tidak tercapai, WebP terkecil tetap boleh dipakai hingga 2,5 MB', async () => {
  await withFakeBrowser(async () => {
    const input = new File([new Uint8Array(1000)], 'tekstur.png', { type: 'image/png' });
    const optimized = await optimizeStudioImage(input, 'card');
    assert.equal(optimized.type, 'image/webp');
    assert.equal(optimized.size, 500_000);
  }, { makeBlob: () => new Blob([new Uint8Array(500_000)], { type: 'image/webp' }) });
});
