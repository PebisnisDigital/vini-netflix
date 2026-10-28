/**
 * CTA jasa pembuatan portfolio, dipakai bersama di semua halaman klien.
 * Jangan mengganti nomor ini dengan nomor pemilik portfolio (/vini, /satria,
 * dan seterusnya); pengunjung diarahkan ke jasa Teh Vini.
 */
export const portfolioServiceCTA = {
  headlineLines: ['MAU DIBUATIN', 'WEB SEPERTI INI ?'],
  buttonLabel: 'Mau Dibuatin',
  whatsappNumber: '6282137523626',
  whatsappMessage: 'Halo Teh Vini, saya mau dibuatin web portofolio PESONAFLIX seperti contoh ini. Boleh dibantu?',
} as const;

export function getPortfolioServiceWhatsappUrl(exampleUrl?: string) {
  const source = exampleUrl ? `\n\nContoh website yang saya lihat: ${exampleUrl}` : '';
  const message = `${portfolioServiceCTA.whatsappMessage}${source}`;
  return `https://wa.me/${portfolioServiceCTA.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
