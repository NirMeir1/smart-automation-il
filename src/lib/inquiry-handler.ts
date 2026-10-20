import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { Resend } from 'resend'
import { contactAvailable } from './contact-config'
import { recordContactOutcome } from './contact-diagnostics'
import { checkContactRateLimit } from './contact-rate-limit'
import { validateInquiry, unavailableMessage, validEmail } from './inquiry'
import { siteOrigin } from './site-config'

const MAX_BYTES = 20_000

async function readBody(request: NextRequest) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new Error('size')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('json')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BYTES) { await reader.cancel(); throw new Error('size') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export async function submitInquiry(request: NextRequest) {
  const requestId = randomUUID()
  const startedAt = Date.now()
  const json = (body: object, status = 200, headers: Record<string, string> = {}) => NextResponse.json(body, {
    status, headers: { 'Cache-Control': 'no-store', 'X-Request-ID': requestId, ...headers },
  })
  const allowedOrigin = siteOrigin() || (process.env.NODE_ENV !== 'production' ? request.nextUrl.origin : undefined)
  if (!allowedOrigin || request.headers.get('origin') !== allowedOrigin) return json({ error: 'לא ניתן לשלוח פנייה ממקור זה.' }, 403)
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'נדרש טופס בפורמט תקין.' }, 415)
  if (!contactAvailable()) {
    recordContactOutcome('unavailable', requestId, startedAt)
    return json({ error: unavailableMessage }, 503)
  }
  try {
    const rate = await checkContactRateLimit(request.headers)
    if (!rate.allowed) {
      recordContactOutcome('rate_limited', requestId, startedAt)
      return json({ error: 'נשלחו יותר מדי פניות. נסו שוב בעוד כמה דקות.' }, 429, { 'Retry-After': String(rate.retryAfter) })
    }
  } catch {
    recordContactOutcome('rate_limit_unavailable', requestId, startedAt)
    return json({ error: 'שליחת פניות אינה זמינה כרגע. נסו שוב בהמשך.' }, 503, { 'Retry-After': '30' })
  }
  let input: unknown
  try { input = await readBody(request) }
  catch (error) { return json({ error: 'הפנייה אינה תקינה או ארוכה מדי.' }, error instanceof Error && error.message === 'size' ? 413 : 400) }
  const { data, errors } = validateInquiry(input)
  if (Object.keys(errors).length) return json({ error: 'בדקו את השדות המסומנים.', errors }, 400)
  if (!Number.isFinite(data.startedAt) || Date.now() - data.startedAt < 1000 || Date.now() - data.startedAt > 86_400_000) return json({ error: 'יש לרענן את העמוד ולנסות שוב.' }, 400)

  const deliveryTimeout = AbortSignal.timeout(15_000)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    // The UUID remains stable on retries. No per-attempt dates enter the provider payload.
    const result = await resend.emails.send({
      from: `Bottomline <${process.env.CONTACT_FROM_EMAIL!}>`,
      to: [process.env.CONTACT_TO_EMAIL!],
      subject: 'פנייה חדשה מאתר Bottomline',
      text: [
        `שם: ${data.name}`, `פרטי חזרה: ${data.contact}`, `אני פונה בתור: ${data.callerType}`,
        `מה הייתם רוצים לפתור?\n${data.message}`, `מערכות קיימות: ${data.systems || 'לא צוין'}`,
        `טווח השקעה: ${data.budget || 'לא צוין'}`, `העדפת פגישה: ${data.meeting || 'אין העדפה'}`,
        `הקשר הפנייה: ${data.intent || 'כללי'}`, 'אושר שימוש בפרטים לצורך טיפול בפנייה. לא ניתנה הסכמה לשיווק.',
      ].join('\n\n'),
      ...(validEmail(data.contact) ? { replyTo: data.contact } : {}),
    }, { idempotencyKey: `bottomline-inquiry/${data.submissionId}`, signal: AbortSignal.any([deliveryTimeout, request.signal]) })
    if (result.error || !result.data?.id) {
      // Resend normalizes fetch aborts into error results rather than throwing.
      if (deliveryTimeout.aborted) {
        recordContactOutcome('delivery_timeout', requestId, startedAt)
        return json({ error: 'לא התקבל אישור לשליחת הפנייה. אפשר לנסות שוב בהמשך.' }, 504)
      }
      recordContactOutcome('delivery_failed', requestId, startedAt)
      if (result.error?.name === 'invalid_idempotent_request') return json({ error: 'פרטי הפנייה השתנו. אפשר לנסות לשלוח שוב.', retryWithNewId: true }, 409)
      return json({ error: 'לא התקבל אישור לשליחת הפנייה. אפשר לנסות שוב בהמשך.' }, 502)
    }
    recordContactOutcome('accepted', requestId, startedAt)
    return json({ success: true })
  } catch {
    recordContactOutcome(deliveryTimeout.aborted ? 'delivery_timeout' : 'delivery_failed', requestId, startedAt)
    return json({ error: 'לא התקבל אישור לשליחת הפנייה. אפשר לנסות שוב בהמשך.' }, deliveryTimeout.aborted ? 504 : 502)
  }
}
