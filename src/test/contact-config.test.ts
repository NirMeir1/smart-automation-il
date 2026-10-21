// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { contactAvailable, contactConfigurationIssues } from '@/lib/contact-config'

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('CONTACT_FORM_ENABLED', 'true')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bottomline-ai.vercel.app')
  vi.stubEnv('CONTACT_TRUST_PROXY', 'true')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fixture.upstash.io')
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'private-redis-test-token')
  vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 'private-shared-test-secret-at-least-32-characters')
  vi.stubEnv('RESEND_API_KEY', 'private-resend-test-key')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'sender@example.test')
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('Production contact configuration diagnosis', () => {
  it('enables a configured production form without logging credentials', () => {
    expect(contactConfigurationIssues()).toEqual([])
    expect(contactAvailable()).toBe(true)
    expect(console.warn).not.toHaveBeenCalled()
  })
  it.each([
    ['CONTACT_FORM_ENABLED', 'false'],
    ['NEXT_PUBLIC_SITE_URL', 'invalid'],
    ['CONTACT_TRUST_PROXY', 'false'],
    ['UPSTASH_REDIS_REST_URL', 'redis://fixture.upstash.io'],
    ['UPSTASH_REDIS_REST_TOKEN', ''],
    ['CONTACT_RATE_LIMIT_SECRET', 'too-short'],
    ['RESEND_API_KEY', ''],
    ['CONTACT_FROM_EMAIL', 'invalid'],
    ['CONTACT_FROM_EMAIL', 'onboarding@resend.dev'],
  ])('identifies %s independently and logs its name only', (name, value) => {
    vi.stubEnv(name, value)
    expect(contactConfigurationIssues()).toEqual([name])
    expect(contactAvailable()).toBe(false)
    expect(console.warn).toHaveBeenCalledWith(JSON.stringify({ event: 'contact_configuration_unavailable', invalidSettings: [name] }))
    expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toMatch(/private-redis|private-resend|private-shared|sender@|fixture\.upstash/)
  })
  it('reports multiple problems together', () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', '')
    expect(contactConfigurationIssues()).toEqual(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'CONTACT_RATE_LIMIT_SECRET'])
  })
  it('preserves local development behavior without production-only settings', () => {
    vi.stubEnv('NODE_ENV', 'development')
    for (const key of ['NEXT_PUBLIC_SITE_URL', 'CONTACT_TRUST_PROXY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'CONTACT_RATE_LIMIT_SECRET']) vi.stubEnv(key, '')
    expect(contactAvailable()).toBe(true)
  })
})
