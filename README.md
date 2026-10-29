# PESONAFLIX — Web Portofolio Personal

Master portofolio bergaya platform streaming untuk beberapa klien dengan brand **PESONAFLIX**. **Satu repo, satu proyek Vercel, satu domain `pesonaflix.vercel.app`, banyak halaman**. Data klien dipisahkan dari variasi desainnya.

| Halaman | Fungsi |
| --- | --- |
| `/` | LP PESONAFLIX (sementara COMING SOON) |
| `/vini` | Portofolio Teh Vini (contoh & acuan desain) |
| `/vini2` | Demo Teh Vini versi Chibi Cinema (desain alternatif bergaya film animasi) |
| `/vini3` | Demo lain gaya Chibi |
| `/vini4` | Demo gaya Anime |
| `/vini5` | Demo gaya Clay 3D |
| `/formulir` | Alamat lama, otomatis mengarah ke `/studio?tab=formulir` |
| `/studio` | CMS editor seperti Blogger: buat/edit konten dan foto, simpan draft, preview |
| `/studio?tab=formulir` | Formulir klien, langsung dipindah ke draft CMS tanpa mengetik ulang |
| `/studio/preview?slug=satria` | Preview portofolio dari draft browser (belum live) |
| `/<nama-klien>` | Portofolio masing-masing klien yang sudah diterbitkan |

**Baca panduan lengkap:** [SOP PESONAFLIX](docs/WEB-PERSONAL-NETFLIX.md).

**CMS Studio:** [Alur editorial, GitHub OAuth, dan penerbitan aman](docs/CMS-STUDIO.md).

**Katalog TEMPLATE Studio:** Saat mengedit klien, buka tab **TEMPLATE · 16 Gaya**. ORIGINAL, CHIBI 3D, ANIME, dan CLAY 3D siap diterapkan ke klien baru. Gaya lain dan mode Avatar AI/FACELESS belum aktif. Untuk CHIBI, ANIME, dan CLAY 3D, unggah sendiri ilustrasi karakter dan poster milik klien lewat Editor Website; sistem belum mengubah foto jadi ilustrasi secara otomatis. Pilihan gaya mengatur tata letak, font, warna latar, dan motion tanpa menyalin identitas/foto dari demo `/vini2`, `/vini4`, atau `/vini5`. Lihat [roadmap template](docs/template-roadmap.md).

## Membuat portofolio klien baru

1. Klien mengirim jawaban dan foto lewat WhatsApp. Teh Vini bisa mengisinya langsung di `/studio`, atau lewat tab **Formulir Klien**.
2. Jika memakai formulir, klik **Buka di Editor CMS** agar isi dan foto tersimpan sebagai draft browser. ZIP dapat diunduh untuk backup jika diperlukan.
3. Periksa hasil di **Lihat Preview** dan minta persetujuan klien.
4. Login GitHub hanya ketika hendak menerbitkan. CMS menyiapkan PR, memeriksa validasi, lalu menerbitkan setelah konfirmasi.

Contoh: `src/data/clients/satria.json` dan `public/clients/satria/foto-utama.webp` akan menghasilkan `https://pesonaflix.vercel.app/satria` setelah diterbitkan.

**Catatan migrasi domain:** Draft CMS tersimpan di IndexedDB yang terikat ke asal domain. Draft dari `tehvini.vercel.app` tidak otomatis muncul di `pesonaflix.vercel.app`; domain lama perlu tetap dapat diakses sampai semua draft penting dipindahkan/diterbitkan. Login GitHub memerlukan callback OAuth baru dan perubahan `GITHUB_CALLBACK_URL` di Vercel.

Tidak diperlukan database atau proyek Vercel baru untuk setiap klien. Saat penambahan klien hanya perlu mengubah JSON dan aset foto; komponen desain membaca data secara otomatis. File `src/data/portfolio.ts` dikhususkan untuk Teh Vini dan tidak perlu diubah.

### Varian Chibi Cinema

`/vini2` menggunakan `designVariant: "chibi-cinema"` dalam `src/data/clients/vini2.json`. Varian ini memberi hero karpet merah bergambar chibi, dua poster BADAI/PROMPTIONAL, font lebih membulat, dan gerakan otomatis. Halaman `/vini` serta klien biasa tidak berubah. Foto dan konten `/vini2` tetap dapat diperbarui melalui Studio. WhatsApp awal memakai nomor Teh Vini dengan kode `PSN-VINI2`, yang bisa diedit di Studio.

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
