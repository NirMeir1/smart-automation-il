// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { emptyInquiry } from '@/lib/inquiry'

const afterTasks = vi.hoisted(() => [] as Array<() => Promise<void>>)
vi.mock('next/server', async importOriginal => ({ ...await importOriginal<typeof import('next/server')>(), after: (callback: () => Promise<void>) => { afterTasks.push(callback) } }))

beforeEach(() => {
  vi.resetModules()
  afterTasks.length = 0
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
  vi.stubEnv('CONTACT_FORM_ENABLED', 'true')
  vi.stubEnv('RESEND_API_KEY', 're_transport_fixture')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'website@posiblo.com')
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
    expect(JSON.parse(options.body)).toMatchObject({ from: 'Posiblo <website@posiblo.com>', to: ['posiblo.contact@gmail.com'], reply_to: 'visitor@example.test', text: expect.stringContaining('שיפור תהליך\nפרטים נוספים') })
    expect(JSON.stringify(await response.json())).not.toContain('internal provider detail')
    expect(afterTasks).toHaveLength(accepted ? 1 : 0)
    for (const task of afterTasks) await task()
    expect(remote).toHaveBeenCalledTimes(accepted ? 2 : 1)
    if (accepted) {
      const [, confirmationOptions] = remote.mock.calls[1]
      expect(new Headers(confirmationOptions.headers).get('Idempotency-Key')).toBe('bottomline-inquiry-autoreply/123e4567-e89b-42d3-a456-426614174000')
      expect(JSON.parse(confirmationOptions.body)).toMatchObject({ to: ['visitor@example.test'], reply_to: 'posiblo.contact@gmail.com', subject: 'קיבלתי את הפנייה שלך — Posiblo' })
      expect(JSON.parse(confirmationOptions.body).text).not.toMatch(/ישראל ישראלי|שיפור תהליך|פרטים נוספים/)
    }
  })

  it.each(['throw', 'reject', 'hang'] as const)('keeps success independent of confirmation failure: %s', async failure => {
    const remote = vi.fn().mockResolvedValueOnce(Response.json({ id: 'owner-receipt' }))
    let finish!: (response: Response) => void
    if (failure === 'throw') remote.mockRejectedValueOnce(new Error('provider fixture error'))
    else if (failure === 'reject') remote.mockResolvedValueOnce(Response.json({ name: 'validation_error', message: 'fixture error' }, { status: 422 }))
    else remote.mockImplementationOnce(() => new Promise<Response>(resolve => { finish = resolve }))
    vi.stubGlobal('fetch', remote)
    const { POST } = await import('@/app/api/lead/route')
    const response = await POST(makeRequest())
    expect(await response.json()).toEqual({ success: true })
    expect(remote).toHaveBeenCalledTimes(1)
    const background = afterTasks[0]()
    if (failure === 'hang') {
      await vi.waitFor(() => expect(remote).toHaveBeenCalledTimes(2))
      // The confirmation is still pending, while the main response is complete.
      expect(response.status).toBe(200)
      finish(Response.json({ id: 'confirmation-receipt' }))
    }
    await background
    expect(response.status).toBe(200)
  })

  it('does not schedule a confirmation for phone-only inquiries', async () => {
    const remote = vi.fn().mockResolvedValue(Response.json({ id: 'owner-receipt' }))
    vi.stubGlobal('fetch', remote)
    const { POST } = await import('@/app/api/lead/route')
    expect((await POST(makeRequest({ email: '', phone: '0502345678' }))).status).toBe(200)
    expect(afterTasks).toHaveLength(0)
    expect(remote).toHaveBeenCalledTimes(1)
  })

  it('does not send another confirmation on an unchanged duplicate retry', async () => {
    const remote = vi.fn().mockImplementation(async () => Response.json({ id: 'stable-owner-receipt' }))
    vi.stubGlobal('fetch', remote)
    const { POST } = await import('@/app/api/lead/route')
    for (let attempt = 0; attempt < 2; attempt++) {
      expect((await POST(makeRequest())).status).toBe(200)
      await afterTasks[attempt]()
    }
    const confirmations = remote.mock.calls.filter(([, options]) => new Headers(options.headers).get('Idempotency-Key')?.startsWith('bottomline-inquiry-autoreply/'))
    expect(confirmations).toHaveLength(1)
    expect(remote).toHaveBeenCalledTimes(3)
  })
})

function makeRequest(fields: Record<string, unknown> = {}) {
  return new NextRequest('http://localhost:3000/api/lead', {
    method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
    body: JSON.stringify({ ...emptyInquiry, name: 'ישראל ישראלי', email: 'visitor@example.test', message: 'תוכן פרטי', callerType: 'עסק', privacy: true, startedAt: Date.now() - 3000, submissionId: '123e4567-e89b-42d3-a456-426614174000', ...fields }),
  })
}
