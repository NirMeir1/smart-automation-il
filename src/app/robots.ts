import type { MetadataRoute } from 'next'
import { indexingAllowed, siteOrigin } from '@/lib/site'
export const dynamic = 'force-dynamic'
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed()) return { rules: { userAgent: '*', disallow: '/' } }
  // Public legal documents must be crawlable so their noindex metadata can be read.
  // Search access does not require granting model-training crawler access.
  return { rules: [
    { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/thanks'] },
    { userAgent: ['GPTBot', 'Google-Extended', 'ClaudeBot', 'CCBot'], disallow: '/' },
  ], sitemap: `${siteOrigin()}/sitemap.xml` }
}
