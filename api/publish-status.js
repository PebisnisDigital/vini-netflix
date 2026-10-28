import { json, requireReadSession } from '../server/auth.mjs';
import { getClientPublicationStatus } from '../server/publishing.mjs';

export async function GET(request) {
  const access = requireReadSession(request);
  if (access.error) return access.error;
  const url = new URL(request.url);
  try {
    return json(await getClientPublicationStatus(access.session.token, { number: Number(url.searchParams.get('number')), sha: url.searchParams.get('sha') }));
  } catch (error) {
    return json({ error: error.message || 'Status penerbitan belum tersedia.' }, 400);
  }
}
