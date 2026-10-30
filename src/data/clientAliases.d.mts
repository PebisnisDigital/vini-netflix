export type ClientAliasRegistry = {
  primaryBySource: Record<string, string>;
  aliasToSource: Record<string, string>;
};

export function validClientSlug(value: unknown): value is string;
export function sourceForPublicSlug(registry: ClientAliasRegistry, publicSlug: string): string;
export function publicSlugForSource(registry: ClientAliasRegistry, sourceSlug: string): string;
export function validateClientAliasRegistry(registry: unknown, sources: string[]): string[];
export function updatePrimaryClientAlias(registry: ClientAliasRegistry, sourceSlug: string, publicSlug: string): ClientAliasRegistry;
