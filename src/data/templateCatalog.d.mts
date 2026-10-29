export type TemplateId = 'original' | 'chibi-3d' | 'anime' | 'clay-3d' | 'komik-pop' | 'doodle' | 'storybook' | 'scrapbook' | 'paper-cut' | 'pixel-retro' | 'miniature-world' | 'editorial-premium' | 'documentary' | 'minimalist' | 'futuristic-neon' | 'vintage-heritage';
export type IdentityMode = 'photo' | 'avatar' | 'faceless';
export type TemplateStatus = 'available' | 'demo' | 'planned';

export type TemplateDefinition = {
  id: TemplateId;
  name: string;
  family: 'Sinematik' | 'Ceria' | 'Bercerita' | 'Profesional';
  status: TemplateStatus;
  audience: string;
  description: string;
  fonts: readonly [string, string];
  colors: readonly [string, string, string];
  backdrop: string;
  motion: string;
  demoUrl?: string;
};

export type IdentityDefinition = {
  id: IdentityMode;
  name: string;
  description: string;
  status: 'available' | 'planned';
};

export const templateCatalog: readonly TemplateDefinition[];
export const identityModes: readonly IdentityDefinition[];
export function getTemplate(id: unknown): TemplateDefinition | undefined;
export function getIdentityMode(id: unknown): IdentityDefinition | undefined;
export function resolveTemplateId(brief?: { templateId?: TemplateId; designVariant?: string; slug?: string }): TemplateId;
export function canApplyTemplate(id: unknown): boolean;
export function canApplyIdentityMode(id: unknown): boolean;
