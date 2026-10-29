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

test('KOMIK POP menambah gerak otomatis tanpa mengganti section dan transisi ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/ComicHero.tsx');
  const css = read('src/components/comic.css');
  assert.match(app, /<ComicHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  assert.match(hero, /data-studio-edit="portrait"/);
  assert.match(css, /animation:\s*comic-camera-drift[^;]*infinite/);
  assert.match(css, /animation:\s*comic-burst-pop[^;]*infinite/);
  assert.match(css, /animation:\s*comic-halftone-drift[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('EDITORIAL PREMIUM memiliki kamera dan detail yang bergerak otomatis; section ORIGINAL tetap ada', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/EditorialHero.tsx');
  const css = read('src/components/editorial.css');
  assert.match(app, /<EditorialHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  assert.match(hero, /data-studio-edit="portrait"/);
  assert.match(hero, /data-studio-edit="bio"/);
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*editorial-camera-drift[^;]*infinite/);
  assert.match(css, /animation:\s*editorial-scroll-pulse[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});

test('DOODLE memiliki garis yang tergambar dan animasi otomatis serta mewarisi section ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/DoodleHero.tsx');
  const css = read('src/components/doodle.css');
  assert.match(app, /<DoodleHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  assert.match(hero, /data-studio-edit="portrait"/);
  assert.match(hero, /data-studio-edit="name"/);
  assert.match(hero, /data-studio-edit="bio"/);
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*doodle-image-breathe[^;]*infinite/);
  assert.match(css, /animation:\s*doodle-line-draw[^;]*infinite/);
  assert.match(css, /animation:\s*doodle-sun-turn[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});
