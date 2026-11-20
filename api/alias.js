import { json, requirePostSession } from '../server/auth.mjs';
import { createClientAliasPullRequest } from '../server/client-aliases.mjs';
import { createDomainRequest } from '../server/domain-publishing.mjs';

export async function POST(request) {
  let access;
  try { access = requirePostSession(request); } catch { return json({ error: 'Konfigurasi GitHub belum siap.' }, 503); }
  if (access.error) return access.error;
  if (Number(request.headers.get('content-length') || 0) > 2000) return json({ error: 'Permintaan terlalu besar.' }, 413);
  try {
    const raw = await request.text();
    if (raw.length > 2000) return json({ error: 'Permintaan terlalu besar.' }, 413);
    const input = JSON.parse(raw);
    if (input?.action === 'custom-domain') return json(await createDomainRequest(access.session.token, input), 201);
    return json(await createClientAliasPullRequest(access.session.token, input), 201);
  } catch (cause) {
    console.error('Ubah URL klien gagal:', cause);
    return json({ error: cause.message || 'Gagal menyiapkan perubahan URL.' }, 400);
  }
}
