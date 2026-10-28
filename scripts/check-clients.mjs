import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const folder = path.join(root, 'src/data/clients');
const reserved = new Set(['vini', 'formulir', 'studio', 'admin', 'api', 'assets', 'demo', 'preview', 'index', 'favicon', 'robots', 'sitemap']);
const errors = [];

function checkString(value, label, slug, min = 1) {
  if (typeof value !== 'string' || value.trim().length < min) errors.push(`${slug}: ${label} wajib diisi.`);
}

async function checkImage(imagePath, slug, field) {
  if (typeof imagePath !== 'string' || !new RegExp(`^/clients/${slug}/[A-Za-z0-9._-]+\\.(png|jpe?g|webp|avif)$`, 'i').test(imagePath)) {
    errors.push(`${slug}: ${field} harus menunjuk foto di folder /clients/${slug}/.`);
    return;
  }
  const location = path.join(root, 'public', imagePath.substring(1));
  try {
    const info = await stat(location);
    if (!info.isFile() || info.size === 0) errors.push(`${slug}: ${field} kosong/tidak berupa file: ${imagePath}`);
    if (info.size > 10 * 1024 * 1024) errors.push(`${slug}: ${field} melebihi 10MB: ${imagePath}`);
  } catch { errors.push(`${slug}: foto ${field} belum diunggah: ${imagePath}`); }
}

const files = (await readdir(folder)).filter((file) => file.endsWith('.json'));
for (const file of files) {
  const slug = file.slice(0, -5);
  let brief;
  try { brief = JSON.parse(await readFile(path.join(folder, file), 'utf8')); }
  catch (e) { errors.push(`${file}: format JSON rusak (${e.message}).`); continue; }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || reserved.has(slug)) errors.push(`${file}: nama URL tidak boleh digunakan.`);
  if (brief.slug !== slug) errors.push(`${file}: slug harus sama dengan nama file ${slug}.json.`);
  for (const field of ['name', 'role', 'location', 'bio']) checkString(brief[field], field, slug, 3);
  if (!Array.isArray(brief.tagline) || !brief.tagline.some((s) => typeof s === 'string' && s.trim())) errors.push(`${slug}: minimal satu tagline.`);
  for (const field of ['interests','experiences','skills']) if (!Array.isArray(brief[field])) errors.push(`${slug}: ${field} harus berupa daftar.`);
  if (brief.education && !Array.isArray(brief.education)) errors.push(`${slug}: pendidikan harus berupa daftar.`);
  for (const [i, edu] of (Array.isArray(brief.education) ? brief.education : []).entries()) {
    checkString(edu?.school, `pendidikan ${i + 1} sekolah`, slug);
    checkString(edu?.degree, `pendidikan ${i + 1} gelar/jurusan`, slug);
  }
  if (brief.highlights && !Array.isArray(brief.highlights)) errors.push(`${slug}: sorotan harus berupa daftar.`);
  for (const [i, item] of (Array.isArray(brief.highlights) ? brief.highlights : []).entries()) {
    checkString(item?.title, `sorotan ${i + 1} judul`, slug);
    checkString(item?.description, `sorotan ${i + 1} deskripsi`, slug);
  }
  if (!Array.isArray(brief.projects) || !brief.projects.length) errors.push(`${slug}: minimal satu karya.`);
  else for (const [i, project] of brief.projects.entries()) {
    checkString(project?.title, `karya ${i + 1} judul`, slug);
    checkString(project?.description, `karya ${i + 1} deskripsi`, slug);
    if (project && !Array.isArray(project.tags)) errors.push(`${slug}: kata kunci karya ${i + 1} harus berupa daftar.`);
    if (project?.image) await checkImage(project.image, slug, `foto karya ${i + 1}`);
    if (project?.website && !/^https?:\/\//.test(project.website)) errors.push(`${slug}: link karya ${i + 1} harus https://.`);
  }
  if (brief.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)) errors.push(`${slug}: email tidak valid.`);
  for (const [name, url] of Object.entries(brief.links ?? {})) if (url && !/^https?:\/\//.test(url)) errors.push(`${slug}: link ${name} harus https://.`);
  await checkImage(brief.photo?.src, slug, 'foto utama');
}

if (errors.length) {
  console.error(`❌ ${errors.length} masalah ditemukan:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else console.log(`✅ ${files.length} konfigurasi klien lolos pemeriksaan (struktur, slug, tautan, dan foto).`);
