import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validatePublishPayload } from '../server/publishing.mjs';
import { readSession, setSessionCookie, startState, stateIsValid } from '../server/auth.mjs';
import { GET as startOAuth } from '../api/auth/start.js';

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
