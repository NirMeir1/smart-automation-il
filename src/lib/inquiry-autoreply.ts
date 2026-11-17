import 'server-only'
import { publicContact } from './contact-public'
import { redisRateLimitConfig } from './contact-rate-limit'

const attempts = new Map<string, number>()
const TTL_SECONDS = 90_000

// Claim once across server instances; store only an opaque submission ID.
// Best effort means a failed confirmation is not retried by form resubmission.
export async function claimAutoReply(submissionId: string): Promise<boolean> {
  const config = redisRateLimitConfig()
  if (config) {
    const response = await fetch(config.url, {
      method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['SET', `bottomline:inquiry:autoreply:v1:${submissionId}`, '1', 'EX', String(TTL_SECONDS), 'NX']),
      signal: AbortSignal.timeout(3000), cache: 'no-store', redirect: 'error',
    })
    if (!response.ok) throw new Error('Confirmation claim unavailable')
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object' || !('result' in body) || ![null, 'OK'].includes(body.result as string | null)) throw new Error('Invalid confirmation claim')
    return body.result === 'OK'
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Shared confirmation claims required')
  const now = Date.now()
  for (const [key, expires] of attempts) if (expires <= now) attempts.delete(key)
  if (attempts.has(submissionId)) return false
  if (attempts.size >= 5000) throw new Error('Confirmation claims full')
  attempts.set(submissionId, now + TTL_SECONDS * 1000)
  return true
}

// Fixed transactional copy: never echo submitted fields into a visitor email.
export const inquiryAutoReply = {
  subject: 'קיבלתי את הפנייה שלך — Posiblo',
  text: `היי,

תודה שפנית. קיבלתי את הפנייה ואחזור אליך בתוך יום עסקים אחד כדי לתאם פגישת היכרות.

הפגישה חינם, נמשכת כ־45 דקות, ואפשר לקיים אותה אונליין או פנים אל פנים בתיאום. אין צורך להכין כלום: מספיק לספר מה קורה היום ומה היית רוצה לשנות.

אם זה דחוף, אפשר לכתוב לי גם בוואטסאפ: ${publicContact.phone}.

ניר מאיר
Posiblo`,
} as const
