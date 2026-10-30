import type { ClientBrief } from './clientModel';
import aliases from './clientAliases.json';
import { publicSlugForSource } from './clientAliases.mjs';

const published = import.meta.glob<{ default: ClientBrief }>('./clients/*.json');

export type PublishedClient = ClientBrief & { publicSlug: string };

export async function publishedClients(): Promise<PublishedClient[]> {
  const entries = await Promise.all(Object.values(published).map(async (get) => (await get()).default));
  return entries.map((brief) => ({ ...brief, publicSlug: publicSlugForSource(aliases, brief.slug) })).sort((a, b) => a.name.localeCompare(b.name, 'id'));
}
