// Public host-to-source mapping. Never use a URL or an arbitrary rewrite destination.
export function normalizeCustomDomain(value) {
  if (typeof value !== 'string') throw new Error('Masukkan nama domain.');
  const host = value.trim().toLowerCase().replace(/\.$/, '');
  if (host.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host)
      || host === 'vercel.app' || host.endsWith('.vercel.app') || host === 'localhost' || host.endsWith('.localhost')) {
    throw new Error('Masukkan domain valid, tanpa https://, path, port, atau wildcard.');
  }
  return host;
}
export function domainRules(registry) {
  return Object.entries(registry).sort(([a],[b]) => a.localeCompare(b)).map(([host, slug]) => {
    if (normalizeCustomDomain(host) !== host || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Peta domain tidak valid.');
    return { source: '/', has: [{ type: 'host', value: host }], destination: '/' + slug + '/index.html' };
  });
}
export function updateDomainConfig(config, previous, next) {
  const oldRules = domainRules(previous);
  const oldKeys = new Set(oldRules.map(r => JSON.stringify(r)));
  const remaining = (config.rewrites || []).filter(r => !oldKeys.has(JSON.stringify(r)));
  return { ...config, rewrites: [...domainRules(next), ...remaining] };
}
