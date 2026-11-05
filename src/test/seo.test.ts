import { describe, expect, it, vi } from 'vitest'
import { indexingAllowed, pageMetadata, siteOrigin } from '@/lib/site'
import { publicRoutes as routes } from '@/lib/routes'
import { brand } from '@/lib/brand'
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
  it('uses distinct public canonicals, index/follow and nine sitemap URLs after indexing is authorized', () => {
    // Configuration fixture only; no request to or assumption about this hostname.
    const origin = brand.origin
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', origin); vi.stubEnv('SITE_INDEXING_ENABLED', 'true'); vi.stubEnv('VERCEL_ENV', 'production'); vi.stubEnv('NODE_ENV', 'production')
    expect(sitemap().map(entry => entry.url)).toEqual(routes.map(route => origin + route.href))
    expect(new Set(routes.map(route => pageMetadata(route.key).title)).size).toBe(9)
    for (const route of routes) {
      expect(pageMetadata(route.key).alternates?.canonical).toBe(origin + route.href)
      expect(pageMetadata(route.key).robots).toEqual({ index: true, follow: true })
    }
    expect(robots()).toHaveProperty('sitemap', origin + '/sitemap.xml')
    expect(robots().rules).toEqual([
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/thanks'] },
      { userAgent: ['GPTBot', 'Google-Extended', 'ClaudeBot', 'CCBot'], disallow: '/' },
    ])
    expect(sitemap().map(entry => entry.url)).not.toEqual(expect.arrayContaining([origin + '/legal/privacy', origin + '/thanks', origin + '/api/lead']))
  })
  it.each([
    ['preview', 'production', brand.origin, 'true', false],
    ['development', 'development', brand.origin, 'true', false],
    ['production', 'development', brand.origin, 'true', false],
    ['', 'development', brand.origin, 'true', false],
    ['', 'production', brand.origin, 'true', true],
    ['production', 'production', 'https://preview.vercel.app', 'true', false],
    ['production', 'production', brand.origin, 'false', false],
  ])('gates %s / %s / %s / %s coherently', (vercel, node, origin, enabled, allowed) => {
    vi.stubEnv('VERCEL_ENV', vercel); vi.stubEnv('NODE_ENV', node)
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', origin); vi.stubEnv('SITE_INDEXING_ENABLED', enabled)
    expect(indexingAllowed()).toBe(allowed)
    expect(pageMetadata('businessAutomation').robots).toEqual({ index: allowed, follow: allowed })
    expect(sitemap()).toHaveLength(allowed ? routes.length : 0)
    if (!allowed) expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } })
  })
  it('keeps preview environments out of the index even with production settings', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://configured-origin.co.il'); vi.stubEnv('SITE_INDEXING_ENABLED', 'true'); vi.stubEnv('VERCEL_ENV', 'preview')
    expect(indexingAllowed()).toBe(false)
    expect(pageMetadata('contact').robots).toEqual({ index: false, follow: false })
  })
})
