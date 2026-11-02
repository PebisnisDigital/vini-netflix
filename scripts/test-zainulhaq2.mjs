import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'public', 'zainulhaq2');
const number = '628522005585';

for (const lang of ['id', 'en']) {
  test(`authorized Amarta replica ${lang.toUpperCase()} uses local assets and the correct WhatsApp`, async () => {
    const source = await readFile(path.join(root, lang === 'en' ? 'en/index.html' : 'index.html'), 'utf8');
    assert.match(source, /PT Amarta Prima Persada/);
    assert.match(source, new RegExp(`https:\\/\\/wa\\.me\\/${number}`, 'g'));
    assert.match(source, new RegExp(`var WA = '${number}'`));
    assert.doesNotMatch(source, /62811844312|\+62 811-844-312|\+62-811-844-312/);
    assert.doesNotMatch(source, /amartaprimapersada\.com\/images\/|\/cdn-cgi\/l\/email-protection/);
    assert.match(source, /mailto:info@amartaprimapersada\.com/);
    assert.match(source, /\/zainulhaq2\/images\/toyota_avanza\.webp/);
    assert.match(source, /\/zainulhaq2\/en\/index\.html/);
    assert.match(source, /\/zainulhaq2\/vendor\/swiper-bundle\.min\.js/);
  });
}

test('all 14 image assets are actual WebP files', async () => {
  const images = [
    'logo_amarta.webp', 'og-cover.webp', 'toyota_avanza.webp', 'toyota_veloz.webp',
    'toyota_innova_reborn.webp', 'innova_reborn_2.4_diesel.webp',
    'Innova_Zenix_G_hybrid.webp', 'Innova_Zenix_Q_Hybrid.webp',
    'toyota_avanza_fleet.webp', 'toyota_veloz_fleet.webp',
    'toyota_innova_reborn_fleet.webp', 'innova_reborn_2.4_diesel_fleet.webp',
    'Innova_Zenix_G_hybrid_fleet.webp', 'Innova_Zenix_Q_Hybrid_fleet.webp',
  ];
  for (const name of images) {
    const filename = path.join(root, 'images', name);
    assert.ok((await stat(filename)).size > 5000, `${name} too small`);
    const content = await readFile(filename);
    assert.equal(content.subarray(0, 4).toString(), 'RIFF', `${name} is not RIFF`);
    assert.equal(content.subarray(8, 12).toString(), 'WEBP', `${name} is not WebP`);
  }
});
