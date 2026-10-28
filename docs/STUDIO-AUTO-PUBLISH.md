# PESONAFLIX Studio — Terbitkan Otomatis Tanpa Login GitHub

## Alur penggunaan

1. Buka <https://pesonaflix.vercel.app/studio> dan masukkan **kode akses tim** satu kali per perangkat. Sesi berlaku 30 hari.
2. Pilih **Buat Klien Baru** atau klien yang sudah terbit, misalnya `/iis`. Editor memakai template Netflix master Sushmita, lengkap dengan kartu dan keahlian.
3. Pilih **Simpan Draft** (tetap tersimpan di IndexedDB browser yang sama) dan **Lihat Preview**.
4. Pilih **Terbitkan Otomatis**. Backend akan memvalidasi data, mengunggah foto, dan membuat PR khusus CMS.
5. Jika pengujian `verify` lulus, GitHub Actions job `auto-publish-cms` menggabungkan PR ke `main`. Vercel otomatis menerbitkan website klien di `https://pesonaflix.vercel.app/{namaklien}`.

Jika pengujian gagal, website publik lama tetap dipertahankan. Studio menampilkan status selama tab terbuka; jika tab ditutup, GitHub Actions tetap berjalan di belakang layar. Riwayat GitHub dapat digunakan untuk audit/rollback.

## Aktivasi sekali oleh pemilik akun (wajib sebelum otomatis live)

**Jangan menempelkan credential ke chat, JavaScript frontend, atau repository.**

### 1. Buat token GitHub berizin terbatas

- GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**.
- Resource owner `PebisnisDigital`, pilih **hanya** repository `vini-netflix`.
- Repository permissions: **Contents: Read and write**, **Pull requests: Read and write** (Metadata: Read otomatis).
- Pilih masa kedaluwarsa yang sesuai. Simpan di password manager dan catat tanggal rotasi.
- Alternatif jangka panjang yang lebih kuat: GitHub App khusus repo dengan token instalasi berumur pendek.

### 2. Tambahkan tiga secret di Vercel

Vercel → tim `jualdigital` → project `vini-netflix` → Settings → Environment Variables. Buat tipe **Secret** khusus **Production**:

| Variabel | Nilai |
|---|---|
| `PESONAFLIX_STUDIO_ACCESS_KEY` | Kode acak minimal **16 karakter**, dibagikan hanya kepada tim. Jangan pakai PIN 6 angka. |
| `PESONAFLIX_STUDIO_SESSION_SECRET` | Secret acak **minimal 32 karakter**, berbeda dari kode akses, khusus server. |
| `PESONAFLIX_GITHUB_TOKEN` | Fine-grained PAT dengan izin terbatas di atas. |

Jangan gunakan prefix `VITE_` karena terekspos ke browser. Jangan pasang rahasia produksi di Preview. **Redeploy Production** setelah menyimpan env variables.

### 3. Periksa izin GitHub Actions

GitHub → repo `vini-netflix` → Settings → Actions → General → Workflow permissions. Job `auto-publish-cms` memerlukan izin `contents: write` dan `pull-requests: write` untuk merge otomatis. Jika organisasi melarangnya, pemilik perlu mengubah pengaturan atau mekanisme merge.

### 4. Uji publikasi dari Studio

- Masuk dengan kode akses.
- Pilih contoh `/iis`; ubah redaksi kecil → Simpan Draft → Preview → Terbitkan Otomatis.
- Pastikan PR CMS dibuat, `verify` lulus, `auto-publish-cms` sukses, dan deployment Production menjadi READY.
- Buka `/iis` dan periksa perubahan; ulangi dengan mengganti satu foto.
- Uji kode salah dan logout, lalu pastikan tanpa cookie endpoint penerbitan mengembalikan 401.

## Batasan & keamanan

- Cookie Studio terenkripsi menggunakan AES-GCM, `HttpOnly`, `Secure`, `SameSite=Strict`, kedaluwarsa setelah 30 hari.
- Endpoint tulis menolak permintaan tanpa cookie dan Origin yang sesuai. Foto, slug, link, dan kartu diperiksa di server. `/vini` tetap dilindungi.
- Percobaan kode dibatasi *best effort* di instance serverless. Untuk perlindungan lintas instance, **aktifkan rate-limiting/WAF Vercel** khusus endpoint `/api/studio/login` sebelum layanan dipakai tim besar.
- Bila perangkat hilang atau anggota tim keluar, rotasi kode akses dan secret sesi lalu redeploy agar semua sesi lama batal.
- Job auto-merge dibatasi untuk PR **dari repository sendiri**, branch `cms/{slug}-...`, penanda `PERSONALFLIX_CMS:{slug}`, serta hanya perubahan satu JSON klien dan foto dalam folder klien yang sama. Semuanya wajib lulus tes terlebih dahulu. Perubahan kode/workflow tidak bisa ikut auto-merge.
- Draft belum sinkron antarperangkat. Klien yang sudah terbit bisa dibuka ulang dari Studio; edit bersamaan atas klien yang sama berisiko konflik dan harus ditinjau.
- Foto, identitas, dan tautan yang diterbitkan ke repo/web publik dapat dilihat orang lain; pastikan persetujuan klien tersedia.
- Mode OAuth GitHub lama berfungsi sebagai fallback **hanya ketika Studio baru belum dikonfigurasi**.
