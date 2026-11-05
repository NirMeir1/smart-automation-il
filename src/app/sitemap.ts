import type { MetadataRoute } from 'next'
import { indexingAllowed, siteOrigin } from '@/lib/site'
import { publicRoutes } from '@/lib/routes'
export const dynamic = 'force-dynamic'
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingAllowed()) return []
  return publicRoutes.map(route => ({ url: `${siteOrigin()}${route.href}` }))
}
