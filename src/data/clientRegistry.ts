import { createPortfolioFromBrief, normalizeSlug, validateBrief, viniContent, type ClientBrief, type PortfolioContent } from './clientModel';
import aliases from './clientAliases.json';
import { sourceForPublicSlug } from './clientAliases.mjs';
import { clientReferralCode } from '../utils/clientWhatsapp.mjs';

// Setiap berkas JSON menjadi satu halaman klien. Import dinamis menjaga bundel tetap ringan.
const clientFiles = import.meta.glob<{ default: ClientBrief }>('./clients/*.json');

export async function loadClient(pathname: string): Promise<{ slug: string; content: PortfolioContent } | null> {
  let slug: string;
  try { slug = decodeURIComponent(pathname.replace(/^\/+|\/+$/g, '')); } catch { return null; }
  if (slug === 'vini') return { slug, content: viniContent };
  if (!slug || slug !== normalizeSlug(slug)) return null;
  const sourceSlug = sourceForPublicSlug(aliases, slug);
  const loadFile = clientFiles[`./clients/${sourceSlug}.json`];
  if (!loadFile) return null;
  const { default: brief } = await loadFile();
  if (brief.slug !== sourceSlug || validateBrief(brief).length) throw new Error(`Konfigurasi klien ${slug} belum lolos validasi.`);
  const content = createPortfolioFromBrief(brief);
  if (slug !== sourceSlug) {
    content.profile.clientSlug = slug;
    content.profile.referralCode = clientReferralCode(slug);
  }
  return { slug, content };
}
