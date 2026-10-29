# PESONAFLIX — fondasi 16 gaya + mode identitas

## Prinsip

- Satu Studio dan satu data klien; gaya, aset, dan mode wajah adalah konfigurasi yang berbeda.
- Mengganti gaya pada tahap berikutnya tidak boleh menghapus nama, karya, pengalaman, tautan, atau nomor WhatsApp/referral.
- Gaya bukan sekadar filter warna: setiap renderer harus punya tipografi, latar, komposisi hero, kartu karya, transisi, dan gerakan otomatis yang sesuai.
- Teks, bukti pengalaman, dan CTA tetap jelas bagi audiens Indonesia, termasuk pembaca mobile usia lanjut.
- Bila pengguna memilih reduced motion, animasi dekoratif harus berhenti.

## Status Tahap 2 — CHIBI aktif

Katalog lengkap tersedia di `src/data/templateCatalog.mjs`. Studio menampilkan 16 gaya dan tiga mode identitas berikut statusnya.

| Status | Makna dan tindakan |
| --- | --- |
| `available` | Renderer siap untuk klien baru; tombol Gunakan aktif. Saat ini ORIGINAL dan CHIBI 3D. |
| `demo` | Contoh klien ada, tetapi renderer belum aman dipakai secara umum; tombol Lihat Demo tersedia. ANIME `/vini4`. |
| `planned` | Konsep gaya tercatat; belum ada tombol Gunakan maupun preview palsu. |

IDENTITAS: `photo` aktif. `avatar` dan `faceless` tercatat sebagai mode independen namun belum aktif untuk produksi. Server menolak nilai tak dikenal maupun gaya/mode yang belum siap ketika data diterbitkan.

CHIBI mengaktifkan renderer `ChibiHero` berdasarkan `templateId: 'chibi-3d'`, tidak lagi memerlukan alamat `/vini2`. Foto yang belum diganti ditampilkan sebagai placeholder pada editor, bukan menggunakan ilustrasi Teh Vini. Ilustrasi karakter dan poster asli harus diunggah melalui Editor Website; tidak ada pengubahan foto menjadi avatar otomatis. Warna dasar chibi dipakai bila klien belum punya warna khusus, dan data nama, karya, WhatsApp/referral tidak berubah ketika gaya diganti.

Halaman `/vini2`, `/vini3`, dan `/vini4` yang sudah menggunakan variasi khusus tetap berjalan menggunakan implementasi lamanya; tidak dimigrasikan otomatis ke katalog baru.

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

1. Selesaikan ANIME, CLAY 3D, KOMIK POP, EDITORIAL PREMIUM.
2. Implementasikan pipeline foto/karakter untuk Avatar AI dan FACELESS, dengan persetujuan aset dan fallback.
3. Produksi gaya tambahan sesuai urutan permintaan klien. Jangan aktifkan seluruh 16 sekaligus sebelum teruji.
