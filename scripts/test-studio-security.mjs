import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validatePublishPayload } from '../server/publishing.mjs';
import { readSession, requirePostSession, setSessionCookie, startState, stateIsValid } from '../server/auth.mjs';
import { GET as startOAuth } from '../api/auth/start.js';
import { GET as studioStatus } from '../api/studio/status.js';
import { POST as studioLogin } from '../api/studio/login.js';
import { readStudioSession, studioCodeIsValid, studioSessionCookie } from '../server/studio-auth.mjs';

const sample = {
  slug: 'satria', name: 'Satria', role: 'Fotografer', location: 'Bandung',
  bio: 'Fotografer produk profesional.', tagline: ['Foto produk'], interests: [],
  photo: { src: '/clients/satria/foto-utama.webp', alt: 'Satria' },
  experiences: [], skills: [], projects: [{ title: 'Karya 1', description: 'Foto produk lokal', category: 'Foto', year: '2026', tags: [], image: '/clients/satria/karya-1.webp' }],
};

test('penerbitan menolak slug terlarang dan foto asing', () => {
  assert.deepEqual(validatePublishPayload({ brief: sample, assets: [], mode: 'create' }), []);
  assert.ok(validatePublishPayload({ brief: { ...sample, slug: 'vini' }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: sample, assets: [{ path: 'public/clients/klien-lain/foto-utama.webp', sha: 'a'.repeat(40) }], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: sample, assets: [{ path: '../../secrets', sha: 'a'.repeat(40) }], mode: 'create' }).length);
});

test('tema klien hanya menerima kode warna hex yang aman', () => {
  assert.deepEqual(validatePublishPayload({ brief: { ...sample, theme: { accent: '#1188ff', background: '#09090e' } }, assets: [], mode: 'create' }), []);
  assert.ok(validatePublishPayload({ brief: { ...sample, theme: { accent: 'url(javascript:alert(1))', background: '#09090e' } }, assets: [], mode: 'create' }).some((message) => message.includes('Warna tema')));
});

test('kartu jelajah boleh ditambah tetapi target dan fotonya wajib aman', () => {
  const watchCards = [{ title: 'Momen', subtitle: 'Cerita terbaik', target: 'moments', image: '/clients/satria/jelajah-1.webp' }];
  assert.deepEqual(validatePublishPayload({ brief: { ...sample, watchCards }, assets: [{ path: 'public/clients/satria/jelajah-1.webp', sha: 'a'.repeat(40) }], mode: 'create' }), []);
  assert.ok(validatePublishPayload({ brief: { ...sample, watchCards: [{ ...watchCards[0], target: 'https://jahat.test' }] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, watchCards: [{ ...watchCards[0], image: '/clients/lain/jelajah-1.webp' }] }, assets: [], mode: 'create' }).length);
});

test('kartu pilihan bisa diterbitkan dengan foto sendiri dan menolak foto asing', () => {
  const pickCards = [{ label: 'POPULER', title: 'Foto Pilihan', detail: 'Cerita karya', image: '/clients/satria/pilihan-1.webp', palette: { from: '#111111', via: '#222222', to: '#333333', accent: '#ff2255' } }];
  const photo = { path: 'public/clients/satria/pilihan-1.webp', sha: 'a'.repeat(40) };
  assert.deepEqual(validatePublishPayload({ brief: { ...sample, pickCards }, assets: [photo], mode: 'create' }), []);
  assert.ok(validatePublishPayload({ brief: { ...sample, pickCards: [] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, pickCards: [{ ...pickCards[0], image: '/clients/lain/pilihan-1.webp' }] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, pickCards: [{ ...pickCards[0], palette: { ...pickCards[0].palette, accent: 'red' } }] }, assets: [], mode: 'create' }).length);
});

test('musim dan episode bisa diterbitkan dengan foto per kartu yang aman', () => {
  const episode = { code: 'S01 E01', title: 'Mulai', runtime: '2026', description: 'Awal perjalanan', tags: ['Karya'], image: '/clients/satria/musim-1-episode-1.webp', palette: { from: '#111111', via: '#222222', to: '#333333', accent: '#ee2255' } };
  const seasons = [{ number: 1, title: 'Perjalanan', period: '2026', synopsis: 'Kisah karya', episodes: [episode] }];
  const assets = [{ path: 'public/clients/satria/musim-1-episode-1.webp', sha: 'a'.repeat(40) }];
  assert.deepEqual(validatePublishPayload({ brief: { ...sample, seasons }, assets, mode: 'create' }), []);
  assert.ok(validatePublishPayload({ brief: { ...sample, seasons: [] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, seasons: [{ ...seasons[0], episodes: [] }] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, seasons: [{ ...seasons[0], episodes: [{ ...episode, image: '/clients/asing/musim-1-episode-1.webp' }] }] }, assets: [], mode: 'create' }).length);
});

test('kategori dan kartu keahlian baru dapat diterbitkan, data tidak valid ditolak', () => {
  const skillCategories = [{ id: 'fotografi', title: 'Fotografi', subtitle: 'Komposisi produk', skills: [{ name: 'Foto Produk', mono: 'FP', note: 'Utama', evidence: ['Katalog UMKM', 'Studio'] }] }];
  assert.deepEqual(validatePublishPayload({ brief: { ...sample, skillCategories, skills: ['Foto Produk'], skillsHeading: 'Keahlian Saya' }, assets: [], mode: 'create' }), []);
  assert.ok(validatePublishPayload({ brief: { ...sample, skillCategories: [] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, skillCategories: [{ ...skillCategories[0], skills: [] }] }, assets: [], mode: 'create' }).length);
  assert.ok(validatePublishPayload({ brief: { ...sample, skillCategories: [{ ...skillCategories[0], skills: [{ name: 'Foto Produk', mono: 'SIMBOL-TOO-LONG' }] }] }, assets: [], mode: 'create' }).length);
});

test('OAuth aman: state harus cocok dan sesi hanya boleh admin', () => {
  const original = Object.fromEntries(['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_SESSION_SECRET', 'GITHUB_ALLOWED_LOGIN', 'GITHUB_CALLBACK_URL'].map((key) => [key, process.env[key]]));
  try {
    process.env.GITHUB_CLIENT_ID = 'example-client-id'; process.env.GITHUB_CLIENT_SECRET = 'not-a-real-secret';
    process.env.GITHUB_SESSION_SECRET = 'an-example-random-session-secret-long-enough-for-a-test';
    process.env.GITHUB_ALLOWED_LOGIN = 'PebisnisDigital'; process.env.GITHUB_CALLBACK_URL = 'https://pesonaflix.vercel.app/api/auth/callback';
    const { state, cookie } = startState();
    const request = new Request('https://pesonaflix.vercel.app/api/auth/callback', { headers: { cookie: cookie.split(';')[0] } });
    assert.equal(stateIsValid(request, state), true);
    assert.equal(stateIsValid(request, 'not-matching'), false);
    const authCookie = setSessionCookie({ login: 'PebisnisDigital', token: 'example-token' });
    assert.equal(readSession(new Request('https://pesonaflix.vercel.app/studio', { headers: { cookie: authCookie.split(';')[0] } })).login, 'PebisnisDigital');
    assert.equal(readSession(new Request('https://pesonaflix.vercel.app/studio', { headers: { cookie: setSessionCookie({ login: 'not-owner', token: 'example' }).split(';')[0] } })), null);
  } finally { for (const [key, value] of Object.entries(original)) if (value === undefined) delete process.env[key]; else process.env[key] = value; }
});

test('OAuth tanpa konfigurasi berhenti, tidak menerbitkan atau mengembalikan rahasia', async () => {
  const old = process.env.GITHUB_CLIENT_ID;
  delete process.env.GITHUB_CLIENT_ID;
  try { const response = startOAuth(); assert.equal(response.status, 503); assert.doesNotMatch(await response.text(), /token|secret/i); }
  finally { if (old !== undefined) process.env.GITHUB_CLIENT_ID = old; }
});

test('edit ulang klien Iis menerima foto bernama bebas yang tetap berada dalam folder klien', () => {
  const changed = { ...sample, slug: 'iis', photo: { src: '/clients/iis/foto-utama.webp', alt: 'Iis' }, projects: [{ ...sample.projects[0], image: '/clients/iis/karya-ipa.webp' }] };
  assert.deepEqual(validatePublishPayload({ brief: changed, assets: [], mode: 'edit' }), []);
  assert.ok(validatePublishPayload({ brief: { ...changed, projects: [{ ...changed.projects[0], image: '/clients/asing/karya-ipa.webp' }] }, assets: [], mode: 'edit' }).length);
  assert.ok(validatePublishPayload({ brief: { ...changed, projects: [{ ...changed.projects[0], image: '/clients/iis/../malware.webp' }] }, assets: [], mode: 'edit' }).length);
});

test('kode Studio benar menghasilkan cookie terenkripsi 30 hari, kode salah dan manipulasi cookie ditolak', async () => {
  const keys = ['PESONAFLIX_STUDIO_ACCESS_KEY', 'PESONAFLIX_STUDIO_SESSION_SECRET', 'PESONAFLIX_GITHUB_TOKEN'];
  const originals = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.PESONAFLIX_STUDIO_ACCESS_KEY = 'contoh-kode-akses-yang-panjang-untuk-testing';
    process.env.PESONAFLIX_STUDIO_SESSION_SECRET = 'contoh-session-secret-studio-yang-panjang-untuk-testing';
    process.env.PESONAFLIX_GITHUB_TOKEN = 'contoh-token-github-khusus-testing';
    assert.equal(studioCodeIsValid('salah-besar-sekali'), false);
    assert.equal(studioCodeIsValid('contoh-kode-akses-yang-panjang-untuk-testing'), true);
    const cookie = studioSessionCookie();
    assert.match(cookie, /HttpOnly; SameSite=Strict/);
    assert.match(cookie, /Max-Age=2592000/);
    const request = new Request('https://pesonaflix.vercel.app/api/publish', { method: 'POST', headers: { origin: 'https://pesonaflix.vercel.app', 'x-personalflix-action': '1', cookie: cookie.split(';')[0] } });
    assert.equal(readStudioSession(request)?.kind, 'studio');
    assert.equal(requirePostSession(request).session.token, 'contoh-token-github-khusus-testing');
    assert.equal(requirePostSession(new Request('https://pesonaflix.vercel.app/api/publish', { method: 'POST', headers: { origin: 'https://other.test', 'x-personalflix-action': '1', cookie: cookie.split(';')[0] } })).error.status, 403);
    assert.equal(requirePostSession(new Request('https://pesonaflix.vercel.app/api/publish', { method: 'POST', headers: { origin: 'https://pesonaflix.vercel.app', 'x-personalflix-action': '1' } })).error.status, 401);
    // Ubah byte autentikasi, bukan karakter terakhir base64url yang bisa berupa padding bit.
    const [cookieName, cookieValue] = cookie.split(';')[0].split('=');
    const tamperedBytes = Buffer.from(cookieValue, 'base64url');
    tamperedBytes[14] ^= 1;
    const badCookie = `${cookieName}=${tamperedBytes.toString('base64url')}`;
    assert.equal(readStudioSession(new Request('https://pesonaflix.vercel.app/studio', { headers: { cookie: badCookie } })), null);
    const ok = await studioLogin(new Request('https://pesonaflix.vercel.app/api/studio/login', { method: 'POST', headers: { origin: 'https://pesonaflix.vercel.app', 'x-personalflix-action': '1' }, body: JSON.stringify({ code: 'contoh-kode-akses-yang-panjang-untuk-testing' }) }));
    assert.equal(ok.status, 200);
    assert.ok(ok.headers.get('set-cookie'));
    const status = studioStatus(new Request('https://pesonaflix.vercel.app/api/studio/status', { headers: { cookie: cookie.split(';')[0] } }));
    assert.equal((await status.json()).authenticated, true);
  } finally { for (const [key, value] of Object.entries(originals)) if (value === undefined) delete process.env[key]; else process.env[key] = value; }
});
