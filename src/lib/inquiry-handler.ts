import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'node:crypto'
import { Resend } from 'resend'
import { contactAvailable } from './contact-config'
import { validateInquiry, unavailableMessage, validEmail } from './inquiry'
import { siteOrigin } from './site'

const buckets = new Map<string, { count: number; expires: number }>()
const salt = randomBytes(24).toString('hex')
const WINDOW = 10 * 60 * 1000
const MAX_BYTES = 20_000
const json = (body: object, status = 200, headers: Record<string, string> = {}) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })

async function withDeliveryTimeout<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([operation, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Delivery confirmation timed out')), 15_000)
    })])
  } finally { clearTimeout(timer) }
}

function rateLimited(request: NextRequest) {
  const now = Date.now()
  for (const [key, bucket] of buckets) if (bucket.expires <= now) buckets.delete(key)
  // Only trust proxy headers after the hosting ingress has been verified to overwrite them.
  const address = process.env.CONTACT_TRUST_PROXY === 'true' ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'shared' : 'shared'
  const key = createHash('sha256').update(salt + address).digest('hex')
  const bucket = buckets.get(key)
  if (!bucket) {
    if (buckets.size >= 5000) return true
    buckets.set(key, { count: 1, expires: now + WINDOW }); return false
  }
  bucket.count++
  return bucket.count > 5
}

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
  const origin = request.headers.get('origin')
  const allowedOrigin = siteOrigin() || (process.env.NODE_ENV !== 'production' ? request.nextUrl.origin : undefined)
  if (!allowedOrigin || origin !== allowedOrigin) return json({ error: 'לא ניתן לשלוח פנייה ממקור זה.' }, 403)
  if (rateLimited(request)) return json({ error: 'נשלחו יותר מדי פניות. נסו שוב בעוד כמה דקות.' }, 429, { 'Retry-After': '600' })
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'נדרש טופס בפורמט תקין.' }, 415)
  let input: unknown
  try { input = await readBody(request) }
  catch (error) { return json({ error: 'הפנייה אינה תקינה או ארוכה מדי.' }, error instanceof Error && error.message === 'size' ? 413 : 400) }
  const { data, errors } = validateInquiry(input)
  if (Object.keys(errors).length) return json({ error: 'בדקו את השדות המסומנים.', errors }, 400)
  if (!Number.isFinite(data.startedAt) || Date.now() - data.startedAt < 1000 || Date.now() - data.startedAt > 86_400_000) return json({ error: 'יש לרענן את העמוד ולנסות שוב.' }, 400)
  if (!contactAvailable()) return json({ error: unavailableMessage }, 503)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    // Plain text avoids HTML injection; user input never controls sender/recipient/subject.
    const result = await withDeliveryTimeout(resend.emails.send({
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
    }))
    if (result.error || !result.data?.id) return json({ error: 'לא התקבל אישור לשליחת הפנייה. נסו שוב בהמשך.' }, 502)
    return json({ success: true })
  } catch {
    // Do not log request bodies, contact details or vendor errors containing PII.
    return json({ error: 'לא התקבל אישור לשליחת הפנייה. נסו שוב בהמשך.' }, 502)
  }
}
