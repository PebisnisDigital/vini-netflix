import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { getPortfolioServiceWhatsappUrl, portfolioServiceCTA } from '../data/portfolioServiceCTA';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { SeriesMark } from './Poster';

export default function FinalCTA({ onReplay }: { onReplay: () => void }) {
  const { scrollTo } = useSmoothScroll();
  const exampleUrl = typeof window === 'undefined' ? undefined : `${window.location.origin}${window.location.pathname}`;
  const whatsappUrl = getPortfolioServiceWhatsappUrl(exampleUrl);

  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(229,19,43,0.18),transparent_70%)]" />
      <Particles count={36} />

      <motion.p
        className="relative mb-6 text-[11px] font-bold uppercase tracking-[0.5em] text-crimson-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Jasa Web Portofolio
      </motion.p>
      <motion.h2
        className="relative mx-auto max-w-6xl font-display leading-[0.9] tracking-[0.015em] text-bone"
        style={{ fontSize: 'clamp(2.15rem, 7.5vw, 7.5rem)' }}
        initial={{ opacity: 0, y: 35, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <span className="block">{portfolioServiceCTA.headlineLines[0]}</span>
        <span className="block text-crimson-2">{portfolioServiceCTA.headlineLines[1]}</span>
      </motion.h2>

      <motion.div
        className="relative mt-10 flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
      >
        <Magnetic>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            aria-label="Chat WhatsApp Teh Vini untuk dibuatkan web portofolio ala Netflix"
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-crimson px-9 py-4 text-base font-bold tracking-[0.04em] text-white shadow-[0_0_50px_rgba(229,19,43,0.5)] transition duration-300 hover:scale-[1.04] hover:bg-crimson-2 focus-visible:outline-offset-4 sm:text-lg"
          >
            {portfolioServiceCTA.buttonLabel}
            <span aria-hidden="true" className="text-xl">↗</span>
          </a>
        </Magnetic>
        <p className="text-xs font-medium tracking-[0.08em] text-mist sm:text-sm">Langsung chat Teh Vini lewat WhatsApp</p>
      </motion.div>

      <div className="relative mt-16 flex flex-wrap justify-center gap-6 text-xs font-semibold tracking-[0.24em] text-smoke">
        <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="hover:text-bone">
          ↺ TONTON LAGI
        </button>
        <button type="button" onClick={onReplay} className="hover:text-bone">
          ▶ ULANGI PEMBUKAAN
        </button>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <div className="mb-2 text-base">
          <SeriesMark />
        </div>
        <p className="text-[11px] leading-relaxed text-smoke">
          © {new Date().getFullYear()} {profile.displayName}. Portofolio personal bergaya layanan streaming — tidak berafiliasi dengan layanan streaming mana pun.
        </p>
        <p className="mt-1 text-[10px] text-smoke/70">Foto model pada demo ini masih aset sementara.</p>
      </footer>
    </section>
  );
}
