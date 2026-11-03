/**
 * Documentary evidence for Ayu's four areas of expertise, presented inside the
 * standard ORIGINAL Netflix experience rather than a standalone page skin.
 * Images and text are retained from her previously approved portfolio.
 */
const expertise = [
  {
    title: 'Digital Marketing',
    description: 'Strategi media sosial, pengembangan konten, pemasaran digital, dan komunikasi brand.',
    image: '/clients/asriwahyuni/behind-scenes.webp',
  },
  {
    title: 'Content Creation',
    description: 'Travel, food, lifestyle, storytelling, dan proses produksi konten.',
    image: '/clients/asriwahyuni/media-9-juta-views.webp',
  },
  {
    title: 'UMKM Development',
    description: 'Pendampingan, edukasi pemasaran, dan pengembangan potensi usaha UMKM.',
    image: '/clients/asriwahyuni/narasumber-umkm.webp',
  },
  {
    title: 'Business & MICE',
    description: 'Pengembangan kemitraan, networking, komunitas, dan peluang kolaborasi di bidang event.',
    image: '/clients/asriwahyuni/founder-community.webp',
  },
];

export default function AsriNetflixExpertise() {
  return (
    <section className="gutter mt-14 border-t border-white/10 pt-10 sm:mt-20 sm:pt-14" aria-labelledby="ayu-documentary-expertise">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-crimson-2">04 / PROFESSIONAL EXPERTISE</p>
          <h3 id="ayu-documentary-expertise" className="font-display text-4xl leading-tight text-bone sm:text-5xl">Profesional Expertise</h3>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-mist">Bidang yang Ayu tekuni dan tawarkan untuk kolaborasi.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {expertise.map((area, index) => (
          <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.07]" key={area.title}>
            <a href={area.image} target="_blank" rel="noopener noreferrer" aria-label={`Buka dokumentasi lengkap ${area.title}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-2">
              <img src={area.image} alt={`Dokumentasi asli ${area.title} Asri Wahyuni`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-[10px] font-bold tracking-[0.2em] text-bone backdrop-blur">0{index + 1} / EXPERTISE</span>
            </a>
            <div className="p-5">
              <h4 className="font-display text-2xl tracking-wide text-bone">{area.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-mist">{area.description}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm leading-relaxed text-mist">Lebih dari satu tahun di dunia bisnis dan digital marketing. Sertifikasi kompetensi BNSP: Digital Marketing, Pendamping UMKM, dan MICE.</p>
    </section>
  );
}
