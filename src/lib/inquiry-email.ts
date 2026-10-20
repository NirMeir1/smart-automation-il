import 'server-only'
import { redisRateLimitConfig } from './contact-rate-limit'
import type { Inquiry } from './inquiry'

// Keep the server receipt time stable across retries and serverless instances.
// Redis stores only a random submission ID and timestamp, never form contents.
const receipts = new Map<string, number>()
const RECEIPT_TTL_SECONDS = 90_000
const MAX_CLOCK_SKEW_MS = 30_000
const receiptScript = `local value = redis.call('GET', KEYS[1])
if value then return value end
redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
return ARGV[1]`

export async function inquiryReceivedAt(submissionId: string): Promise<number> {
  const now = Date.now()
  const config = redisRateLimitConfig()
  if (config) {
    const response = await fetch(config.url, {
      method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', receiptScript, '1', `bottomline:inquiry:receipt:v1:${submissionId}`, String(now), String(RECEIPT_TTL_SECONDS)]),
      signal: AbortSignal.timeout(3000), cache: 'no-store', redirect: 'error',
    })
    if (!response.ok) throw new Error('Receipt storage is unavailable')
    const body: unknown = await response.json()
    const value = body && typeof body === 'object' && 'result' in body ? body.result : undefined
    const timestamp = typeof value === 'string' && /^\d{13}$/.test(value) ? Number(value) : NaN
    // A previous server instance may be a few seconds ahead of this one's clock.
    if (!Number.isSafeInteger(timestamp) || timestamp > now + MAX_CLOCK_SKEW_MS || timestamp < now - RECEIPT_TTL_SECONDS * 1000) throw new Error('Invalid receipt timestamp')
    return timestamp
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Shared receipt storage is required')
  for (const [id, timestamp] of receipts) if (timestamp < now - RECEIPT_TTL_SECONDS * 1000) receipts.delete(id)
  const existing = receipts.get(submissionId)
  if (existing !== undefined) return existing
  if (receipts.size >= 5000) throw new Error('Receipt storage is full')
  receipts.set(submissionId, now)
  return now
}

export function inquiryEmailText(data: Inquiry, receivedAt: number): string {
  const date = new Intl.DateTimeFormat('he-IL', {
    timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', timeZoneName: 'short',
  }).format(new Date(receivedAt))
  const intent = { business: 'עסק', idea: 'רעיון או יזמות', problem: 'בעיה לפתרון' }[data.intent] || 'כללי'
  return [
    'פנייה חדשה דרך אתר BottomLine', `מועד קבלת הפנייה (שעון ישראל): ${date}`,
    `שם מלא: ${data.name}`, `אימייל: ${data.email || 'לא צוין'}`, `טלפון: ${data.phone || 'לא צוין'}`,
    ...(data.contact ? [`פרטי חזרה (טופס קודם): ${data.contact}`] : []),
    `אני פונה בתור: ${data.callerType}`, `מה הייתם רוצים לפתור?\n${data.message}`,
    `מערכות קיימות: ${data.systems || 'לא צוין'}`, `טווח השקעה: ${data.budget || 'לא צוין'}`,
    `העדפת פגישה: ${data.meeting || 'אין העדפה'}`, `הקשר הפנייה: ${intent}`,
    'אושר שימוש בפרטים לצורך טיפול בפנייה. לא ניתנה הסכמה לשיווק.',
    `מזהה פנייה: ${data.submissionId}`,
  ].join('\n\n')
}
