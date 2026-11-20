import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { normalizeCustomDomain, domainRules, updateDomainConfig } from '../server/custom-domains.mjs';
test('domain validation and routing', () => {
  assert.equal(normalizeCustomDomain(' Example.COM. '), 'example.com');
  for (const input of ['https://example.com','*.example.com','example.com/path','example.com:8080','pesonaflix.vercel.app','localhost','127.0.0.1','a..com']) assert.throws(() => normalizeCustomDomain(input));
  const config = { rewrites: [{ source: '/studio', destination: '/studio/index.html' }] };
  const next = updateDomainConfig(config, {}, {'example.com':'erni'});
  assert.deepEqual(next.rewrites, [{ source: '/', has: [{ type:'host', value:'example.com' }], destination:'/erni/index.html' }, ...config.rewrites]);
  assert.deepEqual(updateDomainConfig(next, {'example.com':'erni'}, {}), config);
});
test('all domain mappings target published clients and have a matching rewrite', async () => {
  const registry = JSON.parse(await readFile('src/data/customDomains.json','utf8'));
  const config = JSON.parse(await readFile('vercel.json','utf8'));
  for (const slug of Object.values(registry)) await access('src/data/clients/' + slug + '.json');
  for (const rule of domainRules(registry)) assert.ok(config.rewrites.some(r => JSON.stringify(r) === JSON.stringify(rule)));
});
