import 'server-only'
import { createHash } from 'node:crypto'

type ContactOutcome = 'accepted' | 'delivery_failed' | 'delivery_timeout' | 'rate_limited' | 'rate_limit_unavailable' | 'unavailable'

// Count DISTINCT conversionId for accepted enquiries, never raw request counts.
// Provider receipts are stable on idempotent retries. No form data enters telemetry.
export function recordContactOutcome(outcome: ContactOutcome, requestId: string, startedAt: number, providerReceipt?: string) {
  const conversion = outcome === 'accepted' && providerReceipt
    ? { conversionId: createHash('sha256').update(providerReceipt).digest('hex') } : {}
  console.info(JSON.stringify({ event: 'contact', outcome, requestId, durationMs: Math.max(0, Date.now() - startedAt), ...conversion }))
}
