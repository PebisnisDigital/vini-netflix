import type { ClientBrief, PortfolioContent } from './clientModel';
import { sushmitaExampleBrief } from './clientModel';
import type { TemplateId } from './templateCatalog.mjs';

import chibi from './clients/vini2.json';
import anime from './clients/vini4.json';
import clay from './clients/vini5.json';
import comic from './clients/vini6.json';
import editorial from './clients/vini7.json';
import doodle from './clients/vini8.json';
import storybook from './clients/vini9.json';
import scrapbook from './clients/vini10.json';
import papercut from './clients/vini11.json';
import pixel from './clients/vini12.json';
import miniature from './clients/vini13.json';
import documentary from './clients/vini14.json';
import minimalist from './clients/vini15.json';
import futuristic from './clients/vini16.json';
import vintage from './clients/vini17.json';
import tni from './clients/contoh-tni.json';

/** Satu sumber untuk demo publik dan contoh awal masing-masing gaya Studio. */
const demoByStyle: Record<Exclude<TemplateId, 'original'>, ClientBrief> = {
  'chibi-3d': chibi as ClientBrief,
  anime: anime as ClientBrief,
  'clay-3d': clay as ClientBrief,
  'komik-pop': comic as ClientBrief,
  'editorial-premium': editorial as ClientBrief,
  doodle: doodle as ClientBrief,
  storybook: storybook as ClientBrief,
  scrapbook: scrapbook as ClientBrief,
  'paper-cut': papercut as ClientBrief,
  'pixel-retro': pixel as ClientBrief,
  'miniature-world': miniature as ClientBrief,
  documentary: documentary as ClientBrief,
  minimalist: minimalist as ClientBrief,
  'futuristic-neon': futuristic as ClientBrief,
  'vintage-heritage': vintage as ClientBrief,
  'tni-nusantara': tni as ClientBrief,
};

export function getStudioDemoBrief(templateId: TemplateId): ClientBrief | null {
  return templateId === 'original' ? null : demoByStyle[templateId];
}

/**
 * Isi/struktur dari halaman demo, tetapi tanpa URL, kontak, dan foto milik demo.
 * Aset demo muncul hanya pada kanvas saat data klien belum diisi.
 */
export function createStudioStarterBrief(templateId: TemplateId): ClientBrief {
  if (templateId === 'original') return sushmitaExampleBrief();
  const demo = structuredClone(demoByStyle[templateId]);
  return {
    ...demo,
    slug: '',
    whatsapp: '',
    email: '',
    links: { website: '', linkedin: '', github: '' },
    templateId,
    designVariant: undefined,
    identityMode: 'photo',
    photo: { src: '', alt: '', srcSet: undefined },
    projects: demo.projects.map((item) => ({ ...item, image: '', website: '' })),
    watchCards: demo.watchCards?.map((item) => ({ ...item, image: '' })),
    pickCards: demo.pickCards?.map((item) => ({ ...item, image: '' })),
    seasons: demo.seasons?.map((season) => ({
      ...season,
      episodes: season.episodes.map((episode) => ({ ...episode, image: '' })),
    })),
  };
}

/**
 * Hanya dipakai pada kanvas lokal, tidak pernah mengubah draft atau payload publikasi.
 * Gambar klien sendiri selalu diutamakan ketika sudah diunggah.
 */
export function withStudioDemoPreviewAssets(content: PortfolioContent, brief: ClientBrief): PortfolioContent {
  const demo = getStudioDemoBrief(brief.templateId ?? 'original');
  if (!demo) return content;
  const preview = structuredClone(content);
  if (!brief.photo.src) {
    preview.profile.portrait.src = demo.photo.src;
    preview.profile.portrait.srcSet = '';
    preview.profile.portrait.alt = demo.photo.alt;
  }
  preview.projects.forEach((project, i) => {
    if (!brief.projects[i]?.image && demo.projects[i]?.image) project.image = demo.projects[i].image;
  });
  preview.watchCards?.forEach((card, i) => {
    if (!brief.watchCards?.[i]?.image && demo.watchCards?.[i]?.image) card.image = demo.watchCards[i].image;
  });
  preview.topPicks.forEach((card, i) => {
    if (!brief.pickCards?.[i]?.image && demo.pickCards?.[i]?.image) card.image = demo.pickCards[i].image;
  });
  preview.seasons.forEach((season, i) => season.episodes.forEach((episode, j) => {
    if (!brief.seasons?.[i]?.episodes[j]?.image && demo.seasons?.[i]?.episodes[j]?.image) episode.image = demo.seasons[i].episodes[j].image;
  }));
  return preview;
}

/** Hanya draft contoh yang masih utuh boleh berganti starter tanpa menghapus kerja klien. */
export function isUneditedStudioStarter(brief: ClientBrief): boolean {
  const templateId = brief.templateId ?? 'original';
  if (JSON.stringify(brief) === JSON.stringify(createStudioStarterBrief(templateId))) return true;
  // Kompatibilitas draft lama: dulu seluruh gaya memakai data Sushmita.
  const legacy = { ...sushmitaExampleBrief(), templateId, designVariant: undefined };
  return JSON.stringify(brief) === JSON.stringify(legacy);
}

/** Larang terbit ketika identitas/naskah Teh Vini pada demo belum diganti. */
export function findUnreplacedStudioDemoFields(brief: ClientBrief): string[] {
  const demo = getStudioDemoBrief(brief.templateId ?? 'original');
  if (!demo) return [];
  const leftover: string[] = [];
  if (brief.name.trim().toLowerCase() === demo.name.toLowerCase()) leftover.push('nama demo');
  if (brief.role.trim() === demo.role) leftover.push('profesi demo');
  if (brief.bio.trim() === demo.bio.trim()) leftover.push('cerita diri demo');
  if (brief.tagline.some((line) => demo.tagline.includes(line))) leftover.push('headline demo');
  if (brief.projects.some((project) => demo.projects.some((item) => item.title === project.title || item.description === project.description))) leftover.push('karya demo');
  if (brief.experiences.some((job) => demo.experiences.some((item) => item.company === job.company && item.role === job.role))) leftover.push('pengalaman demo');
  return leftover;
}
