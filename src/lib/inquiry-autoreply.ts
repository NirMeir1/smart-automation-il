import 'server-only'
import { publicContact } from './contact-public'
import { redisRateLimitConfig } from './contact-rate-limit'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const attempts = new Map<string, number>()
const TTL_SECONDS = 90_000

// Claim once across server instances; store only an opaque submission ID.
// Best effort means a failed confirmation is not retried by form resubmission.
export async function claimAutoReply(submissionId: string): Promise<boolean> {
  const config = redisRateLimitConfig()
  if (config) {
    const response = await fetch(config.url, {
      method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['SET', `posiblo:inquiry:autoreply:v1:${submissionId}`, '1', 'EX', String(TTL_SECONDS), 'NX']),
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

ניר מאיר`,
  // Inline styles and presentation tables support email clients without CSS support.
  // No submitted data enters this HTML. The phone alone is explicitly LTR.
  html: `<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body dir="rtl" style="margin:0;padding:0;direction:rtl;text-align:right;background-color:#ffffff;color:#12301f;">
<table role="presentation" dir="rtl" align="right" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;direction:rtl;text-align:right;background-color:#ffffff;">
<tr><td dir="rtl" align="right" style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.8;direction:rtl;text-align:right;color:#12301f;">
<p dir="rtl" style="margin:0 0 20px;direction:rtl;text-align:right;">היי,</p>
<p dir="rtl" style="margin:0 0 20px;direction:rtl;text-align:right;">תודה שפנית. קיבלתי את הפנייה ואחזור אליך בתוך יום עסקים אחד כדי לתאם פגישת היכרות.</p>
<p dir="rtl" style="margin:0 0 20px;direction:rtl;text-align:right;">הפגישה חינם, נמשכת כ־45 דקות, ואפשר לקיים אותה אונליין או פנים אל פנים בתיאום. אין צורך להכין כלום: מספיק לספר מה קורה היום ומה היית רוצה לשנות.</p>
<p dir="rtl" style="margin:0 0 20px;direction:rtl;text-align:right;">אם זה דחוף, אפשר לכתוב לי גם בוואטסאפ: <a href="${publicContact.whatsappHref}" dir="ltr" style="direction:ltr;unicode-bidi:embed;white-space:nowrap;color:#1d7a3e;"><span dir="ltr">${publicContact.phone}</span></a>.</p>
<p dir="rtl" style="margin:0 0 8px;direction:rtl;text-align:right;">ניר מאיר</p>
<table role="presentation" dir="rtl" align="right" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;"><img src="cid:posiblo-logo" alt="לוגו Posiblo" width="160" height="160" border="0" style="display:block;width:160px;height:160px;border:0;background-color:#ffffff;"></td></tr></table>
</td></tr></table>
</body></html>`,
} as const

export async function inquiryAutoReplyWithLogo() {
  // A PNG CID attachment avoids remote-image requests and unsupported email SVGs.
  // Literal local path lets Next's output tracing include it with both API routes.
  const logo = await readFile(join(process.cwd(), 'public/brand/posiblo-email-logo.png'))
  return { ...inquiryAutoReply, attachments: [{ filename: 'posiblo-logo.png', content: logo.toString('base64'), contentType: 'image/png', contentId: 'posiblo-logo' }] }
}
