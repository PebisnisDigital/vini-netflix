import type { CSSProperties } from 'react';
import {
  Award, BookOpen, BriefcaseBusiness, CheckCircle, Facebook, Globe, GraduationCap,
  Heart, Instagram, Leaf, Lightbulb, Mail, MapPin, Music2, Phone, Sparkles, Star, Users, Youtube,
} from 'lucide-react';
import { usePortfolio } from '../data/PortfolioContext';
import { VISUAL_SECTIONS, type VisualFont, type VisualIcon, type VisualSectionId } from '../data/visualDesign';

const fontStack: Record<VisualFont, string> = {
  Default: 'inherit',
  Inter: 'Inter, sans-serif',
  'Nunito Sans': '"Nunito Sans", sans-serif',
  'Playfair Display': '"Playfair Display", Georgia, serif',
  Poppins: 'Poppins, sans-serif',
  Montserrat: 'Montserrat, sans-serif',
  Caveat: 'Caveat, cursive',
  'Bebas Neue': '"Bebas Neue", sans-serif',
  Georgia: 'Georgia, serif',
};

const iconComponents = {
  star: Star, heart: Heart, award: Award, 'book-open': BookOpen,
  'graduation-cap': GraduationCap, 'briefcase-business': BriefcaseBusiness,
  mail: Mail, phone: Phone, globe: Globe, 'map-pin': MapPin,
  leaf: Leaf, 'check-circle': CheckCircle, lightbulb: Lightbulb,
  sparkles: Sparkles, users: Users, instagram: Instagram,
  facebook: Facebook, youtube: Youtube, 'music-2': Music2,
} satisfies Record<VisualIcon, typeof Star>;

const colorOK = (input: unknown): input is string => typeof input === 'string' && /^#[\da-fA-F]{6}$/.test(input);
const fontOK = (input: unknown): input is VisualFont => typeof input === 'string' && Object.prototype.hasOwnProperty.call(fontStack, input);
const sizeOK = (input: unknown): input is number => typeof input === 'number' && Number.isInteger(input) && input >= 10 && input <= 112;

/** CSS dibatasi pada warna, font, dan ukuran terverifikasi; tidak menerima CSS bebas dari pengguna. */
export function VisualDesignStyles() {
  const { visualDesign } = usePortfolio();
  if (!visualDesign) return null;
  const rules: string[] = [];
  for (const section of VISUAL_SECTIONS) {
    const color = visualDesign.sectionBackgrounds?.[section.id];
    if (colorOK(color)) rules.push(`.client-portfolio #${section.id}{background:${color}!important;}`);
  }
  for (const [field, style] of Object.entries(visualDesign.textStyles ?? {})) {
    if (!/^[a-z0-9:-]{1,100}$/.test(field) || !style) continue;
    const properties: string[] = [];
    if (colorOK(style.color)) properties.push(`color:${style.color}!important`);
    if (fontOK(style.fontFamily) && style.fontFamily !== 'Default') properties.push(`font-family:${fontStack[style.fontFamily]}!important`);
    if (sizeOK(style.fontSize)) properties.push(`font-size:min(${style.fontSize}px, 10vw)!important`, 'line-height:1.3!important', 'overflow-wrap:anywhere');
    if (properties.length) {
      const selector = `.client-portfolio [data-studio-edit="${field}"]`;
      rules.push(`${selector},${selector} h1,${selector} h2,${selector} h3,${selector} p,${selector} span{${properties.join(';')}}`);
    }
  }
  return rules.length ? <style>{rules.join('\n')}</style> : null;
}

export function VisualWidgets({ section }: { section: VisualSectionId }) {
  const { visualDesign } = usePortfolio();
  const widgets = visualDesign?.widgets?.filter((widget) => widget.section === section) ?? [];
  if (!widgets.length) return null;
  const sectionBackground = visualDesign?.sectionBackgrounds?.[section];
  const wrapStyle: CSSProperties | undefined = section === 'top' || section === 'continue' || section === 'contact'
    ? { backgroundColor: colorOK(sectionBackground) ? sectionBackground : undefined } : undefined;

  return <div className="visual-added-widgets relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-5 py-6 sm:px-10" style={wrapStyle} aria-label="Elemen tambahan profil">
    {widgets.map((widget) => {
      const Icon = iconComponents[widget.icon || 'star'] || Star;
      const contentStyle: CSSProperties = {
        color: colorOK(widget.color) ? widget.color : 'inherit',
        fontFamily: fontOK(widget.fontFamily) && widget.fontFamily !== 'Default' ? fontStack[widget.fontFamily] : undefined,
        fontSize: sizeOK(widget.fontSize) ? `min(${widget.fontSize}px, 10vw)` : undefined,
        lineHeight: 1.4, overflowWrap: 'anywhere',
      };
      const content = <span className="inline-flex max-w-full items-center gap-2" style={contentStyle}>
        {widget.type === 'icon' && <Icon aria-hidden size={Math.min(80, Math.max(18, widget.fontSize ?? 28))} />}
        {widget.text && <span className="whitespace-pre-line">{widget.text}</span>}
      </span>;
      return <div key={widget.id} data-studio-widget={widget.id} data-studio-section={section} className="max-w-full rounded-xl border border-current/10 bg-white/5 px-4 py-3 text-bone shadow-sm transition hover:bg-white/10">
        {widget.url && /^https?:\/\//i.test(widget.url) ? <a href={widget.url} target="_blank" rel="noopener noreferrer" className="inline-block max-w-full">{content}</a> : content}
      </div>;
    })}
  </div>;
}
