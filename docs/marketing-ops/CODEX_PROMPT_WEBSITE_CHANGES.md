# Codex prompt — Posiblo website changes


## ROLE AND GOAL

You are a senior full-stack engineer working in an existing Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 + plain CSS codebase for **Posiblo (פוסיבלו)**, a one-person Hebrew-first RTL technology studio in Israel (owner: Nir Meir). Implement the website changes listed in "Scope" below. The visible site copy is Hebrew and must stay natural Hebrew with correct RTL handling. The source of truth for these requirements is `marketing-ops/WEBSITE_CHANGE_SPEC.md`; this prompt refines it with decisions already made by the owner.

## READ FIRST
1. `AGENTS.md` — it says this Next.js version has breaking changes. **Read the relevant guide in `node_modules/next/dist/docs/` before writing code**, especially metadata, `opengraph-image`/file conventions, `robots`, route handlers, and `next/image`.
2. `README.md`, `docs/Contact_Form_Setup.md`, `src/lib/*` (brand, site, routes, inquiry, inquiry-handler, inquiry-email, contact-config), `src/content/*`, `src/app/layout.tsx`, `src/app/globals.css`, `src/components/layout/*`, `src/components/contact-form.tsx`, and the tests in `src/test/` and `e2e/`.
3. `marketing-ops/WEBSITE_CHANGE_SPEC.md`, `marketing-ops/BRAND_GUIDELINES.md` (section 8), `marketing-ops/SEO_LIVE_AUDIT.md` (section 4), `marketing-ops/OFFER_AND_COPY_DRAFTS.md` (auto-reply text).

## HARD CONSTRAINTS (do not violate)
- **Never read, print, edit, create or commit `.env*` files, API keys, tokens or secrets.** Use `.env.example` as the only reference. Do not add secrets to the repo.
- **Do not deploy, push, merge, change Vercel/DNS/Resend/Upstash settings, send real emails, or call external APIs.** Tests use mocks.
- Work on a **new branch** `feature/marketing-website-updates`. Make small, logical commits. Do not push.
- **No new third-party scripts, trackers, cookies or analytics.** Keep the Content-Security-Policy in `next.config.mjs` unchanged unless a listed task strictly needs it (none should).
- **No invented facts:** no ratings, reviews, prices, client names, addresses, certifications or statistics anywhere (including structured data). The owner's address is private and must never appear.
- Keep legal pages `noindex`. Do not change `docs/legal-release-status.json`.
- Keep accessibility: skip link, focus styles, RTL, native `<details>` FAQ, form error summaries, `lang="he" dir="rtl"`.
- Keep every existing test passing unless the change deliberately alters the asserted behavior; then **update the test and say so in the report**. Do not weaken tests to make them pass.
- On Windows PowerShell use `npm.cmd` if `npm` is blocked.

## OWNER-CONFIRMED FACTS (use exactly)
- Business phone and WhatsApp (same number): display `052-251-8189`; `tel:+972522518189`; WhatsApp `https://wa.me/972522518189?text=` + URL-encoded Hebrew text `שלום, הגעתי מהאתר של Posiblo ואשמח לשוחח.`
- Public email (already in code): `posiblo.contact@gmail.com`.
- Reply promise: the owner replies to every enquiry **within one business day** (בתוך יום עסקים אחד).
- First meeting: free, about 45 minutes, online or face to face by arrangement.
- Experience: **8 years** (replace 7).
- Brand: navy `#032756`, blue `#0060fc`, mid blue `#008ef9`, cyan `#02b6fd`, light cyan `#1ef6fa` (cyan is for graphics only, never text on white).
- Do **not** publish the owner's city/address anywhere.

## SCOPE — implement in this order

### 1. About page: 7 → 8 years  (spec #1)
- `src/content/about-profile.ts`: change `כ־7 שנות ניסיון` to `כ־8 שנות ניסיון`.
- Update the assertion in `src/test/about-page.test.tsx`.
- Acceptance: no remaining "7 שנות" in `src/`.

### 2. Visible phone and WhatsApp  (spec #2)
- Add public contact constants in one place (e.g. `src/lib/brand.ts` or `src/lib/contact-public.ts`, **not** server-only): display phone, `tel` href, WhatsApp href, email.
- **Footer** (`src/components/layout/footer.tsx`): add two links: `וואטסאפ` (opens WhatsApp link in a new tab, `rel="noopener noreferrer"`) and the phone `052-251-8189` (`tel:` link, wrapped in `<bdi dir="ltr">`). Keep the footer layout tidy on mobile.
- **Contact page** (`src/app/contact/page.tsx`): above the form add a short block (heading `אפשר גם ליצור קשר ישירות`, then WhatsApp, phone and email links, one line saying `אני עונה לכל פנייה בתוך יום עסקים אחד.`). Make it a small reusable component (e.g. `src/components/contact-methods.tsx`) with tests.
- All links need accessible names (e.g. `aria-label="שליחת הודעה בוואטסאפ"`), visible focus, and a minimum 44px touch target.
- **Do not** add a floating/sticky chat widget.
- Privacy: in `src/app/legal/privacy/page.tsx` add one sentence that if the visitor contacts via WhatsApp, the message is also processed by WhatsApp (Meta) under its own terms. Change nothing else in the legal text. Adjust `src/test/legal-drafts.test.tsx` only if it asserts the exact text. **Mention in the final report that legal text was touched.**
- Acceptance: unit/component tests for the new block and footer; e2e checks that the three links exist with correct `href`s.

### 3. Source tracking in the lead form  (spec #7)
- In `contact-form.tsx`, on mount read `utm_source`, `utm_medium`, `utm_campaign` from `window.location.search` and the **referrer hostname only** (not the full URL). Send them as optional fields `source`, `medium`, `campaign`, `referrer` in the existing POST body. No cookies, no localStorage.
- `src/lib/inquiry.ts`: add the optional fields to the `Inquiry` type, `inquiryLimits` (max 100 chars each) and `validateInquiry` (strings only, trimmed, control characters rejected, allow letters/digits/`-_.`). Invalid tracking values must **not** block the submission: drop them silently.
- `src/lib/inquiry-email.ts`: append a line `מקור הפנייה: …` (only when present) to the owner email.
- Both API aliases (`/api/lead`, `/api/send-email`) keep working unchanged.
- Privacy page: add one sentence stating that the campaign source of the visit (if any) is recorded with the enquiry. (Same note as above in the report.)
- Tests: validation, email text, API contract, and form behavior (fields present in the request when the URL has UTM parameters; absent otherwise).

### 4. Auto-reply confirmation email  (spec #8)
- After the owner email is accepted by Resend in `src/lib/inquiry-handler.ts`, if `data.email` exists send a short confirmation to the visitor via the same Resend client and sender.
- **Never let the auto-reply break or delay the main flow:** send it after success is known, catch all errors, record an outcome with `recordContactOutcome` only if the existing helper supports it without leaking content, and still return `{ success: true }`.
- Use an idempotency key `bottomline-inquiry-autoreply/${submissionId}` so retries do not send twice.
- Plain-text only. **Do not include the visitor's message or any other submitted field**, and do not include their name unless sanitized (strip control characters, cap at 60 chars). `replyTo` = `posiblo.contact@gmail.com`.
- Subject: `קיבלתי את הפנייה שלך — Posiblo`
- Body (Hebrew, adapt greeting if the name is empty):
```
היי {שם},

תודה שפנית. קיבלתי את הפנייה ואחזור אליך בתוך יום עסקים אחד כדי לתאם פגישת היכרות.

הפגישה חינם, נמשכת כ־45 דקות, ואפשר לקיים אותה אונליין או פנים אל פנים בתיאום. אין צורך להכין כלום: מספיק לספר מה קורה היום ומה היית רוצה לשנות.

אם זה דחוף, אפשר לכתוב לי גם בוואטסאפ: 052-251-8189.

ניר מאיר
Posiblo
```
- It is a transactional reply to the visitor's own request. **No marketing content, no unsubscribe/newsletter language.**
- Abuse protection: reuse the existing rate limiting and honeypot; add a test showing the auto-reply is not sent when the owner email failed, when no email was given, or on a retried duplicate.
- Update the privacy notice in `contact-form.tsx` / privacy page: one sentence that a confirmation email is sent to the address provided.
- Tests with mocked Resend (follow `src/test/inquiry-transport.test.ts` and `resend-contract.test.ts`).

### 5. Share image + metadata  (spec #9, #20)
- Use the provided asset `marketing-ops/brand-assets/og-image-1200x630.png` (white background, logo, Hebrew headline). Place it where Next.js' metadata file convention expects it (e.g. `src/app/opengraph-image.png` plus `twitter-image.png`) with alt text `Posiblo — פתרונות טכנולוגיים לעסקים`, or declare `openGraph.images`/`twitter.images` explicitly in `pageMetadata`.
- Set `twitter.card` to `summary_large_image`.
- Add `metadataBase` **only when `siteOrigin()` is defined**, so the existing test "does not invent a canonical when origin is unknown" still holds.
- Keep canonical, robots and sitemap behavior and the nine-URL assertions intact; update `src/test/seo.test.ts` for the new image fields.

### 6. Home meta description  (spec #10)
- In `src/content/pages.json` set `home.description` to: `יש תהליך שגוזל זמן או רעיון שרוצים להפוך למציאות? מתחילים בהבנת הבעיה ובונים פתרון מתאים: אוטומציה, מערכות, אתר או אינטגרציה.` (target 135–155 characters; count and report the final length).
- Run `npm run content:check`. If it fails because `docs/BOTTOMLINE_WEBSITE_BRIEF.md` is the compared source, update the compared text in the brief and the generator expectations consistently (do not disable the check). Report what you changed.

### 7. Structured data (JSON-LD)  (spec #11)
- Add a small server component that renders `<script type="application/ld+json">` with escaped JSON (`JSON.stringify` and replace `<` with `<`).
- **All pages:** `ProfessionalService` with `name: "Posiblo"`, `alternateName: "פוסיבלו"`, `url: brand.origin`, `description`, `email`, `telephone: "+972-52-251-8189"`, `areaServed: {"@type":"Country","name":"Israel"}`, `inLanguage: "he"`, `founder: {"@type":"Person","name":"ניר מאיר"}`.
- **Home page only:** `FAQPage` generated **from `pages.home` FAQ items at build time** (question + plain-text answer), so it can never diverge from the visible FAQ.
- **Forbidden fields:** `address`, `aggregateRating`, `review`, `priceRange`, `openingHours`, `geo`.
- Tests: JSON parses, required fields present, forbidden fields absent, FAQ count equals the visible FAQ count.

### 8. AI-crawler policy in robots  (spec #12)
- `src/app/robots.ts`: keep the existing `*` rules. Add an explicit allow group for `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`. Keep the **training crawlers blocked**: `GPTBot`, `Google-Extended`, `ClaudeBot`, `CCBot`. Keep `sitemap`.
- Add a code comment: "bot names must be re-verified against each provider's documentation".
- Update the exact-equality assertions in `src/test/seo.test.ts`.
- Behavior when indexing is not authorized must stay: `{ rules: { userAgent: '*', disallow: '/' } }`.

### 9. Brand alignment to the new logo  (spec #19)
Assets (already approved by the owner): `marketing-ops/brand-assets/posiblo-logo.svg` (navy wordmark), `posiblo-logo-white-wordmark.svg`, `posiblo-mark.svg`, plus PNG fallbacks. They are vector redraws traced from the owner's image (approximate gradient); use as-is, do not "improve" the shapes.
- **Logo:** replace the text wordmark `Posiblo.` in `navigation.tsx` and `footer.tsx` with the SVG logo (inline SVG component or `next/image`), keep `aria-label="Posiblo — דף הבית"` and the link. Provide a white-wordmark variant where the background is dark.
- **Favicon:** replace `src/app/icon.svg` with the "P" mark (test that it renders in Chrome and Firefox; if the SVG `mask` fails in a browser favicon, provide a simplified solid-gradient version).
- **Palette** in `src/app/globals.css` and any hard-coded colors (also `src/app/about/about.module.css`): search all hex values. Map: `--ink`/dark → `#032756`; `--green` (primary buttons/links/accents) → `#0060fc`; hover `#194635` → `#004fd1`; page background `#f8f7f2` → `#ffffff`; section tint `#eaf0e8` → `#eef4ff`; alt section `#fffefa` → `#f7faff`; lines `#d6ddd5` → `#d9e2f0`; muted text `#435955` → `#3c4e6e`; light accent on dark sections `#b5d1b1` → `#8fc5ff`; pale button on dark `#d9e7cc` → `#dbe9ff` with navy text; focus ring `#977328` → a color with ≥3:1 contrast against both white and the blue buttons (suggest `#0b3d91` outline plus white offset), documented in a comment.
- **Never use cyan/light-cyan for text.** Check WCAG AA contrast (4.5:1 body text, 3:1 large text/UI) for every text/background pair, including the dark "principle" and "closing" sections and form error/consent text.
- Re-run the axe accessibility e2e checks. Update snapshot/color assertions if any test references the old colors.
- Update `marketing-ops`-independent docs only: `docs/Typography_Implementation.md` if it lists colors.

### 10. Housekeeping  (spec #18, optional, last)
- `README.md`: wordmark is now the logo image (not "Posiblo_"), and describe that legal release status is controlled by `docs/legal-release-status.json`. Keep it short. Skip if it creates noise.

## OUT OF SCOPE (do not implement)
Founder photo/video on About (#13), analytics (#14), hero outcome line (#15), landing pages (#16), testimonials (#17), booking-link embed (#6), CTA wording changes (#5; the owner has not decided — leave all CTA text as is), Search Console (#4, already done by the owner), any change to environment variables or hosting.

## VERIFICATION (all must pass, report the real output)
Run and report results of: `npm run lint`, `npm run typecheck`, `npm test`, `npm run content:check`, `npm run build:e2e`, `npm run test:e2e`. If something cannot run in the sandbox, say exactly why instead of claiming success.

Also check manually in a local browser at mobile (375px) and desktop widths: header/footer logo, footer contact links, contact page block, About page text, favicon, and page contrast. Confirm the page `<head>` of `/` contains `og:image`, `twitter:card=summary_large_image`, one `ld+json` ProfessionalService and one FAQPage, and that `/legal/privacy` is still `noindex`.

## DELIVERABLE
1. The branch with commits (do not push).
2. A short report in Markdown with: what changed per scope item, files touched, test results, any test you modified and why, anything you did not do and why, and anything the owner must decide (for example: whether the CTA wording should change, the 7-digit postcode/legal review of the two new privacy sentences).
3. Do **not** deploy. The owner will review the Vercel preview before merging.
