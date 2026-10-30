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

test('STORYBOOK membuat halaman buku bergerak otomatis dan mewarisi section ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/StorybookHero.tsx');
  const css = read('src/components/storybook.css');
  assert.match(app, /<StorybookHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  assert.match(hero, /data-studio-edit="portrait"/);
  assert.match(hero, /data-studio-edit="name"/);
  assert.match(hero, /data-studio-edit="bio"/);
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*storybook-watercolor-drift[^;]*infinite/);
  assert.match(css, /animation:\s*storybook-page-turn[^;]*infinite/);
  assert.match(css, /animation:\s*storybook-firefly-float[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});

test('SCRAPBOOK memakai polaroid dan stiker bergerak tanpa menghilangkan section ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/ScrapbookHero.tsx');
  const css = read('src/components/scrapbook.css');
  assert.match(app, /<ScrapbookHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  assert.match(hero, /data-studio-edit="portrait"/);
  assert.match(hero, /data-studio-edit="name"/);
  assert.match(hero, /data-studio-edit="bio"/);
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*scrapbook-photo-sway[^;]*infinite/);
  assert.match(css, /animation:\s*scrapbook-camera-drift[^;]*infinite/);
  assert.match(css, /animation:\s*scrapbook-ink-draw[^;]*infinite/);
  assert.match(css, /animation:\s*scrapbook-sticker-wiggle[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});

test('PAPER CUT menganimasikan diorama berlapis secara otomatis dan mewarisi section ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/PaperCutHero.tsx');
  const css = read('src/components/paper-cut.css');
  assert.match(app, /<PaperCutHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  assert.match(hero, /data-studio-edit="portrait"/);
  assert.match(hero, /data-studio-edit="name"/);
  assert.match(hero, /data-studio-edit="bio"/);
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*papercut-layer-breathe[^;]*infinite/);
  assert.match(css, /animation:\s*papercut-stage-float[^;]*infinite/);
  assert.match(css, /animation:\s*papercut-butterfly-flutter[^;]*infinite/);
  assert.match(css, /animation:\s*papercut-sun-turn[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});

test('PIXEL RETRO menganimasikan dunia game tanpa kontrol dan tetap memakai section ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/PixelRetroHero.tsx');
  const css = read('src/components/pixel-retro.css');
  assert.match(app, /<PixelRetroHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  for (const field of ['portrait', 'name', 'role', 'tagline', 'bio']) assert.match(hero, new RegExp(`data-studio-edit="${field}"`));
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*pixel-star-blink[^;]*infinite/);
  assert.match(css, /animation:\s*pixel-camera-pan[^;]*infinite/);
  assert.match(css, /animation:\s*pixel-coin-hop[^;]*infinite/);
  assert.match(css, /animation:\s*pixel-cloud-drift[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});

test('MINIATURE WORLD menggerakkan diorama, orbit dan kamera tanpa mematikan section ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/MiniatureWorldHero.tsx');
  const css = read('src/components/miniature-world.css');
  assert.match(app, /<MiniatureWorldHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  for (const field of ['portrait', 'name', 'role', 'tagline', 'bio']) assert.match(hero, new RegExp(`data-studio-edit="${field}"`));
  assert.match(hero, /initial=\{\{ opacity: 0/);
  assert.match(css, /animation:\s*miniature-island-bob[^;]*infinite/);
  assert.match(css, /animation:\s*miniature-camera-drift[^;]*infinite/);
  assert.match(css, /animation:\s*miniature-orbit-turn[^;]*infinite/);
  assert.match(css, /animation:\s*miniature-project-pan[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /AnimationControl|toggleMotion|PauseAnimation/);
});

test('DOCUMENTARY memiliki gerak film otomatis dan mempertahankan semua fitur ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/DocumentaryHero.tsx');
  const css = read('src/components/documentary.css');
  assert.match(app, /<DocumentaryHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  for (const field of ['portrait', 'name', 'role', 'tagline', 'bio']) assert.match(hero, new RegExp(`data-studio-edit="${field}"`));
  assert.match(hero, /onOpenProject\(project\)/);
  assert.match(hero, /onClick=\{onPlay\}/);
  assert.match(css, /animation:\s*documentary-ken-burns[^;]*infinite/);
  assert.match(css, /animation:\s*documentary-ticker[^;]*infinite/);
  assert.match(css, /animation:\s*documentary-grain-shift[^;]*infinite/);
  assert.match(css, /animation:\s*documentary-scene-pan[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /PauseAnimation|AnimationControl|toggleMotion/);
});

test('MINIMALIST memiliki gerak foto tenang, indeks karya interaktif dan fitur ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/MinimalistHero.tsx');
  const css = read('src/components/minimalist.css');
  assert.match(app, /<MinimalistHero\s+key=/);
  assert.match(app, /<ContinueWatching\s+order=/);
  assert.match(app, /<Scene\s+key=/);
  assert.match(app, /<FinalCTA\s+onReplay=/);
  for (const field of ['portrait', 'name', 'role', 'tagline', 'bio']) assert.match(hero, new RegExp(`data-studio-edit="${field}"`));
  assert.match(hero, /onOpenProject\(project\)/);
  assert.match(hero, /onClick=\{onPlay\}/);
  assert.match(css, /animation:\s*minimalist-camera-breathe[^;]*infinite/);
  assert.match(css, /animation:\s*minimalist-dot-pulse[^;]*infinite/);
  assert.match(css, /animation:\s*minimalist-thumbnail-breathe[^;]*infinite/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /PauseAnimation|AnimationControl|toggleMotion/);
});

test('FUTURISTIC NEON menggerakkan HUD, foto, orbit dan karya tanpa kontrol manual', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/FuturisticNeonHero.tsx');
  const css = read('src/components/futuristic-neon.css');
  assert.match(app, /<FuturisticNeonHero\s+key=/);
  for (const original of ['<ContinueWatching', '<Scene', '<FinalCTA']) assert.ok(app.includes(original));
  for (const field of ['portrait', 'name', 'role', 'tagline', 'bio']) assert.match(hero, new RegExp(`data-studio-edit="${field}"`));
  assert.match(hero, /onOpenProject\(project\)/);
  assert.match(hero, /onClick=\{onPlay\}/);
  assert.match(hero, /bukan foto asli/i);
  for (const animation of ['neon-camera-breathe', 'neon-scan-sweep', 'neon-orbit-turn', 'neon-project-drift', 'neon-atmosphere-drift']) {
    assert.match(css, new RegExp(`animation:\\s*${animation}[^;]*infinite`));
  }
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /PauseAnimation|AnimationControl|toggleMotion/);
});

test('VINTAGE HERITAGE menggerakkan arsip editorial otomatis dan mewarisi fungsi ORIGINAL', () => {
  const app = read('src/App.tsx');
  const hero = read('src/components/VintageHeritageHero.tsx');
  const css = read('src/components/vintage-heritage.css');
  assert.match(app, /<VintageHeritageHero\s+key=/);
  for (const original of ['<ContinueWatching', '<Scene', '<FinalCTA']) assert.ok(app.includes(original));
  for (const field of ['portrait', 'name', 'role', 'tagline', 'bio']) assert.match(hero, new RegExp(`data-studio-edit="${field}"`));
  assert.match(hero, /onOpenProject\(project\)/);
  assert.match(hero, /onClick=\{onPlay\}/);
  assert.match(hero, /BUKAN FOTO ASLI/);
  for (const animation of ['heritage-camera-breathe', 'heritage-mat-rock', 'heritage-grain-shift', 'heritage-seal-sway', 'heritage-project-drift']) {
    assert.match(css, new RegExp(`animation:\\s*${animation}[^;]*infinite`));
  }
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(hero, /PauseAnimation|AnimationControl|toggleMotion/);
});
