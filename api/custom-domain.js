import { json, requirePostSession } from '../server/auth.mjs';
import { createDomainRequest } from '../server/domain-publishing.mjs';
export async function POST(request) {
  let access;
  try { access = requirePostSession(request); } catch { return json({ error: 'Konfigurasi Studio belum siap.' }, 503); }
  if (access.error) return access.error;
  if (Number(request.headers.get('content-length') || 0) > 2000) return json({ error: 'Permintaan terlalu besar.' }, 413);
  try {
    const raw = await request.text();
    if (raw.length > 2000) return json({ error: 'Permintaan terlalu besar.' }, 413);
    return json(await createDomainRequest(access.session.token, JSON.parse(raw)), 201);
  } catch (cause) {
    return json({ error: cause instanceof Error ? cause.message : 'Tidak dapat menyiapkan domain.' }, 400);
  }
}
