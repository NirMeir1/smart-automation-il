import { defineConfig } from '@playwright/test'
import { browserTestEnvironment } from './scripts/browser-test-env.mjs'

const publicOrigin = 'http://127.0.0.1:3100'
const formOrigin = 'http://127.0.0.1:3101'
const chromium = { browserName: 'chromium' as const, ...(process.env.PLAYWRIGHT_BROWSER_CHANNEL ? { channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL } : {}) }
const disabledEnvironment = browserTestEnvironment

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL: publicOrigin, headless: true, trace: 'off', screenshot: 'off', video: 'off' },
  projects: [
    { name: 'desktop', testMatch: 'site.spec.ts', use: { ...chromium, viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', testMatch: 'site.spec.ts', use: { ...chromium, viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
    { name: 'tablet', testMatch: 'site.spec.ts', use: { ...chromium, viewport: { width: 820, height: 1180 }, hasTouch: true } },
    { name: 'firefox', testMatch: 'site.spec.ts', use: { browserName: 'firefox' } },
    { name: 'webkit', testMatch: 'site.spec.ts', use: { browserName: 'webkit' } },
    ...(['chromium', 'firefox', 'webkit'] as const).map(browserName => ({
      name: `contact-${browserName}`, testMatch: 'contact-flow.spec.ts',
      use: { ...(browserName === 'chromium' ? chromium : { browserName }), baseURL: formOrigin, viewport: { width: 1280, height: 900 } },
    })),
    { name: 'contact-mobile', testMatch: 'contact-flow.spec.ts', use: { ...chromium, baseURL: formOrigin, viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100', url: publicOrigin, env: disabledEnvironment, reuseExistingServer: false, timeout: 30_000 },
    {
      command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3101', url: formOrigin,
      // Deliberately fake credentials. Browser routes intercept every API call; no real delivery.
      env: { ...disabledEnvironment,
        CONTACT_FORM_ENABLED: 'true', RESEND_API_KEY: 're_browser_fixture_not_real',
        CONTACT_FROM_EMAIL: 'sender@browser-fixture.co.il',
        CONTACT_TRUST_PROXY: 'true', UPSTASH_REDIS_REST_URL: 'https://browser-fixture.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'browser-fixture-not-real', CONTACT_RATE_LIMIT_SECRET: 'browser-fixture-secret-never-use-in-production' },
      reuseExistingServer: false, timeout: 30_000,
    },
  ],
})
