# Bottomline

Hebrew-first, RTL website built with Next.js 15, React 18, TypeScript and Tailwind CSS.

## Run locally

Use Node.js 24+ and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). In PowerShell, use `npm.cmd` if `npm.ps1` is blocked.

## Check changes

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Build before running browser tests. They start a local production server on port 3100 and use installed Microsoft Edge. Set `PLAYWRIGHT_BROWSER_CHANNEL=chrome` to use installed Chrome instead. Screenshots and traces go to `test-results/`.

Unit tests mock email delivery. Browser tests expect the default configuration below: no production URL, submissions disabled and indexing disabled.

## Configuration

Create a private `.env.local` when needed; never commit secrets. These defaults keep submissions and indexing disabled:

```dotenv
NEXT_PUBLIC_SITE_URL=
SITE_INDEXING_ENABLED=false
CONTACT_FORM_ENABLED=false
LEGAL_REVIEW_APPROVED=false
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
CONTACT_TRUST_PROXY=false
```

- Set `NEXT_PUBLIC_SITE_URL` to the verified HTTPS production origin, without a path. Rebuild after changing the URL or indexing settings. Vercel previews remain noindex.
- Contact submissions require both enablement flags, Resend credentials, a verified sender and a recipient. Production also requires the production origin. Replace the legal drafts with approved documents before setting `LEGAL_REVIEW_APPROVED=true`.
- Enable `CONTACT_TRUST_PROXY` only if the hosting proxy overwrites `x-forwarded-for`. Otherwise, rate limiting uses one shared bucket. Multiple server instances need shared abuse protection.

Both `/api/lead` and `/api/send-email` validate inquiries and send through Resend. Success means provider acceptance; actual mailbox delivery still needs verification. Inquiries are not saved in browser storage or application logs. Meeting buttons request contact; they do not confirm a booking.

## Pages and content

Public pages: `/`, `/solutions`, `/business`, `/individuals`, `/process`, `/about` and `/contact`.

Legal drafts are under `/legal/privacy`, `/legal/terms` and `/legal/accessibility`. `/testimonials` redirects to About; `/thanks` redirects to Contact. `/admin` is a local demo and returns 404 in production. Do not use it for real customer data.

Reviewed copy lives in `src/content/pages.json`. To regenerate it from Part J of the [specification](docs/Bottomline_Codex_Implementation_Prompt.md), run `node scripts/extract-copy.cjs` and review the diff. Unused legacy components remain for reuse; their old claims are not approved for publication.

## Before launch

Complete the [release checklist](docs/Bottomline_Implementation_Status.md): brand/domain clearance, verified owner details and meeting terms, legal/accessibility approval, production configuration and a real mailbox delivery test. The report also records copy exceptions, verification results and remaining development-tooling security findings.

No deployment, push or live email was performed during implementation.
