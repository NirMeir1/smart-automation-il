import 'server-only'
import { validEmail } from './inquiry'
import { siteOrigin } from './site-config'
import { productionRateLimitConfigured } from './contact-rate-limit'

// Server-only configuration: never pass credentials or destinations to the browser.
export const contactRecipient = 'meirnir89@gmail.com'

export function contactAvailable() {
  return process.env.CONTACT_FORM_ENABLED === 'true' &&
    (process.env.NODE_ENV !== 'production' || Boolean(siteOrigin()) && productionRateLimitConfigured()) &&
    Boolean(process.env.RESEND_API_KEY?.trim()) &&
    validEmail(process.env.CONTACT_FROM_EMAIL || '') && !process.env.CONTACT_FROM_EMAIL?.toLowerCase().endsWith('@resend.dev')
}
