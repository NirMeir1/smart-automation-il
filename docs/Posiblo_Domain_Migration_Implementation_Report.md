# Posiblo — Domain Migration Implementation Report

**Date:** 10 November 2026  
**Branch:** `re-branding`  
**Primary website:** `https://posiblo.com`  
**Business contact and inquiry recipient:** `posiblo.contact@gmail.com`  
**Automated sender:** `website@posiblo.com` through Resend

This report records the completed local implementation and verification from the preceding work. Saving this report did not rerun the checks or change deployment settings.

## A. Changes implemented

- Updated `src/lib/brand.ts` to use `https://posiblo.com`. The existing metadata, sitemap, robots, and indexing logic now recognize the new canonical production origin.
- Updated `src/lib/contact-config.ts` to deliver inquiries to **posiblo.contact@gmail.com**.
- Set the documented sender to **website@posiblo.com**, preserving environment-based sender configuration and the visitor's validated email as Reply-To.
- Updated the privacy draft's recipient without removing its draft notice or noindex safeguard.
- Updated `.env.example`, `README.md`, `docs/Contact_Form_Setup.md`, `docs/BOTTOMLINE_WEBSITE_BRIEF.md`, `scripts/verify-release.mjs`, and related tests.
- Documented that Google Workspace was cancelled and is not used. The receiving inbox is a free personal Gmail account; Resend sending authorization remains a separate requirement.
- Preserved the existing rebranding work, nine public routes, API contracts, strict origin checks, Redis namespaces, rate limiting, validation, consent handling, retries, and Resend idempotency identifiers.
- Preserved the existing GitHub repository and Vercel project. No competing host redirect rules were introduced.

No private environment files, dependencies, external settings, commits, pushes, or deployments were changed. No real inquiry or email was submitted.

### Files updated for the domain and email fixes

| File | Change |
|---|---|
| `src/lib/brand.ts` | Canonical origin and redirect-alias comment. |
| `src/lib/contact-config.ts` | Fixed inquiry recipient. |
| `src/app/legal/privacy/page.tsx` | Verified recipient reference in the existing draft. |
| `.env.example` | New public origin and approved sender; conservative indexing/form defaults retained. |
| `README.md` | Domain/email configuration, deployment checklist, historical-evidence clarification. |
| `docs/Contact_Form_Setup.md` | Current Gmail/Resend setup, existing-service reuse, and authorized live-test instructions. |
| `docs/BOTTOMLINE_WEBSITE_BRIEF.md` | Superseding owner decision for the new origin and email configuration. |
| `scripts/verify-release.mjs` | New-domain sitemap and Open Graph assertions. |
| `src/test/seo.test.ts` | New canonical origin, Open Graph URLs, and old/alternate-host indexing rejection. |
| `src/test/contact-config.test.ts` | Approved production configuration and log-redaction assertions. |
| `src/test/inquiry-api.test.ts` | Approved recipient, canonical production-origin acceptance through both API aliases, and noncanonical-origin rejection. |
| `src/test/inquiry-transport.test.ts` | Real SDK transport assertions for approved sender/recipient with intercepted HTTP. |

Previously uncommitted rebranding changes remain in the working tree. This list identifies the additional domain/email implementation work; it is not a claim that all current Git differences originated in this task.

## B. Verification results

Commands used the existing local Node 24.22.0 tooling and `npm.cmd` where PowerShell execution policy blocks `npm.ps1`. No dependencies or browser binaries were installed.

| Check | Result |
|---|---|
| `npm run content:generate` | Passed; generated and validated all nine public pages. |
| `npm run content:check` | Passed; source and generated content agree. |
| `npm run lint` | Passed. |
| `npm run typecheck` | Passed. |
| `npm test` | **225 tests passed across 14 test files.** |
| `npm run build` | Passed with transient production-origin/sender settings and contact submission disabled for local verification. Private environment files were not edited. |
| `npm run build:e2e` | Passed using the existing isolated fixture configuration. |
| Selected Chromium end-to-end projects | **64 passed, 2 intentional skips, 0 failures.** |
| `npm run verify:release` | Passed. |
| `git diff --check` | Passed. |

The end-to-end invocation was:

```sh
npm run test:e2e -- --project=desktop --project=tablet --project=mobile --project=contact-chromium --project=contact-mobile
```

The two skips are the mobile-only disclosure test in the desktop and tablet projects. The mobile project exercised that interaction.

### SEO and rendered-page validation

The release verifier confirmed:

- All nine public pages render successfully with Posiblo branding.
- Canonical URLs use `https://posiblo.com` with the existing matching paths.
- Open Graph URLs and site-name metadata use the new domain and Posiblo identity.
- Sitemap URLs and the robots sitemap reference agree on the new domain.
- Production indexing works with explicit authorization; unit tests retain preview/development restrictions and reject old/alternate hosts for indexing.
- Legal pages retain noindex behavior.
- Existing application redirects, 404 behavior, and 24 internal links/fragments remain intact.
- Edge desktop/mobile navigation from service pages to Process to Contact works without reported application errors.

The Chromium suite also checked responsive layouts, Hebrew RTL, metadata, accessible navigation, keyboard behavior, FAQ controls, and axe accessibility results.

The host-level Vercel domain redirects were preserved by leaving external settings untouched. They were verified in the earlier audit, not revalidated against live production as part of this local implementation run.

### Contact-form validation

New and existing automated checks verified:

- Requests from `https://posiblo.com` are accepted under fully configured, mocked production conditions through both `/api/lead` and `/api/send-email`.
- Old-domain origins, the `www.posiblo.com` alias, an unrelated lookalike origin, and a missing origin are rejected with 403 when the configured production origin is the canonical apex domain.
- Both API aliases preserve the existing contract and route to the approved recipient.
- The sender is `Posiblo <website@posiblo.com>` when configured with the approved sender address.
- Visitor Reply-To behavior remains intact.
- Rate limiting, validation, consent, provider acceptance/error handling, retry identity, and existing idempotency behavior remain protected by tests.
- The installed Resend SDK's transport payload is checked using intercepted HTTP, not live delivery.

### Remaining verification limits

- Previously documented Firefox page-creation crashes and WebKit local-HTTP/production-CSP HTTPS-upgrade failures were **not rerun**. This run does not establish full Firefox or WebKit coverage.
- Live Resend domain authorization, API-key permissions, production configuration, and actual Gmail receipt remain unverified.
- No real inquiry or mailbox-delivery test occurred.
- Local success does not prove that the reviewed revision is deployed or that live production metadata has changed.
- Legal approval remains outstanding; this work does not claim compliance or approval.
- Generated changes to `next-env.d.ts` introduced by local checks were restored, keeping that unrelated file out of the final diff.

## C. Remaining manual actions

The following is an ordered checklist. No listed external action was performed by this implementation.

1. **Vercel project and source — needs verification.** Confirm the existing GitHub connection, Production branch, root directory, build settings, Node runtime, and promotion behavior. Confirm which reviewed revision should be released. The local branch is `re-branding`; it is not proof that this is Vercel's Production branch.
2. **Production configuration — confirmed requirement; actual settings need verification.** Verify:

   ```env
   NEXT_PUBLIC_SITE_URL=https://posiblo.com
   CONTACT_FROM_EMAIL=website@posiblo.com
   SITE_INDEXING_ENABLED=true
   CONTACT_FORM_ENABLED=true
   ```

   `SITE_INDEXING_ENABLED=true` applies to the approved indexable Production release. Enable `CONTACT_FORM_ENABLED` only after delivery configuration is ready. Keep previews/development non-indexable.

3. **Private integration settings — needs verification.** Verify the existing `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and shared `CONTACT_RATE_LIMIT_SECRET` of at least 32 characters. Verify trusted-ingress behavior before setting `CONTACT_TRUST_PROXY=true`. Do not disclose or rotate secrets merely because of the rebrand. The recipient is fixed in source; `CONTACT_FROM_EMAIL` controls the sender, not the recipient.
4. **Resend and DNS — confirmed requirement; provider verification needs checking.** Verify `posiblo.com` sending authorization for `website@posiblo.com` and publish Resend's exact required authentication records at authoritative DNS if needed. Preserve unrelated records. **Google Workspace is not used; no Google Workspace MX configuration or paid receiving mailbox is required.**
5. **Authorized source release — requires separate authorization.** Review the full working-tree diff, including the earlier uncommitted rebranding work. Commit the intended changes only when authorized, then push or merge to the configured Production branch only when deployment is authorized. Vercel must build the approved revision with the verified Production configuration.
6. **Post-deployment checks — needs live verification.** Inspect all nine live page titles, canonicals, Open Graph URLs, robots, and sitemap. Recheck permanent redirects from the three alternate hosts, preserving paths and query strings.
7. **Real delivery test — requires explicit authorization.** Submit an approved test inquiry from the new primary origin. Verify Resend acceptance and actual receipt at `posiblo.contact@gmail.com`, including spam, separately. Check fields, date/time, and visitor Reply-To. Provider acceptance alone is not proof of mailbox delivery.
8. **Google Search Console — manual action needs verification.** Confirm old/new property ownership, complete the applicable Change of Address steps for old hostname variants, submit the new sitemap, inspect representative URLs, and monitor indexing. Preserve old-domain redirects for at least a year.
9. **Legal review — outstanding requirement.** Complete factual operator/contact details and professional review separately. Draft notices and noindex safeguards remain intact until separately approved.

The active deployment checklist is also documented in `README.md` under **Production migration checklist**.

## D. Deployment readiness

**The migration code is locally tested and ready for deployment review.** No migration-related automated failures remain in the checks executed during this implementation.

Production release remains conditional on external configuration, Resend verification, legal approval, and live verification. Firefox/WebKit coverage remains limited as described above. The application has not been deployed by this work.

- **Branch containing the local changes:** `re-branding`.
- **Commit status:** Changes remain uncommitted.
- **Push/deployment status:** No push or deployment performed.
- **Private environment files:** Not modified.
- **Existing Vercel project and GitHub repository:** Preserved.
- **Current `.next` output:** The contact-disabled release-verification artifact. **Do not deploy this output.** Rebuild with approved Production settings for the actual release.

Safe deployment sequence: verify external configuration and sender authorization, approve the reviewed source changes, commit/push or merge only with authorization to the configured Production branch, let Vercel rebuild with Production settings, and complete the live SEO/redirect/delivery checks above.

## E. Workspace anomaly

The historical file `docs/Posiblo_Post_Domain_Migration_Audit.md` was readable at the start of the implementation but absent at the final check. No command run by the implementation deleted it. Its disappearance was left untouched rather than reconstructing potentially unrelated work. It was still absent when this report was created.

This new report records implementation results and does not replace or claim to reconstruct the missing audit.
