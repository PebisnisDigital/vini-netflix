# PESONAFLIX — fondasi 16 gaya + mode identitas

## Prinsip

- Satu Studio dan satu data klien; gaya, aset, dan mode wajah adalah konfigurasi yang berbeda.
- Mengganti gaya pada tahap berikutnya tidak boleh menghapus nama, karya, pengalaman, tautan, atau nomor WhatsApp/referral.
- Gaya bukan sekadar filter warna: setiap renderer harus punya tipografi, latar, komposisi hero, kartu karya, transisi, dan gerakan otomatis yang sesuai.
- Teks, bukti pengalaman, dan CTA tetap jelas bagi audiens Indonesia, termasuk pembaca mobile usia lanjut.
- Bila pengguna memilih reduced motion, animasi dekoratif harus berhenti.

## Status Tahap 13 — DOCUMENTARY ikut aktif

Katalog lengkap tersedia di `src/data/templateCatalog.mjs`. Studio menampilkan 16 gaya dan tiga mode identitas berikut statusnya.

| Status | Makna dan tindakan |
| --- | --- |
| `available` | Renderer siap untuk klien baru; tombol Gunakan aktif. Saat ini ORIGINAL, CHIBI 3D, ANIME, CLAY 3D, KOMIK POP, EDITORIAL PREMIUM, DOODLE, STORYBOOK, SCRAPBOOK, PAPER CUT, PIXEL RETRO, MINIATURE WORLD, dan DOCUMENTARY. |
| `demo` | Contoh klien ada, tetapi renderer belum aman dipakai secara umum; tombol Lihat Demo saja. |
| `planned` | Konsep gaya tercatat; belum ada tombol Gunakan maupun preview palsu. |

IDENTITAS: `photo` aktif. `avatar` dan `faceless` tercatat sebagai mode independen namun belum aktif untuk produksi. Server menolak nilai tak dikenal maupun gaya/mode yang belum siap ketika data diterbitkan.

CHIBI mengaktifkan renderer `ChibiHero` berdasarkan `templateId: 'chibi-3d'`, tidak lagi memerlukan alamat `/vini2`. Foto yang belum diganti ditampilkan sebagai placeholder pada editor, bukan menggunakan ilustrasi Teh Vini. Ilustrasi karakter dan poster asli harus diunggah melalui Editor Website; tidak ada pengubahan foto menjadi avatar otomatis. Warna dasar chibi dipakai bila klien belum punya warna khusus, dan data nama, karya, WhatsApp/referral tidak berubah ketika gaya diganti.

ANIME menggunakan tata visual hero, tipografi, latar bintang, kartu dan gerakan dari contoh `/vini4`, tetapi kini ditentukan oleh `templateId: 'anime'` untuk setiap klien. Nama dan label episode mengikuti data klien, bukan teks Teh Vini. Pada draft baru, gambar master Sushmita diganti placeholder ilustrasi anime agar admin mengunggah karakter yang benar. Warna bawaan anime tidak menimpa pilihan warna khusus. Mode foto tetap berlaku sebagai jenis input aset; ilustrasi anime yang diunggah harus memiliki hak pakai atau persetujuan pemilik.

CLAY 3D memakai `ClayHero`, palet navy–coral–mint, font Baloo 2, material seperti plastisin, tata kartu polaroid, dan gerak otomatis terputus lembut menyerupai stop-motion. Contoh `/vini5` hanya menampilkan aset ilustrasi Teh Vini sendiri; draft baru menampilkan placeholder karakter buatan CSS sehingga tidak meminjam identitas demo. Semua teks, foto, poster karya, dan warna klien bisa disunting lewat Studio. Tidak ada konversi foto menjadi clay otomatis.

KOMIK POP memakai `ComicHero`, font Bangers, palet navy–magenta–kuning–teal, titik halftone, panel tebal, balon dialog dan stiker WOW. Gambar latar bergeser perlahan, efek pop dan garis kecepatan bergerak terus, panel karya muncul dengan gerakan spring. Animasi pada section, hover, modal, dan transisi scroll tetap berasal dari renderer ORIGINAL. Demo `/vini6` memakai aset khusus Teh Vini; klien baru mendapatkan placeholder komik sampai ilustrasinya diunggah melalui Studio, tanpa konversi foto otomatis. Motion dekoratif berhenti ketika reduced motion aktif.

EDITORIAL PREMIUM memakai `EditorialHero` dengan tata sampul majalah: halaman ivory, masthead tipis, judul Playfair Display besar, potret sinematik, kartu karya kecil terkurasi, latar charcoal, dan aksen emas hangat. Kamera bergerak lembut otomatis; judul dan karya muncul bertahap. Section asli, animasi scroll, dan modal tetap memakai sistem ORIGINAL. Demo `/vini7` menggunakan foto konsep buatan AI yang dilabeli dengan jelas sebagai representasi, **bukan foto asli Teh Vini**. Draft klien baru mendapatkan placeholder editorial; admin mengunggah foto yang berhak digunakan lewat Studio, tanpa konversi otomatis. Kustomisasi warna tidak menimpa data klien.

DOODLE memakai `DoodleHero` dengan tampilan buku sketsa kertas krem bergrid, spiral gambar tangan, tipografi Caveat, tinta biru, kuning cerah, dan kartu karya seperti catatan yang ditempel. Garis panah tergambar otomatis, matahari berputar, bintang bergoyang, dan ilustrasi bergerak lembut. Tetap menggunakan section, rail, animasi scroll, modal, serta aksi asli dari master ORIGINAL. Contoh `/vini8` memakai tiga ilustrasi Doodle buatan AI yang dilabeli sebagai **karakter fiksi, bukan foto asli Teh Vini**. Klien baru tidak menerima gambar Vini: kanvas menunjukkan placeholder CSS, untuk diganti dengan ilustrasi milik klien melalui Studio. Sistem tidak mengonversi foto secara otomatis. Animasi dekoratif berhenti bila pengguna mengaktifkan reduced motion.

STORYBOOK memakai `StorybookHero`, tata buku terbuka dengan dua lembar kertas ivory, tipografi DM Serif Display, aksen sage dan rose, ilustrasi cat air, kartu karya seperti bab dongeng, halaman yang membuka otomatis, kunang-kunang dan daun yang melayang. Tetap mewarisi rail, section, animasi scroll, modal karya, dan CTA dari master ORIGINAL. Contoh `/vini9` berisi tiga ilustrasi cat air AI dengan karakter **fiksi dan bukan potret asli Teh Vini**; draft klien baru menampilkan placeholder dan wajib menggunakan karya milik klien sendiri. Tidak ada konversi foto otomatis. Gerak dekoratif nonaktif untuk reduced motion.

SCRAPBOOK memakai `ScrapbookHero`, kolase polaroid, lembar jurnal bergrid, warna rose–mint–butter yellow, font Caveat, kertas bergigi, memo tempel dan washi tape. Polaroid mengayun perlahan, foto bergerak sinematik, stiker bergoyang, dan garis tinta tergambar berulang secara otomatis. Rail, section, modal karya, animasi scroll dan CTA tetap mewarisi master ORIGINAL. Demo `/vini10` memakai tiga foto konsep analog buatan AI berisi karakter **fiksi, bukan foto asli Teh Vini**. Draft klien baru menampilkan placeholder polaroid dan aset milik klien sendiri; sistem tidak membuat potret AI otomatis. Gerak dekoratif menghormati preferensi reduced motion.

PAPER CUT memakai `PaperCutHero`, panggung diorama dari cardstock bertingkat, lengkungan dan pinggiran bergigi, warna sage–rose–periwinkle, serta font Quicksand bulat. Layer kertas bernafas, awan melayang, matahari berputar, bunga dan ilustrasi bergerak otomatis. Rail karya, modal detail, section, animasi scroll dan CTA tetap diwarisi dari ORIGINAL. Demo `/vini11` memakai tiga ilustrasi bertekstur kertas buatan AI yang menampilkan **karakter fiksi, bukan foto asli Teh Vini**. Draft baru memunculkan placeholder apabila belum ada ilustrasi sendiri, tanpa meminjam foto demo atau mengonversi foto secara otomatis. Gerak dekoratif menghormati reduced motion.

PIXEL RETRO memakai `PixelRetroHero`: panggung karakter game 16-bit dengan HUD level, font Press Start 2P, warna midnight navy–mint–lavender–emas, bingkai layar arcade, indikator HP, koin, bintang berkedip dan kartu karya berupa quest. Kamera karakter bergerak dengan keyframe bertahap otomatis, tanpa kontrol manual. Semua section/rail, animasi scroll, popup karya, pembukaan dan CTA tetap diwarisi dari ORIGINAL. Demo `/vini12` memakai tiga ilustrasi pixel art buatan AI yang menggambarkan **karakter fiksi, bukan potret asli Teh Vini**. Foto klien baru akan menjadi placeholder sampai diunggah melalui Studio, tidak mengambil gambar demo dan tidak ada konversi AI otomatis. Gerak dekoratif menghormati reduced motion.

MINIATURE WORLD memakai `MiniatureWorldHero`: dunia profesi disajikan sebagai model koleksi skala mungil dari kayu, resin dan lampu kecil—bukan stop-motion clay atau potongan kertas. Hero menggunakan tipografi editorial DM Serif Display, mint–amber–deep teal, orbit diorama, cahaya hangat, pulau mini mengambang serta foto makro yang bergerak otomatis; kartu karya seperti koleksi model mini. Semua section, rail, animasi scroll, modal karya dan CTA asli tetap ada. Demo `/vini13` menggunakan tiga ilustrasi diorama buatan AI dengan **figur fiksi, bukan foto asli Teh Vini**. Draft klien baru hanya menampilkan placeholder foto sampai gambar milik klien diunggah via Studio; template tidak otomatis menghasilkan diorama AI. Reduced motion dihormati.

DOCUMENTARY memakai `DocumentaryHero`: komposisi seperti opening film dokumenter observasional, dengan foto sinematik besar, Manrope tegas, frame kamera, garis arsip, ticker cerita, dua cuplikan karya dan film-grain. Fotografi bergerak pelan dengan Ken Burns; cuplikan punya motion kamera tersendiri. Berbeda dari EDITORIAL PREMIUM yang menyerupai majalah. Semua section, rail, modal karya, gerak scroll, tombol profil dan CTA asli tetap utuh. Demo `/vini14` memakai tiga foto konsep buatan AI dengan **figur fiksi tanpa identitas wajah, bukan foto atau bukti kegiatan Teh Vini**. Setiap klien harus memasukkan foto dokumentasi miliknya sendiri melalui Studio; draft baru tidak menyalin aset contoh. Reduced motion dihormati.

Halaman `/vini2` sampai `/vini14` yang sudah menggunakan variasi khusus tetap berjalan menggunakan konfigurasi masing-masing; tidak dimigrasikan otomatis ke katalog baru.

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

1. Selesaikan DOCUMENTARY, lalu gaya berikutnya.
2. Implementasikan pipeline foto/karakter untuk Avatar AI dan FACELESS, dengan persetujuan aset dan fallback.
3. Produksi gaya tambahan sesuai urutan permintaan klien. Jangan aktifkan seluruh 16 sekaligus sebelum teruji.
