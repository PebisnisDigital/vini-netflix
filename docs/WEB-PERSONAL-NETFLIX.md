# WEB PERSONAL NETFLIX — SOP Master Template

Satu proyek GitHub dan Vercel untuk **satu gaya template** (Netflix). Banyak klien memakai source desain yang sama, dengan konten terisolasi per nama URL. Template jenis lain (misalnya futuristik, minimalis) memakai repo/proyek berbeda.

## Alamat halaman

| URL | Isi |
| --- | --- |
| `/` | Landing page utama (saat ini COMING SOON) |
| `/vini` | Portofolio asli Teh Vini, tetap dipertahankan |
| `/formulir` | Formulir pengumpulan data calon klien |
| `/satria` | Portofolio Satria, muncul **hanya** setelah data dan foto diterbitkan |

## 1. Formulir calon klien

Bagikan `https://tehvini.vercel.app/formulir` kepada calon klien.

Isi formulir:

1. Nama, URL pendek (slug), profesi, lokasi, deskripsi pribadi, kalimat sorotan, minat.
2. Foto utama. **Rekomendasi** PNG transparan, foto setengah atau seluruh badan, resolusi memadai. JPG/WebP/AVIF juga diterima; gambar dengan latar belakang mungkin perlu diedit oleh admin.
3. Pengalaman organisasi/pekerjaan (bisa ditambahkan lebih dari satu).
4. Karya/proyek (minimal satu). Setiap proyek dapat memiliki foto tambahan, deskripsi, kategori, keahlian, dan tautan situs.
5. Keahlian, email, serta tautan web/LinkedIn/GitHub (opsional).

Klien memilih **Unduh Data Klien**, kemudian **Unduh Foto Utama** dan foto karya bila ada. Semua berkas dikirim melalui WhatsApp ke Teh Vini. **Formulir tidak mengunggah/menerbitkan data langsung** dan tidak memerlukan database.

Foto minimal **1 foto utama**. Idealnya **1 foto utama + 1 foto untuk tiap karya**. Tidak semua foto harus transparan: foto utama lebih bagus transparan; foto karya lazimnya tetap dengan latar aslinya.

## 2. Penerbitan klien baru

Misal Satria:

1. Simpan berkas JSON klien menjadi `src/data/clients/satria.json`.
2. Simpan foto utama ke `public/clients/satria/foto-utama.png` (atau sesuai ekstensi yang tertulis dalam JSON).
3. Simpan foto tiap karya ke `public/clients/satria/karya-1.webp`, dst. **Nama berkas harus sama dengan isi JSON.**
4. Jangan mengubah `src/data/portfolio.ts` untuk klien baru: berkas itu khusus halaman Teh Vini. Semua teks, kartu, season, karya, dan tautan klien dihasilkan dari JSON.
5. Jalankan `npm run verify`. Gagal jika ada data penting/foto hilang, URL tidak valid, atau TypeScript gagal dikompilasi.
6. Push ke branch baru, buat PR ke `main`, buka preview Vercel dari PR, lalu periksa desktop/HP. Setelah lolos, merge. Vercel otomatis membangun versi produksi dari `main`.

Halaman statis per klien beserta metadata judul/deskripsi/OG dibuat pada akhir build oleh `scripts/render-client-pages.mjs` sehingga ketika `/satria` dibagikan, preview sosial tidak menampilkan Teh Vini.

## 3. Checklist sebelum publish

- [ ] Klien menyetujui ejaan nama, profil, karya, profesi, dan link publik.
- [ ] Klien memiliki hak atas seluruh foto dan materi; izin publikasi telah diperoleh.
- [ ] URL slug tersedia (tanpa spasi, menggunakan huruf kecil dan tanda `-`).
- [ ] Foto utama terlihat baik tanpa terpotong di HP dan desktop.
- [ ] Foto proyek tajam dan tidak rusak; tidak ada berkas kosong/terlalu besar.
- [ ] Slider karya, pilihan dan sorotan bergerak otomatis dan tetap dapat digeser secara manual.
- [ ] Tombol CTA “Mau Dibuatin” menuju WhatsApp Teh Vini.
- [ ] Semua tautan personal klien terbuka dengan benar.
- [ ] `npm run verify` sukses dan pemeriksaan otomatis GitHub PR lulus.
- [ ] **Preview Vercel** sudah dicek sebelum merge ke `main` (jangan langsung push data klien baru ke produksi).

## 4. Perintah untuk Codex saat ada klien baru

> Siapkan klien baru pada repo `PebisnisDigital/vini-netflix` berdasarkan berkas JSON dan foto yang saya lampirkan. Jangan mengubah desain master dan data `/vini`. Simpan JSON di `src/data/clients/<slug>.json` serta semua foto di `public/clients/<slug>/`. Jalankan `npm run verify`. Buat branch dan PR, tampilkan URL preview Vercel agar saya bisa mengecek HP/desktop. Jangan merge ke `main` sebelum saya setujui hasil preview.

## Catatan izin dan kapasitas

- Setiap gambar di `public/` dapat diakses publik melalui URL. Jangan menyimpan KTP, foto pribadi yang belum disetujui, atau data sensitif di repo ini.
- Seluruh klien memakai satu build dan satu proyek Vercel. Masalah build atau desain master berpotensi memengaruhi semua halaman. Karena itu rilis wajib melewati pemeriksaan dan preview.
- Karena akan dipakai sebagai **jasa berbayar**, tinjau ketentuan lisensi source awal dan paket hosting. Vercel Hobby ditujukan untuk penggunaan personal nonkomersial; operasional komersial membutuhkan paket yang sesuai.
