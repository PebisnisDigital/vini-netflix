import { json, requirePostSession } from '../server/auth.mjs';
import { mergeClientPullRequest } from '../server/publishing.mjs';

export async function POST(request) {
  let access;
  try { access = requirePostSession(request); } catch { return json({ error: 'Konfigurasi GitHub belum siap.' }, 503); }
  if (access.error) return access.error;
  try {
    const { confirmed, number, sha } = await request.json();
    if (confirmed !== true) return json({ error: 'Konfirmasi pemeriksaan preview diperlukan.' }, 400);
    return json(await mergeClientPullRequest(access.session.token, { number, sha }));
  } catch (error) {
    console.error('Merge klien gagal:', error);
    return json({ error: error.message || 'Gagal menerbitkan website.' }, 409);
  }
}
