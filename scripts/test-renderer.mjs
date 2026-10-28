import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderClientHtml } from './render-client-pages.mjs';

test('judul dan deskripsi halaman klien tidak membawa nama Vini', () => {
  const html = '<head><title>TEH VINI — THE SERIES</title><meta name="description" content="Teh Vini" /><meta property="og:title" content="Teh Vini" /><meta property="og:description" content="Vini" /></head><body><noscript>TEH VINI</noscript></body>';
  const out = renderClientHtml(html, { name: 'Satria', bio: 'Fotografer Jakarta', photo: { src: '/clients/satria/foto-utama.webp' } });
  assert.match(out, /<title>Satria — THE SERIES<\/title>/);
  assert.match(out, /name="description" content="Fotografer Jakarta"/);
  assert.match(out, /property="og:title" content="Satria — THE SERIES"/);
  assert.doesNotMatch(out, /TEH VINI/);
  assert.match(out, /\/clients\/satria\/foto-utama.webp/);
});

test('data klien di-escape agar tidak menjadi tag HTML', () => {
  const out = renderClientHtml('<head><title>TEH VINI</title></head>', { name: '<script>alert(1)</script>', bio: 'Suka "foto" & desain', photo: { src: '/clients/satria/main.webp' } });
  assert.doesNotMatch(out, /<script>/);
  assert.match(out, /&lt;script&gt;/);
});
