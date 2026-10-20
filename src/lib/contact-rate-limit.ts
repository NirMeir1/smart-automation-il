import 'server-only'
import { createHmac, randomBytes } from 'node:crypto'
import { isIP } from 'node:net'

const WINDOW_SECONDS = 600
const MAX_REQUESTS = 5
const localSalt = randomBytes(32).toString('hex')
const buckets = new Map<string, { count: number; expires: number }>()
export type RateLimitDecision = { allowed: boolean; retryAfter: number }

export function redisRateLimitConfig() {
  try {
    const url = new URL(process.env.UPSTASH_REDIS_REST_URL || '')
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
    const secret = process.env.CONTACT_RATE_LIMIT_SECRET || ''
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.upstash.io') || url.username || url.password || url.port || url.pathname !== '/' || url.search || url.hash || !token || secret.length < 32) return null
    return { url: url.origin, token, secret }
  } catch { return null }
}

export function productionRateLimitConfigured() {
  return process.env.CONTACT_TRUST_PROXY === 'true' && Boolean(redisRateLimitConfig())
}

function clientKey(headers: Headers, secret: string) {
  let identity = 'local-development'
  if (process.env.CONTACT_TRUST_PROXY === 'true') {
    const address = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (!address || !isIP(address)) throw new Error('Trusted client address is unavailable')
    identity = address
  } else if (process.env.NODE_ENV === 'production') {
    throw new Error('Trusted ingress is not configured')
  }
  return `bottomline:inquiry:rate:v1:${createHmac('sha256', secret).update(identity).digest('hex')}`
}

// One atomic script gives every instance the same fixed-window count and TTL.
const incrementWindow = `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('TTL', KEYS[1])}`

export async function checkContactRateLimit(headers: Headers): Promise<RateLimitDecision> {
  const config = redisRateLimitConfig()
  if (config) {
    const key = clientKey(headers, config.secret)
    const response = await fetch(config.url, {
      method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', incrementWindow, '1', key, String(WINDOW_SECONDS)]),
      signal: AbortSignal.timeout(3000), cache: 'no-store', redirect: 'error',
    })
    if (!response.ok) throw new Error('Rate-limit service is unavailable')
    const body: unknown = await response.json()
    const result = body && typeof body === 'object' && 'result' in body ? body.result : undefined
    if (!Array.isArray(result) || result.length !== 2 || !Number.isInteger(result[0]) || result[0] < 1 || !Number.isInteger(result[1]) || result[1] < 0 || result[1] > WINDOW_SECONDS) throw new Error('Invalid rate-limit service response')
    return { allowed: result[0] <= MAX_REQUESTS, retryAfter: Math.max(1, result[1]) }
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Shared rate limiting is required in production')
  const now = Date.now()
  for (const [key, bucket] of buckets) if (bucket.expires <= now) buckets.delete(key)
  const key = clientKey(headers, localSalt)
  let bucket = buckets.get(key)
  if (!bucket) {
    if (buckets.size >= 5000) return { allowed: false, retryAfter: WINDOW_SECONDS }
    bucket = { count: 0, expires: now + WINDOW_SECONDS * 1000 }
    buckets.set(key, bucket)
  }
  bucket.count++
  return { allowed: bucket.count <= MAX_REQUESTS, retryAfter: Math.max(1, Math.ceil((bucket.expires - now) / 1000)) }
}
