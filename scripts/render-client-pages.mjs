import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateClientAliasRegistry } from '../src/data/clientAliases.mjs';

const escapeHtml = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function replaceMeta(html, attr, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*("\\s*/?>)`, 'i');
  return html.replace(pattern, (_, start, end) => `${start}${escapeHtml(value)}${end}`);
}

export function renderClientHtml(template, { name, bio, photo }) {
  const title = `${name} — THE SERIES`;
  return replaceMeta(
    replaceMeta(
      replaceMeta(
        template
          .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
          .replace(/<noscript>[^<]*<\/noscript>/i, `<noscript>Portofolio ${escapeHtml(name)}. Aktifkan JavaScript untuk menjelajahinya.</noscript>`)
          .replace(/<link\s+rel="preload"\s+as="image"\s+href="\/assets\/teh-vini-720.webp"[^>]*>/i, ''),
        'name', 'description', bio,
      ),
      'property', 'og:title', title,
    ),
    'property', 'og:description', bio,
  ).replace('</head>', `<meta property="og:image" content="${escapeHtml((process.env.PUBLIC_SITE_ORIGIN || 'https://pesonaflix.vercel.app') + photo.src)}" /></head>`);
}

async function main() {
  const root = process.cwd();
  const dist = path.join(root, 'dist');
  const template = await readFile(path.join(dist, 'vini/index.html'), 'utf8');
  const files = (await readdir(path.join(root, 'src/data/clients'))).filter((f) => f.endsWith('.json'));
  const registry = JSON.parse(await readFile(path.join(root, 'src/data/clientAliases.json'), 'utf8'));
  const aliasErrors = validateClientAliasRegistry(registry, files.map((file) => file.slice(0, -5)));
  if (aliasErrors.length) throw new Error(`URL klien tidak valid: ${aliasErrors.join(' ')}`);
  for (const file of files) {
    const slug = file.slice(0, -5);
    const brief = JSON.parse(await readFile(path.join(root, 'src/data/clients', file), 'utf8'));
    const directory = path.join(dist, slug);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), renderClientHtml(template, brief));
  }
  for (const [alias, source] of Object.entries(registry.aliasToSource)) {
    const brief = JSON.parse(await readFile(path.join(root, 'src/data/clients', `${source}.json`), 'utf8'));
    const directory = path.join(dist, alias);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), renderClientHtml(template, brief));
  }
  const intake = renderClientHtml(template, {
    name: 'Formulir Klien — PESONAFLIX',
    bio: 'Isi data dan unggah foto untuk pembuatan website portofolio PESONAFLIX.',
    photo: { src: '/favicon.svg' },
  });
  await mkdir(path.join(dist, 'formulir'), { recursive: true });
  await writeFile(path.join(dist, 'formulir/index.html'), intake);
  const studio = renderClientHtml(template, {
    name: 'Dashboard Studio — PESONAFLIX',
    bio: 'Buat, edit, dan kelola portofolio klien bergaya Netflix.', photo: { src: '/favicon.svg' },
  });
  await mkdir(path.join(dist, 'studio', 'preview'), { recursive: true });
  await writeFile(path.join(dist, 'studio/index.html'), studio);
  await writeFile(path.join(dist, 'studio/preview/index.html'), studio);
  console.log(`✅ Formulir, Studio, Preview Studio, ${files.length} halaman klien dan ${Object.keys(registry.aliasToSource).length} link khusus disiapkan.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
