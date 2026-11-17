// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fixture-token')
  vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
})

describe('Confirmation duplicate protection', () => {
  it('claims a submission atomically across instances without storing visitor content', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ result: 'OK' })).mockResolvedValueOnce(Response.json({ result: null }))
    vi.stubGlobal('fetch', fetchMock)
    const { claimAutoReply } = await import('@/lib/inquiry-autoreply')
    expect(await claimAutoReply('submission-fixture')).toBe(true)
    expect(await claimAutoReply('submission-fixture')).toBe(false)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(['SET', 'bottomline:inquiry:autoreply:v1:submission-fixture', '1', 'EX', '90000', 'NX'])
  })
  it.each([{ error: 'fixture failure' }, { result: 1 }, { result: 'unexpected' }])('fails closed on malformed claim responses: %j', async body => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body)))
    const { claimAutoReply } = await import('@/lib/inquiry-autoreply')
    await expect(claimAutoReply('submission-fixture')).rejects.toThrow('Invalid confirmation claim')
  })
  it('requires shared state in production and propagates storage outages to the best-effort caller', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    vi.stubGlobal('fetch', fetchMock)
    const { claimAutoReply } = await import('@/lib/inquiry-autoreply')
    await expect(claimAutoReply('submission-fixture')).rejects.toThrow('Confirmation claim unavailable')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    await expect(claimAutoReply('submission-fixture')).rejects.toThrow('Shared confirmation claims required')
  })
})
