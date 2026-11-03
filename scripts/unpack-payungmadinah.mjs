import {existsSync} from 'node:fs';
import {mkdir, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Payung Madinah's authorized static website copy is stored in a small number
// of compressed archives so the existing 53 PESONAFLIX client pages remain
// untouched. This step simply restores them before Vite copies public/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundleDir = join(root, 'payungmadinah-bundles');
const manifestFile = join(bundleDir, 'manifest.json');
if (!existsSync(manifestFile)) {
  if (!existsSync(join(root, 'public/payungmadinah/index.html'))) {
    throw new Error('Payung Madinah files and archive manifest are both missing');
  }
  console.log('Payung Madinah static pages available directly.');
  process.exit(0);
}

await mkdir(join(root, 'public'), {recursive: true});
const bundles = JSON.parse(await readFile(manifestFile, 'utf8'));
for (const bundle of bundles) {
  if (!/^payungmadinah-\d+\.tar\.gz$/.test(bundle.name)) throw new Error('Invalid bundle filename');
  const archive = join(bundleDir, bundle.name);
  const data = await readFile(archive);
  const digest = createHash('sha256').update(data).digest('hex');
  if (digest !== bundle.sha256) throw new Error(`Archive checksum mismatch: ${bundle.name}`);
  const entries = execFileSync('tar', ['-tzf', archive], {encoding: 'utf8'}).trim().split('\n');
  if (entries.some(path => !path.startsWith('payungmadinah/') || path.split('/').includes('..'))) {
    throw new Error(`Unexpected archive paths: ${bundle.name}`);
  }
  execFileSync('tar', ['-xzf', archive, '-C', join(root, 'public')]);
}
console.log(`Payung Madinah restored from ${bundles.length} archive files.`);
