// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { Resend } from 'resend'

const inquiry = { from: 'sender@example.test', to: ['recipient@example.test'], subject: 'Fixture', text: 'Fixture only' }

describe('installed Resend SDK transport contract', () => {
  it('forwards retry keys and abort signals to fetch without making a network call', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: 'fixture-receipt' }))
    vi.stubGlobal('fetch', fetchMock)
    const signal = new AbortController().signal
    const resend = new Resend('fake-test-key', { baseUrl: 'https://api.resend.com' })
    expect((await resend.emails.send(inquiry, { idempotencyKey: 'fixture-retry-key', signal })).data?.id).toBe('fixture-receipt')
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(new Headers(options?.headers).get('Idempotency-Key')).toBe('fixture-retry-key')
    expect(options?.signal).toBe(signal)
  })

  it('cancels transport and normalizes cancellation into an error response', async () => {
    vi.stubEnv('NODE_ENV', 'production') // The SDK logs vendor errors only outside production.
    let observedAbort = false
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener('abort', () => {
        observedAbort = true
        reject(options.signal?.reason)
      }, { once: true })
    }))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()
    const pending = new Resend('fake-test-key').emails.send(inquiry, { signal: controller.signal })
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    controller.abort(new DOMException('Fixture cancellation', 'TimeoutError'))
    const result = await pending
    expect(observedAbort).toBe(true)
    expect(result.data).toBeNull()
    expect(result.error?.name).toBe('application_error')
  })
})
