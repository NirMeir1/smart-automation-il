// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { emptyInquiry } from '@/lib/inquiry'
const send = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))
const payload = () => ({ ...emptyInquiry, submissionId: '123e4567-e89b-42d3-a456-426614174000', name: '<script>name</script>', contact: '0502345678', callerType: 'עסק', message: '<img onerror="alert(1)">', privacy: true, startedAt: Date.now() - 3000 })
const request = (body: unknown = payload(), headers: Record<string, string> = {}) => new NextRequest('http://localhost:3000/api/lead', { method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) })
beforeEach(() => {
  vi.resetModules(); vi.unstubAllEnvs(); send.mockReset()
  vi.spyOn(console, 'info').mockImplementation(() => {})
  vi.stubEnv('CONTACT_TRUST_PROXY', 'false')
  vi.stubEnv('CONTACT_ALLOW_LOCAL_ORIGIN', 'false')
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
  vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', '')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
  vi.stubEnv('CONTACT_FORM_ENABLED', 'true')
  vi.stubEnv('RESEND_API_KEY', 'test-only'); vi.stubEnv('CONTACT_FROM_EMAIL', 'sender@example.test')
  send.mockResolvedValue({ data: { id: 'provider-receipt' }, error: null })
})
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })
describe('Inquiry endpoint', () => {
  it('accepts explicitly enabled local production submissions with mocked providers', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CONTACT_ALLOW_LOCAL_ORIGIN', 'true')
    vi.stubEnv('VERCEL', '')
    vi.stubEnv('VERCEL_ENV', '')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://posiblo.com')
    vi.stubEnv('CONTACT_TRUST_PROXY', 'true')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token')
    vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, options) => {
      const command = JSON.parse(options.body)
      return Response.json({ result: command[3].includes(':rate:') ? [1, 600] : String(Date.now()) })
    }))
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request(payload(), { 'x-forwarded-for': '127.0.0.1' }))).status).toBe(200)
    expect(send).toHaveBeenCalledTimes(1)
  })
  it.each([
    ['false', '', '', 'http://localhost:3000', 'http://localhost:3000'],
    ['true', '1', '', 'http://localhost:3000', 'http://localhost:3000'],
    ['true', '', 'production', 'http://localhost:3000', 'http://localhost:3000'],
    ['true', '', 'preview', 'http://localhost:3000', 'http://localhost:3000'],
    ['true', '', '', 'http://localhost:3000', 'http://localhost:3001'],
    ['true', '', '', 'http://localhost:3000', 'https://localhost:3000'],
    ['true', '', '', 'http://localhost:3000', 'https://untrusted.invalid'],
    ['true', '', '', 'http://localhost:3000', ''],
    ['true', '', '', 'https://posiblo.com', 'http://localhost:3000'],
    ['true', '', '', 'https://localhost.evil.test', 'https://localhost.evil.test'],
  ])('keeps local production opt-in scoped: %s / %s / %s / %s / %s', async (enabled, vercel, deployment, url, origin) => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CONTACT_ALLOW_LOCAL_ORIGIN', enabled)
    vi.stubEnv('VERCEL', vercel)
    vi.stubEnv('VERCEL_ENV', deployment)
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://posiblo.com')
    const remote = vi.fn()
    vi.stubGlobal('fetch', remote)
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(new NextRequest(url + '/api/lead', {
      method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(payload()),
    }))).status).toBe(403)
    expect(send).not.toHaveBeenCalled()
    expect(remote).not.toHaveBeenCalled()
  })
  it.each(['lead', 'send-email'])('accepts the canonical production origin through /api/%s with approved email routing', async endpoint => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://posiblo.com')
    vi.stubEnv('CONTACT_FROM_EMAIL', 'website@posiblo.com')
    vi.stubEnv('CONTACT_TRUST_PROXY', 'true')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token')
    vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
    const redis = vi.fn().mockImplementation(async (_url, options) => {
      const command = JSON.parse(options.body)
      return Response.json({ result: command[3].includes(':rate:') ? [1, 600] : String(Date.now()) })
    })
    vi.stubGlobal('fetch', redis)
    const { POST } = endpoint === 'lead' ? await import('@/app/api/lead/route') : await import('@/app/api/send-email/route')
    const response = await POST(new NextRequest(`https://posiblo.com/api/${endpoint}`, {
      method: 'POST', headers: { origin: 'https://posiblo.com', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7' },
      body: JSON.stringify({ ...payload(), contact: '', email: 'visitor@example.test' }),
    }))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ success: true })
    expect(redis).toHaveBeenCalledTimes(2)
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      from: 'Posiblo <website@posiblo.com>', to: ['posiblo.contact@gmail.com'], replyTo: 'visitor@example.test',
      subject: 'פנייה חדשה מאתר Posiblo',
    }), expect.objectContaining({ idempotencyKey: `bottomline-inquiry/${payload().submissionId}` }))
  })
  it.each(['https://bottomline-ai.com', 'https://www.bottomline-ai.com', 'https://www.posiblo.com', 'https://posiblo.com.evil.test', ''])('rejects noncanonical or missing production request origin: %s', async origin => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://posiblo.com')
    const remote = vi.fn()
    vi.stubGlobal('fetch', remote)
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request(payload(), { origin }))).status).toBe(403)
    expect(send).not.toHaveBeenCalled()
    expect(remote).not.toHaveBeenCalled()
  })
  it.each([
    { email: 'person@example.test', phone: '' },
    { email: '', phone: '0502345678' },
    { email: 'person@example.test', phone: '0502345678' },
  ])('sends all contact methods and additional fields only to the approved mailbox: %j', async methods => {
    const { POST } = await import('@/app/api/lead/route')
    const body = { ...payload(), contact: '', ...methods, systems: 'Gmail ו-Sheets', budget: 'עדיין לא יודע/ת', meeting: 'אונליין', intent: 'idea' }
    expect((await POST(request(body))).status).toBe(200)
    const email = send.mock.calls[0][0]
    expect(email.to).toEqual(['posiblo.contact@gmail.com'])
    for (const value of [body.name, methods.email || 'לא צוין', methods.phone || 'לא צוין', body.message, body.systems, body.budget, body.meeting, 'רעיון או יזמות', 'שעון ישראל', body.submissionId]) expect(email.text).toContain(value)
    expect(email.replyTo).toBe(methods.email || undefined)
  })
  it('rejects invalid separate contact fields on the server', async () => {
    const { POST } = await import('@/app/api/lead/route')
    for (const methods of [{ email: '', phone: '' }, { email: 'bad', phone: '0502345678' }, { email: 'valid@example.test', phone: 'bad' }]) {
      expect((await POST(request({ ...payload(), contact: '', ...methods }))).status).toBe(400)
    }
    expect(send).not.toHaveBeenCalled()
  })
  it('rejects the reported phone number and missing consent even when browser validation is bypassed', async () => {
    const { POST } = await import('@/app/api/lead/route')
    const invalidPhone = await POST(request({ ...payload(), contact: '', phone: '05238349823983', email: 'valid@example.test' }))
    expect(invalidPhone.status).toBe(400)
    expect((await invalidPhone.json()).errors.phone).toBeTruthy()
    expect((await POST(request({ ...payload(), privacy: false }))).status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })
  it('returns success only with provider receipt; sends plain text and no phone replyTo', async () => {
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(request())
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ success: true })
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('<img onerror='), subject: 'פנייה חדשה מאתר Posiblo' }), expect.objectContaining({ idempotencyKey: 'bottomline-inquiry/123e4567-e89b-42d3-a456-426614174000', signal: expect.any(AbortSignal) }))
    expect(send.mock.calls[0][0]).not.toHaveProperty('html')
    expect(send.mock.calls[0][0]).not.toHaveProperty('replyTo')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })
  it('supports email-only inquiry and preserves the legacy endpoint with identical protections', async () => {
    const { POST } = await import('@/app/api/send-email/route')
    expect((await POST(request({ ...payload(), contact: 'person@example.test' }))).status).toBe(200)
    expect(send.mock.calls[0][0].replyTo).toBe('person@example.test')
  })
  it.each([{ data: null, error: { message: 'vendor secret' } }, { data: null, error: null }])('rejects provider failure or missing receipt', async result => {
    send.mockResolvedValue(result)
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(request())
    expect(response.status).toBe(502); expect(JSON.stringify(await response.json())).not.toContain('vendor secret')
  })
  it('handles a thrown provider error safely', async () => {
    send.mockRejectedValue(new Error('credential detail'))
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(502)
  })
  it('uses identical provider keys and payloads for retries across endpoint aliases', async () => {
    const body = payload()
    const { POST } = await import('@/app/api/lead/route')
    const legacy = await import('@/app/api/send-email/route')
    await POST(request(body)); await legacy.POST(request(body))
    expect(send.mock.calls[0][0]).toEqual(send.mock.calls[1][0])
    expect(send.mock.calls[0][1].idempotencyKey).toBe(send.mock.calls[1][1].idempotencyKey)
  })
  it('records only categorical outcomes, timing and server correlation IDs', async () => {
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(request())
    expect(console.info).toHaveBeenCalledWith(expect.any(String))
    const logs = JSON.stringify(vi.mocked(console.info).mock.calls)
    expect(logs).not.toMatch(/0502345678|<script>|<img|recipient@example|test-only/)
    expect(response.headers.get('X-Request-ID')).toMatch(/^[\da-f-]{36}$/)
    expect(JSON.parse(vi.mocked(console.info).mock.calls[0][0])).toMatchObject({ event: 'contact', outcome: 'accepted', requestId: response.headers.get('X-Request-ID') })
  })
  it('counts distinct provider receipts across retries and endpoint aliases without logging their raw IDs', async () => {
    const { POST } = await import('@/app/api/lead/route')
    const legacy = await import('@/app/api/send-email/route')
    const body = payload()
    await POST(request(body)); await legacy.POST(request(body))
    send.mockResolvedValueOnce({ data: { id: 'another-provider-receipt' }, error: null })
    await POST(request({ ...body, submissionId: '223e4567-e89b-42d3-a456-426614174000' }))
    send.mockResolvedValueOnce({ data: null, error: null })
    await POST(request(body))
    const events = vi.mocked(console.info).mock.calls.map(call => JSON.parse(call[0]))
    expect(events[0].conversionId).toMatch(/^[a-f0-9]{64}$/)
    expect(events[0].conversionId).toBe(events[1].conversionId)
    expect(new Set(events.filter(event => event.outcome === 'accepted').map(event => event.conversionId)).size).toBe(2)
    expect(events[3]).not.toHaveProperty('conversionId')
    expect(JSON.stringify(events)).not.toMatch(/provider-receipt|123e4567|0502345678|<script>/)
  })
  it('fails closed when the shared limiter is unavailable', async () => {
    vi.stubEnv('CONTACT_TRUST_PROXY', 'true'); vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://unit-test.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token'); vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 's'.repeat(32))
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('service down')))
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request(payload(), { 'x-forwarded-for': '203.0.113.7' }))).status).toBe(503)
    expect(send).not.toHaveBeenCalled()
  })
  it('requires shared rate-limit configuration in production', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://configured-origin.co.il')
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request(payload(), { origin: 'https://configured-origin.co.il' }))).status).toBe(503)
    expect(send).not.toHaveBeenCalled()
  })
  it('signals a changed-payload key conflict without reporting success', async () => {
    send.mockResolvedValue({ data: null, error: { name: 'invalid_idempotent_request' } })
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(request())
    expect(response.status).toBe(409)
    expect(await response.json()).toMatchObject({ retryWithNewId: true })
  })
  it('passes an abort signal that cancels a hanging delivery', async () => {
    // A real abort verifies cancellation reaches the SDK, rather than merely racing a promise.
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockImplementationOnce(() => {
      const controller = new AbortController()
      setTimeout(() => controller.abort(new DOMException('Timed out', 'TimeoutError')), 5)
      return controller.signal
    })
    send.mockImplementation((_body, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true })))
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(504)
    expect(timeout).toHaveBeenCalledWith(15_000)
  })
  it('classifies the real SDK normalized abort result as a timeout', async () => {
    vi.spyOn(AbortSignal, 'timeout').mockImplementationOnce(() => AbortSignal.abort(new DOMException('Fixture timeout', 'TimeoutError')))
    send.mockResolvedValue({ data: null, error: { name: 'application_error' } })
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(504)
    expect(JSON.parse(vi.mocked(console.info).mock.calls[0][0])).toMatchObject({ outcome: 'delivery_timeout' })
  })
  it.each(['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_FORM_ENABLED'])('fails honestly when %s is absent', async setting => {
    vi.stubEnv(setting, '')
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(503); expect(send).not.toHaveBeenCalled()
  })
  it('enables configured submissions without claiming legal review approval', async () => {
    vi.stubEnv('LEGAL_REVIEW_APPROVED', 'false')
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(200)
  })
  it('accepts the local development origin when the production URL is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://bottomline-ai.vercel.app')
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(200)
  })
  it('rejects cross-origin/missing-origin, malformed, non-JSON, oversized and invalid submissions', async () => {
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request(payload(), { origin: 'https://other.test' }))).status).toBe(403)
    expect((await POST(request(payload(), { origin: '' }))).status).toBe(403)
    expect((await POST(request('bad json'))).status).toBe(400)
    expect((await POST(request(payload(), { 'content-type': 'text/plain' }))).status).toBe(415)
    expect((await POST(request('x'.repeat(20001)))).status).toBe(413)
    expect((await POST(request({ ...payload(), privacy: false, contact: '' }))).status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })
  it('rate limits repeated requests across both endpoint aliases', async () => {
    const { POST } = await import('@/app/api/lead/route')
    for (let i = 0; i < 5; i++) expect((await POST(request())).status).toBe(200)
    const legacy = await import('@/app/api/send-email/route')
    const response = await legacy.POST(request())
    expect(response.status).toBe(429); expect(response.headers.get('Retry-After')).toBe('600')
  })
  it('rejects honeypot and impossible fill timestamps without sending', async () => {
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request({ ...payload(), website: 'spam' }))).status).toBe(400)
    expect((await POST(request({ ...payload(), startedAt: Date.now() + 5000 }))).status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })
})
