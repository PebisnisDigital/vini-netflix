import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// The owner has authorized replication of amartaprimapersada.com.
// This repeatable pass adapts the copied standalone pages to PESONAFLIX's
// /zainulhaq2 route, local assets, and the client's new WhatsApp contact.
const route = '/zainulhaq2';
const origin = 'https://pesonaflix.vercel.app';
const email = 'info@amartaprimapersada.com';
const pageRoot = path.join(process.cwd(), 'public', 'zainulhaq2');

const vendorAssets = new Map([
  ['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', `${route}/vendor/swiper-bundle.min.css`],
  ['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', `${route}/vendor/swiper-bundle.min.js`],
  ['https://unpkg.com/aos@2.3.4/dist/aos.css', `${route}/vendor/aos.css`],
  ['https://unpkg.com/aos@2.3.4/dist/aos.js', `${route}/vendor/aos.js`],
  ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', `${route}/vendor/gsap.min.js`],
  ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', `${route}/vendor/ScrollTrigger.min.js`],
]);

for (const language of ['id', 'en']) {
  const file = path.join(pageRoot, language === 'en' ? 'en/index.html' : 'index.html');
  let html = await readFile(file, 'utf8');

  html = html
    .replaceAll('62811844312', '628522005585')
    .replaceAll('+62 811-844-312', '+62 852-2200-5585')
    .replaceAll('+62-811-844-312', '+62-852-2200-5585')
    .replaceAll('https://amartaprimapersada.com/', `${origin}${route}/`)
    .replace(/<a href="\/cdn-cgi\/l\/email-protection[^"]*"[^>]*>(?:<span[^>]*>)?\[email&#160;protected\](?:<\/span>)?<\/a>/g, `<a href="mailto:${email}">${email}</a>`)
    .replace(/<script data-cfasync="false" src="\/cdn-cgi\/scripts\/[^\"]+"><\/script>/g, '')
    .replace(/(?:src|href)="(?:\.\.\/)?images\//g, (match) => match.replace(/(?:\.\.\/)?images\//, `${route}/images/`));

  if (language === 'id') {
    html = html
      .replaceAll('href="index.html"', `href="${route}/index.html"`)
      .replaceAll('href="en/index.html"', `href="${route}/en/index.html"`);
  } else {
    html = html
      .replaceAll('href="../index.html"', `href="${route}/index.html"`)
      .replaceAll('href="index.html"', `href="${route}/en/index.html"`)
      .replaceAll('href="../"', `href="${route}"`);
  }

  for (const [remote, local] of vendorAssets) html = html.replaceAll(remote, local);
  await writeFile(file, html);

  if (html.includes('62811844312') || html.includes('/cdn-cgi/l/email-protection')) {
    throw new Error(`Old contact or Cloudflare-encoded email remains in ${file}`);
  }
  console.log(`Prepared ${language.toUpperCase()} standalone clone at ${file}`);
}
