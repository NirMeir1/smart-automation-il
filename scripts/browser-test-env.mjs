// Build and runtime must agree: Next.js embeds NEXT_PUBLIC_* at build time.
export const browserTestOrigin = 'https://browser-fixture.co.il';
export const browserTestEnvironment = {
  NEXT_PUBLIC_SITE_URL: browserTestOrigin,
  SITE_INDEXING_ENABLED: 'false', CONTACT_FORM_ENABLED: 'false',
  RESEND_API_KEY: '', CONTACT_FROM_EMAIL: '', CONTACT_TRUST_PROXY: 'false',
  UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', CONTACT_RATE_LIMIT_SECRET: '',
};
