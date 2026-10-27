import { createPortfolioFromBrief, normalizeSlug, validateBrief, viniContent, type ClientBrief, type PortfolioContent } from './clientModel';

// Setiap berkas JSON menjadi satu halaman klien. Import dinamis menjaga bundel tetap ringan.
const clientFiles = import.meta.glob<{ default: ClientBrief }>('./clients/*.json');

export async function loadClient(pathname: string): Promise<{ slug: string; content: PortfolioContent } | null> {
  let slug: string;
  try { slug = decodeURIComponent(pathname.replace(/^\/+|\/+$/g, '')); } catch { return null; }
  if (slug === 'vini') return { slug, content: viniContent };
  if (!slug || slug !== normalizeSlug(slug)) return null;
  const loadFile = clientFiles[`./clients/${slug}.json`];
  if (!loadFile) return null;
  const { default: brief } = await loadFile();
  if (brief.slug !== slug || validateBrief(brief).length) throw new Error(`Konfigurasi klien ${slug} belum lolos validasi.`);
  return { slug, content: createPortfolioFromBrief(brief) };
}
