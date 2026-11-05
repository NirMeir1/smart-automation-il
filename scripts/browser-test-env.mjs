// Build and runtime must agree: Next.js embeds NEXT_PUBLIC_* at build time.
export const browserTestOrigin = 'https://browser-fixture.co.il';
export const browserTestEnvironment = {
  VERCEL_ENV: 'preview',
  NEXT_PUBLIC_SITE_URL: browserTestOrigin,
  SITE_INDEXING_ENABLED: 'false', CONTACT_FORM_ENABLED: 'false',
  RESEND_API_KEY: '', CONTACT_FROM_EMAIL: '', CONTACT_TRUST_PROXY: 'false',
  UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', CONTACT_RATE_LIMIT_SECRET: '',
};

// Shared by Playwright's normal webServer lifecycle and the Windows direct-child setup.
export const browserTestServers = [
  { port: 3100, env: browserTestEnvironment },
  { port: 3101, env: { ...browserTestEnvironment,
    // Deliberately fake credentials. Browser routes intercept every API call; no real delivery.
    CONTACT_FORM_ENABLED: 'true', RESEND_API_KEY: 're_browser_fixture_not_real',
    CONTACT_FROM_EMAIL: 'sender@browser-fixture.co.il',
    CONTACT_TRUST_PROXY: 'true', UPSTASH_REDIS_REST_URL: 'https://browser-fixture.upstash.io',
    UPSTASH_REDIS_REST_TOKEN: 'browser-fixture-not-real', CONTACT_RATE_LIMIT_SECRET: 'browser-fixture-secret-never-use-in-production',
  } },
];
