import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, LoaderCircle, LockKeyhole, RefreshCw, X } from 'lucide-react';
import { templateCatalog } from '../data/templateCatalog.mjs';
import './checkout.css';

const ENDPOINT = (import.meta.env.VITE_PESONAFLIX_API_URL ||
  'https://tlvxlekqrllkvcpgwmic.supabase.co/functions/v1/pesonaflix-public').replace(/\/$/, '');
const PUBLIC_KEY = import.meta.env.VITE_PESONAFLIX_ANON_KEY ||
  'sb_publishable_CttQA-59OaKmYm2GnzB_Hw_eHfVCv_R';
const PENDING_ORDER_KEY = 'pesonaflix-recent-order';

type Offer = {
  sales_open: boolean;
  normal_price: number | null;
  price: number | null;
  promo_enabled: boolean;
  commission_percent: number;
};
type Payment = {
  status: string;
  amount: number;
  total_amount: number | null;
  qr_url: string | null;
  payment_url: string | null;
  expires_at: string | null;
};
type OrderStatus = {
  status: string;
  paid_at: string | null;
  brief_status: string | null;
  payment: Payment | null;
};

const formatMoney = (value: number | null | undefined) =>
  value == null ? 'Belum ditentukan' : new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(value);

export async function commerce<T>(action: string, init: RequestInit = {}, token?: string): Promise<T> {
  const params = new URLSearchParams({ action });
  if (token) params.set('token', token);
  const res = await fetch(ENDPOINT + '?' + params, {
    cache: 'no-store',
    ...init,
    headers: { apikey: PUBLIC_KEY, 'Content-Type': 'application/json', ...(init.headers || {}) }
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Koneksi belum berhasil. Coba lagi.');
  return body as T;
}

function useStatus(token: string | null) {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) return;
    let active = true;
    let timeout: ReturnType<typeof setTimeout>;
    const check = async () => {
      try {
        const next = await commerce<OrderStatus>('status', {}, token);
        if (!active) return;
        setStatus(next);
        setError('');
        if (next.status !== 'paid' && next.status !== 'expired' && next.status !== 'failed') {
          timeout = setTimeout(check, 5000);
        }
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Gagal memeriksa pembayaran.');
        timeout = setTimeout(check, 10000);
      }
    };
    void check();
    return () => { active = false; clearTimeout(timeout); };
  }, [token]);
  return { status, error };
}

function Header() {
  return <header className="pf-checkout-header">
    <a href="/" aria-label="Kembali ke beranda"><ArrowLeft size={18} /> Kembali</a>
    <span>PESONA<span>FLIX</span></span>
    <small><LockKeyhole size={14} /> Pesanan aman</small>
  </header>;
}

export function CheckoutPage({ embedded = false }: { embedded?: boolean }) {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem(PENDING_ORDER_KEY); }
    catch { return null; }
  });
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const initialTemplate = new URLSearchParams(location.search).get('template') || 'original';
  const [form, setForm] = useState({
    full_name: '', email: '', whatsapp: '',
    template_id: templateCatalog.some(t => t.id === initialTemplate && t.status === 'available') ? initialTemplate : 'original',
    referred_by_code: new URLSearchParams(location.search).get('ref') || ''
  });
  const selected = useMemo(() => templateCatalog.find(t => t.id === form.template_id), [form.template_id]);
  const { status, error: statusError } = useStatus(token);

  function resetOrder() {
    try { localStorage.removeItem(PENDING_ORDER_KEY); } catch { /* private browsing */ }
    setToken(null);
    setRequestId(crypto.randomUUID());
  }

  useEffect(() => {
    commerce<Offer>('offer').then(setOffer).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!offer?.sales_open) return;
    setCreating(true);
    setError('');
    try {
      const result = await commerce<{ token: string }>('create', {
        method: 'POST',
        body: JSON.stringify({
          ...form, whatsapp: form.whatsapp.replace(/\D/g, '').replace(/^0/, '62'),
          request_id: requestId
        })
      });
      setToken(result.token);
      try { localStorage.setItem(PENDING_ORDER_KEY, result.token); } catch { /* storage disabled */ }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Gagal membuat tagihan.');
      setRequestId(crypto.randomUUID());
    } finally { setCreating(false); }
  }

  return <div className={'pf-checkout-page' + (embedded ? ' pf-checkout-embedded' : '')}>
    {!embedded && <Header />}
    <main className={'pf-checkout-main' + (embedded ? ' pf-checkout-modal-main' : '')}>
      <div className="pf-checkout-heading"><span>WEBSITE PERSONAL BRANDING</span><h1>Pesan Website <em>Personalmu.</em></h1>
        <p>Pilih gaya, lakukan pembayaran, lalu ceritakan tentang dirimu. Tim PESONAFLIX yang menyiapkan websitenya.</p>
      </div>
      {token ? <section className="pf-checkout-card">
        {status?.status === 'paid' ? <>
          <CheckCircle2 className="pf-success-icon" size={46} />
          <h2>Pembayaran Berhasil!</h2>
          <p>Sekarang lengkapi data agar tim bisa mulai membuat website kamu.</p>
          <a className="pf-primary" href={'/pesanan?token=' + encodeURIComponent(token)}>Isi Data Website <ArrowRight size={18} /></a>
        </> : <>
          <h2>Selesaikan Pembayaran</h2>
          <p>Scan QRIS berikut, lalu tunggu konfirmasi otomatis.</p>
          {status?.payment?.qr_url && <img className="pf-qris" src={status.payment.qr_url} alt="Kode QRIS pembayaran PESONAFLIX" />}
          <strong className="pf-total">{formatMoney(status?.payment?.total_amount ?? status?.payment?.amount)}</strong>
          {status?.payment?.payment_url && <a className="pf-link" href={status.payment.payment_url} target="_blank" rel="noopener noreferrer">Buka Halaman Pembayaran</a>}
          <div className="pf-payment-state"><RefreshCw size={16} /> {status?.status === 'expired' ? 'Tagihan kedaluwarsa. Buat pesanan baru.' : status?.status === 'failed' ? 'Pembayaran gagal.' : 'Menunggu pembayaran terverifikasi...'}</div>
          {status?.payment?.expires_at && <small>Batas waktu: {new Date(status.payment.expires_at).toLocaleString('id-ID')}</small>}
          {statusError && <p className="pf-error">{statusError}</p>}
        </>}
        <div className="pf-order-recovery">
          <a className="pf-link" href={'/pesanan?token=' + encodeURIComponent(token)}>Buka Link Pesanan Saya</a>
          <button type="button" className="pf-link" onClick={() => {
            void navigator.clipboard.writeText(location.origin + '/pesanan?token=' + token);
          }}>Salin Link Pesanan</button>
          <button type="button" className="pf-link" onClick={resetOrder}>Buat Pesanan Baru</button>
        </div>
      </section> : <div className="pf-checkout-grid">
        <form className="pf-checkout-card" onSubmit={submit}>
          <h2>Data Pemesan</h2>
          <label>Nama lengkap<input required minLength={2} maxLength={100} autoComplete="name" placeholder="Nama sesuai WhatsApp" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></label>
          <label>Email<input required type="email" autoComplete="email" placeholder="nama@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
          <label>Nomor WhatsApp<input required type="tel" inputMode="tel" placeholder="08xxxxxxxxxx" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} /></label>
          <label>Gaya website
            <select value={form.template_id} onChange={e => setForm({ ...form, template_id: e.target.value })}>
              {templateCatalog.filter(t => t.status === 'available').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          {selected && <a className="pf-link" href={selected.demoUrl} target="_blank" rel="noopener noreferrer">Lihat demo {selected.name} ↗</a>}
          {form.referred_by_code && <p className="pf-ref">Kode referensi: {form.referred_by_code}</p>}
          {error && <p className="pf-error" role="alert">{error}</p>}
          {!loading && !offer?.sales_open && <p className="pf-notice">Pemesanan online sedang disiapkan. Silakan kembali saat pendaftaran dibuka.</p>}
          <button className="pf-primary" type="submit" disabled={!offer?.sales_open || creating || loading}>
            {creating ? <><LoaderCircle size={18} className="pf-spin" /> Memproses...</> : <>Bayar dengan QRIS <ArrowRight size={18} /></>}
          </button>
          <small><LockKeyhole size={13} /> Harga dihitung di server. Tidak ada akses BADAI yang dibuat.</small>
        </form>
        <aside className="pf-checkout-card pf-summary">
          <span>RINGKASAN PESANAN</span>
          <h2>Website PESONAFLIX</h2>
          <p>Gaya pilihan: <strong>{selected?.name}</strong></p>
          <div className="pf-summary-price">
            {offer?.promo_enabled && <del>{formatMoney(offer.normal_price)}</del>}
            <strong>{loading ? 'Memuat harga...' : formatMoney(offer?.price)}</strong>
          </div>
          <ul>
            <li><BadgeCheck size={17} /> Website personal sesuai gaya</li>
            <li><BadgeCheck size={17} /> Dibuat oleh tim PESONAFLIX</li>
            <li><BadgeCheck size={17} /> Preview sebelum publikasi</li>
          </ul>
          <p className="pf-summary-note">Setelah pembayaran berhasil, formulir data website akan terbuka. Harga dan bonus final mengikuti ketentuan penawaran saat pemesanan.</p>
        </aside>
      </div>}
    </main>
  </div>;
}

export function CheckoutModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);

  return <dialog ref={dialogRef} className="pf-checkout-modal" aria-label="Formulir checkout PESONAFLIX"
    onClose={onClose} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
    <button className="pf-checkout-modal-close" type="button" aria-label="Tutup checkout"
      onClick={() => dialogRef.current?.close()}><X size={21} /></button>
    <CheckoutPage embedded />
  </dialog>;
}

export function BriefPage() {
  const token = new URLSearchParams(location.search).get('token');
  const { status, error: statusError } = useStatus(token);
  const [brief, setBrief] = useState({
    name: '', role: '', location: '', bio: '', headline: '', services: '',
    achievements: '', portfolio: '', instagram: '', facebook: '', website: '',
    whatsapp: '', preferred_slug: '', notes: ''
  });
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (!token || status?.status !== 'paid') return;
    commerce<{ brief: typeof brief; status: string }>('brief', {}, token).then(data => {
      setBrief(prev => ({ ...prev, ...data.brief }));
      setSubmitted(data.status === 'submitted' || data.status === 'approved');
    }).catch(e => setNotice(e.message));
  }, [token, status?.status]);

  async function save(submit = false) {
    if (!token) return;
    setSaving(true); setNotice('');
    try {
      const result = await commerce<{ status: string }>('brief', {
        method: 'PATCH', body: JSON.stringify({ brief, submit })
      }, token);
      setSubmitted(result.status === 'submitted');
      setNotice(submit ? 'Data berhasil dikirim ke tim PESONAFLIX.' : 'Draft berhasil disimpan.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Gagal menyimpan.'); }
    finally { setSaving(false); }
  }

  return <div className="pf-checkout-page"><Header /><main className="pf-checkout-main pf-brief-main">
    <div className="pf-checkout-heading"><span>LANGKAH SETELAH BAYAR</span><h1>Ceritakan <em>Dirimu.</em></h1>
      <p>Isi data ini agar tim PESONAFLIX bisa menyusun website yang benar-benar mencerminkan dirimu.</p>
    </div>
    {!token ? <div className="pf-checkout-card"><p>Tautan pesanan tidak lengkap. Buka kembali link dari halaman pembayaran.</p></div>
      : status?.status !== 'paid' ? <div className="pf-checkout-card"><p>{statusError || 'Formulir terbuka setelah pembayaran terverifikasi.'}</p>
        <p>Status: {status?.status || 'Memeriksa...'}</p><a href="/checkout" className="pf-link">Kembali ke checkout</a></div>
        : <form className="pf-checkout-card pf-brief-form" onSubmit={e => { e.preventDefault(); void save(true); }}>
          {submitted && <p className="pf-notice">Data sudah terkirim. Perubahan berikutnya perlu dikonfirmasi dengan tim.</p>}
          {([
            ['name', 'Nama yang ditampilkan', 'Contoh: Vini Rahmawati'],
            ['role', 'Profesi atau keahlian', 'Contoh: Mentor Digital Marketing'],
            ['headline', 'Kalimat pembuka', 'Apa yang ingin orang ingat tentang dirimu?'],
            ['location', 'Kota atau domisili', 'Contoh: Bandung'],
            ['bio', 'Cerita singkat tentang dirimu', 'Pengalaman, keahlian, dan hal yang ingin ditonjolkan'],
            ['services', 'Layanan atau bantuan yang ditawarkan', 'Tuliskan satu per baris'],
            ['achievements', 'Pencapaian atau sertifikat', 'Tuliskan satu per baris'],
            ['portfolio', 'Karya atau pengalaman unggulan', 'Tuliskan satu per baris'],
            ['instagram', 'Link Instagram', 'https://instagram.com/...'],
            ['facebook', 'Link Facebook', 'https://facebook.com/...'],
            ['website', 'Link website lainnya', 'https://...'],
            ['whatsapp', 'Nomor WhatsApp untuk tombol website', '08...'],
            ['preferred_slug', 'Nama link yang diinginkan', 'Contoh: vinirahmawati'],
            ['notes', 'Catatan untuk tim', 'Preferensi warna, cerita khusus, atau arahan lain']
          ] as const).map(([key, label, placeholder]) =>
            <label key={key}>{label}{['bio', 'services', 'achievements', 'portfolio', 'notes'].includes(key)
              ? <textarea rows={4} placeholder={placeholder} required={key === 'bio'} value={brief[key]} onChange={e => setBrief({ ...brief, [key]: e.target.value })} />
              : <input placeholder={placeholder} required={key === 'name' || key === 'role'} value={brief[key]} onChange={e => setBrief({ ...brief, [key]: e.target.value })} />}</label>
          )}
          <p className="pf-notice">Foto profil dan karya akan diminta oleh tim melalui WhatsApp pada tahap produksi.</p>
          {notice && <p className="pf-notice" role="status">{notice}</p>}
          <div className="pf-brief-actions"><button type="button" disabled={saving || submitted} onClick={() => void save(false)}>Simpan Draft</button>
            <button className="pf-primary" type="submit" disabled={saving || submitted}>{saving ? 'Menyimpan...' : 'Kirim ke Tim'} <ArrowRight size={18} /></button></div>
        </form>}
  </main></div>;
}
