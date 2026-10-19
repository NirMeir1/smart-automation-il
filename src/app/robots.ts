import type { MetadataRoute } from 'next'
import { indexingAllowed, siteOrigin } from '@/lib/site'
export const dynamic = 'force-dynamic'
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/thanks', '/legal/'] }, sitemap: `${siteOrigin()}/sitemap.xml` }
}
