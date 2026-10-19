import type { Metadata } from 'next'
import pages from '@/content/pages.json'
import { routes } from './routes'
export { routes } from './routes'

export type PageKey = keyof typeof pages

export function siteOrigin(): string | undefined {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || '')
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || /^(localhost|127\.|example\.)/.test(url.hostname) || url.hostname.endsWith('.test')) return undefined
    return url.origin
  } catch { return undefined }
}

export function indexingAllowed() {
  return Boolean(siteOrigin() && process.env.SITE_INDEXING_ENABLED === 'true' &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'))
}

export function pageMetadata(key: PageKey): Metadata {
  const { title, description } = pages[key]
  const path = routes.find(route => route.key === key)!.href
  const origin = siteOrigin()
  return {
    title, description,
    ...(origin ? { alternates: { canonical: `${origin}${path}` } } : {}),
    openGraph: { title, description, siteName: 'Bottomline', locale: 'he_IL', type: 'website', ...(origin ? { url: `${origin}${path}` } : {}) },
    robots: { index: indexingAllowed(), follow: indexingAllowed() },
  }
}
