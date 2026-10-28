import { json } from '../../server/auth.mjs';
import { clearStudioSessionCookie, verifyStudioAction } from '../../server/studio-auth.mjs';

export function POST(request) {
  if (!verifyStudioAction(request)) return json({ error: 'Permintaan tidak diizinkan.' }, 403);
  return json({ authenticated: false }, 200, { 'Set-Cookie': clearStudioSessionCookie() });
}
