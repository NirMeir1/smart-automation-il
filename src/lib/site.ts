import type { Metadata } from 'next'
import { pages } from '@/content/pages'
import type { PageKey } from '@/content/schema'
import { routes } from './routes'
import { indexingAllowed, siteOrigin } from './site-config'
export { routes } from './routes'
export { indexingAllowed, siteOrigin } from './site-config'

export type { PageKey } from '@/content/schema'

export function pageMetadata(key: PageKey): Metadata {
  const { title, description } = pages[key]
  const path = routes.find(route => route.key === key)!.href
  const origin = siteOrigin()
  return {
    title, description,
    ...(origin ? { alternates: { canonical: `${origin}${path}` } } : {}),
    openGraph: { title, description, siteName: 'BottomLine', locale: 'he_IL', type: 'website', ...(origin ? { url: `${origin}${path}` } : {}) },
    robots: { index: indexingAllowed(), follow: indexingAllowed() },
  }
}
