import { json, oauthConfigured, siteOrigin, startState } from '../../server/auth.mjs';

export function GET() {
  if (!oauthConfigured()) return json({ error: 'Login GitHub belum diaktifkan. Hubungi admin untuk konfigurasi OAuth.' }, 503);
  try {
    const { state, cookie } = startState();
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID);
    url.searchParams.set('redirect_uri', `${siteOrigin()}/api/auth/callback`);
    url.searchParams.set('scope', 'public_repo');
    url.searchParams.set('state', state);
    return new Response(null, { status: 302, headers: { Location: url.href, 'Set-Cookie': cookie, 'Cache-Control': 'no-store' } });
  } catch (error) { console.error('OAuth start gagal:', error); return json({ error: 'Konfigurasi autentikasi belum valid.' }, 503); }
}
