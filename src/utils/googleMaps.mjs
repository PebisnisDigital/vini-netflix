/** Hanya tautan Google Maps HTTPS yang boleh menjadi tujuan lokasi publik. */
export function isGoogleMapsUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return false;
    if (url.hostname === 'maps.app.goo.gl') return url.pathname.length > 1;
    return ['google.com', 'www.google.com', 'maps.google.com'].includes(url.hostname)
      && (url.pathname === '/maps' || url.pathname.startsWith('/maps/'));
  } catch { return false; }
}

/** Pakai koordinat viewport dari tautan publik; jangan menganggapnya alamat toko terverifikasi. */
export function googleMapsEmbedFromUrl(value) {
  if (!isGoogleMapsUrl(value)) return null;
  const url = new URL(value);
  const match = decodeURIComponent(url.pathname).match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(\d{1,2})z)?/);
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  const zoom = match[3] ? Number(match[3]) : 15;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || zoom < 1 || zoom > 21) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}&z=${zoom}&output=embed`;
}
