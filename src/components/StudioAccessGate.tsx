import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

type GateStatus = { configured: boolean; authenticated: boolean; mode: 'studio' | 'legacy' };

/** Mengunci editor ketika kode akses Studio sudah diaktifkan pada Vercel. */
export default function StudioAccessGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<GateStatus | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/studio/status', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Tidak dapat memeriksa akses Studio.');
        return response.json() as Promise<GateStatus>;
      })
      .then(setStatus)
      .catch((cause) => { if (!controller.signal.aborted) setError((cause as Error).message); });
    return () => controller.abort();
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/studio/login', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'x-personalflix-action': '1' },
        body: JSON.stringify({ code }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Kode akses belum diterima.');
      setCode(''); setStatus({ configured: true, authenticated: true, mode: 'studio' });
    } catch (cause) { setError((cause as Error).message); }
    finally { setBusy(false); }
  };

  if (status && (status.mode === 'legacy' || status.authenticated)) return <>{children}</>;
  return <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-4 py-10 text-white">
    <section className="w-full max-w-[430px] rounded-3xl border border-white/15 bg-[#131319] p-6 shadow-2xl sm:p-9">
      <a href="/" className="text-lg font-black tracking-[0.14em]">PESONA<span className="text-[#ff4566]">FLIX</span></a>
      <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff8397]">Ruang kerja tim</p>
      <h1 className="mt-2 text-3xl font-extrabold">Buka Studio</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/60">Masukkan kode akses tim satu kali. Perangkat ini akan dikenali hingga 30 hari, tanpa harus masuk ke GitHub.</p>
      {status?.configured ? <form onSubmit={(event) => { void login(event); }} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold">Kode akses Studio
          <input type="password" autoComplete="current-password" minLength={16} maxLength={256} value={code} onChange={(event) => setCode(event.target.value)} required className="mt-2 w-full rounded-xl border border-white/20 bg-[#08090d] px-4 py-3 text-base outline-none focus:border-[#ff5977]" placeholder="Masukkan kode tim" />
        </label>
        <button disabled={busy || code.length < 16} type="submit" className="w-full rounded-xl bg-[#e50931] px-5 py-3 font-bold hover:bg-[#fb2951] disabled:opacity-50">{busy ? 'Memeriksa…' : 'Masuk Studio'}</button>
      </form> : <p className="mt-6 rounded-xl border border-amber-400/25 bg-amber-300/10 p-3 text-sm text-amber-100">{error || 'Menghubungkan keamanan Studio…'}</p>}
      {status?.configured && error && <p role="alert" className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
      <a href="/" className="mt-7 block text-center text-xs text-white/45 underline">Kembali ke beranda</a>
    </section>
  </main>;
}
