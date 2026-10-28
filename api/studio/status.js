import { json } from '../../server/auth.mjs';
import { readStudioSession, studioConfigured, studioPublisherConfigured } from '../../server/studio-auth.mjs';

export function GET(request) {
  const configured = studioConfigured();
  return json({ configured, authenticated: configured && Boolean(readStudioSession(request)), publisherConfigured: studioPublisherConfigured(), mode: configured ? 'studio' : 'legacy' });
}
