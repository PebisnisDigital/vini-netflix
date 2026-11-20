import { useEffect, useState, type FormEvent } from 'react';
import { publishedClients, type PublishedClient } from '../data/studioPublished';
import registry from '../data/customDomains.json';

type DomainRequest = { number: number; url: string; domain: string; sourceSlug: string };
const input = 'mt-2 w-full rounded-xl border border-white/15 bg-[#101017] px-4 py-3 text-white outline-none focus:border-[#ff6580]';
const button = 'rounded-xl bg-[#e50931] px-5 py-3 font-bold hover:bg-[#fb2951] disabled:opacity-40';
const map = registry as Record<string, string>;
const dashboard = 'https://vercel.com/jualdigital/vini-netflix/settings/domains';
export default function CustomDomainManager() {
  const [clients, setClients] = useState<PublishedClient[]>([]);
  const [slug, setSlug] = useState('');
  const [domain, setDomain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<DomainRequest | null>(null);
  useEffect(() => {
    void publishedClients().then(setClients).catch(() => setError('Daftar klien gagal dimuat.'));
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setPending(null);
    try {
      const response = await fetch('/api/custom-domain', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'x-personalflix-action': '1' }, body: JSON.stringify({ sourceSlug: slug, domain }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal menyiapkan domain.');
      setPending(result as DomainRequest);
    } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#09090d] px-4 py-7 text-white sm:px-8">
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3"><a href="/studio" className="font-black tracking-wider">PESONA<span className="text-[#ff4566]">FLIX</span> <span className="text-xs text-white/40">STUDIO</span></a><a href="/studio" className="rounded-xl border border-white/15 px-4 py-2 text-sm">← Kembali ke Studio</a></header>
      <section className="rounded-3xl border border-white/10 bg-[#131319] p-5 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ff6580]">Pengaturan website klien</p>
        <h1 className="mt-2 text-3xl font-black">Custom Domain</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">Gunakan domain milik klien tanpa mengganti desain atau menghapus link PESONAFLIX lama.</p>
        <form className="mt-6 space-y-5" onSubmit={(e) => { void submit(e); }}>
          <label className="block text-sm font-semibold">Website klien<select className={input} required value={slug} onChange={e => { setSlug(e.target.value); setPending(null); }}><option value="">Pilih klien yang sudah tayang</option>{clients.map(c => <option key={c.slug} value={c.slug}>{c.name} — /{c.publicSlug}</option>)}</select></label>
          <label className="block text-sm font-semibold">Domain pribadi<input className={input} required maxLength={253} value={domain} placeholder="contoh: namaklien.com" onChange={e => { setDomain(e.target.value); setPending(null); }} /></label>
          <p className="text-xs text-white/50">Masukkan domain saja, tanpa https://. Domain www dan non-www harus dipetakan terpisah jika keduanya diinginkan.</p>
          <button className={button + ' w-full'} disabled={busy || !slug || !domain.trim()} type="submit">{busy ? 'Menyiapkan…' : 'Siapkan Domain'}</button>
        </form>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {pending && <div className="mt-5 space-y-3 rounded-xl border border-amber-300/25 bg-amber-300/5 p-4"><p className="font-bold text-amber-200">Pemetaan disiapkan — belum aktif</p><p className="break-all text-sm">{pending.domain} → /{pending.sourceSlug}</p><a href={pending.url} target="_blank" rel="noreferrer" className="block underline">Periksa & terbitkan PR #{pending.number}</a><p className="text-sm text-white/60">Setelah tes lulus, merge PR di GitHub dan pastikan deployment READY. Baru tambahkan domain di Vercel.</p></div>}
      </section>
      <section className="space-y-3 rounded-3xl border border-white/10 bg-[#131319] p-5 sm:p-8">
        <h2 className="text-xl font-bold">Aktivasi DNS & HTTPS</h2>
        <p className="text-sm text-white/60">1. Terbitkan pemetaan. 2. Tambahkan domain ke proyek Vercel. 3. Salin record DNS persis seperti instruksi Vercel ke registrar. 4. Pastikan status Valid Configuration dan HTTPS, lalu buka domain untuk mengecek profil yang benar.</p>
        <a className="inline-block rounded-xl border border-white/15 px-4 py-3 text-sm font-bold" href={dashboard} target="_blank" rel="noreferrer">Buka Domains Vercel ↗</a>
        <p className="text-xs text-white/45">Tidak ada pembelian atau pengubahan DNS otomatis. Jangan menghapus record email (MX/TXT) klien.</p>
      </section>
      <section className="rounded-3xl border border-white/10 bg-[#131319] p-5 sm:p-8">
        <h2 className="text-xl font-bold">Domain terpetakan</h2><p className="mt-1 text-xs text-white/45">Pemetaan di deployment ini; belum membuktikan DNS/SSL aktif.</p>
        {Object.entries(map).length === 0 ? <p className="mt-4 text-sm text-white/45">Belum ada domain pribadi.</p> : <div className="mt-4 divide-y divide-white/10">{Object.entries(map).map(([host, client]) => <div key={host} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><a className="break-all font-bold text-emerald-300 underline" href={'https://' + host} target="_blank" rel="noreferrer">{host}</a><p className="text-xs text-white/50">/{client} · Pemetaan terbit</p></div><a href={dashboard} target="_blank" rel="noreferrer" className="text-xs underline">Cek DNS</a></div>)}</div>}
      </section>
    </div>
  </main>;
}
