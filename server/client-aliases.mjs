import { randomBytes } from 'node:crypto';
import { github, repository } from './auth.mjs';
import { updatePrimaryClientAlias, validClientSlug } from '../src/data/clientAliases.mjs';

const headers = (token) => ({ Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' });

async function existsAtCommit(token, path, sha) {
  const response = await fetch(`https://api.github.com${repository}/contents/${path}?ref=${sha}`, { headers: headers(token) });
  if (response.status === 404) return false;
  if (!response.ok) throw new Error('Tidak bisa memeriksa URL dari GitHub.');
  return true;
}

/** Satu link utama per klien, link lama tetap dilayani agar tidak memutus tautan. */
export async function createClientAliasPullRequest(token, { sourceSlug, publicSlug }) {
  if (!validClientSlug(sourceSlug) || !validClientSlug(publicSlug)) throw new Error('Nama link hanya boleh huruf kecil, angka, dan tanda minus (maksimal 60 karakter).');
  const ref = await github(token, `${repository}/git/ref/heads/main`);
  const baseSha = ref.object.sha;
  if (!await existsAtCommit(token, `src/data/clients/${sourceSlug}.json`, baseSha)) throw new Error(`Halaman /${sourceSlug} belum diterbitkan.`);

  const registryFile = await github(token, `${repository}/contents/src/data/clientAliases.json?ref=${baseSha}`);
  if (registryFile.encoding !== 'base64') throw new Error('Format pengaturan link di GitHub tidak valid.');
  const registry = JSON.parse(Buffer.from(registryFile.content.replace(/\s/g, ''), 'base64').toString('utf8'));
  const primary = Object.hasOwn(registry.primaryBySource || {}, sourceSlug) ? registry.primaryBySource[sourceSlug] : sourceSlug;
  if (publicSlug === primary) throw new Error(`Link utama sudah /${publicSlug}. Tidak ada perubahan.`);
  if (publicSlug !== sourceSlug) {
    if (await existsAtCommit(token, `src/data/clients/${publicSlug}.json`, baseSha)) throw new Error(`/${publicSlug} sudah menjadi halaman klien lain.`);
    if (Object.hasOwn(registry.aliasToSource || {}, publicSlug) && registry.aliasToSource[publicSlug] !== sourceSlug) throw new Error(`/${publicSlug} sudah dipakai sebagai link klien lain.`);
  }
  const updated = updatePrimaryClientAlias(registry, sourceSlug, publicSlug);

  const base = await github(token, `${repository}/git/commits/${baseSha}`);
  const tree = await github(token, `${repository}/git/trees`, {
    method: 'POST', body: JSON.stringify({ base_tree: base.tree.sha, tree: [
      { path: 'src/data/clientAliases.json', mode: '100644', type: 'blob', content: `${JSON.stringify(updated, null, 2)}\n` },
    ] }),
  });
  const commit = await github(token, `${repository}/git/commits`, {
    method: 'POST', body: JSON.stringify({ message: `Ubah link utama /${sourceSlug} menjadi /${publicSlug}`, tree: tree.sha, parents: [baseSha] }),
  });
  const branch = `cms/alias-${sourceSlug}-${Date.now().toString(36)}-${randomBytes(3).toString('hex')}`;
  await github(token, `${repository}/git/refs`, { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }) });
  const pr = await github(token, `${repository}/pulls`, {
    method: 'POST', body: JSON.stringify({
      title: `Ubah link: /${sourceSlug} → /${publicSlug}`, head: branch, base: 'main',
      body: `PERSONALFLIX_ALIAS:${sourceSlug}:${publicSlug}\n\nPeriksa link baru /${publicSlug} pada preview. Link lama /${sourceSlug} tetap tersedia. Konten dan gambar tidak dipindahkan.`,
    }),
  });
  return { number: pr.number, url: pr.html_url, branch, sha: commit.sha };
}
