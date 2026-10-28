# WEB PERSONAL NETFLIX

Master template portofolio bergaya platform streaming untuk beberapa klien. **Satu repo, satu proyek Vercel, banyak halaman**, semuanya memakai desain yang sama dengan data dan foto terpisah.

| Halaman | Fungsi |
| --- | --- |
| `/` | Landing page utama (COMING SOON) |
| `/vini` | Portofolio Teh Vini (contoh & acuan desain) |
| `/formulir` | Formulir internal pengemasan data Teh Vini (tanpa login/backend) |
| `/studio` | CMS editor seperti Blogger: buat/edit konten dan foto, simpan draft, preview |
| `/studio/preview?slug=satria` | Preview portofolio dari draft browser (belum live) |
| `/<nama-klien>` | Portofolio masing-masing klien yang sudah diterbitkan |

**Baca panduan lengkap:** [SOP Web Personal Netflix](docs/WEB-PERSONAL-NETFLIX.md).

**CMS Studio:** [Alur editorial, GitHub OAuth, dan penerbitan aman](docs/CMS-STUDIO.md).

## Membuat portofolio klien baru

1. Klien mengirim jawaban dan foto lewat WhatsApp. Teh Vini sendiri memasukkannya di `/formulir`.
2. Klik **Unduh Paket Klien**, menghasilkan satu ZIP berisi `src/data/clients/<slug>.json`, foto di `public/clients/<slug>/`, dan petunjuk. Berikan ZIP ke Codex untuk dimasukkan ke repo; tidak ada pengiriman/publikasi otomatis.
3. Jalankan `npm run verify`. Foto yang hilang atau data tidak lengkap menggagalkan build.
4. Uji lewat branch + preview Vercel. Setelah disetujui, merge ke `main` untuk terbit otomatis.

Contoh: `src/data/clients/satria.json` dan `public/clients/satria/foto-utama.webp` akan menghasilkan `https://tehvini.vercel.app/satria` setelah diterbitkan.

Tidak diperlukan database atau proyek Vercel baru untuk setiap klien. Saat penambahan klien hanya perlu mengubah JSON dan aset foto; komponen desain membaca data secara otomatis. File `src/data/portfolio.ts` dikhususkan untuk Teh Vini dan tidak perlu diubah.

## Pengembangan

Node.js 22 direkomendasikan.

```bash
npm ci
npm run dev
npm run verify
npm run preview
```

Proyek menggunakan React, TypeScript, Vite, Tailwind, Framer Motion dan Lenis. Halaman hasil build berada di `dist/`. Metadata sosial untuk setiap klien dipersiapkan saat build.

## Keterangan sumber dan legal

Desain awal proyek diadaptasi dari **Sushmita — The Series**, portofolio bergaya platform streaming. Website ini adalah karya independen dan **tidak berafiliasi dengan Netflix**. Sebelum menjual layanan berdasarkan template, verifikasi lisensi kode asal dan izin seluruh aset foto/ikon. Untuk penggunaan jasa komersial di Vercel, gunakan paket hosting yang memperbolehkan penggunaan komersial.
