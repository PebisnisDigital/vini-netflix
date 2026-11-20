import { useEffect, useState, type FormEvent } from 'react';
import { publishedClients, type PublishedClient } from '../data/studioPublished';
import registry from '../data/customDomains.json';
type Request = {number:number|null;url?:string;domain:string;sourceSlug:string;includeWww:boolean;hosts:string[]};
type Status = {stage:string;message:string;records?:{host:string;verified:boolean;dns:boolean;redirect:string|null;verification:{type:string;domain:string;value:string}[];a:string[];cname:string|null}[]};
const field='mt-2 w-full rounded-xl border border-white/15 bg-[#101017] px-4 py-3 text-white outline-none focus:border-[#ff6580]';
const button='rounded-xl bg-[#e50931] px-5 py-3 font-bold hover:bg-[#fb2951] disabled:opacity-40';
const dashboard='https://vercel.com/jualdigital/vini-netflix/settings/domains';
const key='pesonaflix-domain-job-v2';
function saved():Request|null {try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
async function post(body:object) {
  const r=await fetch('/api/alias',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','x-personalflix-action':'1'},body:JSON.stringify(body)});
  const j=await r.json(); if(!r.ok)throw new Error(j.error||'Permintaan gagal.');return j;
}
export default function CustomDomainManager(){
  const [clients,setClients]=useState<PublishedClient[]>([]);
  const [job,setJob]=useState<Request|null>(saved);
  const [slug,setSlug]=useState(()=>saved()?.sourceSlug||'');
  const [domain,setDomain]=useState(()=>saved()?.domain||'');
  const [www,setWww]=useState(()=>saved()?.includeWww??true);
  const [status,setStatus]=useState<Status|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [refresh,setRefresh]=useState(0);
  useEffect(()=>{void publishedClients().then(setClients).catch(()=>setError('Daftar klien gagal dimuat.'))},[]);
  useEffect(()=>{
    if(!job)return;
    let cancelled=false; let timer:number|undefined;
    async function poll(){
      try{
        const result=await post({action:'custom-domain-status',...job});
        if(cancelled)return;setStatus(result);setError('');
        if(['testing','deploying'].includes(result.stage))timer=window.setTimeout(poll,7000);
      }catch(e){if(!cancelled)setError((e as Error).message)}
    }
    void poll();return()=>{cancelled=true;if(timer)window.clearTimeout(timer)};
  },[job,refresh]);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(busy)return;setBusy(true);setError('');setStatus(null);setJob(null);
    try{const r=await post({action:'custom-domain',sourceSlug:slug,domain,includeWww:www});const next={...r,includeWww:www} as Request;localStorage.setItem(key,JSON.stringify(next));setJob(next)}catch(e){setError((e as Error).message)}finally{setBusy(false)}
  }
  const working=busy||Boolean(job&&(!status||['testing','deploying'].includes(status.stage))&&!error);
  return <main className="min-h-screen bg-[#09090d] px-4 py-7 text-white sm:px-8"><div className="mx-auto max-w-3xl space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3"><a href="/studio" className="font-black tracking-wider">PESONA<span className="text-[#ff4566]">FLIX</span> <span className="text-xs text-white/40">STUDIO</span></a><a href="/studio" className="rounded-xl border border-white/15 px-4 py-2 text-sm">← Kembali</a></header>
    <section className="rounded-3xl border border-white/10 bg-[#131319] p-5 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-[#ff6580]">Pengaturan website klien</p><h1 className="mt-2 text-3xl font-black">One-Click Custom Domain</h1><p className="mt-2 text-sm text-white/60">Satu tombol untuk menyiapkan alamat, menerbitkan pemetaan, dan menghubungkan Vercel. Link lama tetap tersedia.</p>
    <form className="mt-6 space-y-5" onSubmit={e=>{void submit(e)}}>
      <label className="block text-sm font-semibold">Website klien<select className={field} required disabled={working} value={slug} onChange={e=>setSlug(e.target.value)}><option value="">Pilih klien yang sudah tayang</option>{clients.map(c=><option key={c.slug} value={c.slug}>{c.name} — /{c.publicSlug}</option>)}</select></label>
      <label className="block text-sm font-semibold">Domain pribadi<input className={field} required disabled={working} maxLength={253} value={domain} placeholder="namaklien.com" onChange={e=>setDomain(e.target.value)}/></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#e50931]" checked={www} disabled={working} onChange={e=>setWww(e.target.checked)}/> Hubungkan versi www dan non-www</label>
      <p className="text-xs text-white/50">Gunakan domain milik klien. Untuk subdomain selain www, matikan pilihan www. Jangan mengganti DNS sebelum pemilik menyetujui.</p>
      <button className={button+' w-full'} disabled={working||!slug||!domain.trim()}>{working?'Memproses…':'Hubungkan Domain'}</button>
    </form>
    {error&&<p role="alert" className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
    {job&&<div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-[#101017] p-4"><p className="font-bold break-all">{job.hosts?.join(' · ')} → /{job.sourceSlug}</p><p role="status" className="text-sm text-amber-200">{status?.message||'Memeriksa proses…'}</p>
    <p className="text-xs text-white/45">Biarkan halaman ini terbuka selama publikasi. Jika tertutup, buka kembali untuk melanjutkan pemeriksaan.</p>
    {!working&&<button className="rounded-lg border border-white/20 px-3 py-2 text-sm" onClick={()=>setRefresh(v=>v+1)}>Cek Status</button>}
    {job.url&&<a className="block text-xs text-white/50 underline" href={job.url} target="_blank" rel="noreferrer">Detail proses GitHub</a>}
    {status?.records?.map(r=><div key={r.host} className="rounded-xl border border-white/10 p-3 text-sm space-y-2"><p className="font-semibold break-all">{r.host}</p><p className={r.dns&&r.verified?'text-emerald-300':'text-amber-200'}>{r.dns&&r.verified?'DNS terverifikasi':'DNS / verifikasi belum selesai'}</p>{r.redirect&&<p className="text-xs">Redirect: {r.redirect}</p>}{!r.dns&&<div className="space-y-1 text-xs text-white/75">{r.cname&&<p className="break-all">CNAME: {r.cname}</p>}{r.a?.length>0&&<p>A: {r.a.join(', ')}</p>}<p>Gunakan jenis record yang sesuai dengan domain di dashboard Vercel.</p></div>}{!r.verified&&r.verification?.map((v,i)=><p key={i} className="break-all text-xs">{v.type} {v.domain}: {v.value}</p>)}<a href={'https://'+r.host} target="_blank" rel="noreferrer" className="text-emerald-300 underline">Buka website · cek HTTPS</a></div>)}
    </div>}</section>
    <section className="space-y-3 rounded-3xl border border-white/10 bg-[#131319] p-5 sm:p-8"><h2 className="text-xl font-bold">DNS & HTTPS</h2><p className="text-sm text-white/60">Jika DNS masih di registrar, salin record dari Vercel. SSL diterbitkan Vercel setelah DNS benar. Jangan hapus record email (MX/TXT).</p><a href={dashboard} target="_blank" rel="noreferrer" className="inline-block rounded-xl border border-white/15 px-4 py-3 text-sm font-bold">Pengaturan Vercel ↗</a></section>
    <section className="rounded-3xl border border-white/10 bg-[#131319] p-5 sm:p-8"><h2 className="text-xl font-bold">Domain terpetakan</h2><p className="text-xs text-white/45 mt-1">Pemetaan versi ini, bukan bukti status DNS.</p>{Object.entries(registry as Record<string,string>).map(([host,client])=><div key={host} className="mt-3 border-t border-white/10 pt-3"><a href={'https://'+host} target="_blank" rel="noreferrer" className="text-sm font-bold text-emerald-300 underline break-all">{host}</a><p className="text-xs text-white/45">/{client}</p></div>)}</section>
  </div></main>;
}
