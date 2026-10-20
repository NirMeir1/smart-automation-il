// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { emptyInquiry } from '@/lib/inquiry'

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
  vi.stubEnv('CONTACT_FORM_ENABLED', 'true')
  vi.stubEnv('RESEND_API_KEY', 're_transport_fixture')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'sender@example.test')
  vi.stubEnv('CONTACT_TRUST_PROXY', 'false')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
  vi.spyOn(console, 'info').mockImplementation(() => {})
})

describe('Real Resend SDK transport with intercepted HTTP (no external delivery)', () => {
  it.each([true, false])('reports success only for a provider acceptance receipt: %s', async accepted => {
    const remote = vi.fn().mockResolvedValue(accepted
      ? Response.json({ id: 'intercepted-receipt' })
      : Response.json({ name: 'validation_error', message: 'internal provider detail' }, { status: 422 }))
    vi.stubGlobal('fetch', remote)
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(new NextRequest('http://localhost:3000/api/lead', {
      method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
      body: JSON.stringify({ ...emptyInquiry, name: 'ישראל ישראלי', email: 'visitor@example.test', phone: '0502345678', message: 'שיפור תהליך\nפרטים נוספים', callerType: 'עסק', privacy: true, startedAt: Date.now() - 3000, submissionId: '123e4567-e89b-42d3-a456-426614174000' }),
    }))
    expect(response.status).toBe(accepted ? 200 : 502)
    expect(remote).toHaveBeenCalledTimes(1)
    const [url, options] = remote.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(new Headers(options.headers).get('Idempotency-Key')).toBe('bottomline-inquiry/123e4567-e89b-42d3-a456-426614174000')
    expect(JSON.parse(options.body)).toMatchObject({ to: ['meirnir89@gmail.com'], reply_to: 'visitor@example.test', text: expect.stringContaining('שיפור תהליך\nפרטים נוספים') })
    expect(JSON.stringify(await response.json())).not.toContain('internal provider detail')
  })
})
