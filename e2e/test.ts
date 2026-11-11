import { test as base, expect } from '@playwright/test'

export { expect }

export const test = base.extend({
  page: async ({ page, browserName }, runTest) => {
    if (browserName === 'webkit') {
      // WebKit upgrades loopback assets to HTTPS under the production CSP,
      // but these test servers only speak HTTP. Keep every other CSP directive;
      // the unmodified production headers remain testable through request.get.
      await page.route(/^http:\/\/127\.0\.0\.1:310[01]\//, async route => {
        if (!route.request().isNavigationRequest() || route.request().resourceType() !== 'document') {
          await route.fallback()
          return
        }
        const response = await route.fetch()
        const headers = response.headers()
        if (headers['content-security-policy']) {
          headers['content-security-policy'] = headers['content-security-policy']
            .split(';').filter(directive => directive.trim() !== 'upgrade-insecure-requests').join(';')
        }
        await route.fulfill({ response, headers })
      })
    }
    await runTest(page)
  },
})
