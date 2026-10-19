import type { MetadataRoute } from 'next'
import { indexingAllowed, routes, siteOrigin } from '@/lib/site'
export const dynamic = 'force-dynamic'
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingAllowed()) return []
  return routes.map(route => ({ url: `${siteOrigin()}${route.href}` }))
}
