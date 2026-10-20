# Technology upgrades

Scope: implement the stack assessment recommendations, excluding CI and automated dependency monitoring. Preserve the reviewed Hebrew copy and visual design. No deployment, push, live email, or deletion of browser data.

## Milestones

1. Passed: retired unused landing sections, demo/admin/auth/storage code, and five associated packages. Lint, route type generation, typecheck and all 52 retained site tests passed. The 32 retired tests covered removed demo features. No browser data was read or deleted.
2. Passed: verified Node 24.22.0 / npm 11.19.1, Next.js 16.4.2, React 19.3.1, ESLint 10 flat config and TypeScript 5.9.3. Zero lint warnings, typecheck, all 52 retained tests and Turbopack production build passed. Vendored the same Heebo font with its SIL license to remove network-dependent font builds. Compiler/styling/test-tool major upgrades were verified separately in milestone 5.
3. Passed: stable per-inquiry Resend retry keys, actual SDK abort signals, correlation-only diagnostics, server-only boundaries, HMAC-derived client keys and atomic shared Redis throttling. Production requires the shared service and a trusted ingress; failure is closed. Lint/typecheck/build and all 79 tests passed, including cross-instance counters, retries, provider failures and cancellation. All provider/service traffic was mocked. Next's aggregate lint package was replaced by supported direct Next, Hooks and TypeScript plugins to avoid its legacy peer conflicts.
4. Passed: explicit validated section kinds, stable IDs, card layouts, FAQ pairs and CTA destinations replace runtime positional/text routing. All 89 tests, source regeneration check, lint, typecheck and production build passed. Tests independently compare the original specification, reject malformed content and verify section reordering/caption editing. Configuration uses ESM consistently.
5. Passed: styling and compiler stages were verified separately: Tailwind 4.3.3/PostCSS integration, removal of obsolete configuration/autoprefixer, then TypeScript 6.0.3. Each passed lint/typecheck/build and all 89 tests; styling also passed 19 desktop/mobile browser checks. Vite 8.3.4, Vitest 5.0.5, jsdom 30.1.3 and current Testing Library/axe pass application and test typechecking. Browser coverage includes three engines and enabled-form mocks. Browser testing exposed and fixed pre-hydration input loss and WebKit skip-link focus. A real SDK transport contract test confirmed abort normalization; timeouts are classified correctly. README, environment example and release checklist are current. Final verification is recorded below.

## Runtime

Node 24.22.0 is pinned in `.node-version`. A checksum-verified portable copy may be used from ignored `.tools/` for local verification; no system installation is changed.

## Installed versions

Verified on 2026-10-20 using official documentation and npm registry package metadata. The lockfile records the complete reproducible tree.

| Area | Installed |
| --- | --- |
| Runtime / package manager | Node 24.22.0 LTS / npm 11.19.1 |
| Application | Next.js 16.4.2, React / React DOM 19.3.1 |
| Language / lint | TypeScript 6.0.3, ESLint 10.13.0, typescript-eslint 8.72.0 |
| Styling | Tailwind / Tailwind PostCSS plugin 4.3.3, PostCSS 8.5.31 |
| Delivery | Resend 6.34.1, server-only 0.0.1 |
| Unit tools | Vite 8.3.4, Vitest 5.0.5, jsdom 30.1.3 |
| UI tests | Testing Library React 16.3.3 / jest-dom 7.0.1 |
| Browser / accessibility | Playwright 1.64.1, axe Playwright 4.14.0 |

## Deliberate compatibility decisions

- TypeScript 7 was not installed: the current TypeScript ESLint integration declares support for `>=4.8.4 <6.1.0`. Version 6 is the verified compatible compiler. Native compiler migration needs a separate supported integration.
- ESLint uses the official Next plugin plus React Hooks and TypeScript recommended rules. The aggregate Next config's older plugin peer ranges conflict with ESLint 10. No lint rules are disabled to hide upgrade failures; the narrow control-character regex exception is intentional input validation.
- Full audit reports four high development-only entries from one chain: `@next/eslint-plugin-next -> fast-glob -> micromatch -> braces`. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) has no patched release. Production audit reports zero findings. Keep lint inputs/configuration trusted; do not run automatic forced downgrades to the obsolete Next 14 plugin or substitute incompatible glob implementations. Upstream remediation remains outstanding.
- Tailwind 4 targets Safari 16.4+, Chrome 111+ and Firefox 128+. Current browser engines are tested; older-browser support is not promised.
- Keep Next App Router and static rendering for public content, with dynamic contact/API paths. No CMS, ORM, database of inquiries, container platform, analytics service or new abstraction layer was introduced. Redis is limited to expiring abuse counters.

## External dependencies

Production mailbox delivery, final brand/identity/legal/accessibility review, production ingress configuration and any shared rate-limit service still need the owner's verified configuration. Local tests must not send real email. These are not replaced by environment flags or simulated test success.

Production needs an HTTPS `*.upstash.io` REST origin, a token permitting `EVAL`/counter operations, a shared random secret of at least 32 characters, and a verified proxy that overwrites the forwarded client address. The atomic window permits five attempts per client in ten minutes, shared by both endpoint aliases and all instances. Only HMAC-derived keys and expiring counts go to Redis. Outage/malformed responses fail closed; the bounded process-local fallback is development/test only. No Redis account or resource was created.

Unchanged inquiry retries reuse the UUID and provider payload; field edits generate a new identity. Resend's idempotency retention is 24 hours. Browser forms must be refreshed after 24 hours; changing the inquiry intentionally creates a new request. Diagnostics record categorical outcome, server-generated request ID and duration. The Resend SDK may log vendor errors during development; production suppresses those SDK logs. Hosting/provider logs and retention require separate review.

## Verification

- `npm ci`: passed from the lockfile under Node 24.22.0 / npm 11.19.1, with no peer/install-script warnings. `npm ls --depth=0` passed without invalid dependencies.
- `npm run content:check`: all seven generated pages agree with the specification/extraction rules. Independent source-copy assertions also passed.
- `npm run lint`: passed, zero warnings. `npm run typecheck`: passed for application, route types, browser tests, unit tests and test configuration.
- `npm test`: **92 tests passed across eight files**. Includes shared counters across independent module instances, service failure, PII-free application diagnostics, aliases, retry payload identity, validation, real installed SDK cancellation/headers and truthful timeout handling. Network/provider calls were mocked.
- `npm run build`: passed using Next.js 16.4.2 Turbopack and local licensed Heebo. Seven public content routes retain their intended static/dynamic behavior; no external font request is needed.
- `npm run test:e2e`: **55 passed**, three intentional non-mobile skips of the mobile-only test. Chromium desktop/mobile, Firefox and WebKit cover all pages, metadata, RTL, links, overflow, browser errors, draft/legal/indexing behavior and keyboard access. Enabled forms on all three engines cover client validation, consent, pending/success/failure, stable retries, changed payloads, query intents and blocked-script hydration. Zero axe violations in tested states. No automatic retries hide failures.
- Visual review: desktop homepage and mobile contact compared with saved pre-upgrade screenshots; reviewed copy and page layout preserved. Artifacts remain in ignored `test-results/`.
- `npm audit --omit=dev`: **zero known findings**. Full audit: **four high development-only entries**, the single unpatched lint chain described above; no critical findings.
- `.gitignore` verified for local tools, npm cache, browser artifacts and private environments; `.env.example` remains trackable and contains no credentials.

No deployment, push, new service account or live email occurred. CI and automated dependency monitoring remain excluded. External launch blockers and the unpatched development dependency are unresolved, explicitly documented limitations.

## Official references

- [Node 24.22.0 release](https://nodejs.org/en/blog/release/v24.22.0) and official distribution checksums.
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [Next ESLint plugin](https://nextjs.org/docs/app/api-reference/config/eslint), [TypeScript ESLint compatibility](https://typescript-eslint.io/users/dependency-versions/).
- [Tailwind 4 migration](https://tailwindcss.com/docs/upgrade-guide), [TypeScript 6 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [Vite 8 migration](https://vite.dev/guide/migration), [Vitest 5 migration](https://vitest.dev/guide/migration/).
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), installed SDK request types/transport, [Upstash REST API](https://upstash.com/docs/redis/features/restapi).
- [Playwright hydration guidance](https://playwright.dev/docs/navigations#hydration), [React hydration snapshots](https://react.dev/reference/react/useSyncExternalStore#adding-support-for-server-rendering).
