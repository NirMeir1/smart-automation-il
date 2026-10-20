import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { routes } from '../src/lib/routes'
import { pages } from '../src/content/pages'

for (const route of routes) test(`${route.href}: copy, metadata, links, layout and accessibility`, async ({ page }, testInfo) => {
  const issues: string[] = []
  page.on('pageerror', error => issues.push(error.message))
  page.on('console', message => { if (message.type() === 'error') issues.push(message.text()) })
  const response = await page.goto(route.href)
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'he')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveText(pages[route.key].h1)
  await expect(page).toHaveTitle(pages[route.key].title)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', pages[route.key].description)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  const body = await page.locator('body').innerText()
  expect(body).not.toMatch(/Sogomatic|אוטומציה חכמה|smart-automation\.co\.il|50%|90%|50\+|050-1234567|24 שעות|נדרש להשלמה/)
  for (const href of await page.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
    expect(href).toMatch(/^(\/|#)/)
    const path = href!.split(/[?#]/)[0]
    if (path) expect([...routes.map(r => r.href), '/legal/privacy', '/legal/terms', '/legal/accessibility']).toContain(path)
  }
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(accessibility.violations).toEqual([])
  expect(issues).toEqual([])
  if (route.key === 'home' || route.key === 'contact') await page.screenshot({ path: testInfo.outputPath(`${route.key}.png`), fullPage: true })
})

test('mobile disclosure closes on Escape and internal navigation works', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile')
  await page.goto('/')
  const button = page.getByRole('button', { name: /תפריט/ })
  await button.click()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(button).toBeFocused()
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await button.click()
  await page.getByRole('navigation', { name: 'ניווט ראשי', exact: true }).getByRole('link', { name: 'לפרטיים וליזמים', exact: true }).click()
  await expect(page).toHaveURL('/individuals')
})

test('FAQ is keyboard operable and skip link moves focus', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'דלג לתוכן הראשי' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  const question = page.locator('summary').first()
  await question.focus(); await page.keyboard.press('Enter')
  await expect(question.locator('..')).toHaveAttribute('open', '')
  await page.keyboard.press('Enter')
  await expect(question.locator('..')).not.toHaveAttribute('open', '')
})

test('production blockers are honest; legal drafts and old routes exist', async ({ page, request }) => {
  await page.goto('/contact')
  await expect(page.getByRole('status')).toContainText('אינה זמינה כרגע')
  await expect(page.getByRole('button', { name: /שליחת הפנייה/ })).toBeDisabled()
  for (const path of ['/legal/privacy', '/legal/terms', '/legal/accessibility']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.getByText('טיוטה לעיון בלבד — טרם אושרה לפרסום.')).toBeVisible()
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
  }
  expect((await request.get('/unknown-page')).status()).toBe(404)
  expect((await request.get('/admin')).status()).toBe(404)
  expect((await request.get('/testimonials', { maxRedirects: 0 })).status()).toBe(308)
  expect((await request.get('/thanks', { maxRedirects: 0 })).status()).toBe(307)
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /')
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('<loc>')
  expect((await request.post('/api/lead', { data: {}, headers: { origin: 'https://untrusted.invalid' } })).status()).toBe(403)
})
