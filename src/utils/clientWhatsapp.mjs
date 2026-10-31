/** Normalisasi nomor seluler Indonesia, Singapura, atau Brunei untuk wa.me, tanpa menebak nomor. */
export function normalizeClientWhatsapp(value) {
  if (typeof value !== 'string' || !/^\+?[\d\s().-]+$/.test(value.trim())) return null;
  const digits = value.replace(/\D/g, '');
  const international = digits.startsWith('0') ? `62${digits.slice(1)}` : digits.startsWith('8') ? `62${digits}` : digits;
  if (/^628\d{8,11}$/.test(international)) return international;
  // Nomor seluler Singapura memiliki delapan digit, biasanya dimulai 8 atau 9.
  if (/^65[89]\d{7}$/.test(digits)) return digits;
  // Nomor seluler Brunei memiliki tujuh digit, diawali 7 atau 8.
  if (/^673[78]\d{6}$/.test(digits)) return digits;
  return null;
}

/** Slug adalah ID referral stabil; tautan saja bukan bukti komisi/penjualan. */
export function clientReferralCode(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return '';
  return `PSN-${slug.toUpperCase()}`;
}

export function getClientReferralWhatsappUrl({ whatsapp, ownerName, contactName, referralCode, exampleUrl }) {
  const number = normalizeClientWhatsapp(whatsapp);
  if (!number) return null;
  const owner = typeof ownerName === 'string' && ownerName.trim() ? ownerName.trim() : 'Pemilik Website';
  const contact = typeof contactName === 'string' && contactName.trim() ? contactName.trim() : owner;
  const isSingapore = number.startsWith('65');
  const greeting = isSingapore ? `Hi ${contact}` : contact.toLowerCase() === 'teh vini' ? 'Halo Teh Vini' : `Halo Kak ${contact}`;
  const page = owner.toLowerCase() === contact.toLowerCase() ? 'website profil Kakak' : `website ${owner}`;
  const source = typeof exampleUrl === 'string' && /^https?:\/\//.test(exampleUrl) ? `\n${isSingapore ? 'Example website' : 'Contoh website'}: ${exampleUrl}` : '';
  const referral = typeof referralCode === 'string' && /^PSN-[A-Z0-9-]+$/.test(referralCode) ? `\n${isSingapore ? 'Referral code' : 'Kode referral'}: ${referralCode}` : '';
  const message = isSingapore
    ? `${greeting}, I saw ${owner}'s portfolio and would like to ask about creating a PESONAFLIX-style website. Could you help?${source}${referral}`
    : `${greeting}, saya lihat ${page} dan ingin dibuatkan website PESONAFLIX seperti ini. Bisa dibantu?${source}${referral}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
