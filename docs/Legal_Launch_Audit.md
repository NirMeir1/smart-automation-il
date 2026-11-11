# Posiblo legal launch audit

Content update: 2026-11-11 (Asia/Jerusalem).

## Scope and evidence

The requested audit file was absent from this checkout when work began; no other copy was found by filename search. This report records the current implementation and unresolved evidence, rather than reconstructing an unavailable prior audit. The working tree already contained extensive changes; those changes were preserved.

Read the existing privacy, terms, accessibility, contact form, validation, release state and release guard before editing, and reviewed the retention helper during verification. No deployment, production data change, provider setting change, real email delivery or video edit was performed.

## Content prepared for publication

- All three legal pages share `עודכן לאחרונה` and the actual update date, 11 November 2026. Removed public draft notices and the accompanying requirement for professional review, including draft metadata. Existing RTL, typography and branding remain in place.
- Privacy identifies ניר מאיר and Posiblo, using `בעל השליטה במאגר המידע`, with `posiblo.contact@gmail.com`. No address or registration number was added.
- Terminology checked on 2026-11-11 against the Privacy Protection Authority's official [Amendment 13 questions and answers](https://www.gov.il/he/pages/tikun13_qa?chapterIndex=6). Its indexed official text identifies `בעל שליטה במאגר מידע` as the party determining processing purposes. Direct retrieval returned HTTP 403; verification used the official source's search excerpt. This verifies terminology, not Posiblo's compliance.
- Simplified technical identifiers and logging while retaining collected data categories, processing purposes, security/abuse prevention, duplicate prevention and the warning that identifiers do not guarantee anonymity.
- Preserved unconverted-enquiry retention up to 12 months after the last meaningful interaction, operationally necessary customer/project retention subject to legal obligations, 10-minute rate-limit expiry and 25-hour duplicate-prevention expiry. The policy explicitly distinguishes the internal 12-month rule from a general statutory requirement. Mail deletion remains manual.
- Kept Vercel, Resend, Google/Gmail and Upstash. Removed the unverified Resend 30-day claim and specific data-location assertion. Replaced public placeholders with qualified disclosures about unverified account settings, log/backup retention, access and international processing arrangements.
- Terms body retained: its privacy link was already `/legal/privacy`, contact identity comes from the verified shared operator, project agreements remain separate, and consumer rights and proportionate liability wording remain intact.
- Accessibility retains implemented features, embedded Hebrew subtitle limitations, missing verified full transcript, and the distinction between automated testing and outstanding manual/assistive-technology checks. No full WCAG compliance, certification or exemption is claimed. Removed the unverified physical-service editorial question from the public page.
- Contact form now shows the owner's exact requested notice in separate readable paragraphs with a heading and relative privacy link. Its existing exact consent wording, unchecked initial state, required consent, no-marketing scope, disabled-submit behavior and accessible validation were preserved.
- Required inputs agree with `validateInquiry`: full name, caller type, message, at least one valid email or phone, and consent. Tools, budget and meeting preference are optional; an invalid supplied contact method is rejected even if the other is valid.

## Release status and protections

The owner instructed preparation for public publication without obtaining external professional approval at this stage. That instruction authorizes these content edits; it does not establish legal certification or satisfy a missing dated release record.

`docs/legal-release-status.json` remains unchanged: `status: "draft"`, `reviewedAt: null`, `approvalReference: null`, with five existing blockers. The guard in `scripts/legal-release-state.mjs` requires all of:

1. `status` exactly `approved`.
2. Truthy `reviewedAt` and `approvalReference` values. It does not validate a specific date format or mandate that the reference be a lawyer's approval.
3. An empty `blockers` array.
4. No `להשלמה` or `LegalDraft` match in the legal page source and no `טרם אושרה לפרסום` in the shared shell.

The existing internal `LegalDraft` component/import names were retained to avoid altering the release safeguard as part of content edits. Consequently its source-marker check still reports draft markers even though the rendered documents no longer contain them. Resolving this naming/check coupling belongs to an explicit later release-state review; renaming the component merely to pass the gate was avoided.

`npm.cmd run legal:check` currently exits 1 as expected. Production Vercel builds remain blocked by `next.config.mjs`; local review builds remain allowed. `npm.cmd run verify:release` uses the same guard before its production checks. Existing noindex/nofollow legal metadata and site indexing controls remain unchanged. A local build passing is not release approval.

## Outstanding owner and operational questions

- Verify the active Vercel deployment/account configuration, account access lists and protections, Resend account plan/settings and domain readiness, Google/Gmail access, and Upstash configuration. The existing release-state record reports an earlier Resend HTTP 401; this task did not rerun a credentialed provider check and does not independently confirm that historical result.
- Establish actual provider log/backup retention, processing regions, subprocessors and applicable terms/agreements; determine the applicable arrangements for transfers outside Israel. These cannot be inferred from source code or generic provider documentation. No contractual safeguard or verified location is asserted.
- Put the manual retention process into operation: review enquiry metadata at least quarterly, identify deadlines before the next review, and carry out necessary deletions by the applicable deadline. The existing `scripts/retention-review.mjs` is an offline dry-run helper, not a scheduler or deletion mechanism. Its referenced `docs/Retention_Operations.md` is also absent from this checkout. No existing mail was reviewed or deleted.
- Exact unanswered physical-service question: **Does Posiblo receive customers or provide services at a physical location? If yes, what accessibility arrangements exist there, and how can customers coordinate accommodations?** The meeting-preference option “פנים אל פנים” does not establish a customer reception location. No physical arrangement was invented or published.
- Complete screen-reader and manual content/media checks, including the full audio/visual content, subtitle accuracy/synchronization, and any needed accessible alternative/audio description; determine applicable accessibility obligations. Automated axe checks alone do not settle these questions.
- Review the existing business-disclosure and other legal-scope blockers against verified facts, without treating an unpublished address/registration number as permission to invent them or treating external legal approval as established.
- Once genuine blockers are resolved, record an actual dated owner publication decision and a review reference through the release process. Owner authorization must be described as such; it must not be represented as legal approval or certification. No release status was changed in this task.

## Validation

Browser plugin not available; using the repository's regular Playwright setup. Target flow: each legal route renders Hebrew RTL content and working links; contact privacy links lead to the policy, consent starts unchecked, and form validation/submission remains accessible. Browser API delivery is intercepted with fixtures; no production services are exercised.

Environment: Windows, Node v24.16.0. The project declares Node >=24.22.0 <25; successful checks on the installed version do not prove the declared runtime was tested. PowerShell blocks unsigned `npm.ps1`, so commands use `npm.cmd` without changing execution policy.

- `npm.cmd run build`: passed, including all three legal routes.
- `npm.cmd run lint`: passed with zero warnings.
- `npm.cmd test`: passed, 249 tests in 16 files.
- `npm.cmd run legal:check`: expected blocked result; guard and status preserved.
- `npm.cmd run typecheck`: passed (Next route type generation, application TypeScript and test TypeScript).
- `npm.cmd run build:e2e`: passed after the final UI changes, using the existing isolated preview fixtures and fake credentials.
- `npm.cmd run verify:release`: exited 1 at the existing legal guard, before the production verification build/server; no bypass attempted.
- Initial `npm.cmd run test:e2e`: 10 request-only checks passed; 148 browser tests failed to launch because the bundled Chromium, Firefox and WebKit executables are missing. This run does not provide rendered browser verification.
- Reran using the existing installed-browser option: `$env:PLAYWRIGHT_BROWSER_CHANNEL='msedge'`, then `npm.cmd run test:e2e -- --project=desktop --project=mobile --project=tablet --project=contact-chromium --project=contact-mobile`. **88 passed, 2 skipped**, zero failures. The two skips are the mobile-only menu test in desktop/tablet projects. Firefox/WebKit were not validated; no browser dependencies were installed.
- Edge checked legal pages at 1440×1000, 375×812 and 820×1180, and 320 CSS pixels with doubled text. Verified Hebrew language and RTL, titles/update date, relative legal links returning 200, no draft/editorial text, no horizontal overflow, skip-link and keyboard focus, and zero axe violations on the tested states. Automated results are not accessibility certification.
- Contact fixture checks verified email-only/phone-only/both, optional fields, unchecked required consent and exact accessible name, disabled button and Enter prevention without consent, privacy link, focused error summary, field errors, retry/pending/success behavior, and no marketing-consent payload. All API submission calls were intercepted.
- A separate Edge screenshot/interaction check captured all three legal pages on desktop/mobile, followed the form notice link to `/legal/privacy` on both viewports, and recorded no page errors or console warnings/errors. Visual inspection found readable RTL wrapping, consistent typography/branding and no clipping/overlap in the captured surfaces. No framework error overlay or blank page was present.
- Screenshot evidence is outside the repository: `C:/Users/meirn/AppData/Local/Temp/posiblo-legal-qa-5zyWXR/` (`privacy`, `terms`, `accessibility` and `contact`, each with desktop/mobile PNGs). An earlier supplementary screenshot attempt timed out because PowerShell converted its Hebrew text selector to question marks; the successful rerun used the observed CSS link target. This was a QA script encoding issue, not an application failure.
- Source and generated legal HTML scans found no public draft notices, unfinished placeholders, TODOs or `localhost:3000`. Existing browser checks verified public links and destination responses. `git diff --check` passed.

## Files changed in this task

- `src/components/legal-draft.tsx`: shared legal date, header and metadata. Internal identifier retained for the release guard.
- `src/app/legal/privacy/page.tsx`: identity terminology, simplified explanations and qualified provider disclosures.
- `src/app/legal/accessibility/page.tsx`: removed internal physical-service question and draft wording.
- `src/components/contact-form.tsx`, `src/app/globals.css`: exact notice, semantic heading/paragraphs and restrained spacing/type size.
- `src/test/legal-drafts.test.tsx`, `src/test/contact-form.test.tsx`, `e2e/site.spec.ts`, `e2e/contact-flow.spec.ts`: updated expectations and regression coverage.
- `docs/Legal_Launch_Audit.md`: this report, created because the requested prior file was unavailable.

`src/app/legal/terms/page.tsx` required no additional body edit in this task; it receives the shared header/metadata changes. Other pre-existing working-tree edits, release scripts/status, provider configuration and media were preserved. Next.js regenerated `next-env.d.ts` during builds; its original development-route references were restored after verification to avoid an unrelated generated-file diff.
