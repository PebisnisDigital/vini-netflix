import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clientReferralCode, getClientReferralWhatsappUrl, normalizeClientWhatsapp } from '../src/utils/clientWhatsapp.mjs';

test('nomor Indonesia dinormalisasi tanpa mengubah nomor pemilik lain', () => {
  assert.equal(normalizeClientWhatsapp('0812-3456-7890'), '6281234567890');
  assert.equal(normalizeClientWhatsapp('+62 812 3456 7890'), '6281234567890');
  assert.equal(normalizeClientWhatsapp('62881022445869'), '62881022445869');
  assert.equal(normalizeClientWhatsapp('+65 9343 3749'), '6593433749');
  assert.equal(normalizeClientWhatsapp('6593433749'), '6593433749');
  assert.equal(normalizeClientWhatsapp('+65 7343 3749'), null);
  assert.equal(normalizeClientWhatsapp('+673 8645955'), '6738645955');
  assert.equal(normalizeClientWhatsapp('673-764-5955'), '6737645955');
  assert.equal(normalizeClientWhatsapp('+673 6645955'), null);
  assert.equal(normalizeClientWhatsapp('+673 864595'), null);
  for (const value of ['', undefined, '123', 'https://wa.me/6281234567890', '+62<script>', '62123456789']) {
    assert.equal(normalizeClientWhatsapp(value), null);
  }
});

test('dua website klien membuka WhatsApp pemilik masing-masing dan membawa kode referral', () => {
  const citra = getClientReferralWhatsappUrl({
    whatsapp: '081234567890', ownerName: 'Citra', referralCode: clientReferralCode('citra'), exampleUrl: 'https://pesonaflix.vercel.app/citra',
  });
  const iis = getClientReferralWhatsappUrl({
    whatsapp: '085712345678', ownerName: 'Iis Siti', referralCode: clientReferralCode('iis'), exampleUrl: 'https://pesonaflix.vercel.app/iis',
  });
  assert.equal(new URL(citra).pathname, '/6281234567890');
  assert.equal(new URL(iis).pathname, '/6285712345678');
  assert.match(new URL(citra).searchParams.get('text'), /Kak Citra/);
  assert.match(new URL(citra).searchParams.get('text'), /PSN-CITRA/);
  assert.match(new URL(iis).searchParams.get('text'), /Kak Iis Siti/);
  assert.match(new URL(iis).searchParams.get('text'), /PSN-IIS/);
  assert.doesNotMatch(citra, /62881022445869/);
  assert.equal(getClientReferralWhatsappUrl({ whatsapp: '', ownerName: 'Belum Ada' }), null);
});

test('klien Brunei mengarah ke nomor +673 milik sendiri', () => {
  const url = getClientReferralWhatsappUrl({
    whatsapp: '+6738645955', ownerName: 'Muhaimin Hj Jumat',
    referralCode: clientReferralCode('muhaiminjumat'),
    exampleUrl: 'https://pesonaflix.vercel.app/muhaiminjumat',
  });
  assert.equal(new URL(url).pathname, '/6738645955');
  assert.match(new URL(url).searchParams.get('text'), /PSN-MUHAIMINJUMAT/);
});

test('nomor sementara Teh Vini tetap menandai asal website klien', () => {
  const url = getClientReferralWhatsappUrl({
    whatsapp: '62881022445869', ownerName: 'Citra', contactName: 'Teh Vini',
    referralCode: clientReferralCode('citra'), exampleUrl: 'https://pesonaflix.vercel.app/citra',
  });
  assert.equal(new URL(url).pathname, '/62881022445869');
  const message = new URL(url).searchParams.get('text');
  assert.match(message, /Halo Teh Vini, saya lihat website Citra/);
  assert.match(message, /PSN-CITRA/);
  assert.doesNotMatch(message, /Halo Kak Citra/);
});
