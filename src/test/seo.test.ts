import { describe, expect, it, vi } from 'vitest'
import { indexingAllowed, pageMetadata, routes, siteOrigin } from '@/lib/site'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'

describe('SEO configuration', () => {
  it('does not invent a canonical or sitemap when production origin is unknown', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    expect(siteOrigin()).toBeUndefined()
    expect(pageMetadata('home').alternates).toBeUndefined()
    expect(indexingAllowed()).toBe(false)
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } })
    expect(sitemap()).toEqual([])
  })
  it.each(['https://example.com', 'http://localhost:3000', 'bad-url', 'https://name:secret@host.co.il', 'https://host.co.il/path'])('rejects unusable configured origin %s', url => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', url)
    expect(siteOrigin()).toBeUndefined()
  })
  it('uses distinct route canonicals and all seven sitemap URLs after indexing is authorized', () => {
    // Configuration fixture only; no request to or assumption about this hostname.
    const origin = 'https://configured-origin.co.il'
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', origin); vi.stubEnv('SITE_INDEXING_ENABLED', 'true'); vi.stubEnv('VERCEL_ENV', 'production')
    expect(sitemap().map(entry => entry.url)).toEqual(routes.map(route => origin + route.href))
    expect(new Set(routes.map(route => pageMetadata(route.key).title)).size).toBe(7)
    for (const route of routes) expect(pageMetadata(route.key).alternates?.canonical).toBe(origin + route.href)
    expect(robots()).toHaveProperty('sitemap', origin + '/sitemap.xml')
  })
  it('keeps preview environments out of the index even with production settings', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://configured-origin.co.il'); vi.stubEnv('SITE_INDEXING_ENABLED', 'true'); vi.stubEnv('VERCEL_ENV', 'preview')
    expect(indexingAllowed()).toBe(false)
    expect(pageMetadata('contact').robots).toEqual({ index: false, follow: false })
  })
})
