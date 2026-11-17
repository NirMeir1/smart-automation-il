# Posiblo website changes — 17 November 2026

Follow-up: contact methods now have matching local SVG phone, WhatsApp and envelope icons, preserving visible labels and accessible names. Customer confirmations now include HTML with explicit Hebrew RTL/right alignment, an isolated LTR phone and the approved PNG logo embedded through a CID attachment. This supersedes the original plain-text-only confirmation requirement at the owner's request; a plain-text fallback remains and ends with Nir's name, without a final text wordmark. No visitor content enters either version. Both API build traces include the PNG. Browser previews confirmed mobile/desktop contact layout and the RTL email layout; these are previews, not live inbox delivery. Follow-up checks passed: lint, typecheck, content check, build, **291 unit tests**, and **158 browser tests with 5 existing skips**. New email presentation tests and the intercepted SDK transport test check direction, signature and PNG attachment encoding. Nothing was sent or deployed.

Implemented locally on `feature/marketing-website-updates`. No push, merge, deployment, hosting changes, external API calls or real email delivery were performed. Existing untracked `marketing-ops/` files were left outside the commits. Approved assets were copied into the application unchanged.

| Scope | Result and files |
| --- | --- |
| 1. Experience | About now says כ־8 שנות ניסיון. Updated `src/content/about-profile.ts` and `src/test/about-page.test.tsx`; no `7 שנות` remains in `src/`. |
| 2. Direct contact | Central public constants in `src/lib/contact-public.ts`; reusable `src/components/contact-methods.tsx`; added the block above the contact form in `src/app/contact/page.tsx` and phone/WhatsApp links in `src/components/layout/footer.tsx`. Accessible names, LTR phone/email, 44px minimum link height, safe new-tab WhatsApp link. |
| 3. Attribution | `src/components/contact-form.tsx` captures mount-time UTMs and referrer hostname in memory. `src/lib/inquiry.ts` silently drops invalid optional values; each is capped at 100 characters. `src/lib/inquiry-email.ts` includes attribution only when present. Both API aliases remain supported. |
| 4. Confirmation | `src/lib/inquiry-handler.ts` uses Next `after()` after owner acceptance; confirmation cannot delay the successful response. `src/lib/inquiry-autoreply.ts` supplies fixed plain Hebrew text, with no submitted fields or name. Same sender/client, public mailbox Reply-To, separate required idempotency key. An atomic 25-hour Redis claim prevents repeat attempts across instances; development uses bounded memory. Failures are best effort, without retrying confirmation on form resubmission. `src/lib/contact-diagnostics.ts` records content-free outcomes. |
| 5. Share metadata | Approved 1200×630 asset at `public/brand/og-image-1200x630.png`; explicit OG/Twitter image, alt text and large-image card in `src/lib/site.ts`. `metadataBase` exists only with a valid configured origin. |
| 6. Description | Exact requested Hebrew text in `src/content/pages.json`: **125 characters**, despite the prompt's 135–155 target. Updated the matching description in `docs/BOTTOMLINE_WEBSITE_BRIEF.md`. Generator code and expectations needed no changes; regeneration agrees. |
| 7. JSON-LD | `src/components/structured-data.tsx` safely escapes `<`. `src/app/layout.tsx` renders one ProfessionalService in the head. `src/app/@structuredData/{page.tsx,default.tsx,[...path]/page.tsx}` provides home-only FAQ data in the head and clears it on navigation. FAQ answers derive from visible content; no prohibited business claims or address fields. |
| 8. Crawlers | `src/app/robots.ts` explicitly allows the three requested search bots, retaining private-route exclusions, training-bot blocks and sitemap. Unauthorized indexing still returns the original wildcard disallow object. Added the requested provider-verification comment. |
| 9. Branding | Approved SVGs in `public/brand/`; `src/components/brand-logo.tsx` supports navy and white wordmarks. Updated header/footer, `src/components/layout/footer-top-link.tsx`, `src/app/icon.svg` and the palette in `src/app/globals.css`. Both backgrounds currently use the navy wordmark. No hard-coded colors existed in `src/app/about/about.module.css`; no color list required changes in `docs/Typography_Implementation.md`. |
| 10. Housekeeping | `README.md` describes the SVG logo and the existing legal-release JSON control. |

**Legal text was touched:** exactly three sentences were added to `src/app/legal/privacy/page.tsx`, covering campaign/referrer source, confirmation email and WhatsApp (Meta) processing. The form also discloses confirmation email. Existing legal text and `docs/legal-release-status.json` were preserved. `src/app/legal/terms/page.tsx` only changes its existing internal privacy link to Next Link; its wording is unchanged. `src/components/introduction-video.tsx` similarly uses Link for the accessibility destination. These internal links became lint findings after adding the head slot's catch-all route. Contact fragment CTAs retain native anchors because Next Link reproduced `#inquiry#inquiry` on repeated navigation; regression checks pass.

## Verification

| Command | Final observed result |
| --- | --- |
| `npm.cmd run lint` | Exit 0; no errors or warnings. |
| `npm.cmd run typecheck` | Exit 0; route generation and both TypeScript projects passed. |
| `npm.cmd test` | 19 files, **289 tests passed**. |
| `npm.cmd run content:check` | Exit 0: `Reviewed content and regeneration agree.` |
| `npm.cmd run build:e2e` | Exit 0; optimized Next 16.4.2 build and 18 generated pages completed. |
| `npm.cmd run test:e2e` | Exit 0: **158 passed, 5 skipped (1.4m)**. Chromium desktop/mobile/tablet, Firefox, WebKit and all configured form projects. |

The five skips are existing conditions: mobile-menu-only test on four nonmobile projects, and Windows WebKit's unsupported native MP4 playback. No new skips were added. Real Safari playback remains outside this Windows run.

Browser runs use the existing `.tools/playwright-browsers` cache and Node 24.22.0 from `.tools/node-v24.22.0-win-x64`, selected through process-only `PLAYWRIGHT_BROWSERS_PATH` and `PATH`. Initial runs failed because of sandbox/cache access, missing default-cache Firefox/WebKit revisions, and sandboxed Firefox target crashes. The final full suite ran outside the sandbox with the repository's matching cached binaries; no downloads were needed. Existing build scripts supply fixture delivery settings. No environment files were directly opened or changed; Next's standard build reported automatically loading the existing `.env.local` file. Tests mock or intercept provider traffic.

Existing tests modified deliberately:

- `src/test/about-page.test.tsx`: owner-confirmed eight-year assertion.
- `src/test/seo.test.ts`: exact crawler policy, share-image fields and conditional metadata base; nine sitemap URLs and unknown-origin protection remain asserted.
- `src/test/contact-form.test.tsx`: UTM/referrer capture, omitted absent values, hostname-only disclosure and no browser storage.
- `src/test/inquiry-validation.test.ts`, `src/test/inquiry-email.test.ts`, `src/test/inquiry-api.test.ts`: safe attribution, silent rejection of malformed optional data, owner text and both aliases.
- `src/test/inquiry-transport.test.ts`: queued post-response work, intercepted real SDK confirmation headers/body, owner failure, missing email, duplicate retry, rejected/thrown/stalled confirmation behavior.
- `e2e/site.spec.ts`: approved direct links and image decoding, real head/schema checks, navigation clearing, expected blue palette. External link exceptions match only the two approved contact hrefs. Root canonical expectation accounts for Next's normalization to an origin without trailing slash when metadataBase is supplied; all other canonical expectations and sitemap inventory remain intact.
- `e2e/contact-flow.spec.ts`: exact disabled-button color updated to the new neutral palette.

New tests: `src/test/contact-methods.test.tsx`, `src/test/structured-data.test.tsx`, `src/test/inquiry-autoreply.test.ts`. Existing `resend-contract.test.ts` and legal tests pass unchanged.

## Browser and contrast evidence

Browser plugin was not available; used installed Playwright. The flow checked was home/contact/about → navigation and contact controls → correct identity, accessible controls, metadata and preserved RTL. Manually inspected local desktop (1440×1000) and mobile (375×812) screenshots of the header/footer logos, direct-contact block and About text. No clipping or horizontal overflow was observed. The headed preview logged no page errors. Existing browser tests also check console errors, skip-link/FAQ/menu interactions, all public/legal routes and axe WCAG A/AA results.

Verified `/` head contains `og:image`, `twitter:card=summary_large_image`, one ProfessionalService and one FAQPage. Other pages clear FAQPage during navigation. Privacy remains `noindex, nofollow`. Chrome-engine and Firefox image decoding/canvas checks render visible pixels from the actual SVG favicon, including its mask; no simplified fallback was needed.

Calculated WCAG contrast for the final palette: white/primary blue 5.15:1; blue/pale section 4.66:1; navy/light backgrounds at least 10.54:1; muted text/used backgrounds at least 6.93:1; error text/error background 6.90:1; pale index/navy 8.12:1. Secondary-hover text uses deeper blue to maintain AA. Focus uses deep navy `#001b40` with a white halo to contrast with both white and blue controls and remain visible on dark sections. Cyan is confined to supplied logo graphics. Axe checks passed across the configured routes and browsers.

Screenshots were saved outside the repository in the local temporary `posiblo-qa` directory: `home-desktop.png`, `contact-desktop.png`, `footer-desktop.png`, `contact-mobile.png`, `contact-methods-mobile.png`, `footer-mobile.png`, `about-mobile.png`. The local headed preview is at `http://127.0.0.1:3102`.

## Owner review and limits

- Review the three privacy additions; no legal approval or release-status change is asserted.
- The exact supplied meta description is shorter than the numeric target. Decide separately if a longer version is desired.
- Provider bot names were implemented as requested, without external documentation calls under this task's offline constraint; re-verify against provider documentation before publishing.
- Confirmation is best effort. A failed claim/delivery does not affect the owner inquiry, and the at-most-once claim intentionally suppresses automatic retry. No live delivery is claimed.
- CTA wording, photo/video work, analytics, landing pages, testimonials, booking embeds, Search Console and hosting remain outside this change. No postcode is needed or published because the private address is excluded.
- Owner preview and merge/deployment review remain to be performed separately. No push or deployment was made.
