import { randomBytes } from 'node:crypto';
import { github, repository } from './auth.mjs';
import { normalizeCustomDomain, updateDomainConfig } from './custom-domains.mjs';
import { validClientSlug } from '../src/data/clientAliases.mjs';

const REGISTRY = 'src/data/customDomains.json';
const CONFIG = 'vercel.json';
async function readJson(token, path, sha) {
  const f = await github(token, repository + '/contents/' + path + '?ref=' + sha);
  if (f.encoding !== 'base64') throw new Error('Format data tidak valid.');
  return JSON.parse(Buffer.from(f.content.replace(/\s/g, ''), 'base64').toString('utf8'));
}
export async function createDomainRequest(token, input) {
  const slug = input?.sourceSlug;
  const host = normalizeCustomDomain(input?.domain);
  if (!validClientSlug(slug) || slug === 'vini') throw new Error('Pilih klien yang sudah terbit.');
  const ref = await github(token, repository + '/git/ref/heads/main');
  const baseSha = ref.object.sha;
  await github(token, repository + '/contents/src/data/clients/' + slug + '.json?ref=' + baseSha);
  const [registry, config] = await Promise.all([readJson(token, REGISTRY, baseSha), readJson(token, CONFIG, baseSha)]);
  const current = Object.hasOwn(registry, host) ? registry[host] : null;
  if (current) throw new Error(current === slug ? 'Domain ini sudah dipetakan ke klien.' : 'Domain sudah dipakai klien lain.');
  const next = { ...registry, [host]: slug };
  const updatedConfig = updateDomainConfig(config, registry, next);
  const base = await github(token, repository + '/git/commits/' + baseSha);
  const tree = await github(token, repository + '/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: base.tree.sha, tree: [
    { path: REGISTRY, mode: '100644', type: 'blob', content: JSON.stringify(next, null, 2) + '\n' },
    { path: CONFIG, mode: '100644', type: 'blob', content: JSON.stringify(updatedConfig, null, 2) + '\n' }
  ] }) });
  const commit = await github(token, repository + '/git/commits', { method: 'POST', body: JSON.stringify({ message: 'Peta domain ' + host + ' ke /' + slug, tree: tree.sha, parents: [baseSha] }) });
  const branch = 'domain/' + slug + '-' + randomBytes(6).toString('hex');
  await github(token, repository + '/git/refs', { method: 'POST', body: JSON.stringify({ ref: 'refs/heads/' + branch, sha: commit.sha }) });
  const pr = await github(token, repository + '/pulls', { method: 'POST', body: JSON.stringify({ title: 'Custom domain: ' + host + ' → /' + slug, head: branch, base: 'main', body: 'PESONAFLIX_CUSTOM_DOMAIN:' + slug + ':' + host + '\n\nTinjau dan merge setelah CI lulus. Setelah deploy, tambahkan host ke Vercel lalu ikuti DNS yang ditampilkan Vercel. Ini tidak membeli domain atau mengubah DNS.' }) });
  return { number: pr.number, url: pr.html_url, domain: host, sourceSlug: slug };
}
