import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'pesonaflix_studio';
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const SITE_ORIGIN = 'https://pesonaflix.vercel.app';
const attempts = new Map();

export function studioConfigured() {
  return Boolean(process.env.PESONAFLIX_STUDIO_ACCESS_KEY?.length >= 16 && process.env.PESONAFLIX_STUDIO_SESSION_SECRET?.length >= 32);
}

export function studioPublisherConfigured() {
  return Boolean(process.env.PESONAFLIX_GITHUB_TOKEN?.length >= 20);
}

export function studioOrigin() {
  const configured = process.env.PESONAFLIX_STUDIO_ORIGIN || SITE_ORIGIN;
  const url = new URL(configured);
  if (url.origin !== configured || !['https:', 'http:'].includes(url.protocol)) throw new Error('Origin Studio tidak valid.');
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') throw new Error('Origin Studio wajib HTTPS.');
  return configured;
}

export function verifyStudioAction(request) {
  return request.method === 'POST'
    && request.headers.get('origin') === studioOrigin()
    && request.headers.get('x-personalflix-action') === '1';
}

function secretKey() {
  return createHash('sha256').update(process.env.PESONAFLIX_STUDIO_SESSION_SECRET).digest();
}

function seal(payload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', secretKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

function unseal(raw) {
  try {
    const bytes = Buffer.from(raw, 'base64url');
    if (bytes.length < 29) return null;
    const decipher = createDecipheriv('aes-256-gcm', secretKey(), bytes.subarray(0, 12));
    decipher.setAuthTag(bytes.subarray(12, 28));
    return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString('utf8'));
  } catch { return null; }
}

function cookieHeader(value, age) {
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${age}; Secure; HttpOnly; SameSite=Strict`;
}

export function studioSessionCookie() {
  if (!studioConfigured()) throw new Error('Akses Studio belum dikonfigurasi.');
  return cookieHeader(seal({ kind: 'pesonaflix-studio', exp: Date.now() + SESSION_SECONDS * 1000 }), SESSION_SECONDS);
}

export function clearStudioSessionCookie() { return cookieHeader('', 0); }

export function readStudioSession(request) {
  if (!studioConfigured()) return null;
  const raw = (request.headers.get('cookie') || '').split(';').map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!raw) return null;
  const session = unseal(raw);
  return session?.kind === 'pesonaflix-studio' && typeof session.exp === 'number' && session.exp > Date.now() ? { kind: 'studio' } : null;
}

export function studioCodeIsValid(code) {
  if (!studioConfigured() || typeof code !== 'string' || code.length < 16 || code.length > 256) return false;
  const actual = createHash('sha256').update(process.env.PESONAFLIX_STUDIO_ACCESS_KEY, 'utf8').digest();
  const supplied = createHash('sha256').update(code, 'utf8').digest();
  return timingSafeEqual(actual, supplied);
}

/** Pembatasan best-effort per instance; gunakan proteksi WAF untuk pembatasan lintas instance. */
export function studioLoginLimited(request, correct) {
  const address = (request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim();
  const id = createHash('sha256').update(address).digest('hex');
  const now = Date.now();
  if (attempts.size > 1000) for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
  const record = attempts.get(id);
  if (record && record.until > now && record.count >= 5) return true;
  if (correct) { attempts.delete(id); return false; }
  const count = record && record.until > now ? record.count + 1 : 1;
  attempts.set(id, { count, until: now + 15 * 60_000 });
  return false;
}
