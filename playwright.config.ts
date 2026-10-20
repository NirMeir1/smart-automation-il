import { defineConfig } from '@playwright/test'

const publicOrigin = 'http://127.0.0.1:3100'
const formOrigin = 'http://127.0.0.1:3101'
const chromium = { browserName: 'chromium' as const, ...(process.env.PLAYWRIGHT_BROWSER_CHANNEL ? { channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL } : {}) }
const disabledEnvironment = {
  NEXT_PUBLIC_SITE_URL: '', SITE_INDEXING_ENABLED: 'false', CONTACT_FORM_ENABLED: 'false',
  LEGAL_REVIEW_APPROVED: 'false', RESEND_API_KEY: '', CONTACT_FROM_EMAIL: '', CONTACT_TO_EMAIL: '',
  CONTACT_TRUST_PROXY: 'false', UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', CONTACT_RATE_LIMIT_SECRET: '',
}

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL: publicOrigin, headless: true, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', testMatch: 'site.spec.ts', use: { ...chromium, viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', testMatch: 'site.spec.ts', use: { ...chromium, viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: 'firefox', testMatch: 'site.spec.ts', use: { browserName: 'firefox' } },
    { name: 'webkit', testMatch: 'site.spec.ts', use: { browserName: 'webkit' } },
    ...(['chromium', 'firefox', 'webkit'] as const).map(browserName => ({
      name: `contact-${browserName}`, testMatch: 'contact-flow.spec.ts',
      use: { browserName, baseURL: formOrigin, viewport: { width: 1280, height: 900 } },
    })),
  ],
  webServer: [
    { command: 'npm run start -- --hostname 127.0.0.1 --port 3100', url: publicOrigin, env: disabledEnvironment, reuseExistingServer: false, timeout: 30_000 },
    {
      command: 'npm run start -- --hostname 127.0.0.1 --port 3101', url: formOrigin,
      // Deliberately fake credentials. Browser routes intercept every API call; no real delivery.
      env: { ...disabledEnvironment, NEXT_PUBLIC_SITE_URL: 'https://browser-fixture.co.il',
        CONTACT_FORM_ENABLED: 'true', LEGAL_REVIEW_APPROVED: 'true', RESEND_API_KEY: 're_browser_fixture_not_real',
        CONTACT_FROM_EMAIL: 'sender@browser-fixture.co.il', CONTACT_TO_EMAIL: 'receiver@browser-fixture.co.il',
        CONTACT_TRUST_PROXY: 'true', UPSTASH_REDIS_REST_URL: 'https://browser-fixture.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'browser-fixture-not-real', CONTACT_RATE_LIMIT_SECRET: 'browser-fixture-secret-never-use-in-production' },
      reuseExistingServer: false, timeout: 30_000,
    },
  ],
})
