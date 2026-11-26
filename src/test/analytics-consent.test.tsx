import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { AnalyticsConsent } from '@/components/analytics-consent'
import { ContactLinks } from '@/components/contact-methods'
import { MobileActionBar } from '@/components/layout/mobile-action-bar'
import { trackAnalytics } from '@/lib/analytics'

vi.mock('next/navigation', () => ({ usePathname: () => location.pathname }))

it('measures one view per route and each WhatsApp activation only after analytics consent', () => {
  const fixtureId = 'G-' + '0'.repeat(10)
  vi.mocked(localStorage.setItem).mockImplementation((_key, value) => {
    vi.mocked(localStorage.getItem).mockReturnValue(value)
  })
  const script = () => document.head.querySelectorAll('script[src*="googletagmanager.com"]')
  const commands = () => window.dataLayer?.map(command => Array.from(command)) ?? []
  const events = () => commands().filter(command => command[0] === 'event')
  const site = () => <><AnalyticsConsent id={fixtureId} /><ContactLinks /><MobileActionBar /></>
  window.history.replaceState(null, '', '/?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&email=person@example.test')
  const { rerender } = render(site())
  fireEvent.click(screen.getByRole('link', { name: 'שליחת הודעה בוואטסאפ' }))
  expect(script()).toHaveLength(0)
  expect(commands()).toEqual([])

  fireEvent.click(screen.getByRole('button', { name: 'ללא מדידה' }))
  expect(screen.queryByRole('button', { name: 'אישור מדידה' })).not.toBeInTheDocument()
  expect(script()).toHaveLength(0)
  window.history.pushState(null, '', '/about')
  rerender(site())
  fireEvent.click(screen.getByRole('button', { name: 'העדפות עוגיות' }))
  fireEvent.click(screen.getByRole('button', { name: 'אישור מדידה' }))
  expect(script()).toHaveLength(1)
  expect(commands().slice(0, 2)).toEqual([
    ['consent', 'default', expect.objectContaining({ analytics_storage: 'denied', ad_storage: 'denied' })],
    ['consent', 'update', expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied' })],
  ])
  expect(commands().slice(2, 4)).toEqual([
    ['set', 'send_page_view', false],
    ['js', expect.any(Date)],
  ])
  const measured = `${location.origin}/about?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile`
  expect(events()).toEqual([['event', 'page_view', expect.objectContaining({ page_location: measured })]])
  expect(JSON.stringify(commands())).not.toContain('person@example.test')

  window.history.pushState(null, '', '/about#main')
  rerender(site())
  expect(events()).toHaveLength(1)
  window.history.pushState(null, '', '/business')
  rerender(site())
  expect(events()).toHaveLength(2)
  expect(events()[1]).toEqual(['event', 'page_view', expect.objectContaining({
    page_location: `${location.origin}/business`, page_referrer: measured,
  })])
  fireEvent.click(screen.getByRole('link', { name: 'שליחת הודעה בוואטסאפ' }))
  fireEvent.click(screen.getByRole('link', { name: 'כתבו לי בוואטסאפ' }))
  expect(events().slice(2)).toEqual(Array(2).fill(['event', 'whatsapp_click', { send_to: fixtureId }]))

  document.cookie = '_ga=fixture; Path=/'
  fireEvent.click(screen.getByRole('button', { name: 'העדפות עוגיות' }))
  fireEvent.click(screen.getByRole('button', { name: 'ללא מדידה' }))
  expect(window[`ga-disable-${fixtureId}`]).toBe(true)
  expect(document.cookie).not.toContain('_ga=')
  trackAnalytics('generate_lead')
  fireEvent.click(screen.getByRole('link', { name: 'שליחת הודעה בוואטסאפ' }))
  expect(events()).toHaveLength(4)
})
