/**
 * CTA utama landing page PESONAFLIX, menuju jasa Teh Vini.
 * CTA di halaman pribadi klien menggunakan nomor pemiliknya sendiri melalui
 * clientWhatsapp.mjs, bukan nomor statis ini.
 */
export const portfolioServiceCTA = {
  headlineLines: ['MAU DIBUATIN', 'WEB SEPERTI INI ?'],
  buttonLabel: 'Mau Dibuatin',
  whatsappNumber: '62881022445869',
  whatsappMessage: 'Halo Teh Vini, saya mau dibuatin web portofolio PESONAFLIX seperti contoh ini. Boleh dibantu?',
} as const;

export function getPortfolioServiceWhatsappUrl(exampleUrl?: string) {
  const source = exampleUrl ? `\n\nContoh website yang saya lihat: ${exampleUrl}` : '';
  const message = `${portfolioServiceCTA.whatsappMessage}${source}`;
  return `https://wa.me/${portfolioServiceCTA.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
