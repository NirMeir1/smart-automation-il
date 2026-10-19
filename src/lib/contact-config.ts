import { validEmail } from './inquiry'
import { siteOrigin } from './site'

// Server-only configuration: never pass credentials or destinations to the browser.
export function contactAvailable() {
  return process.env.CONTACT_FORM_ENABLED === 'true' && process.env.LEGAL_REVIEW_APPROVED === 'true' &&
    (process.env.NODE_ENV !== 'production' || Boolean(siteOrigin())) &&
    Boolean(process.env.RESEND_API_KEY?.trim()) && validEmail(process.env.CONTACT_TO_EMAIL || '') &&
    validEmail(process.env.CONTACT_FROM_EMAIL || '') && !process.env.CONTACT_FROM_EMAIL?.toLowerCase().endsWith('@resend.dev')
}
