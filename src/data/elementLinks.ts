/** Tautan untuk foto, kartu, dan tulisan pada semua gaya PESONAFLIX. */
export type ElementLinks = Record<string, string>;

export const BASE_LINK_TARGETS = [
  { id: 'portrait', label: 'Foto utama / avatar' },
  { id: 'name', label: 'Nama profil' },
  { id: 'role', label: 'Profesi' },
  { id: 'tagline', label: 'Tagline' },
  { id: 'bio', label: 'Cerita singkat' },
  { id: 'location', label: 'Lokasi' },
  { id: 'journey:heading', label: 'Judul perjalanan' },
  { id: 'picks:heading', label: 'Judul pilihan' },
  { id: 'skills:heading', label: 'Judul keahlian' },
] as const;

export function isElementKey(input: unknown): input is string {
  return typeof input === 'string' && /^[a-z][a-z0-9:-]{0,99}$/.test(input) && !input.includes('::');
}

export function isSafeElementHref(input: unknown): input is string {
  if (typeof input !== 'string' || input.length > 2048 || input !== input.trim() || /[\u0000-\u001f\u007f<>"'\\]/.test(input)) return false;
  if (/^#[a-z][a-z0-9-]*$/i.test(input)) return true;
  if (/^mailto:[^\s@?]+@[^\s@?]+\.[a-z]{2,}(?:\?subject=[^\s]*)?$/i.test(input)) return true;
  if (/^tel:\+?[0-9()-]{5,25}$/.test(input)) return true;
  if (/^\/(?!\/)[a-z0-9\-/_#?=&%.]*$/i.test(input)) return true;
  try {
    const parsed = new URL(input);
    return ['http:', 'https:'].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch { return false; }
}

/** Kartu dapat diklik melalui gambar, judul, ataupun ruang kosongnya. */
export function elementKeyCandidates(field: string): string[] {
  if (!isElementKey(field)) return [];
  const parts = field.split(':');
  const prefix = parts[0];
  if (['project', 'watch', 'pick', 'season', 'highlight', 'skill-category'].includes(prefix) && /^\d+$/.test(parts[1] || '')) return [field, `${prefix}:${parts[1]}`];
  if (['episode', 'skill'].includes(prefix) && /^\d+$/.test(parts[1] || '') && /^\d+$/.test(parts[2] || '')) return [field, `${prefix}:${parts[1]}:${parts[2]}`];
  return [field];
}

export function validateElementLinks(input: unknown): string[] {
  if (input === undefined) return [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return ['Tautan elemen harus berupa daftar.'];
  const entries = Object.entries(input);
  if (entries.length > 200 || entries.some(([key, url]) => !isElementKey(key) || !isSafeElementHref(url))) return ['Tautan elemen tidak valid. Gunakan https://, #bagian, mailto:, tel:, atau /halaman.'];
  return [];
}
