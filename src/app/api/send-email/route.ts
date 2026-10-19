// Preserve this endpoint URL, with the same validation and delivery guarantees.
import { submitInquiry } from '@/lib/inquiry-handler'
export const runtime = 'nodejs'
export const maxDuration = 30
export const POST = submitInquiry
