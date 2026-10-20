// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { emptyInquiry } from '@/lib/inquiry'

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
})

describe('Inquiry email and server receipt', () => {
  it.each([
    ['2026-01-15T10:30:00Z', '12:30:00'],
    ['2026-07-15T10:30:00Z', '13:30:00'],
  ])('formats Israel time including winter/summer offset for %s', async (instant, expected) => {
    const { inquiryEmailText } = await import('@/lib/inquiry-email')
    expect(inquiryEmailText(emptyInquiry, Date.parse(instant))).toContain(expected)
  })
  it('keeps receipt time unchanged on retries rather than generating a new email payload', async () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1_790_000_000_000)
    const { inquiryReceivedAt } = await import('@/lib/inquiry-email')
    const first = await inquiryReceivedAt('example-uuid')
    clock.mockReturnValue(1_790_000_060_000)
    expect(await inquiryReceivedAt('example-uuid')).toBe(first)
    expect(await inquiryReceivedAt('another-uuid')).toBe(1_790_000_060_000)
    clock.mockRestore()
  })
  it('uses atomic expiring shared receipt storage without sending customer data', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
    vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
    const timestamp = Date.now() - 1000
    const remote = vi.fn().mockResolvedValue(Response.json({ result: String(timestamp) }))
    vi.stubGlobal('fetch', remote)
    const { inquiryReceivedAt } = await import('@/lib/inquiry-email')
    expect(await inquiryReceivedAt('example-uuid')).toBe(timestamp)
    const command = JSON.parse(remote.mock.calls[0][1].body)
    expect(command[0]).toBe('EVAL')
    expect(command[1]).toContain("redis.call('GET'")
    expect(command[1]).toContain("'EX'")
    expect(command[3]).toBe('bottomline:inquiry:receipt:v1:example-uuid')
    expect(command[5]).toBe('90000')
  })
  it.each([{ result: null }, { result: 'bad' }, { error: 'private detail' }])('fails safely on malformed shared receipt results: %j', async result => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
    vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(result)))
    const { inquiryReceivedAt } = await import('@/lib/inquiry-email')
    await expect(inquiryReceivedAt('example-uuid')).rejects.toThrow('Invalid receipt timestamp')
  })
  it.each([5000, 120_000, -90_001_000])('bounds clock skew for shared retry timestamps: %s ms', async offset => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
    vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
    const timestamp = Date.now() + offset
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ result: String(timestamp) })))
    const { inquiryReceivedAt } = await import('@/lib/inquiry-email')
    if (offset === 5000) expect(await inquiryReceivedAt('retry-from-another-server')).toBe(timestamp)
    else await expect(inquiryReceivedAt('retry-from-another-server')).rejects.toThrow('Invalid receipt timestamp')
  })
  it('does not use local receipt storage in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { inquiryReceivedAt } = await import('@/lib/inquiry-email')
    await expect(inquiryReceivedAt('example-uuid')).rejects.toThrow('Shared receipt storage is required')
  })
})
