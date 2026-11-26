import { publicRoutes } from './routes'

const measuredPaths = new Set<string>([
  ...publicRoutes.map(route => route.href),
  '/testimonials', '/legal/privacy', '/legal/terms', '/legal/accessibility',
])
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term', 'utm_source_platform']
const denied = {
  analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
} as const
const granted = { ...denied, analytics_storage: 'granted' } as const

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: (...args: unknown[]) => void
    [key: `ga-disable-${string}`]: boolean | undefined
  }
}

let activeId: string | undefined
let configuredId: string | undefined

export function analyticsLocation(href: string): URL {
  const input = new URL(href)
  const path = input.pathname.replace(/\/$/, '') || '/'
  const page = new URL(measuredPaths.has(path) ? path : '/404', input.origin)
  for (const key of campaignKeys) {
    const value = input.searchParams.get(key)
    if (value && /^[a-z0-9][a-z0-9_.-]{0,79}$/i.test(value)) page.searchParams.set(key, value)
  }
  return page
}

export function analyticsReferrer(href: string): string {
  if (!href) return ''
  const referrer = new URL(href)
  return referrer.origin === location.origin ? analyticsLocation(href).href : `${referrer.origin}/`
}

export function measurePage(id: string, page: string, referrer: string) {
  const pageDetails = { page_location: page, page_referrer: referrer }
  if (configuredId !== id) {
    const queue = window.dataLayer ??= []
    // The Google tag snippet queues arguments objects as commands.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { queue.push(arguments) }
    window.gtag('consent', 'default', denied)
    window.gtag('consent', 'update', granted)
    window.gtag('js', new Date())
    window.gtag('set', pageDetails)
    window.gtag('config', id, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    })
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    script.async = true
    script.referrerPolicy = 'no-referrer'
    document.head.append(script)
    configuredId = id
  } else {
    if (!activeId) {
      window[`ga-disable-${id}`] = false
      window.gtag?.('consent', 'update', granted)
    }
    window.gtag?.('set', pageDetails)
  }
  activeId = id
  window.gtag?.('event', 'page_view', { ...pageDetails, send_to: id })
}

export function stopAnalytics() {
  if (!activeId) return
  const id = activeId
  activeId = undefined
  window[`ga-disable-${id}`] = true
  window.gtag?.('consent', 'update', denied)
  for (const name of ['_ga', `_ga_${id.slice(2)}`]) {
    const expire = `${name}=; Path=/; Max-Age=0`
    document.cookie = expire
    const domain = location.hostname.replace(/^www\./, '')
    document.cookie = `${expire}; Domain=${domain}`
  }
}

export function trackAnalytics(event: 'generate_lead' | 'whatsapp_click') {
  if (!activeId) return
  window.gtag?.('event', event, { send_to: activeId })
}
