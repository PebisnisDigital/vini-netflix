
import { domainHosts, extendDomains, updateDomainConfig } from './custom-domains.mjs';
import { github, repository } from './auth.mjs';
import { validClientSlug } from '../src/data/clientAliases.mjs';
const project = 'prj_iEl5JkLE8FMJBd0Vkg5GsxiE4ebu';
const team = 'team_0n5AP87DcMa7HE63b4gZi3M2';
const registryPath = 'src/data/customDomains.json';
async function read(token, path, ref) {
  const f = await github(token, repository + '/contents/' + path + '?ref=' + ref);
  return JSON.parse(Buffer.from(f.content.replace(/\s/g,''),'base64').toString('utf8'));
}
function same(a,b) { return JSON.stringify(a) === JSON.stringify(b); }
async function validatePR(token, pr, slug, hosts) {
  if (pr.head.repo?.full_name !== 'PebisnisDigital/vini-netflix' || pr.base.ref !== 'main' ||
      !pr.head.ref.startsWith('domain/one-click-' + slug + '-') ||
      pr.body?.split('\n')[0] !== 'PESONAFLIX_ONE_CLICK:' + slug + ':' + hosts.join(',')) throw new Error('Permintaan domain tidak cocok.');
  const files = await github(token, repository + '/pulls/' + pr.number + '/files?per_page=100');
  if (files.length !== 2 || !files.every(f => [registryPath,'vercel.json'].includes(f.filename) && f.status === 'modified')) throw new Error('Perubahan di luar konfigurasi domain ditolak.');
  const main = (await github(token, repository + '/git/ref/heads/main')).object.sha;
  const [before,cfg,after,newCfg] = await Promise.all([read(token,registryPath,main),read(token,'vercel.json',main),read(token,registryPath,pr.head.sha),read(token,'vercel.json',pr.head.sha)]);
  const next = extendDomains(before, hosts, slug);
  if (!same(next, after) || !same(updateDomainConfig(cfg,before,next),newCfg)) throw new Error('Konfigurasi berubah sejak permintaan dibuat. Ulangi Hubungkan Domain.');
  await github(token, repository + '/contents/src/data/clients/' + slug + '.json?ref=' + main);
}
async function vercel(path, method='GET', body) {
  const token = process.env.PESONAFLIX_VERCEL_TOKEN;
  const join = path.includes('?') ? '&' : '?';
  const res = await fetch('https://api.vercel.com' + path + join + 'teamId=' + team, { method, headers:{Authorization:'Bearer ' + token,'Content-Type':'application/json'}, ...(body ? {body:JSON.stringify(body)} : {}), signal:AbortSignal.timeout(8000) });
  const data = await res.json().catch(()=>({}));
  if (!res.ok && res.status !== 404) throw new Error('Vercel ' + res.status + ': ' + (data.error?.message || 'Periksa akses token.'));
  return {status:res.status,data};
}
async function inspectHost(host) {
  const endpoint = '/v9/projects/' + project + '/domains/' + encodeURIComponent(host);
  let result = await vercel(endpoint);
  if (result.status === 404) {
    await vercel('/v10/projects/' + project + '/domains','POST',{name:host});
    result = await vercel(endpoint);
  }
  if (result.status === 404) throw new Error('Domain belum terdaftar di Vercel: ' + host);
  let domain = result.data;
  if (!domain.verified) {
    const attempt = await vercel(endpoint + '/verify','POST',{}).catch(()=>null);
    if (attempt?.data?.verified === true) domain = attempt.data;
  }
  const cfg = (await vercel('/v6/domains/' + encodeURIComponent(host) + '/config?projectIdOrName=' + project)).data;
  return {host,verified:domain.verified === true,dns:cfg.misconfigured === false,redirect:domain.redirect || null,verification:domain.verification || [],a:cfg.recommendedIPv4?.[0]?.value || [],cname:cfg.recommendedCNAME?.[0]?.value || null};
}
export async function advanceDomain(token,input) {
  const slug = input?.sourceSlug;
  const hosts = domainHosts(input?.domain,input?.includeWww !== false);
  if (!validClientSlug(slug) || slug === 'vini') throw new Error('Klien tidak valid.');
  if (input.number != null) {
    if (!Number.isSafeInteger(input.number) || input.number < 1) throw new Error('Nomor permintaan tidak valid.');
    const pr = await github(token,repository + '/pulls/' + input.number);
    if (pr.head.repo?.full_name !== 'PebisnisDigital/vini-netflix' || pr.body?.split('\n')[0] !== 'PESONAFLIX_ONE_CLICK:' + slug + ':' + hosts.join(',')) throw new Error('Permintaan tidak cocok.');
    if (!pr.merged) {
      if (pr.state !== 'open') throw new Error('Permintaan ditutup. Buat ulang.');
      const [runs, checks] = await Promise.all([
        github(token,repository + '/actions/runs?event=pull_request&head_sha=' + pr.head.sha + '&per_page=30'),
        github(token,repository + '/commits/' + pr.head.sha + '/status')
      ]);
      const run = runs.workflow_runs?.find(r=>r.path === '.github/workflows/validate.yml' && r.head_sha === pr.head.sha);
      const preview = checks.statuses?.find(s=>s.context === 'Vercel');
      if (run?.conclusion && run.conclusion !== 'success' || ['failure','error'].includes(preview?.state)) return {stage:'failed',message:'Validasi gagal. Periksa hasil build GitHub/Vercel.'};
      if (run?.conclusion !== 'success' || preview?.state !== 'success' || pr.mergeable !== true) return {stage:'testing',message:'Validasi kode dan preview Vercel.'};
      await validatePR(token,pr,slug,hosts);
      const merged = await github(token,repository + '/pulls/' + pr.number + '/merge',{method:'PUT',body:JSON.stringify({sha:pr.head.sha,merge_method:'squash'})});
      if (!merged.merged) throw new Error('Pemetaan gagal diterbitkan.');
      return {stage:'deploying',message:'Pemetaan diterbitkan. Menunggu versi produksi.'};
    }
  }
  // Consult the deployed registry, not merely GitHub main: never attach before production serves the mapping.
  const live = await fetch('https://pesonaflix.vercel.app/domain-registry.json?t=' + Date.now(),{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(8000)}).then(async r=>r.ok?r.json():null).catch(()=>null);
  if (!live || !hosts.every(h=>Object.hasOwn(live,h)&&live[h]===slug)) {
    if (input.number == null) {
      const ref = (await github(token,repository + '/git/ref/heads/main')).object.sha;
      const current = await read(token,registryPath,ref);
      if (!hosts.every(h=>Object.hasOwn(current,h)&&current[h]===slug)) throw new Error('Pemetaan belum diterbitkan.');
    }
    return {stage:'deploying',message:'Menunggu pemetaan tersedia di produksi.'};
  }
  if (!process.env.PESONAFLIX_VERCEL_TOKEN) return {stage:'setup',message:'Pemetaan sudah tayang. Admin perlu memasang PESONAFLIX_VERCEL_TOKEN sekali di Vercel atau menambah domain secara manual.'};
  const records = await Promise.all(hosts.map(inspectHost));
  const ready = records.every(r=>r.verified && r.dns && (!r.redirect || hosts.includes(r.redirect)));
  return {stage:ready?'dns-ready':'dns',records,message:ready?'DNS dan kepemilikan domain terverifikasi. Buka website untuk memastikan HTTPS dan profil benar.':'Tambahkan record DNS di registrar sesuai petunjuk, lalu cek lagi.'};
}
