import 'server-only'
import { validEmail } from './inquiry'
import { siteOrigin } from './site-config'
import { redisRateLimitEndpoint } from './contact-rate-limit'

// Server-only configuration: never pass credentials or destinations to the browser.
export const contactRecipient = 'meirnir89@gmail.com'

export function contactConfigurationIssues(): string[] {
  const production = process.env.NODE_ENV === 'production'
  const checks = {
    CONTACT_FORM_ENABLED: process.env.CONTACT_FORM_ENABLED === 'true',
    NEXT_PUBLIC_SITE_URL: !production || Boolean(siteOrigin()),
    CONTACT_TRUST_PROXY: !production || process.env.CONTACT_TRUST_PROXY === 'true',
    UPSTASH_REDIS_REST_URL: !production || Boolean(redisRateLimitEndpoint()),
    UPSTASH_REDIS_REST_TOKEN: !production || Boolean(process.env.UPSTASH_REDIS_REST_TOKEN?.trim()),
    CONTACT_RATE_LIMIT_SECRET: !production || (process.env.CONTACT_RATE_LIMIT_SECRET || '').length >= 32,
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY?.trim()),
    CONTACT_FROM_EMAIL: validEmail(process.env.CONTACT_FROM_EMAIL || '') && !process.env.CONTACT_FROM_EMAIL?.toLowerCase().endsWith('@resend.dev'),
  }
  return Object.entries(checks).filter(([, valid]) => !valid).map(([name]) => name)
}

export function contactAvailable() {
  const invalidSettings = contactConfigurationIssues()
  if (invalidSettings.length && process.env.NODE_ENV === 'production') {
    // Server logs contain setting names only, never values or credentials.
    console.warn(JSON.stringify({ event: 'contact_configuration_unavailable', invalidSettings }))
  }
  return invalidSettings.length === 0
}
