# PESONAFLIX — Web Portofolio Personal

Master template portofolio bergaya platform streaming untuk beberapa klien dengan brand **PESONAFLIX**. **Satu repo, satu proyek Vercel, satu domain `pesonaflix.vercel.app`, banyak halaman**, semuanya memakai desain yang sama dengan data dan foto terpisah.

| Halaman | Fungsi |
| --- | --- |
| `/` | LP PESONAFLIX (sementara COMING SOON) |
| `/vini` | Portofolio Teh Vini (contoh & acuan desain) |
| `/formulir` | Alamat lama, otomatis mengarah ke `/studio?tab=formulir` |
| `/studio` | CMS editor seperti Blogger: buat/edit konten dan foto, simpan draft, preview |
| `/studio?tab=formulir` | Formulir klien, langsung dipindah ke draft CMS tanpa mengetik ulang |
| `/studio/preview?slug=satria` | Preview portofolio dari draft browser (belum live) |
| `/<nama-klien>` | Portofolio masing-masing klien yang sudah diterbitkan |

**Baca panduan lengkap:** [SOP PESONAFLIX](docs/WEB-PERSONAL-NETFLIX.md).

**CMS Studio:** [Alur editorial, GitHub OAuth, dan penerbitan aman](docs/CMS-STUDIO.md).

## Membuat portofolio klien baru

1. Klien mengirim jawaban dan foto lewat WhatsApp. Teh Vini bisa mengisinya langsung di `/studio`, atau lewat tab **Formulir Klien**.
2. Jika memakai formulir, klik **Buka di Editor CMS** agar isi dan foto tersimpan sebagai draft browser. ZIP dapat diunduh untuk backup jika diperlukan.
3. Periksa hasil di **Lihat Preview** dan minta persetujuan klien.
4. Login GitHub hanya ketika hendak menerbitkan. CMS menyiapkan PR, memeriksa validasi, lalu menerbitkan setelah konfirmasi.

Contoh: `src/data/clients/satria.json` dan `public/clients/satria/foto-utama.webp` akan menghasilkan `https://pesonaflix.vercel.app/satria` setelah diterbitkan.

**Catatan migrasi domain:** Draft CMS tersimpan di IndexedDB yang terikat ke asal domain. Draft dari `tehvini.vercel.app` tidak otomatis muncul di `pesonaflix.vercel.app`; domain lama perlu tetap dapat diakses sampai semua draft penting dipindahkan/diterbitkan. Login GitHub memerlukan callback OAuth baru dan perubahan `GITHUB_CALLBACK_URL` di Vercel.

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
