# Bottomline

Hebrew, RTL website using Next.js 16, React 19, TypeScript 6 and Tailwind CSS 4. Heebo is bundled locally with its license.

## Tech stack

- **Next.js + React** — website pages, forms and server endpoints.
- **TypeScript** — catches code mistakes before running.
- **Tailwind CSS + PostCSS** — styles and prepares CSS.
- **Node.js + npm** — runs the app and manages packages.
- **Resend** — sends contact inquiries by email.
- **Upstash Redis** — limits production submission attempts; setup required.
- **ESLint** — checks code quality.
- **Vitest + Testing Library + jsdom** — tests logic and components.
- **Vite** — powers the unit test tooling.
- **Playwright + axe** — checks browsers and accessibility.

## Run locally

Use Node **24.22.0** (`.node-version`) and npm **11.19.1**.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). In PowerShell, use `npm.cmd` if `npm.ps1` is blocked.

## Verify changes

```sh
npm run content:check
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
```

Browser tests start local production servers on ports **3100–3101**, cover desktop/mobile and three browser engines, and mock all contact delivery. Screenshots/traces go to ignored `test-results/`. Build without production settings for this suite. Tests never require real credentials.

## Configuration

Copy [.env.example](.env.example) to private `.env.local`. Submissions and indexing default to disabled.

- Use a verified HTTPS origin in `NEXT_PUBLIC_SITE_URL`. Rebuild after changing it or indexing settings; Vercel previews stay noindex.
- Submissions require `CONTACT_FORM_ENABLED=true`, `LEGAL_REVIEW_APPROVED=true` and valid Resend settings. Production also requires shared Upstash Redis, a random secret of at least 32 characters, and a proxy that **overwrites** `x-forwarded-for`. Enable `CONTACT_TRUST_PROXY` only after checking this. Rate-limit service failure blocks sending.
- Replace legal drafts with approved documents before enabling `LEGAL_REVIEW_APPROVED`. Provider acceptance does not prove mailbox delivery; verify the real mailbox before launch.

Both `/api/lead` and `/api/send-email` use the same validated handler. Retry IDs protect unchanged inquiries against duplicate emails within Resend's 24-hour window. Form data is not saved in browser storage; production application diagnostics exclude it. Meeting buttons request contact, without confirming a booking.

## Content and release

Seven public pages: `/`, `/solutions`, `/business`, `/individuals`, `/process`, `/about`, `/contact`. Legal drafts live under `/legal/*`; testimonials/thanks redirect, and `/admin` returns 404.

Reviewed copy is in `src/content/pages.json`; its schema and explicit layouts/links are in `src/content/`. Run `npm run content:generate` to regenerate from Part J of the [specification](docs/Bottomline_Codex_Implementation_Prompt.md), then review the diff and run the checks above.

See [upgrade results and remaining limitations](docs/Technology_Upgrade_Status.md) and the [launch checklist](docs/Bottomline_Implementation_Status.md). CI and automated dependency monitoring are intentionally deferred. Nothing has been deployed or pushed.
