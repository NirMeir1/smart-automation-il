// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const headers = (address = '203.0.113.7') => new Headers({ 'x-forwarded-for': address })
beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('CONTACT_TRUST_PROXY', 'true')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
  vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
})
afterEach(() => vi.restoreAllMocks())

describe('Shared contact abuse protection', () => {
  it('enforces one counter across independent server instances without sending raw addresses', async () => {
    const counts = new Map<string, number>()
    const remote = vi.fn(async (_url: string, options: RequestInit) => {
      const key = JSON.parse(String(options.body))[3] as string
      const count = (counts.get(key) || 0) + 1
      counts.set(key, count)
      return Response.json({ result: [count, 420] })
    })
    vi.stubGlobal('fetch', remote)
    const first = await import('@/lib/contact-rate-limit')
    for (let attempt = 0; attempt < 5; attempt++) expect((await first.checkContactRateLimit(headers())).allowed).toBe(true)
    vi.resetModules()
    const second = await import('@/lib/contact-rate-limit')
    expect(await second.checkContactRateLimit(headers())).toEqual({ allowed: false, retryAfter: 420 })
    expect((await second.checkContactRateLimit(headers('203.0.113.8'))).allowed).toBe(true)
    expect(counts.size).toBe(2)
    expect(JSON.stringify(remote.mock.calls)).not.toMatch(/203\.0\.113\./)
  })
  it.each([
    { result: [1, -1] }, { result: [1, 601] }, { result: [1.5, 600] }, { result: ['1', 600] },
    { result: [1] }, { result: null }, { error: 'private provider detail' },
  ])('rejects invalid service replies instead of failing open: %j', async reply => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(reply)))
    const { checkContactRateLimit } = await import('@/lib/contact-rate-limit')
    await expect(checkContactRateLimit(headers())).rejects.toThrow('Invalid rate-limit service response')
  })
  it('rejects missing/spoofed client addresses and an untrusted production ingress', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const remote = vi.fn(); vi.stubGlobal('fetch', remote)
    const { checkContactRateLimit } = await import('@/lib/contact-rate-limit')
    await expect(checkContactRateLimit(new Headers())).rejects.toThrow()
    await expect(checkContactRateLimit(headers('malformed'))).rejects.toThrow()
    vi.stubEnv('CONTACT_TRUST_PROXY', 'false')
    await expect(checkContactRateLimit(headers())).rejects.toThrow()
    expect(remote).not.toHaveBeenCalled()
  })
  it('never substitutes an instance-local limiter for missing production configuration', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    const { checkContactRateLimit } = await import('@/lib/contact-rate-limit')
    await expect(checkContactRateLimit(headers())).rejects.toThrow('Shared rate limiting is required')
  })
  it.each(['http://unit-test.upstash.io', 'https://unit-test.upstash.io.evil.test', 'https://user:secret@unit-test.upstash.io', 'https://unit-test.upstash.io/other'])('rejects an unsafe service endpoint: %s', async url => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', url)
    const { redisRateLimitConfig } = await import('@/lib/contact-rate-limit')
    expect(redisRateLimitConfig()).toBeNull()
  })
  it('expires the development counter and keeps different trusted clients independent', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1000)
    const { checkContactRateLimit } = await import('@/lib/contact-rate-limit')
    for (let attempt = 0; attempt < 5; attempt++) expect((await checkContactRateLimit(headers())).allowed).toBe(true)
    expect((await checkContactRateLimit(headers())).allowed).toBe(false)
    expect((await checkContactRateLimit(headers('203.0.113.8'))).allowed).toBe(true)
    clock.mockReturnValue(601001)
    expect((await checkContactRateLimit(headers())).allowed).toBe(true)
  })
})
