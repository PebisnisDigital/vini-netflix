import { motion } from 'framer-motion';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { normalizeClientWhatsapp } from '../utils/clientWhatsapp.mjs';

type FocusTopic = {
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  target?: string;
  message?: string;
};

const topics: FocusTopic[] = [
  {
    number: '01',
    eyebrow: 'PERSONAL PROFILE',
    title: 'KENALI NINIK WARDHANI',
    subtitle: 'Cerita, Perjalanan & Inspirasi Kehidupan',
    description: 'Mengenal lebih dekat sosok Ninik Wardhani melalui perjalanan hidup, profil, pengalaman, keluarga, aktivitas, serta nilai-nilai kehidupan yang menjadi prinsip dalam berkarya dan bertumbuh.',
    cta: 'Kenali Ninik',
    target: 'about',
  },
  {
    number: '02',
    eyebrow: 'MITRA SAMIRA JAKARTA SELATAN',
    title: 'BISNIS TRAVEL UMROH & HAJI — SAMIRA TRAVEL',
    subtitle: 'Mengantarkan Niat Menuju Baitullah',
    description: 'Ninik Wardhani hadir sebagai Mitra Samira Jakarta Selatan untuk membantu Anda memperoleh informasi paket Umroh dan Haji, berkonsultasi mengenai perjalanan ibadah, serta mengenal peluang menjadi agen dan mitra bisnis travel. Rincian jadwal, harga, dan fasilitas dikonfirmasi sesuai program resmi yang tersedia.',
    cta: 'Lihat Paket',
    target: 'skills',
  },
  {
    number: '03',
    eyebrow: 'PROPERTY & INVESTASI',
    title: 'BISNIS PROPERTY',
    subtitle: 'Membangun Aset, Mewujudkan Masa Depan',
    description: 'Membantu Anda menemukan properti yang tepat untuk hunian maupun investasi. Jelajahi pilihan rumah, apartemen, tanah, dan properti potensial, sekaligus peluang bergabung sebagai mitra bisnis properti.',
    cta: 'Tanya Properti',
    message: 'Halo Bu Ninik, saya melihat profil PESONAFLIX dan ingin bertanya mengenai bisnis properti.',
  },
  {
    number: '04',
    eyebrow: 'DIGITAL & TECHNOLOGY',
    title: 'DIGITAL MARKETING',
    subtitle: 'Berkarya dan Bertumbuh di Era Digital',
    description: 'Mengembangkan peluang bisnis melalui pemanfaatan teknologi dan strategi pemasaran digital. Jelajahi layanan website, Artificial Intelligence (AI), desain kreatif, SEO, strategi konten, edukasi digital, serta konsultasi pengembangan bisnis.',
    cta: 'Tanya Digital',
    message: 'Halo Bu Ninik, saya ingin bertanya mengenai layanan digital marketing dan teknologi.',
  },
];

export default function NinikFocusSections() {
  const { profile } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const contactNumber = normalizeClientWhatsapp(profile.whatsapp);

  if (profile.clientSlug !== 'ninikwardhani') return null;

  return (
    <section id="ninik-bidang" aria-labelledby="ninik-bidang-title" className="gutter relative z-10 scroll-mt-20 py-16 sm:py-24">
      <div className="mb-9 max-w-4xl sm:mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1268bd] sm:text-sm">
          NINIK WARDHANI · PERSONAL PROFILE | BUSINESS | INSPIRATION
        </p>
        <h2 id="ninik-bidang-title" className="mt-4 font-display text-[clamp(2.25rem,5.5vw,5.25rem)] leading-[1.08] tracking-wide text-bone">
          Empat Layanan, Satu Kepercayaan
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-mist sm:text-lg">
          Mengenal Ninik, berkonsultasi tentang ibadah ke Tanah Suci, menjajaki properti, dan tumbuh lewat teknologi digital.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {topics.map((topic, index) => {
          const href = topic.message && contactNumber
            ? 'https://wa.me/' + contactNumber + '?text=' + encodeURIComponent(topic.message)
            : '';
          const actionClass = 'inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0c3b74] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0a2d59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c29a4c]';
          return (
            <motion.article
              key={topic.number}
              id={'ninik-bidang-' + topic.number}
              className="group relative flex min-h-[340px] scroll-mt-28 flex-col overflow-hidden rounded-[24px] border border-[#c4d8ea] bg-[linear-gradient(145deg,#ffffff_0%,#edf7ff_68%,#dceeff_100%)] p-6 shadow-[0_20px_60px_rgba(17,82,147,0.09)] sm:p-8"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-6xl leading-none text-[#beddf7] sm:text-7xl" aria-hidden="true">{topic.number}</span>
                <span className="max-w-[60%] rounded-full border border-[#e9c77a] bg-[#fff9e8] px-3 py-1.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#8c6423] sm:text-xs">{topic.eyebrow}</span>
              </div>
              <div className="relative mt-5 flex-1">
                <h3 className="font-display text-[clamp(1.8rem,2.8vw,2.7rem)] leading-[1.12] tracking-wide text-[#103461]">{topic.title}</h3>
                <p className="mt-3 text-[15px] font-semibold leading-snug text-[#0a63b4] sm:text-base">{topic.subtitle}</p>
                <p className="mt-4 max-w-2xl text-sm leading-[1.8] text-[#496b8e] sm:text-[15px]">{topic.description}</p>
              </div>
              <div className="relative mt-7 flex flex-wrap items-center gap-2">
                {topic.target ? (
                  <button type="button" onClick={() => scrollTo('#' + topic.target)} className={actionClass}>
                    {topic.cta} <span aria-hidden="true">↗</span>
                  </button>
                ) : href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={actionClass}>
                    {topic.cta} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {topic.number === '02' && contactNumber && (
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={'https://wa.me/' + contactNumber + '?text=' + encodeURIComponent('Assalamu’alaikum Bu Ninik, saya ingin konsultasi paket Umroh atau Haji bersama Samira Travel.')} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-[#b7cde4] px-4 text-xs font-bold text-[#0c3b74] transition hover:bg-white">Konsultasi</a>
                    <a href={'https://wa.me/' + contactNumber + '?text=' + encodeURIComponent('Assalamu’alaikum Bu Ninik, saya tertarik menjadi agen atau mitra Samira Travel Jakarta Selatan.')} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-[#e2bf6b] px-4 text-xs font-bold text-[#89611c] transition hover:bg-[#fff8e6]">Jadi Mitra</a>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
