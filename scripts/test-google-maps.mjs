import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isGoogleMapsUrl, googleMapsEmbedFromUrl } from '../src/utils/googleMaps.mjs';

test('peta lokasi Mitra Amanah terbentuk dari link yang diberikan klien', () => {
  const url = 'https://www.google.com/maps/search/Mitra%20Amanah%20Store/@-7.6009,112.7911,17z?hl=id';
  assert.equal(isGoogleMapsUrl(url), true);
  assert.equal(googleMapsEmbedFromUrl(url), 'https://www.google.com/maps?q=-7.6009%2C112.7911&z=17&output=embed');
});

test('tautan selain Google Maps ditolak', () => {
  for (const url of ['https://evil.example/maps', 'http://www.google.com/maps', 'https://google.com.evil.example/maps', 'javascript:alert(1)', '']) {
    assert.equal(isGoogleMapsUrl(url), false);
    assert.equal(googleMapsEmbedFromUrl(url), null);
  }
  assert.equal(isGoogleMapsUrl('https://maps.app.goo.gl/abc123'), true);
  assert.equal(googleMapsEmbedFromUrl('https://maps.app.goo.gl/abc123'), null);
});
