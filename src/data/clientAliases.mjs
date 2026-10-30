/** Link publik dapat diganti tanpa memindahkan data atau aset demo/klien. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(['vini', 'formulir', 'studio', 'checkout', 'pesanan', 'admin', 'api', 'assets', 'demo', 'preview', 'index', 'favicon', 'robots', 'sitemap']);

export function validClientSlug(value) {
  return typeof value === 'string' && value.length <= 60 && SLUG.test(value) && !RESERVED.has(value);
}

export function sourceForPublicSlug(registry, publicSlug) {
  return Object.hasOwn(registry?.aliasToSource ?? {}, publicSlug) ? registry.aliasToSource[publicSlug] : publicSlug;
}

export function publicSlugForSource(registry, sourceSlug) {
  return Object.hasOwn(registry?.primaryBySource ?? {}, sourceSlug) ? registry.primaryBySource[sourceSlug] : sourceSlug;
}

export function validateClientAliasRegistry(registry, sources) {
  const errors = [];
  const sourceSet = new Set(sources);
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) return ['Peta URL harus berupa objek.'];
  const { primaryBySource, aliasToSource } = registry;
  if (!primaryBySource || typeof primaryBySource !== 'object' || Array.isArray(primaryBySource) || !aliasToSource || typeof aliasToSource !== 'object' || Array.isArray(aliasToSource)) return ['Peta URL tidak lengkap.'];
  const primaryEntries = Object.entries(primaryBySource);
  const aliasEntries = Object.entries(aliasToSource);
  if (primaryEntries.length > 500 || aliasEntries.length > 1500) errors.push('Terlalu banyak URL klien.');
  for (const [alias, source] of aliasEntries) {
    if (!validClientSlug(alias) || !validClientSlug(source) || !sourceSet.has(source) || sourceSet.has(alias) || alias === source) errors.push(`Link /${alias} tidak valid atau sudah dipakai.`);
  }
  for (const [source, primary] of primaryEntries) {
    if (!sourceSet.has(source) || !validClientSlug(primary) || !Object.hasOwn(aliasToSource, primary) || aliasToSource[primary] !== source) errors.push(`Link utama untuk /${source} tidak sesuai.`);
  }
  return errors;
}

export function updatePrimaryClientAlias(registry, sourceSlug, publicSlug) {
  const next = {
    primaryBySource: { ...registry.primaryBySource },
    aliasToSource: { ...registry.aliasToSource },
  };
  if (sourceSlug === publicSlug) delete next.primaryBySource[sourceSlug];
  else {
    next.primaryBySource[sourceSlug] = publicSlug;
    next.aliasToSource[publicSlug] = sourceSlug;
  }
  return next;
}
