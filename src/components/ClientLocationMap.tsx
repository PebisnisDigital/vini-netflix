import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../data/PortfolioContext';
import { googleMapsEmbedFromUrl, isGoogleMapsUrl } from '../utils/googleMaps.mjs';

/** Bagian lokasi opsional yang juga tampil dalam kanvas Studio. */
export default function ClientLocationMap() {
  const { profile } = usePortfolio();
  const mapUrl = profile.googleMapsUrl;
  if (!mapUrl || !isGoogleMapsUrl(mapUrl)) return null;
  const embedUrl = googleMapsEmbedFromUrl(mapUrl);
  const placeName = profile.googleMapsLabel?.trim() || profile.displayName;

  return (
    <section id="lokasi" aria-label={`Lokasi ${placeName}`} className="relative isolate overflow-hidden bg-[#101413] px-4 py-20 text-white sm:px-8 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(205,170,108,0.14),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}>
          <div className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#d6b780]"><MapPin size={17} /> Lokasi Usaha</div>
          <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">Temukan <span className="text-[#d6b780]">{placeName}</span></h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">{profile.location}. Lihat area lokasi pada peta, lalu konfirmasikan alamat kunjungan langsung melalui kontak pemilik usaha.</p>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full border border-[#d6b780]/65 bg-[#d6b780] px-6 py-3 text-sm font-extrabold text-[#19211c] transition hover:bg-[#f1d39b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6b780]">
            <Navigation size={18} /> Buka Maps <ArrowUpRight size={17} />
          </a>
          <p className="mt-4 text-xs leading-relaxed text-white/45">Titik peta mengikuti tautan yang diberikan. Pastikan alamat sebelum berkunjung.</p>
        </motion.div>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#d6b780]/30 bg-[#212a26] p-2 shadow-[0_25px_90px_rgba(0,0,0,0.4)] sm:p-3">
          {embedUrl ? (
            <iframe title={`Peta area ${placeName}`} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="block h-[330px] w-full rounded-[1.2rem] border-0 sm:h-[430px]" />
          ) : (
            <div className="flex h-[330px] flex-col items-center justify-center gap-4 rounded-[1.2rem] bg-gradient-to-br from-[#30463c] to-[#17251e] px-8 text-center sm:h-[430px]">
              <MapPin className="text-[#d6b780]" size={50} strokeWidth={1.5} />
              <p className="text-lg font-bold">{placeName}</p>
              <p className="max-w-xs text-sm text-white/65">Buka lokasi melalui tombol Google Maps di sebelah peta.</p>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 px-3 py-3 text-xs text-white/60"><span>{placeName}</span><span>GOOGLE MAPS</span></div>
        </div>
      </div>
    </section>
  );
}
