# PESONAFLIX landing page — design QA

## Scope

- Design: **Cinema Showcase / Versi 1**. Netflix-inspired black, crimson, cinematic portraits and horizontal content rails.
- Preview route: `/` only. Existing `/vini`, `/iis`, `/citra`, and `/studio` remain unchanged.
- Content covers introduction, service deliverables, portfolio benefits, professional images, 50% affiliate opportunity, illustrative bonus ideas, real demo routes, sample testimonial layouts, how to order, and WhatsApp CTA.

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

## Final release gate

- [x] Desktop and mobile visual review
- [x] Existing routes included in build
- [x] Verify + build succeed
- [ ] Teh Vini approves preview before publishing this landing page to the primary domain

Screenshots were reviewed interactively in the browser session; no screenshot files are committed to this repository.
