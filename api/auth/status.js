import { json, oauthConfigured, readSession } from '../../server/auth.mjs';

export function GET(request) {
  const session = readSession(request);
  return json({ configured: oauthConfigured(), authenticated: Boolean(session), login: session?.login || null });
}
