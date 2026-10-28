import { github, json, repository, requirePostSession } from '../server/auth.mjs';

const MAX_BYTES = 2_500_000;
const validPath = /^public\/clients\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9][a-z0-9._-]{0,80})\.(png|jpe?g|webp|avif)$/i;

export async function POST(request) {
  let access;
  try { access = requirePostSession(request); } catch { return json({ error: 'Konfigurasi GitHub belum siap.' }, 503); }
  if (access.error) return access.error;
  const path = request.headers.get('x-client-photo-path') || '';
  if (!validPath.test(path)) return json({ error: 'Nama dan lokasi foto tidak valid.' }, 400);
  if (Number(request.headers.get('content-length') || 0) > MAX_BYTES) return json({ error: 'Foto terlalu besar. Maksimal 2,5 MB per file.' }, 413);
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength < 20 || bytes.byteLength > MAX_BYTES) return json({ error: 'Ukuran foto tidak didukung (maksimal 2,5 MB).' }, 413);
  try {
    const blob = await github(access.session.token, `${repository}/git/blobs`, {
      method: 'POST', body: JSON.stringify({ content: Buffer.from(bytes).toString('base64'), encoding: 'base64' }),
    });
    return json({ path, sha: blob.sha });
  } catch (error) { console.error('Upload blob gagal:', error); return json({ error: 'Upload foto ke GitHub gagal. Coba lagi.' }, 502); }
}
