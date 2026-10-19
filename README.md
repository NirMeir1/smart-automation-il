# Smart Automation IL — אוטומציה חכמה

A Hebrew, right-to-left website for business automation services, built with Next.js, React, TypeScript, and Tailwind CSS.

## Run locally

Install Node.js (18.17 or later) and npm, then run from the project directory:

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Stop the server with `Ctrl+C`.
If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`.

## Configuration

Create `.env.local` as needed, then restart the development server:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_demo_password
```

- `NEXT_PUBLIC_SITE_URL`: base URL for page metadata; set it to your public URL when deploying.
- `RESEND_API_KEY`: required for contact emails. Configure the sender and recipient in `src/app/api/send-email/route.ts`.
- `NEXT_PUBLIC_ADMIN_PASSWORD`: demo admin access. The password is exposed to the browser; production use requires server-side authentication.

Keep `.env.local` out of version control.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve a production build |
| `npm run lint` | Run the configured lint script |

Test files exist in `src/test`, but test dependencies and npm scripts are not configured.

## Source

- `src/app`: pages and API routes
- `src/components`: UI and layout components
- `src/lib`: shared utilities
- `public`: static assets
