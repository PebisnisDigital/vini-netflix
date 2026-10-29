# PESONAFLIX Studio — CMS Tanpa Codex

> **Panduan baru:** [Penerbitan otomatis tanpa login GitHub](STUDIO-AUTO-PUBLISH.md). Alur OAuth di bawah ini hanya fallback saat konfigurasi Studio baru belum diaktifkan.

## Alur penggunaan

1. Buka **`https://pesonaflix.vercel.app/studio`** di browser pribadi Teh Vini. Draft tersimpan **di browser tersebut**, bukan di server. Tidak ada login saat mengetik, mengunggah foto, atau menyimpan draft. Semua halaman memakai domain yang sama.
   - `/` — halaman utama layanan (sementara **COMING SOON**).
   - `/studio` — editor CMS.
   - `/studio?tab=formulir` — formulir lengkap; tombol **Buka di Editor CMS** menyalin semua data dan foto ke draft lokal tanpa mengetik ulang.
   - `/{namaklien}` — portofolio publik, misalnya `/vini` dan `/satria` setelah diterbitkan.
   - `/formulir` — alamat lama yang otomatis mengarahkan ke `/studio?tab=formulir`.
2. Klik **Buat Klien Baru** atau pilih klien yang sudah tayang. **Canvas Netflix** langsung muncul dengan contoh isi dan foto master. Alternatifnya isi tab Formulir Klien lalu klik **Buka di Editor CMS**. Halaman `/vini` tetap contoh master dan tidak diedit lewat sistem JSON klien.
3. Klik langsung **nama, profesi, lokasi, headline, deskripsi, foto**, atau **kartu karya** di kanvas. Panel kanan menampilkan kolom teks atau unggah foto untuk elemen yang dipilih. Hasilnya langsung terlihat di kanvas yang merender komponen Netflix asli. Tombol **Desktop / HP** memeriksa tampilan responsif; tombol **Warna** mengubah aksen dan latar. Tambahkan, hapus, atau susun ulang kartu tanpa Codex. Bagian **Pengaturan Detail** tetap tersedia untuk pengalaman, pendidikan, keahlian, pencapaian, dan tautan.
   - Isi juga **WhatsApp Pemilik & Referral** di bawah kanvas. Nomor WA setiap klien akan dipakai oleh tombol **Mau Dibuatin** pada halaman pribadinya. Format yang didukung: `08…`, `62…`, atau `+62…` (nomor seluler Indonesia).
   - Pesan WA otomatis menyertakan kode `PSN-NAMAURL`. Kode tersebut membantu atribusi manual ketika klien meneruskan calon pembeli ke Teh Vini. **Klik bukan penjualan dan komisi 50% belum dihitung otomatis oleh sistem.**
4. Klik **Simpan Draft** dan **Lihat Preview**. Kanvas adalah simulasi langsung yang belum publik; Preview lengkap mengambil data dan foto IndexedDB lokal serta merender website pengunjung sesungguhnya.
5. Setelah disetujui klien dan siap diterbitkan, klik **Login GitHub & Siapkan Preview**. OAuth GitHub diminta hanya pada tahap ini (sesi sekitar 30 menit).
6. Server memeriksa akun GitHub, mengunggah foto, dan membuat **branch serta Pull Request**, bukan langsung memodifikasi `main`. Tunggu validasi GitHub Actions dan buka Preview Vercel dari PR.
7. Setelah **memeriksa HP, desktop, foto, redaksi, dan tautan**, centang pernyataan dan pilih **Terbitkan ke Website Live**. Server hanya merge PR yang dibuat melalui CMS dan hanya bila check `verify` sukses. Vercel membuat deployment produksi dari `main`.

## Konfigurasi OAuth GitHub (wajib untuk publikasi otomatis)

Belum bisa digunakan tanpa aplikasi OAuth dan environment variables. **Jangan menyalin secret ke chat, file repo, atau JavaScript frontend.**

1. Pada akun GitHub pemilik repo, buka **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Isi nama, misalnya `PESONAFLIX Studio`; **Homepage URL** `https://pesonaflix.vercel.app`; **Authorization callback URL** `https://pesonaflix.vercel.app/api/auth/callback` (exact, tanpa wildcard).
3. Simpan Client ID dan Client Secret di **Vercel → vini-netflix → Settings → Environment Variables**, scope **Production**. Tambahkan:

   - `GITHUB_CLIENT_ID` — ID aplikasi OAuth.
   - `GITHUB_CLIENT_SECRET` — secret OAuth aplikasi.
   - `GITHUB_SESSION_SECRET` — string acak minimal 32 karakter, hanya server; dapat dibuat lokal lewat password manager.
   - `GITHUB_ALLOWED_LOGIN` — `PebisnisDigital` (login GitHub yang diberi izin menerbitkan).
   - `GITHUB_CALLBACK_URL` — `https://pesonaflix.vercel.app/api/auth/callback`.

4. Redeploy setelah menyimpan variabel. Gunakan akun GitHub `PebisnisDigital` saat proses authorize. Jika repo dipindah menjadi privat, flow ini perlu direvisi ke izin GitHub App yang sesuai.
5. Untuk pengujian OAuth di alamat preview Vercel yang berbeda domain, perlu aplikasi OAuth terpisah dengan callback khusus preview dan environment scoped preview. **Jangan** memakai wildcard callback atau membocorkan secret production ke preview.

## Pengamanan yang diterapkan

- Data draft dan foto tetap di perangkat melalui IndexedDB, tidak dibagikan ke pengunjung lain. Namun semua orang yang mengetahui `/studio` bisa membuka editor kosong miliknya sendiri; ini **bukan** halaman admin yang terlindungi login sampai tahap penerbitan.
- Semua endpoint tulis butuh sesi OAuth GitHub valid milik `GITHUB_ALLOWED_LOGIN`, cookie `HttpOnly`, `Secure`, `SameSite=Lax`, dan pemeriksaan Origin yang sama. Token GitHub tidak pernah dikirim ke frontend.
- Aplikasi OAuth meminta scope `public_repo` (untuk repository publik). GitHub App khusus satu repository bisa menjadi peningkatan keamanan bila layanan berkembang.
- Server membatasi nama URL, lokasi foto, foto maksimal 2,5 MB per unggahan, dan tidak pernah menulis ke `main` sebelum PR lulus validasi dan user menyetujui.
- Gambar besar dikompres menjadi WebP dalam editor, sebisa mungkin menjaga transparansi. Bila tetap di atas batas, kompres dulu sebelum mengunggah.
- Saat foto kartu diganti, berkas lama bisa masih berada dalam riwayat Git; jika klien meminta penghapusan total, lakukan prosedur penghapusan riwayat terpisah.
- Setelah penerbitan, profil, foto, dan tautan yang ada dalam repo/website publik **dapat dilihat siapa saja**. Minta izin tertulis klien terlebih dahulu.
- Draft browser dapat hilang jika data situs dibersihkan atau pindah perangkat. Simpan backup ZIP melalui `/formulir` untuk arsip penting.
- **Migrasi domain:** IndexedDB terisolasi per domain. Draft lama di `tehvini.vercel.app` tidak ikut berpindah ke domain PESONAFLIX. Sebelum menghapus atau mengalihkan domain lama, selesaikan/publikasikan draft atau ekspor backup klien dari domain lama.

## Batasan saat ini

- Halaman lama `/citra` dan `/iis` belum memiliki nomor WhatsApp klien di JSON. Sebelum CTA referral dapat aktif, pilih **Edit website terbit** di Studio, isi nomor masing-masing, lalu terbitkan pembaruannya. Nomor tidak boleh ditebak atau otomatis diganti nomor Teh Vini.
- Formulir dan penerbitan baru mewajibkan nomor WhatsApp klien. Jika nomor belum terisi pada halaman lama, CTA tidak membuka WhatsApp siapa pun.

- Dashboard tidak dapat memodifikasi konten `/vini` yang masih dikodekan dalam `src/data/portfolio.ts` karena halaman ini adalah contoh/master yang dilindungi.
- Kanvas dibuka di dalam iframe agar efek Netflix tampil otentik tanpa mengganggu tombol Studio. Saat mengedit di kanvas, klik elemen untuk memilihnya lalu ketik di panel kanan. Animasi masih berjalan; navigasi dari iframe sengaja dicegah sampai masuk Preview lengkap.
- Editor tidak memiliki sinkronisasi lintas perangkat; draft lokal hanya ada di browser yang sama.
- CMS menghasilkan satu PR per publikasi. Jika `main` berubah sebelum PR digabungkan, GitHub mungkin meminta penyelesaian konflik terlebih dahulu.
- Login GitHub belum berfungsi sampai Teh Vini mengatur OAuth App dan variabel Vercel. Tes frontend/preview dapat digunakan sebelumnya.
- Vercel Hobby tidak untuk layanan komersial; pastikan paket dan lisensi source asal memperbolehkan bisnis jasa.
