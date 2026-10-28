import { json } from '../../server/auth.mjs';
import { studioCodeIsValid, studioConfigured, studioLoginLimited, studioSessionCookie, verifyStudioAction } from '../../server/studio-auth.mjs';

export async function POST(request) {
  if (!verifyStudioAction(request)) return json({ error: 'Permintaan tidak diizinkan.' }, 403);
  if (!studioConfigured()) return json({ error: 'Akses Studio belum diaktifkan oleh pengelola.' }, 503);
  if (Number(request.headers.get('content-length') || 0) > 1500) return json({ error: 'Permintaan terlalu besar.' }, 413);
  let code;
  try { ({ code } = await request.json()); } catch { return json({ error: 'Format kode tidak valid.' }, 400); }
  const correct = studioCodeIsValid(code);
  if (studioLoginLimited(request, correct)) return json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' }, 429);
  if (!correct) return json({ error: 'Kode akses salah.' }, 401);
  return json({ authenticated: true }, 200, { 'Set-Cookie': studioSessionCookie() });
}
