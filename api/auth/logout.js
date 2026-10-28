import { clearSessionCookie, json, requirePostSession } from '../../server/auth.mjs';

export function POST(request) {
  const { error } = requirePostSession(request);
  if (error) return error;
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
}
