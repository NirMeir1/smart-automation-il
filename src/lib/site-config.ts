import 'server-only'
import { brand } from './brand'

export function siteOrigin(): string | undefined {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || '')
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || /^(localhost|127\.|example\.)/.test(url.hostname) || url.hostname.endsWith('.test')) return undefined
    return url.origin
  } catch { return undefined }
}

export function indexingAllowed() {
  const production = process.env.NODE_ENV === 'production' &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production')
  return production && siteOrigin() === brand.origin && process.env.SITE_INDEXING_ENABLED === 'true'
}
