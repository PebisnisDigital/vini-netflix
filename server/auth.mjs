import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'personalflix_session';
const STATE_COOKIE = 'personalflix_oauth_state';
const SESSION_SECONDS = 30 * 60;

export function oauthConfigured() {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_SESSION_SECRET && process.env.GITHUB_ALLOWED_LOGIN && process.env.GITHUB_CALLBACK_URL);
}

export function siteOrigin() {
  const callback = process.env.GITHUB_CALLBACK_URL;
  if (!callback) throw new Error('GitHub OAuth belum dikonfigurasi.');
  const parsed = new URL(callback);
  if (parsed.protocol !== 'https:' || parsed.pathname !== '/api/auth/callback') throw new Error('GITHUB_CALLBACK_URL harus HTTPS dan berakhir /api/auth/callback.');
  return parsed.origin;
}

function key() {
  const secret = process.env.GITHUB_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('GITHUB_SESSION_SECRET harus minimal 32 karakter acak.');
  return createHash('sha256').update(secret).digest();
}

function seal(data) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64url');
}

function unseal(value) {
  try {
    const raw = Buffer.from(value, 'base64url');
    if (raw.length < 29) return null;
    const decipher = createDecipheriv('aes-256-gcm', key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8'));
  } catch { return null; }
}

function cookieValue(request, name) {
  const cookies = request.headers.get('cookie') || '';
  const found = cookies.split(';').map((s) => s.trim()).find((s) => s.startsWith(`${name}=`));
  return found ? found.slice(name.length + 1) : '';
}

function cookie(name, value, age, path = '/') {
  return `${name}=${value}; Path=${path}; Max-Age=${age}; Secure; HttpOnly; SameSite=Lax`;
}

export function startState() {
  const state = randomBytes(32).toString('hex');
  return { state, cookie: cookie(STATE_COOKIE, seal({ state, exp: Date.now() + 600000 }), 600, '/api/auth') };
}

export function stateIsValid(request, value) {
  const stored = unseal(cookieValue(request, STATE_COOKIE));
  if (!stored || typeof stored.state !== 'string' || stored.exp < Date.now() || typeof value !== 'string' || stored.state.length !== value.length) return false;
  return timingSafeEqual(Buffer.from(stored.state), Buffer.from(value));
}

export function clearStateCookie() { return cookie(STATE_COOKIE, '', 0, '/api/auth'); }
export function setSessionCookie({ login, token }) {
  return cookie(SESSION_COOKIE, seal({ login, token, exp: Date.now() + SESSION_SECONDS * 1000 }), SESSION_SECONDS);
}
export function clearSessionCookie() { return cookie(SESSION_COOKIE, '', 0); }

export function readSession(request) {
  if (!oauthConfigured()) return null;
  const session = unseal(cookieValue(request, SESSION_COOKIE));
  if (!session || typeof session.login !== 'string' || typeof session.token !== 'string' || session.exp < Date.now()) return null;
  if (session.login.toLowerCase() !== process.env.GITHUB_ALLOWED_LOGIN.toLowerCase()) return null;
  return session;
}

export function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...extraHeaders } });
}

export function requirePostSession(request) {
  if (request.method !== 'POST') return { error: json({ error: 'Metode tidak diizinkan.' }, 405) };
  const origin = request.headers.get('origin');
  const expected = siteOrigin();
  if (origin !== expected || request.headers.get('x-personalflix-action') !== '1') return { error: json({ error: 'Permintaan tidak valid.' }, 403) };
  const session = readSession(request);
  if (!session) return { error: json({ error: 'Silakan login GitHub saat menerbitkan.' }, 401) };
  return { session };
}

export async function github(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${result.message || 'Operasi ditolak'}`);
  return result;
}

export const repository = '/repos/PebisnisDigital/vini-netflix';
