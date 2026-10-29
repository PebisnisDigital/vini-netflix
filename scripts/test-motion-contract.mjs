import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('gerakan landing otomatis tanpa kontrol dan tanpa penonaktifan dari preferensi sistem', () => {
  const landing = read('src/landing/LandingPage.tsx');
  const css = read('src/landing/landing.css');
  assert.doesNotMatch(landing, /MotionPreferenceControl|useReducedMotion|motionPreferenceKey/);
  assert.match(landing, /if \(!autoPlay\) return/);
  assert.match(css, /animation:\s*lp-cta-zoom[^;]*infinite/);
  assert.match(css, /animation:\s*lp-cast-float[^;]*infinite/);
  assert.match(css, /animation:\s*lp-image-breathe[^;]*infinite/);
  assert.doesNotMatch(css, /animation-duration:\s*\.01ms\s*!important/);
});

test('template klien memiliki gerakan otomatis tanpa memengaruhi Studio', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/Hero.tsx');
  const css = read('src/index.css');
  assert.match(app, /editorMode\s*\?\s*''\s*:\s*' client-portfolio'/);
  assert.match(hero, /client-portrait-cinema/);
  assert.match(hero, /client-hero-now-playing/);
  assert.match(css, /animation:\s*client-portrait-drift[^;]*infinite/);
  assert.match(css, /animation:\s*client-cta-zoom[^;]*infinite/);
  assert.match(css, /animation:\s*client-card-kenburns[^;]*infinite/);
});
