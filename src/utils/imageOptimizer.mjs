/** Batas ukuran unduhan untuk gambar baru di portfolio PESONAFLIX. */
export const IMAGE_PRESETS = Object.freeze({
  hero: { maxEdge: 1600, targetBytes: 400_000 },
  work: { maxEdge: 1200, targetBytes: 150_000 },
  card: { maxEdge: 960, targetBytes: 100_000 },
  episode: { maxEdge: 1200, targetBytes: 150_000 },
});

const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif']);
const MAX_SOURCE_BYTES = 25_000_000;
const MAX_UPLOAD_BYTES = 2_500_000;

function toWebp(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
}

/**
 * Konversi foto ke WebP sebelum masuk draft/GitHub, termasuk file yang sudah kecil.
 * Canvas transparan dipertahankan: tidak ada latar putih yang ditambahkan.
 * Target adalah anggaran ukuran, bukan alasan untuk menghilangkan foto jika
 * WebP paling kecil masih sedikit di atas target (maksimal unggah tetap 2,5 MB).
 */
export async function optimizeStudioImage(file, kind = 'work') {
  const preset = IMAGE_PRESETS[kind];
  if (!preset) throw new Error('Jenis foto tidak dikenal.');
  if (!ACCEPTED_TYPES.has(file?.type)) throw new Error('Gunakan foto PNG, JPG, WebP, atau AVIF.');
  if (!file.size || file.size > MAX_SOURCE_BYTES) throw new Error('Foto asli terlalu besar. Pilih foto maksimal 25 MB.');

  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error('Foto belum dapat dibaca. Coba ekspor ulang sebagai JPG atau PNG.'); }

  try {
    if (bitmap.width < 1 || bitmap.height < 1) throw new Error('Resolusi foto tidak valid.');
    const scale = Math.min(1, preset.maxEdge / Math.max(bitmap.width, bitmap.height));
    let width = Math.max(1, Math.round(bitmap.width * scale));
    let height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('Perangkat tidak mendukung pemrosesan foto.');

    let smallest = null;
    const qualities = [0.84, 0.74, 0.62, 0.5];
    for (let resize = 0; resize < 6; resize++) {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);

      for (const quality of qualities) {
        const blob = await toWebp(canvas, quality);
        if (!blob || blob.type !== 'image/webp' || !blob.size) throw new Error('Browser belum bisa mengonversi foto ke WebP.');
        if (!smallest || blob.size < smallest.size) smallest = blob;
        if (blob.size <= preset.targetBytes) return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
      }

      if (Math.max(width, height) <= 320) break;
      width = Math.max(1, Math.round(width * 0.78));
      height = Math.max(1, Math.round(height * 0.78));
    }

    if (!smallest || smallest.size > MAX_UPLOAD_BYTES) throw new Error('Foto masih terlalu besar. Coba foto dengan resolusi lebih kecil.');
    return new File([smallest], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
  } finally {
    bitmap.close();
  }
}
