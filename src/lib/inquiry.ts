import { parsePhoneNumberWithError } from 'libphonenumber-js/max'

export const callerTypes = ['עסק', 'עצמאי/ת', 'יזם/ת', 'אדם פרטי', 'אחר'] as const
export const meetingFormats = ['אונליין', 'פנים אל פנים', 'אין העדפה'] as const
export const inquiryLimits = { name: 100, contact: 254, email: 254, phone: 40, callerType: 30, message: 5000, systems: 1000, budget: 200, meeting: 30, website: 200 } as const
export type Inquiry = { name: string; contact: string; email: string; phone: string; callerType: string; message: string; systems: string; budget: string; meeting: string; privacy: boolean; website: string; startedAt: number; intent: string; submissionId: string }
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>
export const emptyInquiry: Inquiry = { name: '', contact: '', email: '', phone: '', callerType: '', message: '', systems: '', budget: '', meeting: 'אין העדפה', privacy: false, website: '', startedAt: 0, intent: '', submissionId: '' }
export const privacyAcknowledgement = 'אני מאשר/ת שימוש בפרטים שמסרתי לצורך טיפול בפנייה וחזרה אליי, בהתאם למדיניות הפרטיות.'
export const inquirySuccess = { title: 'תודה. קיבלתי את הפנייה.', body: 'אעבור על מה שכתבתם ונוכל להבין יחד מה הצעד הבא המתאים.' }
export const unavailableMessage = 'שליחת פניות דרך האתר אינה זמינה כרגע. הפנייה לא נשלחה ולא נשמרה. אפשר לחזור ולנסות בהמשך.'
export function validEmail(value: string): boolean {
  if (value.length > inquiryLimits.email) return false
  const parts = value.split('@')
  if (parts.length !== 2) return false
  const [local, domain] = parts
  if (!local || local.length > 64 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  const labels = domain.split('.')
  return labels.length >= 2 && labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)) && /^(?:[a-z]{2,63}|xn--[a-z0-9-]+)$/i.test(labels.at(-1)!)
}

export function validPhone(value: string): boolean {
  // Accept familiar spacing, but never extract a number out of arbitrary text.
  if (value.length > inquiryLimits.phone || !/^\+?[\d ()-]+$/.test(value)) return false
  let parentheses = 0
  for (const character of value) {
    if (character === '(' && ++parentheses > 1) return false
    if (character === ')' && --parentheses < 0) return false
  }
  if (parentheses !== 0) return false
  const compact = value.replace(/[ ()-]/g, '')
  // Local numbers must include the Israeli trunk prefix. Other countries use +country code.
  if (!compact.startsWith('+') && !compact.startsWith('0')) return false
  try {
    const phone = parsePhoneNumberWithError(compact, { defaultCountry: 'IL', extract: false })
    return phone.isValid() && (compact.startsWith('+') || phone.country === 'IL')
  } catch { return false }
}

export function validateInquiry(input: unknown): { data: Inquiry; errors: InquiryErrors } {
  const raw = input && typeof input === 'object' && !Array.isArray(input) ? input as Record<string, unknown> : {}
  const data = { ...emptyInquiry }
  const errors: InquiryErrors = {}
  for (const key of Object.keys(inquiryLimits) as (keyof typeof inquiryLimits)[]) {
    if (typeof raw[key] === 'string') data[key] = raw[key].trim()
    else if (raw[key] !== undefined) errors[key] = 'יש להזין טקסט תקין.'
    if (data[key].length > inquiryLimits[key]) errors[key] = `אפשר להזין עד ${inquiryLimits[key]} תווים.`
    // eslint-disable-next-line no-control-regex -- Intentionally reject control bytes while allowing tabs and line breaks.
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(data[key])) errors[key] = 'הטקסט מכיל תווים לא תקינים.'
  }
  data.privacy = raw.privacy === true
  data.startedAt = typeof raw.startedAt === 'number' ? raw.startedAt : 0
  data.submissionId = typeof raw.submissionId === 'string' ? raw.submissionId : ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId)) errors.submissionId = 'יש לרענן את העמוד ולנסות שוב.'
  data.intent = typeof raw.intent === 'string' && ['business', 'idea', 'problem'].includes(raw.intent) ? raw.intent : ''
  // Do not require multiple words: legitimate names vary across languages and cultures.
  if (!/\p{L}/u.test(data.name) || /[\r\n\t]/.test(data.name)) errors.name = 'יש למלא שם מלא.'
  // Preserve existing API clients using the former combined contact field.
  if (data.contact) {
    if (validEmail(data.contact)) data.email ||= data.contact
    else if (validPhone(data.contact)) data.phone ||= data.contact
    else errors.contact = 'יש להזין מספר טלפון או כתובת אימייל תקינים. מספיק אחד מהם.'
  }
  if (data.email && !validEmail(data.email)) errors.email = 'יש להזין כתובת אימייל תקינה.'
  if (data.phone && !validPhone(data.phone)) errors.phone = 'יש להזין מספר טלפון תקין, כולל קידומת. לדוגמה: 052-2345678 או +972-52-2345678.'
  if (!data.email && !data.phone) errors.contact = 'יש להזין מספר טלפון או כתובת אימייל תקינים. מספיק אחד מהם.'
  if (!(callerTypes as readonly string[]).includes(data.callerType)) errors.callerType = 'יש לבחור בתור מי אתם פונים.'
  if (!/[\p{L}\p{N}\p{P}\p{S}]/u.test(data.message)) errors.message = 'ספרו מה הייתם רוצים לפתור.'
  if (data.meeting && !(meetingFormats as readonly string[]).includes(data.meeting)) errors.meeting = 'יש לבחור העדפת פגישה מהרשימה.'
  if (!data.privacy) errors.privacy = 'כדי לטפל בפנייה נדרש אישור שימוש בפרטים בהתאם למדיניות הפרטיות.'
  if (data.website) errors.website = 'לא ניתן לשלוח את הפנייה.'
  return { data, errors }
}
