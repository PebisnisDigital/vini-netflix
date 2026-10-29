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
  { id: 'komik-pop', name: 'KOMIK POP', family: 'Ceria', status: 'planned', audience: 'Trainer dan kreator konten', description: 'Panel komik dengan garis tinta, balon kata, dan warna berani.', fonts: ['Bangers', 'Inter'], colors: ['#081B42', '#F52983', '#FFD83B'], backdrop: 'Panel komik halftone', motion: 'Panel muncul dan efek pop' },
  { id: 'doodle', name: 'DOODLE', family: 'Ceria', status: 'planned', audience: 'Guru dan komunitas', description: 'Coretan tangan yang santai dan terasa personal.', fonts: ['Caveat', 'Inter'], colors: ['#F8F7ED', '#2466BA', '#F6C94D'], backdrop: 'Kertas coretan', motion: 'Garis tergambar otomatis' },
  { id: 'storybook', name: 'STORYBOOK', family: 'Bercerita', status: 'planned', audience: 'Penulis dan edukator', description: 'Nuansa buku cerita dengan ilustrasi cat air.', fonts: ['DM Serif Display', 'Nunito Sans'], colors: ['#F9F3EA', '#7DAD94', '#D68E8B'], backdrop: 'Halaman buku berilustrasi', motion: 'Transisi lembar cerita' },
  { id: 'scrapbook', name: 'SCRAPBOOK', family: 'Bercerita', status: 'planned', audience: 'Blogger dan kreator lifestyle', description: 'Kolase foto, stiker, dan catatan seperti jurnal.', fonts: ['Caveat', 'Inter'], colors: ['#F9E9DB', '#B16F79', '#896249'], backdrop: 'Buku jurnal dan potongan kertas', motion: 'Stiker dan polaroid bergeser' },
  { id: 'paper-cut', name: 'PAPER CUT', family: 'Bercerita', status: 'planned', audience: 'Craft, edukasi, UMKM', description: 'Lapisan kertas membentuk panggung berdimensi.', fonts: ['Quicksand', 'Inter'], colors: ['#E7F4E9', '#F3A9B7', '#6C8DC6'], backdrop: 'Diorama potongan kertas', motion: 'Lapisan bergerak perlahan' },
  { id: 'pixel-retro', name: 'PIXEL RETRO', family: 'Bercerita', status: 'planned', audience: 'Gamer dan developer', description: 'Portofolio ala permainan klasik berpiksel.', fonts: ['Press Start 2P', 'Inter'], colors: ['#0C1322', '#71E3A5', '#A881F4'], backdrop: 'Dunia game pixel', motion: 'Transisi frame bertahap' },
  { id: 'miniature-world', name: 'MINIATURE WORLD', family: 'Bercerita', status: 'planned', audience: 'Pengusaha dan kreator', description: 'Tokoh berada di dunia miniatur sesuai profesi.', fonts: ['Poppins', 'Inter'], colors: ['#132A3D', '#FFAA65', '#82D4CF'], backdrop: 'Diorama dunia mini', motion: 'Gerak kamera miniatur' },
  { id: 'editorial-premium', name: 'EDITORIAL PREMIUM', family: 'Profesional', status: 'planned', audience: 'CEO, konsultan, pembicara', description: 'Majalah premium dengan tipografi elegan dan ruang lega.', fonts: ['Playfair Display', 'Inter'], colors: ['#0D0C0C', '#DDB780', '#FFF4E7'], backdrop: 'Studio editorial premium', motion: 'Reveal tenang dan halus' },
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
