import { motion } from 'framer-motion';
import { usePortfolio } from '../data/PortfolioContext';
import { portfolioServiceCTA } from '../data/portfolioServiceCTA';
import { getClientReferralWhatsappUrl, normalizeClientWhatsapp } from '../utils/clientWhatsapp.mjs';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { SeriesMark } from './Poster';

export default function FinalCTA({ onReplay }: { onReplay: () => void }) {
  const { profile } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const isNoahInna = profile.clientSlug === 'noahinna';
  const isYudha = profile.clientSlug === 'yudhaandaka';
  const directContactPortfolio = isNoahInna || isYudha;
  const exampleUrl = typeof window === 'undefined' ? undefined : `${window.location.origin}${profile.clientSlug ? `/${profile.clientSlug}` : window.location.pathname}`;
  const contactName = normalizeClientWhatsapp(profile.whatsapp) === normalizeClientWhatsapp(portfolioServiceCTA.whatsappNumber) ? 'Teh Vini' : profile.displayName;
  const whatsappUrl = getClientReferralWhatsappUrl({
    whatsapp: profile.whatsapp, ownerName: profile.displayName, contactName,
    referralCode: profile.referralCode, exampleUrl,
  });
  const contactNumber = normalizeClientWhatsapp(profile.whatsapp);
  const directContactUrl = directContactPortfolio && contactNumber
    ? `https://wa.me/${contactNumber}?text=${encodeURIComponent(isNoahInna ? 'Hi Ain, I found your Noah Inna creative portfolio and would love to discuss a creative project.' : 'Halo Pak Yudha, saya melihat profil profesional Bapak di PESONAFLIX. Boleh berkenalan dan berdiskusi?')}`
    : null;

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
        {isNoahInna ? 'CONTACT ELECTRONIC TIGER CREATIVE STUDIO' : isYudha ? 'TERHUBUNG · YUDHA ANDAKA' : 'Jasa Web Portofolio'}
      </motion.p>
      <motion.h2
        className="relative mx-auto max-w-6xl font-display leading-[1.14] text-bone"
        style={{ fontSize: 'clamp(1.85rem, 5.1vw, 5rem)' }}
        initial={{ opacity: 0, y: 35, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <span className="block">{isNoahInna ? 'Have a Creative Idea?' : isYudha ? 'Pengalaman Membuka Percakapan.' : portfolioServiceCTA.headlineLines[0]}</span>
        <span className="block text-crimson-2 client-cta-headline">{isNoahInna ? "Let's Bring It to Life." : isYudha ? 'Mari Terhubung.' : portfolioServiceCTA.headlineLines[1]}</span>
      </motion.h2>

      <motion.div
        className="relative mt-10 flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
      >
        {(directContactPortfolio ? directContactUrl : whatsappUrl) ? <Magnetic>
          <a
            href={(directContactPortfolio ? directContactUrl : whatsappUrl) || '#contact'}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            aria-label={directContactPortfolio ? `Hubungi ${contactName} melalui WhatsApp` : `Chat WhatsApp ${contactName} untuk dibuatkan web portofolio PESONAFLIX`}
            className="client-cta-pulse inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-crimson px-9 py-4 text-base font-bold tracking-[0.04em] text-white shadow-[0_0_50px_rgba(229,19,43,0.5)] transition duration-300 hover:bg-crimson-2 focus-visible:outline-offset-4 sm:text-lg"
          >
            {isNoahInna ? 'Message Ain' : isYudha ? 'Hubungi Pak Yudha' : portfolioServiceCTA.buttonLabel}
            <span aria-hidden="true" className="text-xl">↗</span>
          </a>
        </Magnetic> : null}
        {directContactPortfolio && profile.email && <a className="text-sm font-semibold text-bone/85 underline decoration-white/40 underline-offset-4 hover:text-bone" href={`mailto:${profile.email}`}>{isNoahInna ? 'Email the Studio ↗' : profile.email}</a>}
        {isYudha && profile.secondaryEmail && <a className="text-sm font-semibold text-bone/85 underline decoration-white/40 underline-offset-4 hover:text-bone" href={`mailto:${profile.secondaryEmail}`}>{profile.secondaryEmail}</a>}
        {directContactPortfolio && whatsappUrl && <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 px-6 py-5 text-sm text-mist"><p>{isNoahInna ? 'Love this portfolio format?' : 'Ingin website personal seperti ini?'}</p><a className="mt-2 inline-flex font-bold text-bone underline decoration-crimson-2 underline-offset-4" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{isNoahInna ? 'Get Your Own ↗' : 'Buat Web Serupa ↗'}</a></div>}
        {!whatsappUrl && <p className="text-xs font-medium tracking-[0.08em] text-mist sm:text-sm">Nomor WhatsApp pemilik website belum tersedia.</p>}
      </motion.div>

      <div className="relative mt-16 flex flex-wrap justify-center gap-6 text-xs font-semibold tracking-[0.24em] text-smoke">
        <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="hover:text-bone">
          ↺ {isNoahInna ? 'BACK TO TOP' : 'TONTON LAGI'}
        </button>
        <button type="button" onClick={onReplay} className="hover:text-bone">
          ▶ {isNoahInna ? 'REPLAY INTRO' : 'ULANGI PEMBUKAAN'}
        </button>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <div className="mb-2 text-base">
          <SeriesMark />
        </div>
        <p className="text-[11px] leading-relaxed text-smoke">
          {isNoahInna ? `© ${new Date().getFullYear()} ${profile.displayName}. Created by Electronic Tiger Creative Studio. Independent creative portfolio.` : `© ${new Date().getFullYear()} ${profile.displayName}. Portofolio personal bergaya layanan streaming — tidak berafiliasi dengan layanan streaming mana pun.`}
        </p>
      </footer>
    </section>
  );
}
