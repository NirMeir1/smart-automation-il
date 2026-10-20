# Bottomline implementation and release record

The authoritative [specification](Bottomline_Codex_Implementation_Prompt.md) was read in full. The seven-page implementation and subsequent technology upgrades are complete locally. Production launch still requires the owner checks below.

Current stack, milestone evidence, official references and remaining dependency findings: [Technology upgrade record](Technology_Upgrade_Status.md). That record supersedes earlier Next.js 15 / React 18 verification results.

## Implemented

- Seven Hebrew, RTL pages with the reviewed Part J copy, exact metadata, shared navigation/footer, keyboard access and native FAQ disclosures.
- Explicit, validated content types, section IDs/layouts, FAQ pairs and link destinations; reproducible extraction from the original specification.
- One gated contact handler for both API aliases, client/server validation, bounded bodies, same-origin checks, consent and spam protection.
- Atomic shared production throttling, HMAC-derived client keys, stable delivery retry IDs, real provider cancellation and diagnostics without inquiry contents.
- Accurate noindex/legal drafts, verified-origin controls, sitemap/robots, legacy redirects and `/admin` returning 404.
- Removed unused prototype sections, browser-only admin/auth/storage code and associated dependencies. No visitor browser data was read or deleted.
- Current framework/tooling, licensed local Heebo font, application/test typechecking and browser checks across Chromium, Firefox and WebKit. Automated checks do not replace professional accessibility review.

## Release blockers: owner / professionals

- [ ] Clear Bottomline name/trademark, final domain and ownership strategy.
- [ ] Supply verified operator name, professional photo, background, optional profile links and physical meeting region.
- [ ] Approve introductory meeting cost, duration and online/in-person availability. Until then, terms stay subject to coordination.
- [ ] Verify Resend sender domain, recipient ownership and production credentials; test actual mailbox delivery.
- [ ] Configure shared Upstash Redis, a random secret shared across instances, and a hosting ingress verified to overwrite `x-forwarded-for`. Check production timeout behavior and service permissions. Local mocks do not verify hosting or a real Redis account.
- [ ] Obtain qualified Israeli legal review of privacy, processors, hosting/logs, retention/deletion, contact details, terms, B2C/cancellation/contract rights and anti-spam requirements. Replace drafts before enabling submissions.
- [ ] Complete professional accessibility review, applicability, statement and verified accessibility contact; verify real devices and assistive technology.
- [ ] Verify production origin and explicitly authorize indexing/deployment.
- [ ] Require evidence and publication permission for any future testimonial/case study.

## Copy exceptions

- Omit the unverified About owner introduction and internal factual checklist; retain the remaining reviewed copy.
- Retain the free-meeting FAQ question, with an honest terms-by-coordination answer until approved. No unsupported free/duration promise.
- Physical meeting availability requires coordination and owner confirmation.
- Legal pages remain explicit, noindex drafts reflecting current code behavior.
- No booking URL, address, phone, production domain or social proof was invented.

## Verification and scope

The [upgrade record](Technology_Upgrade_Status.md) contains the current results; earlier 84-test and Edge-only results are historical. Source-copy tests independently compare the original Markdown, including the documented exceptions and conditional success text. Delivery and shared-service tests use mocks; no real email was sent.

CI and automated dependency monitoring are deferred at the owner's request. No deployment, push, new service account or irreversible external change was performed.

## Main files

- `src/app/`: seven public routes, three legal drafts, metadata endpoints and both API aliases.
- `src/content/`, `scripts/extract-copy.mjs`, `src/components/copy-page.tsx`: validated content, explicit editorial structure, extraction and semantic rendering.
- `src/components/contact-form.tsx`, `src/lib/inquiry*.ts`, `contact-*.ts`: form, validation, delivery, configuration, throttling and diagnostics.
- `src/lib/site*.ts`, `routes.ts`: route metadata, verified origin and indexing controls.
- `src/test/`, `e2e/`, tool configurations: unit/integration/browser checks; README and `.env.example` document local setup.
