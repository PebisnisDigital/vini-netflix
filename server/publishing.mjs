import { randomBytes } from 'node:crypto';
import { github, repository } from './auth.mjs';
import { normalizeClientWhatsapp } from '../src/utils/clientWhatsapp.mjs';
import { canApplyIdentityMode, canApplyTemplate, getIdentityMode, getTemplate } from '../src/data/templateCatalog.mjs';

const reserved = new Set(['vini', 'formulir', 'studio', 'admin', 'api', 'assets', 'demo', 'preview', 'index', 'favicon', 'robots', 'sitemap']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Terima juga nama file yang sudah diterbitkan manual (contoh karya-ipa.webp).
// Slug tetap terkunci pada milik klien dan nama file tidak boleh berisi folder.
const pathPattern = /^public\/clients\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9][a-z0-9._-]{0,80})\.(png|jpe?g|webp|avif)$/i;
const urlValid = (url) => { try { return ['https:', 'http:'].includes(new URL(url).protocol); } catch { return false; } };

export function validatePublishPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return ['Data penerbitan tidak valid.'];
  const { brief, assets, mode } = payload;
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return ['Data klien kosong.'];
  if (typeof brief.slug !== 'string' || !slugPattern.test(brief.slug) || reserved.has(brief.slug)) errors.push('Alamat klien tidak valid atau dilindungi.');
  if (!['create', 'edit'].includes(mode)) errors.push('Pilih membuat klien baru atau mengedit klien yang sudah tayang.');
  for (const key of ['name', 'role', 'location', 'bio']) if (typeof brief[key] !== 'string' || brief[key].trim().length < 3 || brief[key].length > 4000) errors.push(`${key} wajib diisi dengan benar.`);
  for (const key of ['tagline', 'interests', 'skills', 'experiences']) if (!Array.isArray(brief[key]) || brief[key].length > 100) errors.push(`Daftar ${key} tidak valid.`);
  if (brief.skillCategories !== undefined) {
    if (!Array.isArray(brief.skillCategories) || brief.skillCategories.length < 1 || brief.skillCategories.length > 12) errors.push('Kategori keahlian harus berjumlah 1–12.');
    else {
      const ids = new Set(); let count = 0;
      for (const [i, group] of brief.skillCategories.entries()) {
        if (typeof group?.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(group.id) || ids.has(group.id)) errors.push(`ID kategori keahlian ${i + 1} tidak valid.`);
        ids.add(group?.id);
        if (typeof group?.title !== 'string' || !group.title.trim() || group.title.length > 100 || typeof group?.subtitle !== 'string' || group.subtitle.length > 250) errors.push(`Judul kategori keahlian ${i + 1} tidak valid.`);
        if (!Array.isArray(group?.skills) || group.skills.length < 1 || group.skills.length > 40) { errors.push(`Jumlah kartu kategori keahlian ${i + 1} tidak valid.`); continue; }
        count += group.skills.length;
        for (const [j, skill] of group.skills.entries()) {
          if (typeof skill?.name !== 'string' || !skill.name.trim() || skill.name.length > 100 || typeof skill?.mono !== 'string' || !skill.mono.trim() || skill.mono.length > 8 || (skill.note !== undefined && (typeof skill.note !== 'string' || skill.note.length > 100))) errors.push(`Kartu keahlian ${i + 1}.${j + 1} tidak valid.`);
          if (skill?.evidence !== undefined && (!Array.isArray(skill.evidence) || skill.evidence.length > 15 || skill.evidence.some((point) => typeof point !== 'string' || point.length > 250))) errors.push(`Poin keahlian ${i + 1}.${j + 1} tidak valid.`);
        }
      }
      if (count > 100) errors.push('Maksimal 100 kartu keahlian.');
    }
  }
  for (const key of ['skillsHeading', 'skillsAside', 'skillsKicker']) if (brief[key] !== undefined && (typeof brief[key] !== 'string' || !brief[key].trim())) errors.push(`Teks ${key} tidak valid.`);
  if (!Array.isArray(brief.projects) || brief.projects.length < 1 || brief.projects.length > 30) errors.push('Karya harus berjumlah 1–30 kartu.');
  if (!brief.tagline?.some?.((text) => typeof text === 'string' && text.trim())) errors.push('Minimal satu sorotan wajib diisi.');
  const imagePaths = [];
  const addImage = (src, label) => {
    const relative = `public${src}`;
    const match = pathPattern.exec(relative);
    if (!match || match[1] !== brief.slug) errors.push(`Alamat foto ${label} tidak valid.`);
    else imagePaths.push(relative);
  };
  if (typeof brief.photo?.src !== 'string') errors.push('Foto utama wajib ada.');
  else addImage(brief.photo.src, 'utama');
  for (const [index, project] of (Array.isArray(brief.projects) ? brief.projects : []).entries()) {
    if (typeof project?.title !== 'string' || !project.title.trim() || typeof project?.description !== 'string' || !project.description.trim()) errors.push(`Karya ${index + 1} perlu judul dan deskripsi.`);
    if (!Array.isArray(project?.tags)) errors.push(`Tag karya ${index + 1} tidak valid.`);
    if (project?.image) addImage(project.image, `karya ${index + 1}`);
    if (project?.website && !urlValid(project.website)) errors.push(`Link karya ${index + 1} tidak valid.`);
  }
  if (brief.watchCards !== undefined) {
    if (!Array.isArray(brief.watchCards) || brief.watchCards.length < 1 || brief.watchCards.length > 30) errors.push('Kartu jelajah harus berjumlah 1–30.');
    else for (const [index, item] of brief.watchCards.entries()) {
      if (typeof item?.title !== 'string' || !item.title.trim() || typeof item?.subtitle !== 'string' || !item.subtitle.trim()) errors.push(`Kartu jelajah ${index + 1} wajib punya judul dan deskripsi.`);
      if (!['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'].includes(item?.target)) errors.push(`Tujuan kartu jelajah ${index + 1} tidak valid.`);
      if (item?.image) addImage(item.image, `jelajah ${index + 1}`);
    }
  }
  if (brief.pickCards !== undefined) {
    if (!Array.isArray(brief.pickCards) || brief.pickCards.length < 1 || brief.pickCards.length > 30) errors.push('Kartu pilihan harus berjumlah 1–30.');
    else for (const [index, item] of brief.pickCards.entries()) {
      if (['label', 'title', 'detail'].some((key) => typeof item?.[key] !== 'string' || !item[key].trim())) errors.push(`Kartu pilihan ${index + 1} wajib punya label, judul, dan deskripsi.`);
      if (item?.image) addImage(item.image, `pilihan ${index + 1}`);
      if (item?.palette && (typeof item.palette !== 'object' || ['from', 'via', 'to', 'accent'].some((key) => !/^#[a-f0-9]{6}$/i.test(item.palette[key] || '')))) errors.push(`Warna kartu pilihan ${index + 1} tidak valid.`);
    }
  }
  if (brief.seasons !== undefined) {
    if (!Array.isArray(brief.seasons) || brief.seasons.length < 1 || brief.seasons.length > 10) errors.push('Musim harus berjumlah 1–10.');
    else for (const [index, season] of brief.seasons.entries()) {
      if (['title', 'period', 'synopsis'].some((key) => typeof season?.[key] !== 'string' || !season[key].trim())) errors.push(`Musim ${index + 1} wajib punya judul, periode, dan ringkasan.`);
      if (!Array.isArray(season?.episodes) || season.episodes.length < 1 || season.episodes.length > 15) errors.push(`Musim ${index + 1} harus punya 1–15 episode.`);
      else for (const [episodeIndex, episode] of season.episodes.entries()) {
        if (['title', 'description', 'runtime'].some((key) => typeof episode?.[key] !== 'string' || !episode[key].trim()) || !Array.isArray(episode?.tags)) errors.push(`Episode ${index + 1}.${episodeIndex + 1} wajib memiliki judul, waktu, cerita, dan tag.`);
        if (episode?.image) addImage(episode.image, `episode ${index + 1}.${episodeIndex + 1}`);
        if (!episode?.palette || typeof episode.palette !== 'object' || ['from', 'via', 'to', 'accent'].some((key) => !/^#[a-f0-9]{6}$/i.test(episode.palette[key] || ''))) errors.push(`Warna episode ${index + 1}.${episodeIndex + 1} tidak valid.`);
      }
    }
  }
  for (const key of ['journeyHeading', 'journeyAside', 'journeyKicker']) if (brief[key] !== undefined && (typeof brief[key] !== 'string' || !brief[key].trim())) errors.push(`Teks ${key} tidak valid.`);
  for (const key of ['picksHeading', 'picksKicker']) if (brief[key] !== undefined && (typeof brief[key] !== 'string' || !brief[key].trim())) errors.push(`Teks ${key} tidak valid.`);
  if (brief.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email)) errors.push('Email tidak valid.');
  if (!normalizeClientWhatsapp(brief.whatsapp)) errors.push('Nomor WhatsApp pemilik website wajib valid agar CTA tidak salah tujuan.');
  if (brief.theme && (typeof brief.theme !== 'object' || !/^#[0-9a-f]{6}$/i.test(brief.theme.accent || '') || !/^#[0-9a-f]{6}$/i.test(brief.theme.background || ''))) errors.push('Warna tema harus berupa kode hex yang aman.');
  if (brief.designVariant !== undefined && brief.designVariant !== 'chibi-cinema') errors.push('Gaya website tidak dikenali.');
  if (brief.templateId !== undefined && !getTemplate(brief.templateId)) errors.push('Template website tidak dikenal.');
  else if (brief.templateId !== undefined && !canApplyTemplate(brief.templateId)) errors.push('Template ini belum siap diterbitkan untuk klien.');
  if (brief.identityMode !== undefined && !getIdentityMode(brief.identityMode)) errors.push('Mode identitas tidak dikenal.');
  else if (brief.identityMode !== undefined && !canApplyIdentityMode(brief.identityMode)) errors.push('Mode identitas ini belum siap diterbitkan.');
  if (brief.links) for (const link of Object.values(brief.links)) if (link && (typeof link !== 'string' || !urlValid(link))) errors.push('Link profil harus berupa URL HTTP/HTTPS.');
  if (!Array.isArray(assets) || assets.length > 241) errors.push('Daftar foto unggahan tidak valid.');
  else {
    const seen = new Set();
    for (const asset of assets) {
      if (typeof asset?.path !== 'string' || !imagePaths.includes(asset.path) || !/^[a-f0-9]{40}$/i.test(asset.sha || '') || seen.has(asset.path)) errors.push('Ada foto unggahan yang tidak cocok dengan data klien.');
      seen.add(asset?.path);
    }
  }
  return [...new Set(errors)];
}

export async function createClientPullRequest(token, { brief, assets, mode }) {
  const errors = validatePublishPayload({ brief, assets, mode });
  if (errors.length) throw new Error(errors.join(' '));
  const slug = brief.slug;
  const filePath = `src/data/clients/${slug}.json`;
  const current = await github(token, `${repository}/git/ref/heads/main`);
  const headSha = current.object.sha;
  const base = await github(token, `${repository}/git/commits/${headSha}`);
  const existing = await fetch(`https://api.github.com${repository}/contents/${filePath}?ref=main`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } });
  if (!existing.ok && existing.status !== 404) throw new Error('Tidak dapat mengecek data klien pada branch main.');
  if (mode === 'create' && existing.ok) throw new Error(`Alamat /${slug} sudah dipakai. Gunakan mode Edit Klien.`);
  if (mode === 'edit' && !existing.ok) throw new Error(`Alamat /${slug} belum diterbitkan. Gunakan mode Klien Baru.`);

  const photos = [brief.photo.src, ...brief.projects.map((p) => p.image).filter(Boolean), ...(brief.watchCards || []).map((card) => card.image).filter(Boolean), ...(brief.pickCards || []).map((card) => card.image).filter(Boolean), ...(brief.seasons || []).flatMap((season) => season.episodes.map((episode) => episode.image).filter(Boolean))].map((src) => `public${src}`);
  for (const photo of photos) {
    if (assets.some((a) => a.path === photo)) continue;
    const assetResponse = await fetch(`https://api.github.com${repository}/contents/${photo}?ref=main`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } });
    if (!assetResponse.ok) throw new Error(`Foto ${photo} belum ada. Pilih gambar baru atau periksa data klien.`);
  }

  const tree = await github(token, `${repository}/git/trees`, {
    method: 'POST', body: JSON.stringify({ base_tree: base.tree.sha, tree: [
      { path: filePath, mode: '100644', type: 'blob', content: `${JSON.stringify(brief, null, 2)}\n` },
      ...assets.map(({ path, sha }) => ({ path, mode: '100644', type: 'blob', sha })),
    ] }),
  });
  const commit = await github(token, `${repository}/git/commits`, {
    method: 'POST', body: JSON.stringify({ message: `${mode === 'edit' ? 'Perbarui' : 'Tambah'} portofolio ${brief.name}`, tree: tree.sha, parents: [headSha] }),
  });
  const branch = `cms/${slug}-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
  await github(token, `${repository}/git/refs`, { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }) });
  const pr = await github(token, `${repository}/pulls`, {
    method: 'POST', body: JSON.stringify({ title: `${mode === 'edit' ? 'Edit' : 'Klien baru'}: ${brief.name}`, head: branch, base: 'main', body: `PERSONALFLIX_CMS:${slug}\n\nMohon periksa teks, izin publikasi, foto, tombol, dan tampilan HP/desktop pada preview Vercel sebelum merge.\n\nHalaman: /${slug}` }),
  });
  return { number: pr.number, url: pr.html_url, branch, sha: commit.sha };
}

export async function mergeClientPullRequest(token, { number, sha }) {
  if (!Number.isSafeInteger(number) || number <= 0 || !/^[a-f0-9]{40}$/i.test(sha || '')) throw new Error('Data PR tidak valid.');
  const pr = await github(token, `${repository}/pulls/${number}`);
  if (pr.state !== 'open' || pr.base?.ref !== 'main' || !/^cms\/[a-z0-9-]+$/.test(pr.head?.ref || '') || pr.head?.sha !== sha || pr.head?.repo?.full_name !== 'PebisnisDigital/vini-netflix' || !/^PERSONALFLIX_CMS:[a-z0-9-]+/.test(pr.body || '')) throw new Error('PR ini bukan draft CMS yang siap diterbitkan.');
  const checks = await github(token, `${repository}/commits/${sha}/check-runs`);
  const validation = checks.check_runs?.filter((r) => r.name === 'verify' || r.name === 'Validasi PESONAFLIX' || r.name === 'Validasi Web Personal Netflix') || [];
  if (!validation.some((r) => r.status === 'completed' && r.conclusion === 'success')) throw new Error('Validasi GitHub Actions belum lulus. Tunggu sampai berhasil.');
  const merged = await github(token, `${repository}/pulls/${number}/merge`, { method: 'PUT', body: JSON.stringify({ sha, merge_method: 'squash', commit_title: `Terbitkan ${pr.title}` }) });
  if (!merged.merged) throw new Error('GitHub belum bisa menerbitkan PR ini.');
  return { merged: true, slug: pr.body.match(/^PERSONALFLIX_CMS:([a-z0-9-]+)/)?.[1] };
}

export async function getClientPublicationStatus(token, { number, sha }) {
  if (!Number.isSafeInteger(number) || number <= 0 || !/^[a-f0-9]{40}$/i.test(sha || '')) throw new Error('Nomor publikasi tidak valid.');
  const pr = await github(token, `${repository}/pulls/${number}`);
  const slug = pr.body?.match(/^PERSONALFLIX_CMS:([a-z0-9-]+)/)?.[1];
  if (!slug || !/^cms\/[a-z0-9-]+$/.test(pr.head?.ref || '') || pr.head?.repo?.full_name !== 'PebisnisDigital/vini-netflix' || pr.base?.ref !== 'main') throw new Error('Publikasi ini bukan berasal dari Studio.');
  if (pr.head?.sha !== sha) throw new Error('Data publikasi sudah berubah. Muat ulang proyek.');
  if (pr.merged) return { state: 'merged', slug, url: `https://pesonaflix.vercel.app/${slug}` };
  if (pr.state !== 'open') return { state: 'failed', slug, message: 'Penerbitan ditutup tanpa dipublikasikan.' };
  const result = await github(token, `${repository}/commits/${sha}/check-runs`);
  const checks = result.check_runs || [];
  const validation = checks.filter((check) => check.name === 'verify');
  const mergeJob = checks.filter((check) => check.name === 'auto-publish-cms');
  if (validation.some((check) => check.status === 'completed' && check.conclusion !== 'success')) return { state: 'failed', slug, message: 'Pengujian proyek gagal. Website lama tetap aman.' };
  if (mergeJob.some((check) => check.status === 'completed' && check.conclusion !== 'success')) return { state: 'failed', slug, message: 'GitHub belum diizinkan menerbitkan. Periksa izin GitHub Actions dan PR.' };
  return { state: 'pending', slug, message: validation.some((check) => check.conclusion === 'success') ? 'Pengujian lulus. Menunggu penerbitan otomatis…' : 'GitHub sedang memeriksa perubahan…' };
}
