# PESONAFLIX landing page — design QA

**Final result: passed**

## Scope

- Design: **Cinema Showcase / Versi 1**. Netflix-inspired black, crimson, cinematic portraits and horizontal content rails.
- Preview route: `/` only. Existing `/vini`, `/iis`, `/citra`, and `/studio` remain unchanged.
- Content covers introduction, service deliverables, portfolio benefits, professional images, 50% affiliate opportunity, illustrative bonus ideas, real demo routes, sample testimonial layouts, how to order, and WhatsApp CTA.
- Motion update: parallax imagery, continuously scrolling card rails, repeating section stamp animation, cinematic image drift, and a larger, faster pulsing CTA.

## Design comparison evidence

- **Source visual truth:** `/workspace/scratch/f1f909124176/generated_images/exec-7324468f-f867-4bfc-b304-25e09ea43d80.png` (Cinema Showcase approved reference).
- **Implementation:** `http://terminal.local:4173/`; screenshots captured and visually inspected in the cloud browser on 29 October 2026. Browser-produced captures remain in the browser session and were not written as files.
- **Desktop:** approx. 1363 × 900 CSS px, browser density 1, screenshot inspected at original scale; full-view hero and focused example-card section compared to the source.
- **Mobile:** 375 × 812 CSS px iframe, density 1; hero and example-card section inspected. Mobile rearrangement is intentional for legibility and tap sizing.
- **State:** default dark theme; post-stamp resting states, active CTA pulse, examples rail after navigation/scroll. The supplied source is a static full-page design, so exact motion timing has no static visual comparison point.
- **Focused comparisons:** hero portraits/headline/CTA and horizontal portfolio examples; spacing and visual hierarchy match the selected direction. The page adds intermediate sections requested after the original visual was generated.

## Browser checks (29 October 2026)

| Check | Result | Notes |
| --- | --- | --- |
| Desktop hero | PASS | 1363px viewport; readable two-line headline and all three portfolio portraits visible. |
| Desktop section layout | PASS | Visually checked about, service, portfolio, partner, and example sections. |
| Mobile hero | PASS | 375px iframe viewport; portraits, text, and two CTAs remain within the viewport. |
| Mobile examples | PASS | Horizontal cards scroll with a visible next-card edge; Iis/Citra explicitly marked fictional demos. |
| Mobile navigation | PASS | Menu opens, closes after navigation and moves to the correct anchor. |
| Horizontal overflow | PASS | Mobile document width matches viewport at 375px; no page-wide sideways scrolling. |
| Example rail arrows | PASS | Clicking the next arrow changes `scrollLeft` from 2 to 118 on desktop. |
| External action | PASS | CTA targets the prepared WhatsApp URL for Teh Vini. |
| Claim transparency | PASS | Sample testimonials are visibly labeled simulations, bonus ideas are labeled examples, and partner terms need confirmation. |
| Section stamp animation | PASS | Intersection observer activates headings in view; 7s repeating stamp effect with reduced-motion override, verified in local browser. |
| Parallax | PASS | Scroll-based `--parallax-y` updated to -4.9px on a visible portfolio portrait; hero layers animate subtly. |
| Endless card loop | PASS | RequestAnimationFrame smoothly advances visible rails; measured live service rail position from 0 to 93px without interaction, with loop reset at repeat boundary. |
| CTA zoom | PASS | CSS animation `lp-cta-zoom` is active at 1.85s; stronger 9.5% pulse and larger hit area. |
| Production domain | PENDING | `pesonaflix.vercel.app/` still shows Coming Soon; the animated landing page is only on the preview branch pending Teh Vini's release approval. |
| Accessibility | PASS | Explicit reduced-motion CSS and autoplay guard; duplicate rail items hidden from accessibility tree and excluded from tab order. |
| Browser errors | PASS | No application JavaScript errors observed; only browser-extension metadata messages. |

## Fidelity surfaces

- **Fonts:** Nunito Sans headlines and Inter text remain readable; animation settles at the original size and wrapping.
- **Spacing:** section rhythm unchanged; enlarged CTA still fits beside the secondary link on 375px mobile.
- **Colors:** consistent near-black background, white titles, vivid red accent and CTA halo.
- **Images:** existing optimized WebP photos preserve detail; parallax scale prevents edge gaps.
- **Copy:** original PESONAFLIX offer, fictional demo labels, affiliate caveat and WhatsApp destinations remain unchanged.
- **P0/P1/P2 issues:** none remaining on the preview branch after mobile and loop checks. Production rollout is intentionally held for approval.

## Final release gate

- [x] Desktop and mobile visual review
- [x] Existing routes included in build
- [x] Verify + build succeed
- [ ] Teh Vini approves preview before publishing this landing page to the primary domain

Screenshots were reviewed interactively in the browser session; no screenshot files are committed to this repository.

---

## Klien `/vini2` — Netflix × Chibi (versi 1)

**Final result: passed** (29 Oktober 2026)

### Reference and implementation

- **Source of visual truth:** `/workspace/scratch/0b7a6af7a352/generated_images/exec-1870731f-f63d-433b-95cb-0143dc1489b4.png`; selected first mobile concept by Teh Vini.
- **Preview checked:** `https://vini-netflix-iccfhf491-jualdigital.vercel.app/vini2`.
- **Visual check:** browser screenshots inspected at 390 × 844 (mobile) and 1440 × 900 (desktop); mobile shows cinematic Vini chibi, oversized heading, two CTAs, and BADAI/PROMPTIONAL posters within the initial scroll. Desktop uses a two-column cinema composition without hiding the existing portfolio sections.
- **Refinement:** decreased the gap above the hero posters and increased name emphasis to better match the selected mockup. Source image content was used as original artwork with separate, selectable DOM text and working buttons.

### Functional and regression checks

| Check | Result | Evidence |
| --- | --- | --- |
| Route `/vini2` | PASS | Preview title “Teh Vini — THE SERIES”; page loads with chibi hero and sections. |
| Mobile navigation | PASS | Menu opens, reveals named sections, scrolls to Karya, then closes. |
| Desktop navigation | PASS | All eight named navigation buttons and collaboration control render. |
| Hero CTAs | PASS | “Kenalan Yuk” opens the original intro dialog; “Lihat Karya” scrolls to the Karya section. |
| Chibi project posters | PASS | BADAI poster opens the existing project dialog; PROMPTIONAL is rendered as another accessible project button. |
| WhatsApp referral | PASS | Final CTA directs to `wa.me/62881022445869` with source URL and `PSN-VINI2` referral code. |
| Continuous motion | PASS | CSS hero drift/breathing loops without an interactive playback control; `prefers-reduced-motion` disables nonessential movement. |
| Browser JavaScript errors | PASS | Browser error log returned an empty array. |
| Verification | PASS | `npm run verify`: TypeScript, client checks and Vite build succeeded; `/vini2/index.html` included. |
| Deployment | PASS | Vercel preview check for commit `b124355` reported success. |

### Fidelity notes

- **P0/P1/P2 issues:** none observed after the spacing refinement.
- **Intentional adaptation:** fully readable Indonesian personal-branding copy remains connected to the existing Netflix-style profile, episode rails, and original work, while vivid chibi imagery stays limited to `/vini2`.
- **Unchanged routes:** existing `/vini`, `/iis`, `/citra`, and Studio are handled by their original variants; no global style changes.
- **Production verification:** pending merge and post-merge smoke check of the public domain.

---

## Klien `/zainulhaq2` — PT Amarta Prima Persada replica

**Final result: passed** (2 November 2026)

### Reference and implementation

- **Source of visual truth:** `https://amartaprimapersada.com/`, inspected at desktop and mobile widths including the full desktop page.
- **Production route:** `https://pesonaflix.vercel.app/zainulhaq2` (with a second language at `/zainulhaq2/en/index.html`).
- **Implementation:** faithfully adapted the original HTML, CSS, animations, typography, mobile menu, FAQs, rental fleet cards and original image assets into isolated `public/zainulhaq2` files. Local relative paths, language switching and contact targets were made compatible with the nested route.
- **Authorized contact change:** all WhatsApp destinations, contact text, telephone links and structured data now use `+62 852-2200-5585` / `628522005585`.

### Functional and fidelity checks

| Check | Result | Evidence |
| --- | --- | --- |
| Desktop visual | PASS | Original and implementation hero, navigation, typography, vehicle carousel, floating WhatsApp button and section hierarchy inspected in browser. |
| Mobile visual | PASS | 390px viewport inspected; responsive 36px heading and off-canvas navigation render. |
| Mobile navigation | PASS | Menu button reveals Tentang, Armada, Skema Sewa, FAQ, Kontak and ID/EN language controls. |
| FAQ | PASS | FAQ accordion opens on interaction. |
| Indonesian production route | PASS | Public `/zainulhaq2` opens correct Amarta page with correct H1 and title; no `/index.html` suffix necessary. |
| English production route | PASS | Public `/zainulhaq2/en/index.html` opens English title and heading. |
| WhatsApp | PASS | All inspected live Indonesian and English `wa.me` links use `628522005585`; the prior number is not displayed. |
| Images | PASS | All 14 vendored WebP assets validated locally and included in the production build; 15 page images reference nested local assets. |
| External dependencies | PASS | Swiper, GSAP and AOS vendored under the nested route; original Google Fonts request retained. |
| Browser errors | PASS | Live Indonesian and English browser JavaScript error logs were empty. |
| Regression | PASS | `npm run verify` passed 13 suites and Vite production build completed. Existing PESONAFLIX clients kept unchanged. |
| Deployment | PASS | GitHub main commit `17591cac01f64bf1f067fef681cdd38c7f82d7dc` built and deployed to Vercel production with READY status and `pesonaflix.vercel.app` alias. |

### Fidelity surfaces and release gate

- **Typography:** original Poppins/Inter styling and heading hierarchy retained.
- **Spacing / colors:** original section rhythm, dark navy/gold hero, white backgrounds and card layouts retained.
- **Images:** original logo and vehicle/fleet imagery served from the isolated project route.
- **Content:** original bilingual copy, fleet, FAQ and contact-form structure retained; only contact data and nested URLs adapted.
- **P0/P1/P2 issues:** none identified in production smoke checks.
- **Release:** production alias and both language routes verified publicly.

---

## Klien `/asriwahyuni` — editorial personal-brand homepage

**Final result: passed** (3 November 2026; local design and interaction verification)

### Reference and implementation

- **Source of visual truth:** screenshot homepage supplied by Teh Vini on 3 November 2026 (cream rounded card, landscape portrait, oversized `Creativity. Business. Opportunities.`, black full-width CTA, and `About Me` below).
- **Implementation route:** `/asriwahyuni` only; custom `AsriLifestylePage` and scoped stylesheet; no global style changes to other PESONAFLIX profiles.
- **Image:** AI-assisted editorial landscape portrait of Ayu, `public/clients/asriwahyuni/hero-editorial.webp` (1400×788), alongside existing transparent original portrait on About Me.
- **Copy:** short homepage description matches the supplied reference, while the client's complete About Me, beRAni, culinary business, and three BNSP certification fields remain accessible below.

### Visual and functional checks

| Check | Result | Evidence |
| --- | --- | --- |
| Desktop hero | PASS | Cloud-browser screenshot on local preview at ~1363px showed balanced landscape portrait, light-cream card, large dark typography, and consistent horizontal spacing. |
| Mobile hero | PASS | 390px CSS viewport rendered in a real browser iframe, visually checked against the supplied screenshot: top brand label, landscape photo, two-line main headline, role, description, full-width dark CTA, then About Me. |
| Mobile About Me | PASS | Browser screenshot at 390px showed clean single-column layout, readable headings, original transparent portrait, and full story content without sideways clipping. |
| Mobile navigation | PASS | Menu expanded to four anchors; tapping About Me navigated to `#about` and collapsed the menu. |
| Primary CTA | PASS | Browser click navigated to `#about`. |
| Contact links | PASS | Accessibility tree confirmed WhatsApp `628116359997` and `mailto:footageayu@gmail.com`. |
| Studio integration | PASS | Editable name, portrait, headline, role, description, About Me, and work-card fields retain `data-studio-edit` hooks for the visual editor. |
| Asset format | PASS | Landscape image exported to WebP; original transparent portrait remains a WebP. |
| Regression | PASS | `npm run build` generated all existing client pages successfully. |

- **P0/P1/P2 issues:** none found in the inspected desktop and 390px mobile surfaces.
- **Production release:** tracked separately via GitHub/Vercel deployment; QA above refers to the local browser preview before publishing.

---

## Klien `/asriwahyuni` — expertise photographs and supporting documentation

**Final result: passed** (3 November 2026; browser-rendered desktop and mobile preview)

### Comparison targets

- **Visual reference:** user-supplied screenshot `upload/WhatsApp Image 2026-11-03 at 13.45.55 (1).jpeg`, 610×1356 pixels, depicting four expertise rows with left-aligned rounded thumbnails, right-side labels and descriptions, followed by Business & Ventures.
- **User assets:** actual filming photo, media article screenshot, founder-of-communities poster, Tangerang government certificate, and community Instagram screenshots supplied in this turn. Each converted to a WebP in `public/clients/asriwahyuni`.
- **Implementation:** local cloud-browser capture of `/asriwahyuni#expertise` at a 390×850 CSS-pixel iframe viewport (device scale 1), displayed within a desktop browser stage; additional desktop screenshot at approximately 1363×900 CSS pixels. Captures were visually inspected in the browser session and not exported to disk.
- **Normalization:** reference screenshot includes Android and ChatGPT chrome; comparison restricted to the page-owned section content. Image design, section order, and copy matched rather than reproducing device chrome.
- **State:** default light theme, four expertise images loaded, certification list, scrollable Business & Ventures gallery, and functional image links; after navigation from the mobile menu.

### Visual QA, iteration and interaction checks

| Surface | Result | Evidence / comparison |
| --- | --- | --- |
| Typography | PASS | Professional Expertise heading, four bold labels, quieter supporting text; mobile headline reduced from 37px two-line wrapping to ~31px one line to match the reference. |
| Spacing and layout | PASS | 390px browser screenshot shows 104px rounded square thumbnails on the left and consistent text groups on the right, separated by fine rules without horizontal clipping. Desktop uses a legible two-column grid. |
| Colors and tokens | PASS | Existing cream, taupe, charcoal and white editorial palette retained; no unrelated client styling changed. |
| Image quality and relevance | PASS | Source photos not replaced by stock images; filming photo under Content Creation, social/community poster under Digital Marketing, actual government certificate under UMKM Development, Instagram community screenshot under Business & MICE. All galleries link to full WebP versions. |
| Content | PASS | Expertise copy corresponds to four headings in source; gallery describes supplied media article, community poster, narasumber certificate, on-set photo, and community accounts without claiming independent verification of the screenshot content. |
| Mobile navigation | PASS | Browser menu exposes Expertise and Highlights; selecting Expertise updates iframe location to `#expertise` and closes menu. |
| Gallery | PASS | Browser screenshots show filming and media article cards; image lazy loading resolved after scroll and rendered crisp text/imagery. |
| Build regression | PASS | `npm run build` succeeded across all 53 client configs; this revision only adds scoped Ayu styles and assets. |

### Findings and fixes

- **[P2, fixed]** Mobile expertise heading initially wrapped into two lines, unlike the screenshot. Reduced only that section's mobile title size; post-fix browser screenshot shows one-line `Professional Expertise.` at 390px.
- **P0/P1/P2 remaining:** none observed in checked page regions.
- **P3:** proof cards are intentionally larger than the screenshot's thumbnail-only section, to keep article and certificate evidence accessible and readable.
- **Production release:** confirm separately after merge and production deployment.

---

## Klien `/asriwahyuni` — identity fidelity and corrected expertise mapping

**Final result: passed** (3 November 2026; 390px cloud-browser mobile preview)

- **User correction:** previous category photographs were misplaced. Use filming/laptop behind-the-scenes photo for **Digital Marketing**, original news article screenshot about 9 million views for **Content Creation**, government certificate for **UMKM Development**, and founder-of-three-communities poster for **Business & MICE**.
- **Identity source:** original user-submitted photo of Ayu on an outdoor staircase, wearing glasses and a patterned navy hijab. Generated 1:1 head-and-shoulders transparent WebP (`800×800`, `45,272 bytes`) and a consistent landscape editorial hero; AI-rendered hero labeled as a conceptual visual.
- **MICE poster:** corrected model face to the recognizable features of the user-provided Ayu reference while retaining the original three community names and branding; exported readable poster WebP (`1,050×1,149`).
- **Live mobile QA:** browser screenshot at the 390px iframe viewport confirms all four expertise images in corrected rows, clear text and dividers, responsive hero, and working `#expertise` navigation. No horizontal overflow observed.
- **Scope:** original photography and press clipping remain attributed only to the materials supplied by the user. No changes to other client pages.
- **Production release:** verify after GitHub merge and Vercel READY deployment.

---

## Klien `/asriwahyuni` — final correction: only original photo, no AI-modified model

**Visual asset QA: passed** (3 November 2026)

- **Latest client instruction supersedes earlier AI portrait request.** The actual user-provided 960×1280 stairway photo is the only source for the subject Ayu in the portrait, hero and community poster. No generative face replacement, skin alteration, garment replacement, or subject reconstruction is present in these three assets.
- **Portrait:** lossless-coordinate crop of original source at `300×300+305+500`, then resized to 800×800 WebP (39 KB). Source natural staircase background retained because user explicitly asked to change only zoom/crop; not transparent.
- **Hero:** original source crop `530×298+200+505`, resized to landscape WebP. No fake office or AI subject; copy explicitly states it is an unmodified person in the supplied photo.
- **Community/MICE poster:** restored original supplied poster and mechanically covered the unrelated model with a rectangular crop (`300×555+310+525`) of the actual stairway photo. Three community logos, account screenshots and business-vision copy remain in the poster.
- **Preview checks:** source-vs-final image side-by-side inspected; original face/hijab/denim preserved. Caution: close crop magnifies modest source resolution, so the actual photo looks softer than a regenerated AI portrait; preserving identity is intentional.
- **Other photos:** original digital marketing, content creation, UMKM supporting images and link mapping remain unchanged.
- **Release:** production deployment must be checked after GitHub merge.

---

## Klien `/asriwahyuni` — switch to ORIGINAL Netflix template

**Latest client brief** (3 November 2026; supersedes previous editorial-style design and prior portrait background decision)

- **Template:** remove the dedicated `AsriLifestylePage` rendering override; render the shared PESONAFLIX ORIGINAL Netflix experience with its default cinematic black-and-red theme, native hero, episodes, skill tabs and horizontal artwork rail. The Studio preview uses the same route and profile data.
- **Copy:** retain the client's full seven-paragraph `aboutMe`, original headline, roles, biographical summary, skill descriptions, beRAni, and food business descriptions from `asriwahyuni.json`.
- **Projects:** preserve the original four creative/business project cards and migrate all five previous documentary proof cards (on-set film crew, 9-million-view media clipping, three female communities, UMKM speaker certificate, and community Instagram snapshots) into the Netflix projects carousel. Each image-bearing project exposes a full-size image in its modal.
- **Expertise:** preserve the four named expertise areas and their exact descriptions as dark Netflix-styled documentary cards after the original skills interface. Photo mapping matches the client's latest correction.
- **Portrait:** crop the genuine submitted outdoor stairway JPG at `340×340+300+520`, preserve the photographic pixels of the actual person, mask the surrounding scene to transparency without generative reconstruction, and export a close-up `800×800` RGBA WebP at **25,622 bytes** (< 50 KB). The low-resolution original is intentionally not facially retouched, so facial features and clothes remain recognizably untouched.
- **Scope:** changes are specific to Asri's JSON, binary portrait, original-route conditional, documentary expertise component and Asri modal image behavior. Other client assets and templates stay as before.
- **Verification:** local `npm run verify` passed (full test suite, 53 client pages, Vite build). Deployment and mobile browser checks should be recorded after the PR is merged.

---

## Klien `/asriwahyuni` — genuine full-photo square crop (supersedes cutout)

**User correction** (3 November 2026): The previous close-up cutout makes Ayu's face appear soft/pixelated when shown large. Keep the *entire original photographic subject and staircase background*; change only the crop boundaries to a square.

- **Source:** the originally supplied 960×1280 outdoor-stairway JPG, unchanged facial details, clothing, lighting and surroundings.
- **Crop:** 960×960 at original coordinates `0,320` (full original horizontal resolution, **no enlargement**, head through shoes visible).
- **Export:** WebP 960×960, 178,906 bytes at the selected quality. This intentionally exceeds the old 50 KB portrait target to honor the client's newer and higher-priority request for sharpness. No transparent mask or generated subject.
- **Implementation:** replace only `public/clients/asriwahyuni/foto-profesional.webp` and correct its alt text; the original Netflix layout, copy and all nine projects remain unchanged.
