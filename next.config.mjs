import { legalReleaseBlockers } from './scripts/legal-release-state.mjs';

// Local review builds remain possible. A production Vercel build must not
// accidentally publish documents whose operator details and review are missing.
if (process.env.VERCEL_ENV === 'production' && legalReleaseBlockers().length) {
  throw new Error('RELEASE BLOCKED: legal documents are drafts. See docs/legal-release-status.json.');
}

const isDev = process.env.NODE_ENV === 'development';

// Keep static rendering/CDN caching. Next.js hydration requires inline scripts;
// nonce-based CSP would require dynamically rendering every page instead.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(!isDev ? ['upgrade-insecure-requests'] : []),
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};

export default nextConfig;
