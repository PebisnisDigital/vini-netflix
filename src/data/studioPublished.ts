import type { ClientBrief } from './clientModel';

const published = import.meta.glob<{ default: ClientBrief }>('./clients/*.json');

export async function publishedClients(): Promise<ClientBrief[]> {
  const entries = await Promise.all(Object.values(published).map(async (get) => (await get()).default));
  return entries.sort((a, b) => a.name.localeCompare(b.name, 'id'));
}
