/** Pengaturan Elementor-lite yang melekat pada satu klien, bukan pada master template. */
import { isSafeElementHref } from './elementLinks';
export const VISUAL_SECTIONS = [
  { id: 'top', label: 'Pembuka / Hero' },
  { id: 'continue', label: 'Lanjutkan Menjelajah' },
  { id: 'about', label: 'Tentang Saya' },
  { id: 'journey', label: 'Perjalanan' },
  { id: 'originals', label: 'Karya' },
  { id: 'picks', label: 'Pilihan' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'moments', label: 'Sorotan' },
  { id: 'story', label: 'Cerita / CV' },
  { id: 'contact', label: 'Kontak / Penutup' },
] as const;

export type VisualSectionId = (typeof VISUAL_SECTIONS)[number]['id'];
export const VISUAL_FONTS = ['Default', 'Inter', 'Nunito Sans', 'Playfair Display', 'Poppins', 'Montserrat', 'Caveat', 'Bebas Neue', 'Georgia'] as const;
export type VisualFont = (typeof VISUAL_FONTS)[number];
export const VISUAL_ICONS = ['star', 'heart', 'award', 'book-open', 'graduation-cap', 'briefcase-business', 'mail', 'phone', 'globe', 'map-pin', 'leaf', 'check-circle', 'lightbulb', 'sparkles', 'users', 'instagram', 'facebook', 'youtube', 'music-2'] as const;
export type VisualIcon = (typeof VISUAL_ICONS)[number];

export type VisualTextStyle = { color?: string; fontFamily?: VisualFont; fontSize?: number };
export type VisualWidget = {
  id: string;
  section: VisualSectionId;
  type: 'text' | 'icon';
  text: string;
  icon?: VisualIcon;
  color?: string;
  fontFamily?: VisualFont;
  fontSize?: number;
  url?: string;
};
export type VisualDesign = {
  sectionBackgrounds?: Partial<Record<VisualSectionId, string>>;
  textStyles?: Record<string, VisualTextStyle>;
  widgets?: VisualWidget[];
};

const isHex = (value: unknown): value is string => typeof value === 'string' && /^#[\da-fA-F]{6}$/.test(value);
const validFont = (value: unknown) => VISUAL_FONTS.includes(value as VisualFont);
const validSize = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 10 && value <= 112;
const validTextStyle = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const style = value as VisualTextStyle;
  return (style.color === undefined || isHex(style.color)) &&
    (style.fontFamily === undefined || validFont(style.fontFamily)) &&
    (style.fontSize === undefined || validSize(style.fontSize));
};

export function validateVisualDesign(input: unknown): string[] {
  if (input === undefined) return [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return ['Pengaturan desain visual tidak valid.'];
  const design = input as VisualDesign;
  const errors: string[] = [];
  if (design.sectionBackgrounds !== undefined) {
    if (!design.sectionBackgrounds || typeof design.sectionBackgrounds !== 'object' || Array.isArray(design.sectionBackgrounds) ||
      Object.entries(design.sectionBackgrounds).some(([key, value]) => !VISUAL_SECTIONS.some((section) => section.id === key) || !isHex(value))) errors.push('Warna section harus kode hex 6 digit.');
  }
  if (design.textStyles !== undefined) {
    if (!design.textStyles || typeof design.textStyles !== 'object' || Array.isArray(design.textStyles) || Object.keys(design.textStyles).length > 200 ||
      Object.entries(design.textStyles).some(([field, style]) => !/^[a-z0-9:-]{1,100}$/.test(field) || !validTextStyle(style))) errors.push('Pengaturan tipografi teks tidak valid (maksimal 200 elemen).');
  }
  if (design.widgets !== undefined) {
    if (!Array.isArray(design.widgets) || design.widgets.length > 60 || design.widgets.some((widget) =>
      !widget || typeof widget.id !== 'string' || !/^[a-z0-9-]{1,64}$/.test(widget.id) ||
      !VISUAL_SECTIONS.some((section) => section.id === widget.section) || !['text', 'icon'].includes(widget.type) ||
      typeof widget.text !== 'string' || widget.text.length > 1000 ||
      (widget.icon !== undefined && !VISUAL_ICONS.includes(widget.icon)) ||
      (widget.color !== undefined && !isHex(widget.color)) ||
      (widget.fontFamily !== undefined && !validFont(widget.fontFamily)) ||
      (widget.fontSize !== undefined && !validSize(widget.fontSize)) ||
      (widget.url !== undefined && widget.url !== '' && !isSafeElementHref(widget.url)))) errors.push('Widget teks/ikon tidak valid (maksimal 60 widget).');
  }
  return errors;
}
