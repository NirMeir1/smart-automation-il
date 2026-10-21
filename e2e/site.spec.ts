import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { routes } from '../src/lib/routes'
import { pages } from '../src/content/pages'
import { pageTextNodes } from '../src/content/schema'
import { browserTestOrigin } from '../scripts/browser-test-env.mjs'

for (const route of routes) test(`${route.href}: copy, metadata, links, layout and accessibility`, async ({ page }) => {
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
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', browserTestOrigin + route.href)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  const body = await page.locator('body').innerText()
  expect(body).not.toMatch(/Sogomatic|אוטומציה חכמה|smart-automation\.co\.il|50%|90%|50\+|050-1234567|24 שעות/)
  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()
  const mainText = normalize((await page.locator('main').textContent())!)
  if (route.key === 'about') {
    await expect(page.locator('main > article')).toHaveAttribute('dir', 'rtl')
    const placeholder = page.getByText('כאן תופיע תמונה מקצועית של ניר מאיר', { exact: true })
    await expect(placeholder).toBeVisible()
    const portrait = await placeholder.locator('..').boundingBox()
    expect(portrait).not.toBeNull()
    expect(portrait!.width / portrait!.height).toBeCloseTo(4 / 5, 2)
    await expect(page.locator('main img, main a[href*="linkedin"], main a[href*="github"]')).toHaveCount(0)
    await expect(page.locator('bdi[dir="ltr"]').filter({ hasText: 'FDE' })).toHaveCount(1)
    expect(mainText).not.toMatch(/נדרש להשלמה|שם מלא תמונה מקצועית/)
  }
  for (const node of pageTextNodes(pages[route.key])) expect(mainText).toContain(normalize(node.text))
  for (const section of pages[route.key].sections) await expect(page.locator(`#${section.id}-heading`)).toHaveText(section.title)
  for (const href of await page.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
    expect(href).toMatch(/^(\/|#)/)
    const path = href!.split(/[?#]/)[0]
    if (path) expect([...routes.map(r => r.href), '/legal/privacy', '/legal/terms', '/legal/accessibility']).toContain(path)
  }
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(accessibility.violations).toEqual([])
  expect(issues).toEqual([])
})

test('navigation and every page CTA reach their real internal destinations', async ({ page, request }) => {
  const checked = new Set<string>()
  for (const route of routes) {
    await page.goto(route.href)
    for (const href of await page.locator('main a, footer a').evaluateAll(links => links.map(link => link.getAttribute('href')!))) {
      if (checked.has(href)) continue
      checked.add(href)
      expect((await request.get(href)).status(), href).toBe(200)
    }
    const menu = page.getByRole('button', { name: 'פתיחת תפריט' })
    if (await menu.isVisible()) await menu.click()
    const next = routes[(routes.indexOf(route) + 1) % routes.length]
    await page.getByRole('navigation', { name: 'ניווט ראשי', exact: true }).getByRole('link', { name: next.label, exact: true }).click()
    await expect(page).toHaveURL(next.href)
    await expect(page.locator('h1')).toHaveText(pages[next.key].h1)
  }
})

test('restored design tokens, responsive hero and honest 16:9 video area', async ({ page }) => {
  for (const width of [320, 390, 768, 820, 1024, 1440, 1536, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    const layout = await page.evaluate(() => {
      const video = document.querySelector('.video-surface')!.getBoundingClientRect()
      const copy = document.querySelector('.hero-copy')!.getBoundingClientRect()
      const bodyStyle = getComputedStyle(document.body)
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        white: bodyStyle.backgroundColor, navy: bodyStyle.color,
        font: bodyStyle.fontFamily, accent: getComputedStyle(document.querySelector('.home-hero .action')!).backgroundColor,
        video: { x: video.x, y: video.y, width: video.width, height: video.height },
        copy: { x: copy.x, bottom: copy.bottom },
      }
    })
    expect(layout.overflow, `width ${width}`).toBe(false)
    expect(layout.white).toBe('rgb(248, 247, 242)')
    expect(layout.navy).toBe('rgb(24, 45, 44)')
    expect(layout.accent).toBe('rgb(35, 92, 72)')
    expect(layout.font.toLowerCase()).toContain('heebo')
    expect(layout.video.width / layout.video.height).toBeCloseTo(16 / 9, 1)
    if (width <= 900) expect(layout.video.y).toBeGreaterThanOrEqual(layout.copy.bottom)
    else expect(layout.video.x + layout.video.width).toBeLessThan(layout.copy.x)
    await expect(page.locator('.introduction-video')).toContainText('כאן יופיע סרטון ההיכרות')
    await expect(page.locator('.introduction-video button, .introduction-video video, .problem-diagram, .headline-accent')).toHaveCount(0)
  }
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
