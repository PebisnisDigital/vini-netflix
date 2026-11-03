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
  const isElectronicTiger = name === 'Electronic Tiger Creative Studio';
  const isHijamaTeam = name === 'HijamaTeam';
  const title = isHijamaTeam ? 'HijamaTeam — Perkhidmatan Bekam Darah di Singapura'
    : isElectronicTiger ? 'Electronic Tiger Creative Studio — Ideas Into Creations' : `${name} — THE SERIES`;
  const description = isHijamaTeam
    ? 'HijamaTeam menyediakan perkhidmatan bekam darah di Bukit Panjang, Singapura sejak 2009. Ketahui pilihan rawatan, pusat ilmu bekam dan hubungi Nur Ain untuk janji temu.'
    : isElectronicTiger
      ? 'Electronic Tiger Creative Studio creates original brands, meaningful stories, Islamic children’s entertainment, personal development media, and cinematic AI films.'
      : bio;
  const noscript = isHijamaTeam ? 'HijamaTeam — sila aktifkan JavaScript untuk melayari laman rasmi kami.'
    : isElectronicTiger ? 'Electronic Tiger Creative Studio portfolio. Enable JavaScript to explore our creative worlds.'
    : `Portofolio ${name}. Aktifkan JavaScript untuk menjelajahinya.`;
  // The studio has its own identity mark; keep the PESONAFLIX favicon for other clients.
  const brandedTemplate = isHijamaTeam
    ? template.replace(
      /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/>/i,
      '<link rel="icon" type="image/png" sizes="256x256" href="/clients/hijamateam/favicon-merah.png" />',
    ).replace('<html lang="id">', '<html lang="ms">')
      .replace(/<meta name="theme-color" content="[^"]+"\s*\/>/i, '<meta name="theme-color" content="#741910" />')
    : isElectronicTiger
    ? template.replace(
      /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/>/i,
      '<link rel="icon" type="image/png" href="/clients/noahinna/et-favicon.png" />',
    )
    : template;
  return replaceMeta(
    replaceMeta(
      replaceMeta(
        brandedTemplate
          .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
          .replace(/<noscript>[^<]*<\/noscript>/i, `<noscript>${escapeHtml(noscript)}</noscript>`)
          .replace(/<link\s+rel="preload"\s+as="image"\s+href="\/assets\/teh-vini-720.webp"[^>]*>/i, ''),
        'name', 'description', description,
      ),
      'property', 'og:title', title,
    ),
    'property', 'og:description', description,
  ).replace('</head>', `<meta property="og:image" content="${escapeHtml((process.env.PUBLIC_SITE_ORIGIN || 'https://pesonaflix.vercel.app') + (isHijamaTeam ? '/clients/hijamateam/logo-rasmi.webp' : photo.src))}" /></head>`);
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
  const hijamaTitle = 'HIJAMATEAM | Bekam Darah di Bukit Panjang, Singapura Sejak 2009';
  const hijamaDescription = 'HIJAMATEAM di Bukit Panjang, Singapura sejak 2009. Maklumat perkhidmatan bekam darah, proses, kebersihan, keselamatan, pusat ilmu dan janji temu WhatsApp.';
  const hijamaHtml = replaceMeta(replaceMeta(replaceMeta(
    template
      .replace(/<html lang="[^"]+">/i, '<html lang="ms">')
      .replace(/<meta name="theme-color" content="[^"]+"\s*\/>/i, '<meta name="theme-color" content="#741910" />')
      .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(hijamaTitle)}</title>`)
      .replace(/<noscript>[^<]*<\/noscript>/i, `<noscript>${escapeHtml('HIJAMATEAM. Maklumat bekam darah di Bukit Panjang sejak 2009. Hubungi Nur Ain di +65 8956 7799 untuk pertanyaan dan janji temu.')}</noscript>`)
      .replace(/<link\s+rel="preload"\s+as="image"\s+href="\/assets\/teh-vini-720.webp"[^>]*>/i, '')
      .replace(/<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\/favicon\.svg"\s*\/>/i, '<link rel="icon" type="image/png" sizes="256x256" href="/clients/hijamateam/favicon-merah.png" />'),
    'name', 'description', hijamaDescription),
    'property', 'og:title', hijamaTitle),
    'property', 'og:description', hijamaDescription)
    .replace('</head>', `<meta property="og:type" content="website" /><meta property="og:locale" content="ms_SG" /><meta property="og:image" content="https://pesonaflix.vercel.app/clients/hijamateam/logo-rasmi.webp" /><link rel="canonical" href="https://pesonaflix.vercel.app/HijamaTeam" /><meta name="robots" content="index,follow" /><script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'HIJAMATEAM',
      description: hijamaDescription, foundingDate: '2009', telephone: '+6589567799',
      url: 'https://pesonaflix.vercel.app/HijamaTeam',
      address: { '@type': 'PostalAddress', streetAddress: 'Block 429 Bukit Panjang Ring Road #07-715', addressLocality: 'Singapore', postalCode: '670429', addressCountry: 'SG' },
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '09:00', closes: '20:00' }],
      sameAs: ['https://www.youtube.com/@hijamateam','https://www.facebook.com/ainhassan/']
    })}</script></head>`);
  await mkdir(path.join(dist, 'HijamaTeam'), { recursive: true });
  await writeFile(path.join(dist, 'HijamaTeam/index.html'), hijamaHtml);
  const intake = renderClientHtml(template, {
    name: 'Formulir Klien — PESONAFLIX',
    bio: 'Isi data dan unggah foto untuk pembuatan website portofolio PESONAFLIX.',
    photo: { src: '/favicon.svg' },
  });
  await mkdir(path.join(dist, 'formulir'), { recursive: true });
  await writeFile(path.join(dist, 'formulir/index.html'), intake);
  const landing = await readFile(path.join(dist, 'index.html'), 'utf8');
  for (const route of ['checkout', 'pesanan']) {
    const destination = path.join(dist, route);
    await mkdir(destination, { recursive: true });
    await writeFile(path.join(destination, 'index.html'), landing);
  }
  const studio = renderClientHtml(template, {
    name: 'Dashboard Studio — PESONAFLIX',
    bio: 'Buat, edit, dan kelola portofolio klien bergaya Netflix.', photo: { src: '/favicon.svg' },
  });
  await mkdir(path.join(dist, 'studio', 'preview'), { recursive: true });
  await writeFile(path.join(dist, 'studio/index.html'), studio);
  await writeFile(path.join(dist, 'studio/preview/index.html'), studio);
  console.log(`✅ Checkout, pesanan, Studio, Preview, HIJAMATEAM, ${files.length} halaman klien dan ${Object.keys(registry.aliasToSource).length} link khusus disiapkan.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
