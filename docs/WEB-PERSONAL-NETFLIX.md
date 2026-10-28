# PESONAFLIX — SOP Master Template

Satu proyek GitHub dan Vercel untuk **satu gaya template** (portofolio bergaya serial). Banyak klien memakai source desain yang sama, dengan konten terisolasi per nama URL. Domain utama: `pesonaflix.vercel.app`. Template jenis lain (misalnya futuristik, minimalis) memakai repo/proyek berbeda.

## Alamat halaman

| URL | Isi |
| --- | --- |
| `/` | Landing page utama (saat ini COMING SOON) |
| `/vini` | Portofolio asli Teh Vini, tetap dipertahankan |
| `/studio` | CMS untuk edit teks, foto, dan kartu (draft lokal) |
| `/studio?tab=formulir` | Formulir kerja Teh Vini; tombol lanjut memindahkan isi ke draft CMS |
| `/formulir` | Alamat lama, mengalihkan ke tab formulir di `/studio` |
| `/satria` | Portofolio Satria, muncul **hanya** setelah data dan foto diterbitkan |

## 1. Formulir kerja Teh Vini

Klien mengirim jawaban dan foto lewat WhatsApp. **Teh Vini sendiri** membuka `https://pesonaflix.vercel.app/studio?tab=formulir` dan mengisi data klien. Klik **Buka di Editor CMS** untuk langsung menyimpan data dan foto menjadi draft lokal di `/studio`, lalu lanjut edit, preview, dan terbitkan lewat GitHub. Paket ZIP tetap tersedia sebagai backup opsional. Tidak diperlukan login saat menyusun draft karena pengisian hanya berlangsung di perangkat pengguna dan tidak ada penyimpanan backend. **Namun alamat formulir tetap publik; siapa pun yang memiliki URL bisa membukanya dan mengunduh ZIP lokal.** Jangan menganggap kerahasiaan URL sebagai autentikasi.

Isi formulir:

1. Nama, URL pendek (slug), profesi, lokasi, deskripsi pribadi, kalimat sorotan, minat.
2. Foto utama. **Rekomendasi** PNG transparan, foto setengah atau seluruh badan, resolusi memadai. JPG/WebP/AVIF juga diterima; gambar dengan latar belakang mungkin perlu diedit oleh admin.
3. Pengalaman organisasi/pekerjaan dan pendidikan (keduanya dapat ditambahkan lebih dari satu).
4. Karya/proyek (minimal satu). Setiap proyek dapat memiliki foto tambahan, deskripsi, kategori, keahlian, dan tautan situs.
5. Keahlian, sorotan/pencapaian, email, serta tautan web/LinkedIn/GitHub (opsional).

Jika butuh arsip cadangan, Teh Vini bisa klik **Unduh Backup ZIP**. Satu ZIP `paket-klien-satria.zip` berisi:

```text
PANDUAN.txt
src/data/clients/satria.json
public/clients/satria/foto-utama.png
public/clients/satria/karya-1.webp  (jika foto karya tersedia)
```

Nama berkas di dalam paket selalu diselaraskan dengan path pada JSON. Format yang didukung: PNG, JPG/JPEG, WebP, AVIF; setiap foto harus terisi dan maksimal 10 MB. Proses berlangsung **di browser**: paket diunduh langsung, bukan dikirim ke server/WhatsApp. Jangan memuat data sensitif, seperti KTP dan nomor rekening, ke paket yang akan dipublikasikan.

Foto minimal **1 foto utama**. Idealnya **1 foto utama + 1 foto untuk tiap karya**. Tidak semua foto harus transparan: foto utama lebih bagus transparan; foto karya lazimnya tetap dengan latar aslinya.

## 2. Penerbitan klien baru (cara utama: Studio CMS)

1. Dari formulir klik **Buka di Editor CMS**, atau langsung buat klien baru di `/studio`.
2. Simpan draft, klik **Lihat Preview**, lalu minta persetujuan klien.
3. Saat siap menerbitkan, login GitHub, unggah foto, dan buat PR dari CMS.
4. Pastikan pemeriksaan GitHub dan preview Vercel lulus sebelum menekan tombol terbitkan.

### Jalur cadangan manual via ZIP (opsional)

Misal Satria:

1. Serahkan `paket-klien-satria.zip` ke Codex pada repo `PebisnisDigital/vini-netflix`. Minta Codex menyalin berkas ZIP ke jalur relatif repo yang sudah tercantum (tanpa menimpa berkas klien lain).
2. Periksa `src/data/clients/satria.json` dan foto utama di `public/clients/satria/foto-utama.png` (atau ekstensi sesuai JSON).
3. Periksa foto karya di `public/clients/satria/karya-1.webp`, dst. **Nama berkas sudah otomatis sesuai JSON.**
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
- [ ] Seluruh URL publik memakai `pesonaflix.vercel.app`, bukan nama deployment preview.
- [ ] Semua tautan personal klien terbuka dengan benar.
- [ ] `npm run verify` sukses dan pemeriksaan otomatis GitHub PR lulus.
- [ ] **Preview Vercel** sudah dicek sebelum merge ke `main` (jangan langsung push data klien baru ke produksi).

## 4. Perintah untuk Codex saat ada klien baru

> Siapkan klien baru pada repo `PebisnisDigital/vini-netflix` berdasarkan satu berkas `paket-klien-<slug>.zip` yang saya lampirkan. Semua berkas di dalam ZIP sudah memakai path repo; salin sesuai struktur tersebut tanpa mengubah desain master dan data `/vini`. Pastikan nama slug belum ada dan semua file tidak menimpa klien lain. Jalankan `npm run verify`. Buat branch dan PR, tampilkan URL preview Vercel agar saya bisa mengecek HP/desktop. Jangan merge ke `main` sebelum saya setujui hasil preview.

## Catatan izin dan kapasitas

- Setiap gambar di `public/` dapat diakses publik melalui URL. Jangan menyimpan KTP, foto pribadi yang belum disetujui, atau data sensitif di repo ini.
- Seluruh klien memakai satu build dan satu proyek Vercel. Masalah build atau desain master berpotensi memengaruhi semua halaman. Karena itu rilis wajib melewati pemeriksaan dan preview.
- Karena akan dipakai sebagai **jasa berbayar**, tinjau ketentuan lisensi source awal dan paket hosting. Vercel Hobby ditujukan untuk penggunaan personal nonkomersial; operasional komersial membutuhkan paket yang sesuai.
