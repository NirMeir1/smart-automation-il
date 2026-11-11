import { expect, test } from './test'
import AxeBuilder from '@axe-core/playwright'
import { routes, publicRoutes } from '../src/lib/routes'
import { pages } from '../src/content/pages'
import { pageTextNodes } from '../src/content/schema'
import { browserTestOrigin } from '../scripts/browser-test-env.mjs'
import { operator } from '../src/lib/brand'

test('legal copy reflows at 320 CSS pixels with doubled text', async ({ page }) => {
  // 1280px / 4 = 320 CSS px: zoom-equivalent reflow, not a claim that browser UI zoom was operated.
  await page.setViewportSize({ width: 320, height: 900 })
  for (const path of ['/legal/privacy', '/legal/terms', '/legal/accessibility']) {
    await page.goto(path)
    await page.locator('main h1, main h2, main p, main a').evaluateAll(elements => {
      const sizes = elements.map(element => parseFloat(getComputedStyle(element).fontSize))
      elements.forEach((element, index) => { (element as HTMLElement).style.fontSize = `${sizes[index] * 2}px` })
    })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('article a[href^="mailto:"]').first()).toBeVisible()
  }
})

test('native video can be reached and toggled using the keyboard', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit' && process.platform === 'win32', 'Windows WebKit rejects this MP4 with NotSupportedError even in isolated HTML; verify real Safari playback separately')
  await page.goto('/')
  const video = page.locator('.introduction-video video')
  await expect(video.locator('source')).toHaveAttribute('src', '/videos/founder-introduction-blurred.mp4')
  await expect(page.getByText(/בסרטון משולבות כתוביות בעברית/)).toBeVisible()
  await video.evaluate((element: HTMLVideoElement) => { element.muted = true })
  await video.focus()
  expect(await video.evaluate(element => document.activeElement === element)).toBe(true)
  expect(await video.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none')
  await page.keyboard.press('Space')
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true)
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 10000 }).toBeGreaterThan(0)
  await page.keyboard.press('Space')
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true)
})

test('intentional video originals and derivatives remain directly accessible', async ({ request }) => {
  for (const name of ['founder-introduction.mp4', 'founder-introduction-blurred.mp4', 'founder-introduction-poster.webp', 'founder-introduction-poster-blurred.webp']) {
    const response = await request.head(`/videos/${name}`)
    expect(response.status()).toBe(200)
    expect(Number(response.headers()['content-length'])).toBeGreaterThan(0)
  }
})

test('production security headers protect public and legal pages', async ({ request }) => {
  for (const path of ['/', '/contact', '/legal/privacy', '/legal/terms', '/legal/accessibility']) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const headers = response.headers()
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    const csp = headers['content-security-policy']
    for (const directive of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "form-action 'self'", 'upgrade-insecure-requests']) {
      expect(csp).toContain(directive)
    }
    expect(csp).not.toContain('unsafe-eval')
  }
})

for (const [path, title] of [
  ['/legal/privacy', 'מדיניות פרטיות'],
  ['/legal/terms', 'תנאי שימוש'],
  ['/legal/accessibility', 'הצהרת נגישות'],
]) test(`${path}: Hebrew legal content remains dated, unindexed and keyboard accessible`, async ({ page }) => {
  const issues: string[] = []
  page.on('pageerror', error => issues.push(error.message))
  page.on('console', message => { if (message.type() === 'error') issues.push(message.text()) })
  expect((await page.goto(path))?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'he')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('h1')).toHaveText(title)
  await expect(page).toHaveTitle(`${title} | Posiblo`)
  await expect(page.locator('main time')).toHaveAttribute('datetime', '2026-11-11')
  expect(await page.locator('main').innerText()).not.toMatch(/טיוטה|טרם אושרה|להשלמה|localhost:3000|\[.*?\]/)
  for (const href of await page.locator('main a').evaluateAll(links => links.map(link => link.getAttribute('href')!))) {
    if (href.startsWith('mailto:')) expect(href.split('?')[0]).toBe(`mailto:${operator.email}`)
    else {
      expect(href).toMatch(/^\//)
      expect((await page.request.get(href)).status()).toBe(200)
    }
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(accessibility.violations).toEqual([])
  expect(issues).toEqual([])
})

for (const route of publicRoutes) test(`${route.href}: copy, metadata, links, layout and accessibility`, async ({ page }) => {
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
  expect(body).not.toMatch(/Bottomline|BottomLine|Sogomatic|אוטומציה חכמה|smart-automation\.co\.il|50%|90%|50\+|050-1234567|24 שעות/)
  const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()
  const mainText = normalize((await page.locator('main').textContent())!)
  if (route.key === 'about') {
    await expect(page.locator('main > article')).toHaveAttribute('dir', 'rtl')
    await expect(page.getByText('כאן תופיע תמונה מקצועית של ניר מאיר', { exact: true })).toHaveCount(0)
    await expect(page.locator('main img, main a[href*="linkedin"], main a[href*="github"]')).toHaveCount(0)
    await expect(page.locator('bdi[dir="ltr"]').filter({ hasText: 'FDE' })).toHaveCount(1)
    expect(mainText).not.toMatch(/נדרש להשלמה|שם מלא תמונה מקצועית/)
  }
  for (const node of pageTextNodes(pages[route.key])) expect(mainText).toContain(normalize(node.text))
  for (const section of pages[route.key].sections) await expect(page.locator(`#${section.id}-heading`)).toHaveText(section.title)
  for (const href of await page.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
    if (href?.startsWith('mailto:')) { expect(href.split('?')[0]).toBe(`mailto:${operator.email}`); continue }
    expect(href).toMatch(/^(\/|#)/)
    const path = href!.split(/[?#]/)[0]
    if (path) expect([...publicRoutes.map(r => r.href), '/legal/privacy', '/legal/terms', '/legal/accessibility']).toContain(path)
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
      if (href.startsWith('mailto:')) { expect(href.split('?')[0]).toBe(`mailto:${operator.email}`); continue }
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

test('repeated contact anchor navigation keeps a single fragment', async ({ page }) => {
  await page.goto('/contact#inquiry')
  for (let index = 0; index < 4; index++) {
    const menu = page.getByRole('button', { name: 'פתיחת תפריט' })
    if (await menu.isVisible()) await menu.click()
    await page.locator('a.header-action').click()
    await expect(page).toHaveURL(/\/contact#inquiry$/)
    await expect(page.locator('#inquiry')).toBeInViewport()
  }
})

test('brand tokens and responsive portrait founder introduction', async ({ page }) => {
  for (const width of [320, 390, 768, 820, 1024, 1440, 1536, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.home-hero .action').first()).toHaveCSS('background-color', 'rgb(35, 92, 72)')
    const layout = await page.evaluate(() => {
      const video = document.querySelector('.video-surface')!.getBoundingClientRect()
      const copy = document.querySelector('.hero-copy')!.getBoundingClientRect()
      const bodyStyle = getComputedStyle(document.body)
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        white: bodyStyle.backgroundColor, navy: bodyStyle.color,
        font: bodyStyle.fontFamily,
        video: { x: video.x, y: video.y, width: video.width, height: video.height },
        copy: { x: copy.x, bottom: copy.bottom },
      }
    })
    expect(layout.overflow, `width ${width}`).toBe(false)
    expect(layout.white).toBe('rgb(248, 247, 242)')
    expect(layout.navy).toBe('rgb(24, 45, 44)')
    expect(layout.font.toLowerCase()).toContain('heebo')
    expect(layout.video.width / layout.video.height).toBeCloseTo(9 / 16, 2)
    expect(layout.video.width).toBeLessThanOrEqual(260)
    if (width <= 900) expect(layout.video.y).toBeGreaterThanOrEqual(layout.copy.bottom)
    else expect(layout.video.x + layout.video.width).toBeLessThan(layout.copy.x)
    await expect(page.locator('.introduction-video')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('.introduction-video h2')).toHaveText('בואו נכיר')
    await expect(page.locator('.introduction-video video')).toHaveAttribute('preload', 'none')
    const cta = page.locator('.introduction-next-step a.action')
    await expect(cta).toHaveAttribute('href', '/contact#inquiry')
    expect((await cta.boundingBox())!.y).toBeGreaterThanOrEqual(layout.video.y + layout.video.height)
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

test('production blockers are honest; legal pages and old routes exist', async ({ page, request }) => {
  await page.goto('/contact')
  await expect(page.getByRole('status')).toContainText('אינה זמינה כרגע')
  await expect(page.getByRole('button', { name: /שליחת הפנייה/ })).toBeDisabled()
  for (const path of ['/legal/privacy', '/legal/terms', '/legal/accessibility']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.getByText('עודכן לאחרונה:', { exact: false })).toBeVisible()
    expect(await page.locator('main').innerText()).not.toMatch(/טיוטה|טרם אושרה|להשלמה/)
    await expect(page.locator('time')).toHaveAttribute('datetime', '2026-11-11')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    await expect(page.locator('article a[href^="mailto:"]')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'דלג לתוכן הראשי' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
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
