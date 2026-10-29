/** Normalisasi nomor seluler Indonesia untuk tautan wa.me, tanpa menebak nomor. */
export function normalizeClientWhatsapp(value) {
  if (typeof value !== 'string' || !/^\+?[\d\s().-]+$/.test(value.trim())) return null;
  const digits = value.replace(/\D/g, '');
  const international = digits.startsWith('0') ? `62${digits.slice(1)}` : digits.startsWith('8') ? `62${digits}` : digits;
  return /^628\d{8,11}$/.test(international) ? international : null;
}

/** Slug adalah ID referral stabil; tautan saja bukan bukti komisi/penjualan. */
export function clientReferralCode(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return '';
  return `PSN-${slug.toUpperCase()}`;
}

export function getClientReferralWhatsappUrl({ whatsapp, ownerName, referralCode, exampleUrl }) {
  const number = normalizeClientWhatsapp(whatsapp);
  if (!number) return null;
  const name = typeof ownerName === 'string' && ownerName.trim() ? ownerName.trim() : 'Pemilik Website';
  const source = typeof exampleUrl === 'string' && /^https?:\/\//.test(exampleUrl) ? `\nContoh website: ${exampleUrl}` : '';
  const referral = typeof referralCode === 'string' && /^PSN-[A-Z0-9-]+$/.test(referralCode) ? `\nKode referral: ${referralCode}` : '';
  const message = `Halo Kak ${name}, saya lihat website profil Kakak dan ingin dibuatkan website PESONAFLIX seperti ini. Bisa dibantu?${source}${referral}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
