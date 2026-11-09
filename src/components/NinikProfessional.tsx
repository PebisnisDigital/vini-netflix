import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, ChartNoAxesCombined, House, Menu, MessageCircle, Plane, ShieldCheck, X } from 'lucide-react';
import { usePortfolio } from '../data/PortfolioContext';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { normalizeClientWhatsapp } from '../utils/clientWhatsapp.mjs';

const navItems = [
  { label: 'Profil Ninik Wardhani', target: 'about' },
  { label: 'Bisnis Travel Umroh & Haji – Samira Travel', target: 'ninik-bidang-02' },
  { label: 'Bisnis Property', target: 'ninik-bidang-03' },
  { label: 'Digital Marketing', target: 'ninik-bidang-04' },
];

export function NinikNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollTo } = useSmoothScroll();
  const { profile } = usePortfolio();
  const number = normalizeClientWhatsapp(profile.whatsapp);
  const contactUrl = `https://wa.me/${number}?text=${encodeURIComponent('Assalamu’alaikum Bu Ninik, saya ingin berkonsultasi melalui website Anda.')}`;

  const navigate = (target: string) => {
    setIsOpen(false);
    scrollTo(`#${target}`, { offset: target === 'top' ? 0 : -88 });
  };

  return (
    <header className="ninik-professional-header fixed inset-x-0 top-0 z-[65] border-b border-white/10 bg-[#062653]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] max-w-[1510px] items-center justify-between gap-5 px-5 sm:px-8 xl:px-12">
        <button type="button" onClick={() => navigate('top')} className="flex min-w-0 items-center gap-3 text-left" aria-label="Kembali ke beranda Ninik Wardhani">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#dbb96a]/65 bg-[#f2d78e]/10 text-[#f0d391]"><BriefcaseBusiness className="size-5" strokeWidth={1.8} /></span>
          <span className="block leading-none">
            <span className="block text-[15px] font-extrabold tracking-[0.06em] text-white sm:text-lg">NINIK WARDHANI</span>
            <span className="mt-1.5 block text-[9px] font-semibold tracking-[0.14em] text-[#efd59c] sm:text-[10px]">PERSONAL • TRAVEL • PROPERTY • DIGITAL</span>
          </span>
        </button>

        <nav aria-label="Menu utama Ninik Wardhani" className="hidden items-center gap-4 xl:flex 2xl:gap-6">
          {navItems.map((item) => (
            <button key={item.target} type="button" onClick={() => navigate(item.target)} className="max-w-[180px] text-center text-xs font-semibold leading-snug text-white/85 transition hover:text-[#f1cf82] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f1cf82] 2xl:text-[13px]">
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="hidden min-h-10 items-center gap-2 rounded-full bg-[linear-gradient(110deg,#ffe69e,#e7b547)] px-4 text-xs font-extrabold text-[#12294d] shadow-[0_9px_26px_rgba(229,176,69,.22)] transition hover:brightness-110 sm:inline-flex">
            <MessageCircle className="size-4" /> Kontak WhatsApp
          </a>
          <button type="button" onClick={() => setIsOpen((v) => !v)} aria-label={isOpen ? 'Tutup menu Ninik' : 'Buka menu Ninik'} aria-expanded={isOpen} className="flex size-11 items-center justify-center rounded-lg border border-white/20 text-white xl:hidden">
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav aria-label="Menu seluler Ninik Wardhani" className="border-t border-white/10 bg-[#092b5b] px-5 py-4 shadow-2xl xl:hidden">
          {navItems.map((item) => (
            <button key={item.target} type="button" onClick={() => navigate(item.target)} className="block min-h-11 w-full border-b border-white/10 py-3 text-left text-sm font-semibold text-white/90">
              {item.label}
            </button>
          ))}
          <a href={contactUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#eac16c] px-5 text-sm font-bold text-[#0b2a56]"><MessageCircle className="size-4" /> Kontak WhatsApp</a>
        </nav>
      )}
    </header>
  );
}

export function NinikHero() {
  const { profile } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const number = normalizeClientWhatsapp(profile.whatsapp);
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent('Assalamu’alaikum Bu Ninik, saya ingin bertanya mengenai layanan Anda.')}`;

  return (
    <section id="top" className="ninik-professional-hero relative isolate overflow-hidden bg-[#061f47] text-white">
      <img src="/clients/ninikwardhani/hero-kaaba-navy.webp" alt="Suasana Masjidil Haram dan Ka'bah dengan nuansa biru malam" className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]" fetchPriority="high" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,25,59,.96)_0%,rgba(5,37,81,.92)_32%,rgba(5,38,83,.55)_66%,rgba(4,34,72,.28)_100%)]" />
      <div className="relative mx-auto flex min-h-[750px] max-w-[1510px] flex-col justify-between px-5 pb-8 pt-[132px] sm:px-8 sm:pt-[154px] lg:min-h-[800px] lg:pb-9 lg:pt-[164px] xl:px-12">
        <div className="relative z-10 flex flex-col lg:min-h-[475px]">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-[730px]">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#edc979]/75 bg-[#082c62]/70 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.17em] text-[#f5d58c] shadow-[0_8px_32px_rgba(0,0,0,.13)] sm:text-xs">
              <ShieldCheck className="size-4" /> Personal Profile | Business | Inspiration
            </p>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.22em] text-white/80 sm:text-sm">Selamat datang di profil Ninik Wardhani</p>
            <h1 className="max-w-[760px] text-[clamp(2.65rem,5.7vw,5.7rem)] font-extrabold leading-[1.035] tracking-[-.052em] drop-shadow-[0_4px_20px_rgba(0,0,0,.15)]">
              Menghubungkan <span className="block text-[#f1c969]">Niat, Peluang,</span> dan Masa Depan
            </h1>
            <p className="mt-7 max-w-[600px] text-[15px] leading-[1.75] text-white/85 sm:text-lg">
              Kenali perjalanan Ninik serta layanan Umroh & Haji bersama Samira Travel, bisnis properti, dan digital marketing—dengan pendekatan personal, profesional, dan amanah.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button type="button" onClick={() => scrollTo('#ninik-bidang', { offset: -80 })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(120deg,#ffe7a3,#e6b449)] px-6 text-sm font-extrabold text-[#112e59] shadow-[0_15px_35px_rgba(227,172,55,.25)] transition hover:-translate-y-0.5 hover:brightness-105 sm:px-8">Lihat Layanan <ArrowRight className="size-4" /></button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/80 bg-[#0b376a]/50 px-6 text-sm font-bold text-white transition hover:bg-white/15 sm:px-8"><MessageCircle className="size-4" /> Hubungi Ninik</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.2 }} className="pointer-events-none relative mx-auto -mb-5 mt-8 h-[320px] w-[min(90vw,360px)] sm:h-[380px] lg:absolute lg:-bottom-[80px] lg:right-[-4%] lg:mt-0 lg:h-[640px] lg:w-[47%] xl:right-[-2%]">
            <img data-studio-edit="portrait" src={profile.portrait.src} alt={profile.portrait.alt} className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_23px_35px_rgba(1,14,35,.45)]" fetchPriority="high" />
          </motion.div>
        </div>
        <div className="relative z-20 grid grid-cols-3 gap-2 border-t border-[#dcb96a]/45 pt-6 sm:max-w-[850px] sm:gap-6 lg:mt-8 lg:gap-10">
          {[
            { label: 'Umroh & Haji', sub: 'Mitra Samira Jakarta Selatan', icon: Plane },
            { label: 'Property', sub: 'Hunian & Investasi', icon: House },
            { label: 'Digital Marketing', sub: 'Peluang Era Digital', icon: ChartNoAxesCombined },
          ].map(({ label, sub, icon: Icon }) => (
            <div key={label} className="flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
              <Icon className="size-6 shrink-0 text-[#f4ca70] sm:size-8" strokeWidth={1.7} />
              <div><strong className="block text-[11px] font-bold leading-snug text-white sm:text-base">{label}</strong><span className="mt-1 block text-[9px] leading-snug text-white/70 sm:text-xs">{sub}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-20 h-[3px] w-full bg-[linear-gradient(90deg,transparent,#e7bf6b_62%,#f9e6ae)]" />
    </section>
  );
}
