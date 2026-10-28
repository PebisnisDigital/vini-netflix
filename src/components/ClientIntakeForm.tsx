import { useEffect, useState, type ReactNode } from 'react';
import { normalizeSlug, validateBrief, type ClientBrief } from '../data/clientModel';
import { createClientPackage, imagePath } from '../data/clientPackage';
import { saveDraft } from '../data/studioDraft';

const newProject = () => ({ title: '', year: '2026', description: '', category: 'Portofolio', tags: [] as string[], website: '', image: '' });
const newExperience = () => ({ company: '', role: '', period: '', description: '' });
const newEducation = () => ({ school: '', degree: '', place: '', period: '', score: '' });
const newHighlight = () => ({ title: '', description: '', category: '' });
const initial: ClientBrief = {
  slug: '', name: '', role: '', location: '', bio: '', tagline: [], interests: [],
  photo: { src: '', alt: '' }, email: '', links: { website: '', linkedin: '', github: '' },
  projects: [newProject()], experiences: [newExperience()], education: [], skills: [], highlights: [],
};
const splitLines = (value: string) => value.split(/\n|,/).map((s) => s.trim()).filter(Boolean);

function Field({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return <label className="block min-w-0"><span className="mb-2 block text-sm font-semibold text-white">{label}</span>{children}{note && <span className="mt-1.5 block text-xs leading-relaxed text-white/55">{note}</span>}</label>;
}

const inputClass = 'w-full min-h-12 rounded-xl border border-white/20 bg-[#16161b] px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-[#fa526e] focus:outline-none focus:ring-2 focus:ring-[#fa526e]/20';
const sectionClass = 'rounded-2xl border border-white/15 bg-[#111115] p-5 sm:p-7';

function downloadFile(file: Blob, name: string) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.append(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export default function ClientIntakeForm() {
  const [brief, setBrief] = useState<ClientBrief>(initial);
  const [portrait, setPortrait] = useState<File | null>(null);
  const [portraitPreview, setPortraitPreview] = useState('');
  const [projectPhotos, setProjectPhotos] = useState<Record<number, File>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [exported, setExported] = useState(false);
  const [packing, setPacking] = useState(false);
  const [savingStudio, setSavingStudio] = useState(false);

  useEffect(() => {
    if (!portrait) { setPortraitPreview(''); return; }
    const url = URL.createObjectURL(portrait);
    setPortraitPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [portrait]);

  const update = <K extends keyof ClientBrief>(key: K, value: ClientBrief[K]) => {
    setBrief((prev) => ({ ...prev, [key]: value })); setErrors([]); setExported(false);
  };
  const patchProject = (index: number, patch: Partial<ClientBrief['projects'][number]>) =>
    update('projects', brief.projects.map((p, i) => i === index ? { ...p, ...patch } : p));
  const patchExperience = (index: number, patch: Partial<ClientBrief['experiences'][number]>) =>
    update('experiences', brief.experiences.map((p, i) => i === index ? { ...p, ...patch } : p));
  const patchEducation = (index: number, patch: Partial<NonNullable<ClientBrief['education']>[number]>) =>
    update('education', (brief.education || []).map((p, i) => i === index ? { ...p, ...patch } : p));
  const patchHighlight = (index: number, patch: Partial<NonNullable<ClientBrief['highlights']>[number]>) =>
    update('highlights', (brief.highlights || []).map((p, i) => i === index ? { ...p, ...patch } : p));

  const choosePortrait = (file: File | null) => {
    setPortrait(file); setExported(false);
    update('photo', { src: file ? imagePath(brief.slug, file, 'foto-utama') : '', alt: `Foto ${brief.name}` });
  };
  const chooseProjectPhoto = (index: number, file: File | null) => {
    const next = { ...projectPhotos };
    if (file) next[index] = file; else delete next[index];
    setProjectPhotos(next);
    patchProject(index, { image: file ? imagePath(brief.slug, file, `karya-${index + 1}`) : '' });
  };
  const prepared: ClientBrief = {
    ...brief,
    photo: { ...brief.photo, src: portrait ? imagePath(brief.slug, portrait, 'foto-utama') : '' },
    experiences: brief.experiences.filter((e) => e.company || e.role || e.description),
    education: (brief.education || []).filter((e) => e.school || e.degree),
    highlights: (brief.highlights || []).filter((h) => h.title || h.description),
    projects: brief.projects.map((p, i) => ({ ...p, image: projectPhotos[i] ? imagePath(brief.slug, projectPhotos[i], `karya-${i + 1}`) : '' })),
  };
  const exportData = async () => {
    if (packing) return;
    const invalid = validateBrief(prepared);
    if (!portrait) invalid.push('Pilih foto utama terlebih dahulu.');
    if (invalid.length) { setErrors(invalid); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setPacking(true);
    setExported(false);
    try {
      const zip = await createClientPackage(prepared, portrait, projectPhotos);
      downloadFile(new Blob([new Uint8Array(zip)], { type: 'application/zip' }), `paket-klien-${prepared.slug}.zip`);
      setErrors([]);
      setExported(true);
    } catch (error) {
      setErrors(error instanceof Error ? error.message.split('\n') : ['Paket belum bisa dibuat. Coba lagi.']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setPacking(false); }
  };

  const openStudio = async () => {
    if (savingStudio) return;
    const invalid = validateBrief(prepared);
    if (!portrait) invalid.push('Pilih foto utama terlebih dahulu.');
    if (invalid.length) { setErrors(invalid); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setSavingStudio(true);
    try {
      await saveDraft({ slug: prepared.slug, brief: prepared, portrait, projectPhotos, mode: 'create', updatedAt: Date.now() });
      sessionStorage.setItem('personalflix-last-draft', prepared.slug);
      window.location.assign('/studio');
    } catch {
      setErrors(['Draft gagal disimpan di browser. Periksa ruang penyimpanan dan coba lagi.']);
      setSavingStudio(false);
    }
  };

  return <div className="min-h-screen bg-[#08080b] text-white font-sans">
    <header className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-5 sm:px-10"><a href="/" className="text-base font-extrabold tracking-wide text-white">PESONA<span className="text-[#fa526e]">FLIX</span></a><span className="rounded-lg border border-[#fa526e]/50 bg-[#fa526e]/10 px-3 py-2 text-xs font-bold text-white">Formulir Klien</span><a href="/studio" className="rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-[#ff8da0]">Editor CMS →</a></header>
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-3"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff6c86]">PESONAFLIX STUDIO</p><h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">Data Klien.<br/>Siap Masuk Studio.</h1><p className="max-w-2xl text-base leading-relaxed text-white/65">Teh Vini mengisi formulir berdasarkan data dan foto dari WhatsApp. Setelah lengkap, klik <strong className="text-white">Buka di Editor CMS</strong> agar semua isian dan foto langsung menjadi draft—tanpa mengetik ulang, tanpa Codex, dan tanpa login.</p></div>
      {errors.length > 0 && <div role="alert" className="rounded-xl border border-red-500/60 bg-red-500/10 p-5"><p className="mb-2 font-semibold">Masih ada yang perlu dilengkapi:</p><ul className="list-disc space-y-1 pl-5 text-sm">{errors.map((e) => <li key={e}>{e}</li>)}</ul></div>}

      <section className={sectionClass}><h2 className="mb-5 text-xl font-bold">01 · Identitas</h2><div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama lengkap / nama brand *"><input className={inputClass} value={brief.name} placeholder="Satria Putra" onChange={(e) => { const name = e.target.value; setBrief((p) => ({ ...p, name, slug: normalizeSlug(name), photo: { ...p.photo, alt: `Foto ${name}` } })); setErrors([]); }} /></Field>
        <Field label="Alamat URL *" note={`Hasil: pesonaflix.vercel.app/${brief.slug || 'nama-klien'}`}><input className={inputClass} value={brief.slug} placeholder="satria" onChange={(e) => update('slug', normalizeSlug(e.target.value))} /></Field>
        <Field label="Profesi / posisi *"><input className={inputClass} value={brief.role} placeholder="Fotografer • Kreator Konten" onChange={(e) => update('role', e.target.value)} /></Field>
        <Field label="Kota / lokasi *"><input className={inputClass} value={brief.location} placeholder="Bandung, Indonesia" onChange={(e) => update('location', e.target.value)} /></Field>
      </div><div className="mt-5"><Field label="Tentang saya *" note="Cerita singkat 3–5 kalimat. Ditampilkan pada halaman pembuka dan profil."><textarea rows={4} className={inputClass} value={brief.bio} placeholder="Saya adalah ..." onChange={(e) => update('bio', e.target.value)} /></Field></div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Sorotan singkat *" note="Pisahkan setiap poin dengan baris baru. Contoh: 10 tahun pengalaman."><textarea rows={3} className={inputClass} value={brief.tagline.join('\n')} placeholder={'Pecinta fotografi\nSpesialis potret'} onChange={(e) => update('tagline', splitLines(e.target.value))} /></Field><Field label="Minat / hobi"><textarea rows={3} className={inputClass} value={brief.interests.join('\n')} placeholder={'Desain\nFotografi\nTraveling'} onChange={(e) => update('interests', splitLines(e.target.value))} /></Field></div></section>

      <section className={sectionClass}><h2 className="mb-3 text-xl font-bold">02 · Foto Utama *</h2><p className="mb-5 text-sm leading-relaxed text-white/65">Paling bagus foto resolusi tinggi dengan badan setengah/full, cahaya terang. <strong className="text-white">PNG transparan lebih disarankan</strong> agar menyatu dengan tema Netflix. JPG/WebP berlatar biasa juga bisa, tetapi bisa perlu proses hapus background oleh admin.</p>
        <input aria-label="Unggah foto utama" className="block w-full cursor-pointer rounded-xl border border-dashed border-white/25 p-4 text-sm" type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(e) => choosePortrait(e.target.files?.[0] || null)} />
        {portraitPreview && <img src={portraitPreview} alt="Pratinjau foto yang dipilih" className="mt-5 h-44 max-w-full rounded-xl bg-[#26212c] object-contain" />}
        <p className="mt-3 text-xs text-white/50">Foto tetap berada di perangkat Anda sampai Anda mengirimkannya ke admin.</p>
      </section>

      <section className={sectionClass}><h2 className="mb-5 text-xl font-bold">03 · Pengalaman</h2>{brief.experiences.map((item, i) => <div className="mb-5 grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2" key={i}>
        <Field label="Perusahaan / organisasi"><input className={inputClass} value={item.company} placeholder="Nama organisasi" onChange={(e) => patchExperience(i, { company: e.target.value })}/></Field>
        <Field label="Jabatan"><input className={inputClass} value={item.role} placeholder="Founder / Mentor" onChange={(e) => patchExperience(i, { role: e.target.value })}/></Field>
        <Field label="Periode"><input className={inputClass} value={item.period} placeholder="2022 – Sekarang" onChange={(e) => patchExperience(i, { period: e.target.value })}/></Field>
        <Field label="Penjelasan singkat"><textarea rows={2} className={inputClass} value={item.description} placeholder="Apa yang dikerjakan?" onChange={(e) => patchExperience(i, { description: e.target.value })}/></Field>
        {brief.experiences.length > 1 && <button type="button" className="justify-self-start text-sm text-red-300" onClick={() => update('experiences', brief.experiences.filter((_, j) => i !== j))}>Hapus pengalaman</button>}
      </div>)}<button type="button" className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/10" onClick={() => update('experiences', [...brief.experiences, newExperience()])}>+ Tambah pengalaman</button>
      <h3 className="mb-4 mt-10 text-lg font-semibold">Pendidikan (opsional)</h3>
      {(brief.education || []).map((item, i) => <div className="mb-4 grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2" key={i}>
        <Field label="Sekolah / kampus"><input className={inputClass} value={item.school} onChange={(e) => patchEducation(i, { school: e.target.value })}/></Field>
        <Field label="Jurusan / gelar"><input className={inputClass} value={item.degree} onChange={(e) => patchEducation(i, { degree: e.target.value })}/></Field>
        <Field label="Kota"><input className={inputClass} value={item.place} onChange={(e) => patchEducation(i, { place: e.target.value })}/></Field>
        <Field label="Tahun"><input className={inputClass} value={item.period} onChange={(e) => patchEducation(i, { period: e.target.value })}/></Field>
        <button type="button" className="justify-self-start text-sm text-red-300" onClick={() => update('education', (brief.education || []).filter((_, j) => j !== i))}>Hapus pendidikan</button>
      </div>)}
      <button type="button" className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/10" onClick={() => update('education', [...(brief.education || []), newEducation()])}>+ Tambah pendidikan</button></section>

      <section className={sectionClass}><h2 className="mb-2 text-xl font-bold">04 · Karya / Portofolio *</h2><p className="mb-5 text-sm text-white/65">Minimal 1 karya. Boleh isi produk, jasa, kegiatan, atau pencapaian. Foto tambahan per karya opsional.</p>{brief.projects.map((item, i) => <div className="mb-5 space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4" key={i}>
        <p className="font-semibold text-[#ff8096]">Karya {i + 1}</p><div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama karya *"><input className={inputClass} value={item.title} placeholder="Proyek Andalan" onChange={(e) => patchProject(i, { title: e.target.value })}/></Field>
          <Field label="Tahun / periode"><input className={inputClass} value={item.year} placeholder="2026" onChange={(e) => patchProject(i, { year: e.target.value })}/></Field>
          <Field label="Kategori"><input className={inputClass} value={item.category} placeholder="Fotografi" onChange={(e) => patchProject(i, { category: e.target.value })}/></Field>
          <Field label="Link karya (opsional)"><input className={inputClass} value={item.website || ''} placeholder="https://..." onChange={(e) => patchProject(i, { website: e.target.value })}/></Field>
        </div><Field label="Cerita karya *"><textarea rows={3} className={inputClass} value={item.description} placeholder="Ceritakan karya ini..." onChange={(e) => patchProject(i, { description: e.target.value })}/></Field>
        <Field label="Kata kunci karya" note="Pisahkan dengan koma"><input className={inputClass} value={item.tags.join(', ')} placeholder="Fotografi, Branding, Desain" onChange={(e) => patchProject(i, { tags: splitLines(e.target.value) })}/></Field>
        <Field label="Foto karya (opsional)"><input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="block w-full cursor-pointer rounded-xl border border-dashed border-white/20 p-3 text-sm" onChange={(e) => chooseProjectPhoto(i, e.target.files?.[0] || null)}/></Field>
        {brief.projects.length > 1 && <button type="button" className="text-sm text-red-300" onClick={() => {update('projects', brief.projects.filter((_, j) => j !== i).map((p) => ({ ...p, image: '' }))); setProjectPhotos({});}}>Hapus karya ini</button>}
      </div>)}<button type="button" className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/10" onClick={() => update('projects', [...brief.projects, newProject()])}>+ Tambah karya</button></section>

      <section className={sectionClass}><h2 className="mb-5 text-xl font-bold">05 · Keahlian & Kontak</h2><Field label="Keahlian" note="Satu keahlian per baris"><textarea rows={3} className={inputClass} value={brief.skills.join('\n')} placeholder={'Komunikasi\nDesain Grafis\nPublic Speaking'} onChange={(e) => update('skills', splitLines(e.target.value))}/></Field><div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Email (opsional)"><input className={inputClass} type="email" value={brief.email || ''} placeholder="nama@email.com" onChange={(e) => update('email', e.target.value)}/></Field>
        {(['website','linkedin','github'] as const).map((k) => <Field key={k} label={`Link ${k} (opsional)`}><input className={inputClass} value={brief.links?.[k] || ''} placeholder="https://..." onChange={(e) => update('links', { ...brief.links, [k]: e.target.value })}/></Field>)}
      </div><h3 className="mb-4 mt-8 text-lg font-semibold">Pencapaian / sorotan (opsional)</h3>
      {(brief.highlights || []).map((item, i) => <div className="mb-4 space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4" key={i}>
        <Field label="Judul pencapaian"><input className={inputClass} value={item.title} placeholder="Pernah mengadakan kelas 100 peserta" onChange={(e) => patchHighlight(i, { title: e.target.value })}/></Field>
        <Field label="Penjelasan"><textarea rows={2} className={inputClass} value={item.description} onChange={(e) => patchHighlight(i, { description: e.target.value })}/></Field>
        <Field label="Kategori"><input className={inputClass} value={item.category} placeholder="Kelas / Penghargaan / Kegiatan" onChange={(e) => patchHighlight(i, { category: e.target.value })}/></Field>
        <button type="button" className="text-sm text-red-300" onClick={() => update('highlights', (brief.highlights || []).filter((_, j) => j !== i))}>Hapus sorotan</button>
      </div>)}<button type="button" className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold hover:bg-white/10" onClick={() => update('highlights', [...(brief.highlights || []), newHighlight()])}>+ Tambah sorotan</button></section>

      <section className={`${sectionClass} border-[#ff6985]/40`}><h2 className="text-xl font-bold">06 · Lanjut ke Editor CMS</h2><p className="mt-2 text-sm leading-relaxed text-white/65">Data dan foto disimpan sebagai draft di browser ini, lalu langsung terbuka di editor. Teteh bisa memoles tulisan, menambah kartu, melihat preview, dan login GitHub hanya saat menerbitkan.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" disabled={savingStudio} aria-busy={savingStudio} className="min-h-12 rounded-xl bg-[#e62f50] px-5 py-3 font-bold text-white hover:bg-[#f84a69] disabled:cursor-wait disabled:opacity-60" onClick={() => void openStudio()}>{savingStudio ? 'Menyimpan draft…' : 'Buka di Editor CMS'}</button><button type="button" disabled={packing} aria-busy={packing} className="min-h-12 rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10 disabled:opacity-60" onClick={exportData}>{packing ? 'Menyiapkan ZIP…' : 'Unduh Backup ZIP'}</button></div>
        {exported && <p role="status" className="mt-4 text-sm font-semibold text-green-300">Backup ZIP berhasil disiapkan. Simpan sebagai arsip klien.</p>}
        <p className="mt-4 text-xs leading-relaxed text-white/50">Simpan ZIP di tempat aman karena bisa berisi data kontak dan foto klien. Jangan unggah berkas berisi data sensitif ke repositori publik.</p>
        <a className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl border border-[#5ac899]/60 px-5 py-3 font-bold text-green-300 hover:bg-green-500/10" href="https://wa.me/6282137523626?text=Halo%20Teh%20Vini%2C%20saya%20mau%20dibuatkan%20web%20PESONAFLIX.%20Saya%20akan%20kirim%20data%20formulir%20dan%20fotonya." target="_blank" rel="noreferrer">WhatsApp Teh Vini ↗</a>
      </section>
      <p className="pb-10 text-center text-xs text-white/40">© PESONAFLIX · Layanan portofolio personal independen.</p>
    </main>
  </div>;
}
