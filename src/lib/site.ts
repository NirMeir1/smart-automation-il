import type { Metadata } from 'next'
import { pages } from '@/content/pages'
import type { PageKey } from '@/content/schema'
import { publicRoutes } from './routes'
import { brand } from './brand'
import { indexingAllowed, siteOrigin } from './site-config'
export { routes } from './routes'
export { indexingAllowed, siteOrigin } from './site-config'

export type { PageKey } from '@/content/schema'

export function pageMetadata(key: PageKey): Metadata {
  const { title, description } = pages[key]
  const path = publicRoutes.find(route => route.key === key)!.href
  const origin = siteOrigin()
  return {
    title, description,
    ...(origin ? { metadataBase: new URL(origin), alternates: { canonical: `${origin}${path}` } } : {}),
    openGraph: { title, description, siteName: brand.name, locale: 'he_IL', type: 'website', images: [{ url: '/brand/og-image-1200x630.png', width: 1200, height: 630, alt: 'Posiblo — פתרונות טכנולוגיים לעסקים' }], ...(origin ? { url: `${origin}${path}` } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: [{ url: '/brand/og-image-1200x630.png', alt: 'Posiblo — פתרונות טכנולוגיים לעסקים' }] },
    robots: { index: indexingAllowed(), follow: indexingAllowed() },
  }
}
