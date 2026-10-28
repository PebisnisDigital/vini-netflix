import { strToU8, zipSync } from 'fflate';
import { validateBrief, type ClientBrief } from './clientModel';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif']);

export function imageExtension(file: File): string {
  return file.name.split('.').pop()?.toLowerCase() ?? '';
}

export function imagePath(slug: string, file: File, name: string): string {
  return `/clients/${slug}/${name}.${imageExtension(file)}`;
}

/** Siapkan satu ZIP yang jalur berkasnya langsung cocok dengan struktur repo. */
export async function createClientPackage(
  brief: ClientBrief,
  portrait: File | null,
  projectPhotos: Record<number, File>,
): Promise<Uint8Array> {
  const errors = validateBrief(brief);
  if (!portrait) errors.push('Foto utama wajib dipilih.');

  const photos: { file: File; path: string }[] = [];
  if (portrait) {
    photos.push({ file: portrait, path: imagePath(brief.slug, portrait, 'foto-utama') });
    if (brief.photo.src !== photos[0].path) errors.push('Path foto utama tidak cocok dengan berkas yang dipilih.');
  }

  for (const [key, file] of Object.entries(projectPhotos)) {
    const index = Number(key);
    if (!Number.isSafeInteger(index) || index < 0 || index >= brief.projects.length) {
      errors.push('Ada foto karya yang tidak terkait dengan data karya.');
      continue;
    }
    const path = imagePath(brief.slug, file, `karya-${index + 1}`);
    photos.push({ file, path });
    if (brief.projects[index].image !== path) errors.push(`Path foto karya ${index + 1} tidak cocok.`);
  }

  for (const [index, project] of brief.projects.entries()) {
    if (project.image && !projectPhotos[index]) errors.push(`Foto karya ${index + 1} belum dipilih.`);
  }

  for (const { file, path } of photos) {
    if (!IMAGE_EXTENSIONS.has(imageExtension(file)) || (file.type && !file.type.startsWith('image/'))) {
      errors.push(`Format gambar tidak didukung: ${file.name}`);
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      errors.push(`${file.name}: ukuran foto harus lebih dari 0 dan maksimal 10 MB.`);
    }
    if (!path.startsWith(`/clients/${brief.slug}/`)) errors.push(`Lokasi foto tidak valid: ${file.name}`);
  }
  if (errors.length) throw new Error([...new Set(errors)].join('\n'));

  const entries: Record<string, Uint8Array> = {
    [`src/data/clients/${brief.slug}.json`]: strToU8(`${JSON.stringify(brief, null, 2)}\n`),
    'PANDUAN.txt': strToU8(
      `PAKET KLIEN WEB PERSONAL NETFLIX: ${brief.name}\n\n` +
      `URL target: https://tehvini.vercel.app/${brief.slug}\n\n` +
      'Semua berkas dalam ZIP memakai jalur relatif ke akar repo PebisnisDigital/vini-netflix.\n' +
      '1. Minta Codex menambahkan berkas sesuai jalur yang sudah ada di paket ini.\n' +
      '2. Jangan menimpa data atau foto klien lain, terutama /vini.\n' +
      '3. Jalankan npm run verify. Buat branch dan pull request.\n' +
      '4. Periksa preview Vercel di desktop dan HP. Merge hanya setelah disetujui.\n' +
      '5. Pastikan klien mengizinkan publikasi teks, foto, dan tautan.\n\n' +
      'Catatan: ZIP ini tidak otomatis mengirim data atau menerbitkan website.\n',
    ),
  };
  const photoBytes = await Promise.all(photos.map(async ({ file, path }) => ({
    path: `public${path}`,
    bytes: new Uint8Array(await file.arrayBuffer()),
  })));
  for (const { path, bytes } of photoBytes) entries[path] = bytes;
  // Gambar sudah terkompresi; level 0 mempercepat pembuatan ZIP di HP.
  return zipSync(entries, { level: 0 });
}
