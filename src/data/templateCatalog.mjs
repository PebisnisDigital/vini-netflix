/**
 * Katalog publik Studio. `available` berarti aman dipakai untuk klien baru;
 * `demo` hanya memiliki halaman contoh; `planned` belum memiliki renderer.
 * Jangan menyamakan gambar demo dengan template yang siap dipublikasikan.
 */
export const templateCatalog = Object.freeze([
  { id: 'original', name: 'ORIGINAL', family: 'Sinematik', status: 'available', audience: 'Semua profesi', description: 'Portofolio ala serial film yang tegas dan profesional.', fonts: ['Bebas Neue', 'Inter'], colors: ['#0B0B11', '#E50931', '#F3ECEB'], backdrop: 'Studio film gelap', motion: 'Parallax dan sorotan film', demoUrl: '/vini' },
  { id: 'chibi-3d', name: 'CHIBI 3D', family: 'Ceria', status: 'available', audience: 'Mentor, kreator, UMKM', description: 'Tokoh imut tiga dimensi dengan dunia sinema berwarna.', fonts: ['Nunito Sans', 'Inter'], colors: ['#100309', '#FF1746', '#FFD3E4'], backdrop: 'Panggung chibi', motion: 'Karakter bernapas dan melayang', demoUrl: '/vini2' },
  { id: 'anime', name: 'ANIME', family: 'Ceria', status: 'available', audience: 'Kreator dan anak muda', description: 'Kisah personal seperti serial anime sinematik.', fonts: ['Sora', 'Nunito Sans'], colors: ['#0A1024', '#FF5CA3', '#7DF4FF'], backdrop: 'Adegan ilustrasi anime', motion: 'Cahaya dan transisi adegan', demoUrl: '/vini4' },
  { id: 'clay-3d', name: 'CLAY 3D', family: 'Ceria', status: 'available', audience: 'Guru, parenting, UMKM', description: 'Boneka tanah liat, panggung miniatur, dan suasana hangat.', fonts: ['Baloo 2', 'Nunito Sans'], colors: ['#18223E', '#FF876F', '#A9E5D0'], backdrop: 'Studio miniatur clay', motion: 'Gerak stop-motion halus', demoUrl: '/vini5' },
  { id: 'komik-pop', name: 'KOMIK POP', family: 'Ceria', status: 'available', audience: 'Trainer dan kreator konten', description: 'Panel komik dengan garis tinta, balon kata, dan warna berani.', fonts: ['Bangers', 'Inter'], colors: ['#081B42', '#F52983', '#FFD83B'], backdrop: 'Panel komik halftone', motion: 'Panel muncul dan efek pop otomatis', demoUrl: '/vini6' },
  { id: 'doodle', name: 'DOODLE', family: 'Ceria', status: 'available', audience: 'Guru, mentor, dan komunitas', description: 'Buku sketsa hidup: tulisan tangan, stiker kertas, dan karakter coretan ceria.', fonts: ['Caveat', 'Nunito Sans'], colors: ['#FFF8E8', '#2466BA', '#F6C94D'], backdrop: 'Halaman kertas bergrid dan spidol', motion: 'Garis digambar, bintang berputar, dan foto bergerak otomatis', demoUrl: '/vini8' },
  { id: 'storybook', name: 'STORYBOOK', family: 'Bercerita', status: 'available', audience: 'Penulis, edukator, mentor, dan UMKM', description: 'Buku cerita berilustrasi cat air, halaman berlipat, dan perjalanan personal yang hangat.', fonts: ['DM Serif Display', 'Nunito Sans'], colors: ['#FCF5E7', '#7DAD94', '#D68E8B'], backdrop: 'Buku terbuka dengan halaman cat air', motion: 'Sudut halaman membalik, cahaya kunang-kunang, dan kamera halus otomatis', demoUrl: '/vini9' },
  { id: 'scrapbook', name: 'SCRAPBOOK', family: 'Bercerita', status: 'available', audience: 'Blogger, mentor, kreator, dan UMKM', description: 'Album kenangan hidup dengan foto analog, polaroid bertumpuk, washi tape dan memo berwarna.', fonts: ['Caveat', 'Nunito Sans'], colors: ['#FCF4E5', '#E7848C', '#B7DBD1'], backdrop: 'Jurnal bergrid, potongan kertas, stiker dan foto polaroid', motion: 'Polaroid melayang, stiker bergoyang, dan garis tinta tergambar otomatis', demoUrl: '/vini10' },
  { id: 'paper-cut', name: 'PAPER CUT', family: 'Bercerita', status: 'available', audience: 'Craft, edukasi, UMKM', description: 'Panggung diorama dari potongan kertas berlapis dengan kedalaman dan warna pastel.', fonts: ['Quicksand', 'Nunito Sans'], colors: ['#E7F4E9', '#F3A9B7', '#6C8DC6'], backdrop: 'Diorama cardstock berlapis, lengkungan kertas, bunga dan bayangan nyata', motion: 'Lapisan bernafas, karakter bergerak, awan melayang dan matahari berputar otomatis', demoUrl: '/vini11' },
  { id: 'pixel-retro', name: 'PIXEL RETRO', family: 'Bercerita', status: 'available', audience: 'Kreator, guru, gamer, developer', description: 'Profil seperti petualangan game 16-bit dengan karakter, nyawa, level dan kartu quest.', fonts: ['Press Start 2P', 'Nunito Sans'], colors: ['#10162C', '#69E8D8', '#A28BFF'], backdrop: 'Dunia arcade 16-bit, bintang neon dan layar character select', motion: 'Bintang berkedip, karakter bergerak bertahap, koin naik-turun otomatis', demoUrl: '/vini12' },
  { id: 'miniature-world', name: 'MINIATURE WORLD', family: 'Bercerita', status: 'available', audience: 'Mentor, UMKM, guru, pengusaha dan kreator', description: 'Dunia karya terasa nyata seperti koleksi miniatur dalam foto makro, lengkap dengan adegan profesi.', fonts: ['DM Serif Display', 'Nunito Sans'], colors: ['#102B35', '#95D9C2', '#EABE84'], backdrop: 'Diorama resin dan kayu skala kecil di panggung studio', motion: 'Diorama mengambang, kamera makro, orbit, kilau dan kartu karya bergerak otomatis', demoUrl: '/vini13' },
  { id: 'editorial-premium', name: 'EDITORIAL PREMIUM', family: 'Profesional', status: 'available', audience: 'CEO, konsultan, pembicara', description: 'Majalah premium dengan tipografi elegan, ruang lega, dan potret editorial.', fonts: ['Playfair Display', 'Inter'], colors: ['#0D0C0C', '#DDB780', '#FFF4E7'], backdrop: 'Studio editorial premium', motion: 'Reveal editorial dan gerak kamera lembut otomatis', demoUrl: '/vini7' },
  { id: 'documentary', name: 'DOCUMENTARY', family: 'Profesional', status: 'planned', audience: 'Founder dan tokoh publik', description: 'Cerita perjalanan nyata melalui fotografi dokumenter.', fonts: ['Manrope', 'Inter'], colors: ['#111213', '#B9B9B9', '#F1EFEA'], backdrop: 'Foto dokumenter dan arsip', motion: 'Pan kamera sinematik' },
  { id: 'minimalist', name: 'MINIMALIST', family: 'Profesional', status: 'planned', audience: 'Konsultan, akademisi, profesional', description: 'Bersih, terukur, dan menonjolkan reputasi serta karya.', fonts: ['Manrope', 'Inter'], colors: ['#F6F6F3', '#202020', '#B9A79A'], backdrop: 'Ruang putih dan editorial', motion: 'Fade nyaris tak terasa' },
  { id: 'futuristic-neon', name: 'FUTURISTIC NEON', family: 'Profesional', status: 'planned', audience: 'Praktisi AI dan teknologi', description: 'Lingkungan digital dengan cahaya dan bentuk futuristik.', fonts: ['Orbitron', 'Inter'], colors: ['#080B1A', '#4BDCF2', '#A57CFF'], backdrop: 'Kota digital dan cahaya neon', motion: 'Glow dan transisi teknologi' },
  { id: 'vintage-heritage', name: 'VINTAGE HERITAGE', family: 'Profesional', status: 'planned', audience: 'Seniman, pengrajin, brand lokal', description: 'Kesan klasik yang hangat dengan sentuhan tradisi.', fonts: ['Libre Baskerville', 'Inter'], colors: ['#251C18', '#B88B5F', '#EAD8B8'], backdrop: 'Film lawas dan tekstur kertas', motion: 'Butiran film ringan' },
]);

export const identityModes = Object.freeze([
  { id: 'photo', name: 'Foto Asli', description: 'Menggunakan foto pemilik website.', status: 'available' },
  { id: 'avatar', name: 'Avatar AI', description: 'Membutuhkan ilustrasi khusus berdasarkan izin pemilik.', status: 'planned' },
  { id: 'faceless', name: 'FACELESS', description: 'Menggunakan siluet, objek, atau karya tanpa wajah.', status: 'planned' },
]);

export const getTemplate = (id) => templateCatalog.find((item) => item.id === id);
export const getIdentityMode = (id) => identityModes.find((item) => item.id === id);

/** Nama gaya lama tetap terbaca tanpa mengubah tampilan `/vini2`, `/vini3`, dan `/vini4`. */
export function resolveTemplateId(brief = {}) {
  if (getTemplate(brief.templateId)) return brief.templateId;
  if (brief.designVariant === 'chibi-cinema' || brief.slug === 'vini3') return 'chibi-3d';
  if (brief.slug === 'vini4') return 'anime';
  return 'original';
}

export const canApplyTemplate = (id) => getTemplate(id)?.status === 'available';
export const canApplyIdentityMode = (id) => getIdentityMode(id)?.status === 'available';
