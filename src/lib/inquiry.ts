export const callerTypes = ['עסק', 'עצמאי/ת', 'יזם/ת', 'אדם פרטי', 'אחר'] as const
export const meetingFormats = ['אונליין', 'פנים אל פנים', 'אין העדפה'] as const
export const inquiryLimits = { name: 100, contact: 254, callerType: 30, message: 5000, systems: 1000, budget: 200, meeting: 30, website: 200 } as const
export type Inquiry = { name: string; contact: string; callerType: string; message: string; systems: string; budget: string; meeting: string; privacy: boolean; website: string; startedAt: number; intent: string; submissionId: string }
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>
export const emptyInquiry: Inquiry = { name: '', contact: '', callerType: '', message: '', systems: '', budget: '', meeting: 'אין העדפה', privacy: false, website: '', startedAt: 0, intent: '', submissionId: '' }
export const privacyAcknowledgement = 'אני מאשר/ת שימוש בפרטים שמסרתי לצורך טיפול בפנייה וחזרה אליי, בהתאם למדיניות הפרטיות.'
export const inquirySuccess = { title: 'תודה. קיבלתי את הפנייה.', body: 'אעבור על מה שכתבתם ונוכל להבין יחד מה הצעד הבא המתאים.' }
export const unavailableMessage = 'שליחת פניות דרך האתר אינה זמינה כרגע. הפנייה לא נשלחה ולא נשמרה. אפשר לחזור ולנסות בהמשך.'
export const validEmail = (value: string) => /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(value)
export const validPhone = (value: string) => /^\+?[\d ()-]+$/.test(value) && value.replace(/\D/g, '').length >= 9 && value.replace(/\D/g, '').length <= 15

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
  if (!data.name || /[\r\n]/.test(data.name)) errors.name = 'יש למלא שם מלא.'
  if (!validEmail(data.contact) && !validPhone(data.contact)) errors.contact = 'יש להזין מספר טלפון או כתובת אימייל תקינים. מספיק אחד מהם.'
  if (!(callerTypes as readonly string[]).includes(data.callerType)) errors.callerType = 'יש לבחור בתור מי אתם פונים.'
  if (!data.message) errors.message = 'ספרו מה הייתם רוצים לפתור.'
  if (data.meeting && !(meetingFormats as readonly string[]).includes(data.meeting)) errors.meeting = 'יש לבחור העדפת פגישה מהרשימה.'
  if (!data.privacy) errors.privacy = 'כדי לטפל בפנייה נדרש אישור שימוש בפרטים בהתאם למדיניות הפרטיות.'
  if (data.website) errors.website = 'לא ניתן לשלוח את הפנייה.'
  return { data, errors }
}
