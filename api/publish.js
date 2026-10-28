import { json, requirePostSession } from '../server/auth.mjs';
import { createClientPullRequest } from '../server/publishing.mjs';

export async function POST(request) {
  let access;
  try { access = requirePostSession(request); } catch { return json({ error: 'Konfigurasi GitHub belum siap.' }, 503); }
  if (access.error) return access.error;
  if (Number(request.headers.get('content-length') || 0) > 120_000) return json({ error: 'Data klien terlalu besar.' }, 413);
  try {
    const payload = await request.json();
    const result = await createClientPullRequest(access.session.token, payload);
    return json(result, 201);
  } catch (error) {
    console.error('Penerbitan draft gagal:', error);
    return json({ error: error.message || 'Gagal membuat preview GitHub.' }, 400);
  }
}
