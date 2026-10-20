import 'server-only'

type ContactOutcome = 'accepted' | 'delivery_failed' | 'delivery_timeout' | 'rate_limited' | 'rate_limit_unavailable' | 'unavailable'

// Only categorical outcomes and server-generated correlation IDs may enter logs.
export function recordContactOutcome(outcome: ContactOutcome, requestId: string, startedAt: number) {
  console.info(JSON.stringify({ event: 'contact', outcome, requestId, durationMs: Math.max(0, Date.now() - startedAt) }))
}
