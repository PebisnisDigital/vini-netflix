# PESONAFLIX — fondasi 16 gaya + mode identitas

## Prinsip

- Satu Studio dan satu data klien; gaya, aset, dan mode wajah adalah konfigurasi yang berbeda.
- Mengganti gaya pada tahap berikutnya tidak boleh menghapus nama, karya, pengalaman, tautan, atau nomor WhatsApp/referral.
- Gaya bukan sekadar filter warna: setiap renderer harus punya tipografi, latar, komposisi hero, kartu karya, transisi, dan gerakan otomatis yang sesuai.
- Teks, bukti pengalaman, dan CTA tetap jelas bagi audiens Indonesia, termasuk pembaca mobile usia lanjut.
- Bila pengguna memilih reduced motion, animasi dekoratif harus berhenti.

## Status Tahap 6 — CHIBI, ANIME, CLAY, KOMIK POP, dan EDITORIAL PREMIUM aktif

Katalog lengkap tersedia di `src/data/templateCatalog.mjs`. Studio menampilkan 16 gaya dan tiga mode identitas berikut statusnya.

| Status | Makna dan tindakan |
| --- | --- |
| `available` | Renderer siap untuk klien baru; tombol Gunakan aktif. Saat ini ORIGINAL, CHIBI 3D, ANIME, CLAY 3D, KOMIK POP, dan EDITORIAL PREMIUM. |
| `demo` | Contoh klien ada, tetapi renderer belum aman dipakai secara umum; tombol Lihat Demo saja. |
| `planned` | Konsep gaya tercatat; belum ada tombol Gunakan maupun preview palsu. |

IDENTITAS: `photo` aktif. `avatar` dan `faceless` tercatat sebagai mode independen namun belum aktif untuk produksi. Server menolak nilai tak dikenal maupun gaya/mode yang belum siap ketika data diterbitkan.

CHIBI mengaktifkan renderer `ChibiHero` berdasarkan `templateId: 'chibi-3d'`, tidak lagi memerlukan alamat `/vini2`. Foto yang belum diganti ditampilkan sebagai placeholder pada editor, bukan menggunakan ilustrasi Teh Vini. Ilustrasi karakter dan poster asli harus diunggah melalui Editor Website; tidak ada pengubahan foto menjadi avatar otomatis. Warna dasar chibi dipakai bila klien belum punya warna khusus, dan data nama, karya, WhatsApp/referral tidak berubah ketika gaya diganti.

ANIME menggunakan tata visual hero, tipografi, latar bintang, kartu dan gerakan dari contoh `/vini4`, tetapi kini ditentukan oleh `templateId: 'anime'` untuk setiap klien. Nama dan label episode mengikuti data klien, bukan teks Teh Vini. Pada draft baru, gambar master Sushmita diganti placeholder ilustrasi anime agar admin mengunggah karakter yang benar. Warna bawaan anime tidak menimpa pilihan warna khusus. Mode foto tetap berlaku sebagai jenis input aset; ilustrasi anime yang diunggah harus memiliki hak pakai atau persetujuan pemilik.

CLAY 3D memakai `ClayHero`, palet navy–coral–mint, font Baloo 2, material seperti plastisin, tata kartu polaroid, dan gerak otomatis terputus lembut menyerupai stop-motion. Contoh `/vini5` hanya menampilkan aset ilustrasi Teh Vini sendiri; draft baru menampilkan placeholder karakter buatan CSS sehingga tidak meminjam identitas demo. Semua teks, foto, poster karya, dan warna klien bisa disunting lewat Studio. Tidak ada konversi foto menjadi clay otomatis.

KOMIK POP memakai `ComicHero`, font Bangers, palet navy–magenta–kuning–teal, titik halftone, panel tebal, balon dialog dan stiker WOW. Gambar latar bergeser perlahan, efek pop dan garis kecepatan bergerak terus, panel karya muncul dengan gerakan spring. Animasi pada section, hover, modal, dan transisi scroll tetap berasal dari renderer ORIGINAL. Demo `/vini6` memakai aset khusus Teh Vini; klien baru mendapatkan placeholder komik sampai ilustrasinya diunggah melalui Studio, tanpa konversi foto otomatis. Motion dekoratif berhenti ketika reduced motion aktif.

EDITORIAL PREMIUM memakai `EditorialHero` dengan tata sampul majalah: halaman ivory, masthead tipis, judul Playfair Display besar, potret sinematik, kartu karya kecil terkurasi, latar charcoal, dan aksen emas hangat. Kamera bergerak lembut otomatis; judul dan karya muncul bertahap. Section asli, animasi scroll, dan modal tetap memakai sistem ORIGINAL. Demo `/vini7` menggunakan foto konsep buatan AI yang dilabeli dengan jelas sebagai representasi, **bukan foto asli Teh Vini**. Draft klien baru mendapatkan placeholder editorial; admin mengunggah foto yang berhak digunakan lewat Studio, tanpa konversi otomatis. Kustomisasi warna tidak menimpa data klien.

Halaman `/vini2`, `/vini3`, `/vini4`, `/vini5`, `/vini6`, dan `/vini7` yang sudah menggunakan variasi khusus tetap berjalan menggunakan konfigurasi masing-masing; tidak dimigrasikan otomatis ke katalog baru.

## Model data bertahap

```json
{
  "templateId": "original",
  "identityMode": "photo",
  "theme": { "accent": "#e5132b", "background": "#07070a" }
}
```

Field baru opsional agar JSON klien lama tetap valid. Draft baru menggunakan ORIGINAL dan Foto Asli. `designVariant` lama dipertahankan selama migrasi renderer.

## Gerbang kualitas sebelum mengaktifkan gaya baru

1. Implementasi renderer dan desain visual benar-benar selesai, bukan sekadar mengganti warna atau font.
2. Gambar hero dan poster milik klien bisa diunggah sesuai gaya; jangan diam-diam membuat avatar dari foto tanpa persetujuan pemilik.
3. Verifikasi mode identitas yang didukung, preview desktop/HP, keterbacaan, tautan WhatsApp, navigasi, modal, dan animasi otomatis.
4. Tersedia contoh publik yang jelas, kemudian ubah `status` menjadi `available` dan tambahkan pemeriksaan kompatibilitas data.
5. Uji regresi semua klien lama dan cek performa; font/asset per gaya dimuat hanya saat diperlukan.

## Tahap berikutnya

1. Selesaikan DOODLE, STORYBOOK, lalu gaya berikutnya.
2. Implementasikan pipeline foto/karakter untuk Avatar AI dan FACELESS, dengan persetujuan aset dan fallback.
3. Produksi gaya tambahan sesuai urutan permintaan klien. Jangan aktifkan seluruh 16 sekaligus sebelum teruji.
