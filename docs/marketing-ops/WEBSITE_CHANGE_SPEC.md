# WEBSITE_CHANGE_SPEC — proposed changes for a separate developer pass

**Nothing here has been applied.** Project rules forbid changing application code during marketing tasks. Nir can approve this list and run it as a separate coding task (in a new session, with tests), or reject items. File paths come from my audit of the repo. Priority: P0 do first, P1 soon, P2 later.

| # | Pri | Change | Where | Notes / dependency |
|---|---|---|---|---|
| 1 | P0 | About page: "כ־7 שנות ניסיון" → "כ־8 שנות ניסיון" | `src/content/about-profile.ts` (line with `יש לי כ־7 שנות ניסיון`) | Per Nir. Also search tests (`src/test/about-page.test.tsx`) for the old text |
| 2 | P0 | Show business phone and WhatsApp: header or footer link, contact page block, and a floating or inline "WhatsApp" button with a prefilled message | `footer.tsx`, `contact/page.tsx`, new small component | **Number received: 052-251-8189 (WhatsApp: https://wa.me/972522518189).** Link format: `https://wa.me/972XXXXXXXXX?text=...` (number without 0 or +). Add to privacy text that WhatsApp (Meta) may process messages |
| 3 | P0 | Verify the live About page shows no bracket placeholders (`[שם מלא — נדרש להשלמה]`) | live site | A visual check only; the code should hide them |
| 4 | P0 | Google Search Console verification + submit sitemap | DNS or meta tag; Vercel env `SITE_INDEXING_ENABLED` must be `true` for the sitemap to have URLs | Owner action, no code needed for DNS method |
| 5 | P1 | CTA wording honesty: keep "לקביעת פגישת היכרות" if a booking link exists; otherwise "השאירו פרטים לתיאום פגישת היכרות" | `src/lib/routes.ts` (nav), `src/content/structure.ts` (`ctaLinks` labels) and `pages.json` | Copy changes in many places; the tests compare CTA text to the source |
| 6 | P1 | Booking link: embed or link a Google Calendar appointment schedule | contact page | CSP in `next.config.mjs` blocks third-party frames/scripts, so use a plain link first (no embed) |
| 7 | P1 | Hidden source fields in the form: capture `utm_source`, `utm_medium`, `utm_campaign` and referrer from the URL and include them in the owner email | `contact-form.tsx`, `src/lib/inquiry.ts`, `inquiry-email.ts`, `inquiry-handler.ts` | Update privacy policy to say campaign source is recorded |
| 8 | P1 | Auto-reply confirmation email to the sender (text in `OFFER_AND_COPY_DRAFTS.md`) | `src/lib/inquiry-handler.ts` | Only when the visitor gave an email. Needs a verified sender (already `website@posiblo.com`). Update privacy text and tests |
| 9 | P1 | Open Graph/Twitter image (1200×630, green palette + wordmark) and `metadataBase` | `src/app/layout.tsx`, new image | Needs a designed image; I can draft the layout brief |
| 10 | P1 | Shorten home meta description to about 135–150 characters (current: 178). Suggested: "יש תהליך שגוזל זמן או רעיון שרוצים להפוך למציאות? מתחילים בהבנת הבעיה ובונים פתרון מתאים: אוטומציה, מערכות, אתר או אינטגרציה." Count characters before use | `src/content/pages.json` → `home.description` | The copy-source test (`content-schema`) may compare to the original brief; update both |
| 11 | P1 | Structured data (JSON-LD): `ProfessionalService` (name, URL, areaServed Israel, no address), `FAQPage` on home | `src/app/layout.tsx` / home page | Do **not** add ratings, reviews, address or prices |
| 12 | P1 | AI crawler policy per `DECISIONS.md` | `src/app/robots.ts` | Verify bot names in each provider's docs. Allow search/answer agents; keep training bots blocked |
| 13 | P1 | Add the founder video (or a shorter cut) and a photo to `/about` | `about-profile.ts` (photo field), `introduction-video.tsx` | Needs approved photo and (ideally) captions with a transcript |
| 14 | P2 | Privacy-friendly analytics (cookieless) + conversion events: form submit success, WhatsApp click, phone click, booking-link click | layout + CSP (`next.config.mjs`) | CSP currently allows only same-origin scripts; adding a third-party script means editing it |
| 15 | P2 | Concrete outcome line in home hero for the chosen offer (after week 6 of validation), e.g. "אף ליד לא נשכח" style, only if true for the delivered solution | `pages.json` home | Wait for real client feedback |
| 16 | P2 | A dedicated landing page per validated offer (single CTA) | new route + sitemap | After the offer is chosen |
| 17 | P2 | Testimonials/case-study section | new component | **Only** with written permission and true facts. The `/testimonials` route currently redirects to `/about` |
| 18 | P2 | Update stale docs: `README.md` ("Posiblo_", launch blocked), `CHANGELOG.md` | repo docs | Housekeeping, no marketing effect |

**Process I recommend for execution:** one branch, items 1–3 and 5–8 first, run `npm run lint`, `npm test`, `npm run typecheck` and the e2e checks, then Nir previews the Vercel preview URL before merging. I will not deploy.

## Added 17 Nov 2026 — brand alignment
| # | Pri | Change | Where | Notes |
|---|---|---|---|---|
| 19 | P1 | Align the website to the official logo: replace the text wordmark "Posiblo." and the provisional green favicon with the real logo (SVG), change the palette from forest green to navy/blue (`#032756`, `#0060fc`, accents `#008ef9`/`#02b6fd`) | `src/app/globals.css` (CSS variables `--green`, `--ink`, `--accent-*`, hard-coded greens in many rules), `src/app/icon.svg`, `navigation.tsx`, `footer.tsx` | **Needs the vector logo file.** Check contrast ratios (WCAG AA), update the focus-ring colour and the dark "principle/closing" sections, and re-run the accessibility tests. Do not use cyan for text |
| 20 | P1 | Open Graph image: logo on white with the headline, 1200×630 | `src/app/layout.tsx` + new image | Same assets as #19 (supersedes the colours noted in #9) |
