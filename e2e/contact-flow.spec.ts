import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { callerTypes, inquirySuccess, meetingFormats } from '../src/lib/inquiry'

test.beforeEach(async ({ page }) => {
  // A missing mock must fail locally, never fall through to a delivery endpoint.
  await page.route('**/api/**', route => route.abort('blockedbyclient'))
})

async function fill(page: Page) {
  await page.locator('#name').fill('Browser fixture')
  await page.locator('#email').fill('visitor@example.test')
  await page.locator('#callerType').selectOption(callerTypes[0])
  await page.locator('#message').fill('A browser test inquiry about improving an existing process.')
  if (!await page.locator('#privacy').isChecked()) {
    await page.locator('#privacy').focus()
    await page.keyboard.press('Space')
  }
}

for (const method of ['email', 'phone', 'both'] as const) test(`submits ${method} contact details accurately with responsive fields`, async ({ page }) => {
  let received: Record<string, unknown> | undefined
  await page.route('**/api/lead', async route => {
    received = route.request().postDataJSON()
    await route.fulfill({ json: { success: true } })
  })
  await page.goto('/contact')
  await fill(page)
  if (method === 'phone') await page.locator('#email').fill('')
  if (method !== 'email') await page.locator('#phone').fill('0502345678')
  await page.locator('#systems').fill('Gmail ו-Sheets')
  await page.locator('#budget').fill('עדיין לא יודע/ת')
  await expect(page.locator('#email')).toHaveAttribute('type', 'email')
  await expect(page.locator('#phone')).toHaveAttribute('type', 'tel')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.locator('button[type=submit]').click()
  await expect(page.getByRole('heading', { name: inquirySuccess.title, exact: true })).toBeVisible()
  expect(received).toMatchObject({ email: method === 'phone' ? '' : 'visitor@example.test', phone: method === 'email' ? '' : '0502345678', systems: 'Gmail ו-Sheets', budget: 'עדיין לא יודע/ת' })
})

test('rejects an invalid supplied contact method while keeping the valid one', async ({ page }) => {
  let requests = 0
  page.on('request', request => { if (request.url().includes('/api/')) requests++ })
  await page.goto('/contact')
  await fill(page)
  await page.locator('#phone').fill('bad phone')
  await page.locator('button[type=submit]').click()
  await expect(page.locator('#phone')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#email')).toHaveValue('visitor@example.test')
  expect(requests).toBe(0)
})

test('protects edits while client scripts are still loading', async ({ page }) => {
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route(/\/_next\/static\/.*\.js(?:\?|$)/, async route => {
    await gate
    await route.continue()
  })
  try {
    await page.goto('/contact', { waitUntil: 'commit' })
    await expect(page.locator('#name')).toBeDisabled()
    await expect(page.locator('button[type=submit]')).toBeDisabled()
  } finally { release() }
  await page.locator('#name').fill('Preserved after hydration')
  await expect(page.locator('#name')).toHaveValue('Preserved after hydration')
})

test('validates without sending, focuses the summary and supports keyboard fields', async ({ page }) => {
  let requests = 0
  page.on('request', request => { if (request.url().includes('/api/')) requests++ })
  await page.goto('/contact')
  await page.locator('#privacy').check()
  await page.locator('button[type=submit]').click()
  await expect(page.locator('form').getByRole('alert')).toBeFocused()
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true')
  await page.locator('form').getByRole('alert').locator('a[href="#name"]').click()
  await expect(page.locator('#name')).toBeFocused()
  await fill(page)
  await expect(page.locator('#privacy')).toBeChecked()
  const radio = page.getByRole('radio', { name: meetingFormats[0], exact: true })
  await radio.focus()
  await page.keyboard.press('Space')
  await expect(radio).toBeChecked()
  expect(requests).toBe(0)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
})

test('consent controls the gray disabled button and blocks Enter submission', async ({ page }) => {
  let requests = 0
  page.on('request', request => { if (request.url().includes('/api/')) requests++ })
  await page.goto('/contact')
  const button = page.locator('button[type=submit]')
  await expect(button).toBeDisabled()
  await expect(button).toHaveCSS('background-color', 'rgb(224, 227, 225)')
  await fill(page)
  await expect(button).toBeEnabled()
  await page.locator('#privacy').focus()
  await page.keyboard.press('Space')
  await expect(button).toBeDisabled()
  await page.locator('#email').press('Enter')
  expect(requests).toBe(0)
})

test('rejects the reported invalid phone before any API call and accepts correction', async ({ page }) => {
  let requests = 0
  page.on('request', request => { if (request.url().includes('/api/')) requests++ })
  await page.goto('/contact')
  await fill(page)
  await page.locator('#phone').fill('05238349823983')
  await page.locator('#phone').blur()
  await expect(page.locator('#phone')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#phone-error')).toBeVisible()
  await page.locator('button[type=submit]').click()
  await expect(page.locator('form').getByRole('alert')).toBeFocused()
  expect(requests).toBe(0)
  await page.locator('#phone').fill('0522345678')
  await expect(page.locator('#phone')).toHaveAttribute('aria-invalid', 'false')
  await expect(page.locator('#phone-error')).toHaveCount(0)
})

test('shows pending state and confirms only a successful backend receipt', async ({ page }) => {
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  let requests = 0
  await page.route('**/api/lead', async route => {
    requests++
    const payload = route.request().postDataJSON()
    expect(payload.privacy).toBe(true)
    expect(payload.submissionId).toMatch(/^[a-f0-9-]{36}$/)
    await gate
    await route.fulfill({ json: { success: true } })
  })
  await page.goto('/contact')
  await fill(page)
  await page.locator('button[type=submit]').click()
  await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('button[type=submit]')).toBeDisabled()
  await expect(page.locator('#name')).toBeDisabled()
  release()
  await expect(page.getByRole('heading', { name: inquirySuccess.title, exact: true })).toBeVisible()
  await expect(page.getByRole('status')).toBeFocused()
  await expect(page.getByRole('status')).toContainText(inquirySuccess.body)
  expect(requests).toBe(1)
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0])
})

for (const status of [429, 503]) test(`retains data and retry identity after ${status}; edits create a new identity`, async ({ page }) => {
  const identities: string[] = []
  await page.route('**/api/lead', async route => {
    identities.push(route.request().postDataJSON().submissionId)
    await route.fulfill(identities.length < 3
      ? { status, json: { error: 'Temporary browser fixture failure' } }
      : { json: { success: true } })
  })
  await page.goto('/contact')
  await fill(page)
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.locator('button[type=submit]').click()
    await expect(page.locator('form').getByRole('alert')).toBeFocused()
    await expect(page.locator('form').getByRole('alert')).toContainText('Temporary browser fixture failure')
    await expect(page.locator('#name')).toHaveValue('Browser fixture')
    await expect(page.locator('#privacy')).toBeChecked()
    await expect(page.locator('button[type=submit]')).toBeEnabled()
  }
  expect(identities[0]).toBe(identities[1])
  await page.locator('#message').fill('Changed inquiry for the browser fixture.')
  await page.locator('button[type=submit]').click()
  await expect(page.getByRole('heading', { name: inquirySuccess.title, exact: true })).toBeVisible()
  expect(identities[2]).not.toBe(identities[0])
})

test('uses the validated server intent and ignores unknown query values', async ({ page }) => {
  await page.goto('/contact?intent=idea#inquiry')
  await expect(page.locator('#callerType')).toHaveValue('יזם/ת')
  await page.goto('/contact?intent=unknown')
  await expect(page.locator('#callerType')).toHaveValue('')
})
