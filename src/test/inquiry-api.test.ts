// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { emptyInquiry } from '@/lib/inquiry'
const send = vi.hoisted(() => vi.fn())
vi.mock('resend', () => ({ Resend: class { emails = { send } } }))
const payload = () => ({ ...emptyInquiry, name: '<script>name</script>', contact: '0501234567', callerType: 'עסק', message: '<img onerror="alert(1)">', privacy: true, startedAt: Date.now() - 3000 })
const request = (body: unknown = payload(), headers: Record<string, string> = {}) => new NextRequest('http://localhost:3000/api/lead', { method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) })
beforeEach(() => {
  vi.resetModules(); vi.unstubAllEnvs(); send.mockReset()
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
  vi.stubEnv('CONTACT_FORM_ENABLED', 'true'); vi.stubEnv('LEGAL_REVIEW_APPROVED', 'true')
  vi.stubEnv('RESEND_API_KEY', 'test-only'); vi.stubEnv('CONTACT_FROM_EMAIL', 'sender@example.test'); vi.stubEnv('CONTACT_TO_EMAIL', 'recipient@example.test')
  send.mockResolvedValue({ data: { id: 'provider-receipt' }, error: null })
})
describe('Inquiry endpoint', () => {
  it('returns success only with provider receipt; sends plain text and no phone replyTo', async () => {
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(request())
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ success: true })
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('<img onerror='), subject: 'פנייה חדשה מאתר Bottomline' }))
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
  it.each(['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL', 'CONTACT_FORM_ENABLED', 'LEGAL_REVIEW_APPROVED'])('fails honestly when %s is absent', async setting => {
    vi.stubEnv(setting, '')
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(request())).status).toBe(503); expect(send).not.toHaveBeenCalled()
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
