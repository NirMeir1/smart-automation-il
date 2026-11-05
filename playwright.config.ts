import { defineConfig } from '@playwright/test'
import { browserTestServers } from './scripts/browser-test-env.mjs'

const publicOrigin = 'http://127.0.0.1:3100'
const formOrigin = 'http://127.0.0.1:3101'
const chromium = { browserName: 'chromium' as const, ...(process.env.PLAYWRIGHT_BROWSER_CHANNEL ? { channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL } : {}) }

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  // On restricted Windows hosts taskkill /T can fail and leave webServer teardown waiting forever.
  globalSetup: process.platform === 'win32' ? './scripts/playwright-windows-servers.mjs' : undefined,
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
  webServer: process.platform === 'win32' ? undefined : browserTestServers.map(({ port, env }) => ({
    command: `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`, env, reuseExistingServer: false, timeout: 30_000,
  })),
})
