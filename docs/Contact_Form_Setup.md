# Contact form: setup and verification

Implemented on 20 October 2026. Updated after the owner configured Resend and Upstash and confirmed receipt of a live test email. No deployment was performed by the coding agent.

## What is implemented

- Separate full-name, email, phone, and message inputs. Name and message are required; email or phone is required; visitors may enter both. Every supplied contact method must be valid.
- Existing caller type, tools/systems, budget, meeting preference, audience intent, and privacy acknowledgement are preserved. Caller type and privacy acknowledgement retain their existing required status.
- Shared frontend/backend validation, bounded request size, strict origin checks, a honeypot, minimum completion time, and five attempts per client per ten minutes.
- Both existing endpoints (`/api/lead`, `/api/send-email`) remain supported, including the previous combined `contact` API field.
- Server-side Resend delivery only to **meirnir89@gmail.com**, fixed in server configuration. No recipient override is accepted from visitors. The old `CONTACT_TO_EMAIL` variable is no longer used.
- Plain-text Hebrew email includes all customer fields, consent acknowledgement, inquiry ID, and server receipt date/time using `Asia/Jerusalem`, including daylight saving time. Plain text avoids interpreting customer input as HTML. Reply-To uses the validated customer email when supplied.
- The existing Upstash database stores expiring rate counters and random inquiry IDs with timestamps, never message contents or raw IP addresses. Receipt timestamps expire after 25 hours; a stable timestamp preserves identical email payloads on retries across server instances. Resend idempotency protects retries for 24 hours.
- Loading state, immediate duplicate-submit guard, accessible errors, preserved values after failures, and success only after the provider returns an acceptance ID. An acceptance ID is not proof of Gmail inbox delivery.
- Existing design, Hebrew RTL, mobile layout, no browser storage of form contents, and safe application diagnostics are preserved. Phone validation now uses the free, open-source `libphonenumber-js` package with full numbering-plan metadata, shared by frontend and backend; Israel is the default for local numbers, while international numbers require `+` and a country code. See the [library documentation](https://github.com/catamphetamine/libphonenumber-js). Validation checks number structure, not whether a person owns the number or it can receive calls.
- The submit button is gray and disabled until the privacy checkbox is checked; the submission handler and backend enforce consent as well. Field errors appear on blur, are rechecked during correction, and are checked again before sending. Email syntax, human-name input, visible message content, required selections, and all field length limits are validated. No additional paid service or account is needed.

## Free service comparison

Official sources checked on 20 October 2026. Free plans may change later.

| Provider | Verified free allowance | Card requirement | Decision |
|---|---|---|---|
| [Resend](https://resend.com/pricing) | 3,000 emails/month; 100/day | [Transactional free plan requires no card](https://resend.com/products/transactional-emails) | Selected: already installed, simple server-side SDK, documented retry idempotency; sufficient for low traffic. |
| [Brevo](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans) | 300 emails/day; no time limit | No card | Suitable alternative, but switching would replace working infrastructure without a current need. |

Select the actual **Free** plan, without paid upgrades, add-ons, or billing details. Resend's pricing lists paid overage options for paid subscriptions; none are enabled by this application. Delivery errors, including quota exhaustion, show a failure rather than simulated success. Free service limits and availability are outside the application's control.

The existing shared spam protection uses [Upstash Redis Free](https://upstash.com/pricing/redis): one database, 250 MB and 500,000 commands/month according to its pricing FAQ. Keep the database on Free and do not add billing details or upgrade. This application uses its existing REST integration with no new Redis SDK. It fails closed if Redis is unavailable or its quota is exhausted. Development/testing alone may use bounded in-memory state; production requires shared Redis.

## Exact setup steps

1. Create a free [Resend account](https://resend.com/signup) and verify your account email. Choose the transactional Free plan without a card or paid subscription.
2. Under Domains, add a domain or subdomain **you already own**. Follow [Resend's domain instructions](https://resend.com/docs/add-a-domain) and copy its exact DNS records into your DNS provider. Wait for verification. Do not change existing unrelated mail records. The email service is free; ownership of a sending domain is a separate prerequisite. Gmail is the recipient, not the sending domain.
3. Create a [Resend API key](https://resend.com/docs/dashboard/api-keys/introduction) with **Sending access**, scoped to the verified domain where available. Store it privately. Set the sender to an address at that verified domain. A separate paid mailbox is not required just to send through Resend; use a sender address you control. The application intentionally disallows `@resend.dev` test senders.
4. Create an Upstash account and one persistent Redis database on the **Free** plan. From the database console, copy its HTTPS REST URL and read/write REST token. Required Redis operations are `EVAL`, `INCR`, `EXPIRE`, `TTL`, `GET`, and `SET`. No temporary three-day database is used.
5. Generate a private random rate-limit secret of at least 32 characters. For example, using the project's Node installation: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Store the result only in private environment settings.
6. Copy `.env.example` to ignored `.env.local` for local work. For an authorized future deployment, use the hosting provider's private server environment settings with the same variables. Never put secrets in `NEXT_PUBLIC_*` variables or commit `.env.local`.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your private sending API key |
| `CONTACT_FROM_EMAIL` | Sender email at the verified domain; email address only, without a display name |
| `NEXT_PUBLIC_SITE_URL` | Actual HTTPS website origin, e.g. `https://your-owned-domain`; no path, query, or fragment |
| `UPSTASH_REDIS_REST_URL` | Database's HTTPS `*.upstash.io` REST origin |
| `UPSTASH_REDIS_REST_TOKEN` | Private read/write REST token |
| `CONTACT_RATE_LIMIT_SECRET` | Generated random secret; same value across server instances |
| `CONTACT_TRUST_PROXY` | `true` only after verifying the hosting ingress overwrites `x-forwarded-for` with the real client IP |
| `CONTACT_FORM_ENABLED` | `true` when the sending configuration is ready |
| `LEGAL_REVIEW_APPROVED` | Obsolete and ignored by the contact handler. Legal pages remain drafts; enabling submissions does not certify a legal review. |
| `SITE_INDEXING_ENABLED` | Keep existing setting; this feature does not require search indexing |

There is no recipient setting to configure: every accepted inquiry targets **meirnir89@gmail.com**. Old recipient variables can be removed from private configuration.

7. The host must run the existing Next.js Node server/API routes; a static-only export cannot send mail. No deployment adapter/configuration identifying the final hosting service was found. Verify the trusted proxy behavior before enabling production; do not assume that an appended client-supplied forwarded header is safe. No hosting service has been selected or changed by this task.
8. Restart the development server after changing server variables. Rebuild before an authorized production rollout because the public site origin is also used in site metadata. Set `CONTACT_FORM_ENABLED=true` to enable configured submissions. At the owner's request, form availability is independent of the legal pages' draft status; no approval is asserted or fabricated.
9. With private configuration ready, submit a real inquiry from the actual configured origin. Verify the Resend acceptance record and then personally check **meirnir89@gmail.com**, including spam. Check both contact methods, full multiline message, optional fields, date/time, and Reply-To. Repeat with a failed connection to verify safe retries. Do not report inbox delivery until that mailbox check is complete.

## Verification completed

- `npm test`: **184 tests passed** across 12 files after the validation update. Covers required/invalid inputs; Israeli and international phone numbering rules; email syntax; names, visible message content and length boundaries; email-only, phone-only and both; consent gating; optional fields; origin/body protections; rate limiting; honeypot/timing; provider rejection, missing receipt and timeout; stable retries; timestamp storage; Israel winter/summer time; failure data retention and pending states.
- The real installed Resend SDK was exercised with intercepted HTTP responses, checking the actual recipient, Reply-To and idempotency header. This is a transport test, not a live provider request.
- Real installed Chrome against a local production build: **24 browser tests passed**, covering desktop and mobile form behavior, the reported invalid phone regression, gray disabled consent button, Enter-key protection, overflow checks, keyboard/error focus, accessibility scan, contact combinations, pending state, and retry/error recovery. API responses were deliberately intercepted; no email was sent during this browser run. No screenshots or recordings were generated.
- Production build, TypeScript checks, ESLint and content regeneration check passed.

## Remaining dependencies

Private local Resend and Upstash credentials are now configured. Live Redis rate-limit and receipt scripts passed. Resend accepted a Hebrew test email, an identical retry returned the same receipt, and the owner confirmed arrival in Gmail. This verifies provider connectivity and mailbox delivery, rather than a complete production website-form submission. The owner reports setting the production variables in Vercel. Local form submission is enabled; the obsolete legal-review flag no longer blocks it. The live Vercel form still requires deploying the updated code and setting `CONTACT_FORM_ENABLED=true`. Legal pages remain drafts. No website was deployed or published by the coding agent.
