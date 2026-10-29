# PESONAFLIX — fondasi 16 gaya + mode identitas

## Prinsip

- Satu Studio dan satu data klien; gaya, aset, dan mode wajah adalah konfigurasi yang berbeda.
- Mengganti gaya pada tahap berikutnya tidak boleh menghapus nama, karya, pengalaman, tautan, atau nomor WhatsApp/referral.
- Gaya bukan sekadar filter warna: setiap renderer harus punya tipografi, latar, komposisi hero, kartu karya, transisi, dan gerakan otomatis yang sesuai.
- Teks, bukti pengalaman, dan CTA tetap jelas bagi audiens Indonesia, termasuk pembaca mobile usia lanjut.
- Bila pengguna memilih reduced motion, animasi dekoratif harus berhenti.

## Status Tahap 1

Katalog lengkap tersedia di `src/data/templateCatalog.mjs`. Studio menampilkan 16 gaya dan tiga mode identitas berikut statusnya.

| Status | Makna dan tindakan |
| --- | --- |
| `available` | Renderer siap untuk klien baru; tombol Gunakan aktif. Saat ini hanya ORIGINAL. |
| `demo` | Contoh klien ada, tetapi renderer belum aman dipakai secara umum; tombol Lihat Demo tersedia. CHIBI `/vini2` dan ANIME `/vini4`. |
| `planned` | Konsep gaya tercatat; belum ada tombol Gunakan maupun preview palsu. |

IDENTITAS: `photo` aktif. `avatar` dan `faceless` tercatat sebagai mode independen namun belum aktif untuk produksi. Server menolak nilai tak dikenal maupun gaya/mode yang belum siap ketika data diterbitkan.

Halaman `/vini2`, `/vini3`, dan `/vini4` yang sudah menggunakan variasi khusus tetap berjalan menggunakan implementasi lamanya; tidak dimigrasikan otomatis ke katalog baru. Mapping demo bersifat kompatibilitas sementara.

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

1. Selesaikan CHIBI sebagai renderer generik yang tidak bergantung pada gambar demo Vini2; setelah lolos QA, aktifkan untuk klien baru.
2. Selesaikan ANIME, CLAY 3D, KOMIK POP, EDITORIAL PREMIUM.
3. Implementasikan pipeline foto/karakter untuk Avatar AI dan FACELESS, dengan persetujuan aset dan fallback.
4. Produksi gaya tambahan sesuai urutan permintaan klien. Jangan aktifkan seluruh 16 sekaligus sebelum teruji.
