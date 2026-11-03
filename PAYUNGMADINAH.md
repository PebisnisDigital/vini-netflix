# Payung Madinah — authorized website mirror

This client website is mounted at `/azura` within the existing
PESONAFLIX Vite/Vercel project. The original owner approved replication.
The former `/payungmadinah` links permanently redirect to `/azura`.
The public brand name, logo, favicon and color scheme are AZURA Tour & Travel;
the original archive names remain unchanged for checksum integrity.

- Homepage plus 39 linked information, catalogue, campaign and article pages.
- WhatsApp buttons and all detected customer-service WhatsApp numbers have
  been changed to **+62 852-2200-5585** (`6285222005585`).
- All first-party static assets are local; no hotlinking to source images.
- Google Tag Manager, Hotjar and Facebook Pixel tracking belonging to the
  source website are intentionally excluded.
- The source server's POST forms **are not connected**: visitors are told the
  form was not submitted and offered WhatsApp instead. No form data is sent.
- Catalogues, prices, seats and old departure dates are a snapshot of the
  public source as captured November 3, 2026. Validate with the owner before
  accepting bookings; this is not a live travel booking backend.

## Build

`npm run build` first runs `scripts/unpack-payungmadinah.mjs` to verify and
unpack `payungmadinah-bundles/*.tar.gz`, then rename the generated directory to
`public/azura/`, update internal links and brand names, and inject
`branding/azura/theme.css` with the new logo assets. Vite then copies these pages
into `dist/azura/` with all other client routes.

The archives are checked with SHA-256 against the committed manifest, and
their paths are restricted to the `payungmadinah/` directory within the archives.

Updates to the mirrored site should be prepared and visually verified in a
separate prototype, then the bundles should be regenerated and committed.
