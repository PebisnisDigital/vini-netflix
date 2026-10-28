import { clearSessionCookie, clearStateCookie, github, json, oauthConfigured, setSessionCookie, siteOrigin, stateIsValid } from '../../server/auth.mjs';

export async function GET(request) {
  if (!oauthConfigured()) return json({ error: 'Login GitHub belum diaktifkan.' }, 503);
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code || !stateIsValid(request, url.searchParams.get('state'))) return json({ error: 'Sesi login tidak cocok atau kedaluwarsa. Ulangi dari dashboard.' }, 403);
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${siteOrigin()}/api/auth/callback` }),
    });
    const tokenInfo = await response.json();
    if (!response.ok || !tokenInfo.access_token) return json({ error: 'Otorisasi GitHub gagal. Coba login kembali.' }, 401);
    const user = await github(tokenInfo.access_token, '/user');
    if (user.login?.toLowerCase() !== process.env.GITHUB_ALLOWED_LOGIN.toLowerCase()) return json({ error: 'Akun GitHub ini tidak diizinkan menerbitkan website.' }, 403, { 'Set-Cookie': clearSessionCookie() });
    const headers = new Headers({ Location: `${siteOrigin()}/studio?login=berhasil`, 'Cache-Control': 'no-store' });
    headers.append('Set-Cookie', setSessionCookie({ login: user.login, token: tokenInfo.access_token }));
    headers.append('Set-Cookie', clearStateCookie());
    return new Response(null, { status: 302, headers });
  } catch (error) { console.error('OAuth callback gagal:', error); return json({ error: 'Login GitHub belum berhasil.' }, 502); }
}
