'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { callerTypes, emptyInquiry, Inquiry, InquiryErrors, inquiryLimits, inquirySuccess, meetingFormats, privacyAcknowledgement, unavailableMessage, validateInquiry } from '@/lib/inquiry'

const subscribeToHydration = () => () => undefined
const clientSnapshot = () => true
const serverSnapshot = () => false

export function ContactForm({ enabled, initialIntent = '' }: { enabled: boolean; initialIntent?: string }) {
  // Do not accept input until React can preserve edits and handle submission.
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot)
  const [values, setValues] = useState<Inquiry>(() => ({ ...emptyInquiry, intent: initialIntent, callerType: initialIntent === 'business' ? 'עסק' : initialIntent === 'idea' ? 'יזם/ת' : '' }))
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState('')
  const [attempt, setAttempt] = useState(0)
  const summary = useRef<HTMLDivElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  const openedAt = useRef(0)
  const submitting = useRef(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])
  useEffect(() => { if (success) confirmation.current?.focus() }, [success])
  useEffect(() => { summary.current?.focus() }, [failure, attempt])

  function change<K extends keyof Inquiry>(key: K, value: Inquiry[K]) {
    setSubmissionId(null)
    setValues(v => ({ ...v, [key]: value }))
    setErrors(current => {
      const next = validateInquiry({ ...values, [key]: value }).errors
      return { ...current, [key]: current[key] ? next[key] : undefined,
        ...(['email', 'phone'].includes(key) && current.contact ? { contact: next.contact } : {}) }
    })
  }
  function validateField(key: keyof Inquiry) {
    setErrors(current => ({ ...current, [key]: validateInquiry(values).errors[key] }))
  }
  const errorFor = (key: keyof Inquiry) => errors[key] ? <p className="field-error" id={`${key}-error`}>{errors[key]}</p> : null
  const attrs = (key: keyof typeof inquiryLimits) => ({
    id: key, name: key, value: values[key], maxLength: inquiryLimits[key],
    'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `${key}-error` : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => change(key, event.target.value),
    onBlur: () => validateField(key),
  })
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (submitting.current || !enabled || !hydrated || !values.privacy) return
    setFailure('')
    setAttempt(n => n + 1)
    const retryId = submissionId || crypto.randomUUID()
    setSubmissionId(retryId)
    const payload = { ...values, startedAt: openedAt.current, submissionId: retryId }
    const validation = validateInquiry(payload)
    setErrors(validation.errors)
    if (Object.keys(validation.errors).length) return
    submitting.current = true
    setPending(true)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20000),
      })
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        if (result.errors) setErrors(result.errors)
        if (result.retryWithNewId === true) setSubmissionId(null)
        setFailure(typeof result.error === 'string' ? result.error : 'הפנייה לא נשלחה. נסו שוב בהמשך.')
        return
      }
      setSuccess(true)
      setValues({ ...emptyInquiry })
    } catch {
      setFailure('לא התקבל אישור שליחה. ייתכן שהפנייה נשלחה, אך לא ניתן לאשר זאת כרגע. אפשר לנסות שוב בהמשך.')
    } finally { submitting.current = false; setPending(false) }
  }

  return <section className="inquiry-section" id="inquiry" aria-label="טופס פנייה"><div className="site-container form-container">
    {!enabled && <p className="availability-notice" role="status">{unavailableMessage}</p>}
    {success ? <div ref={confirmation} tabIndex={-1} className="form-success" role="status"><h2>{inquirySuccess.title}</h2><p>{inquirySuccess.body}</p></div> :
      <form onSubmit={submit} noValidate aria-busy={pending}>
        {(failure || Object.values(errors).some(Boolean)) && <div ref={summary} tabIndex={-1} className="error-summary" role="alert"><h2>לא ניתן להשלים את השליחה</h2>{failure && <p>{failure}</p>}<ul>{Object.entries(errors).filter(([, message]) => message).map(([key, message]) => <li key={key}>{['name', 'contact', 'email', 'phone', 'callerType', 'message', 'systems', 'budget', 'meeting', 'privacy'].includes(key) ? <a href={`#${key === 'contact' ? 'email' : key}`}>{message}</a> : message}</li>)}</ul></div>}
        <fieldset disabled={!enabled || !hydrated || pending} className="form-fields">
          <legend className="sr-only">ספרו לי מה אתם מנסים לפתור.</legend>
          <div className="field"><label htmlFor="name">שם מלא *</label><input {...attrs('name')} placeholder="איך לפנות אליכם?" autoComplete="name" required />{errorFor('name')}</div>
          <fieldset className="contact-methods" aria-describedby="contact-help contact-error">
            <legend>טלפון או אימייל *</legend>
            <p className="field-help" id="contact-help">איפה הכי נוח לחזור אליכם? מספיק למלא אחד מהשדות. אפשר גם את שניהם.</p>
            <div className="form-grid">
              <div className="field"><label htmlFor="email">אימייל</label><input {...attrs('email')} type="email" autoComplete="email" dir="ltr" placeholder="כתובת האימייל שלכם" />{errorFor('email')}</div>
              <div className="field"><label htmlFor="phone">טלפון</label><input {...attrs('phone')} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="מספר הטלפון שלכם" aria-describedby={errors.phone ? 'phone-help phone-error' : 'phone-help'} /><p className="field-help" id="phone-help">מספר ישראלי כולל קידומת, או מספר מחו״ל עם + וקוד מדינה.</p>{errorFor('phone')}</div>
            </div>
            <p className="field-error" id="contact-error">{errors.contact}</p>
          </fieldset>
          <div className="field"><label htmlFor="callerType">אני פונה בתור *</label><select {...attrs('callerType')} required><option value="">בחרו אפשרות</option>{callerTypes.map(type => <option key={type}>{type}</option>)}</select>{errorFor('callerType')}</div>
          <div className="field"><label htmlFor="message">מה הייתם רוצים לפתור? *</label><textarea {...attrs('message')} required rows={6} placeholder="ספרו לי במילים שלכם. מה קורה היום? מה מעכב, מתסכל או פשוט לוקח יותר מדי זמן?" />{errorFor('message')}</div>
          <div className="field"><label htmlFor="systems">אם רלוונטי — באילו כלים או מערכות אתם משתמשים היום?</label><textarea {...attrs('systems')} dir="auto" rows={2} placeholder="לדוגמה: WhatsApp, Gmail, Sheets, CRM, מערכת חשבוניות, אתר..." />{errorFor('systems')}</div>
          <div className="field"><label htmlFor="budget">יש טווח השקעה משוער שחשוב לדעת?</label><input {...attrs('budget')} aria-describedby={errors.budget ? 'budget-help budget-error' : 'budget-help'} /><p className="field-help" id="budget-help">לא חובה. גם &quot;עדיין לא יודע/ת&quot; זו תשובה מצוינת.</p>{errorFor('budget')}</div>
          <fieldset className="meeting-options" id="meeting" aria-describedby={errors.meeting ? 'meeting-error' : undefined}><legend>איך תרצו להיפגש?</legend><div>{meetingFormats.map(format => <label key={format}><input type="radio" name="meeting" value={format} checked={values.meeting === format} onChange={() => change('meeting', format)} />{format}</label>)}</div>{errorFor('meeting')}</fieldset>
          <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input {...attrs('website')} tabIndex={-1} autoComplete="off" /></div>
          <div className="field"><label className="privacy-label" htmlFor="privacy"><input id="privacy" name="privacy" type="checkbox" required aria-label={privacyAcknowledgement} checked={values.privacy} onChange={event => change('privacy', event.target.checked)} aria-invalid={!!errors.privacy} aria-describedby={errors.privacy ? 'privacy-error' : undefined} /><span>{privacyAcknowledgement.split('מדיניות הפרטיות')[0]}<Link href="/legal/privacy">מדיניות הפרטיות</Link>.</span></label>{errorFor('privacy')}</div>
          <button type="submit" className="action" disabled={!enabled || !hydrated || pending || !values.privacy}>{pending ? 'שולחים את הפנייה…' : 'שליחת הפנייה'}<span aria-hidden="true">↖</span></button>
          {!values.privacy && <p className="field-help">כדי לשלוח את הפנייה, יש לסמן את אישור השימוש בפרטים.</p>}
          {pending && <p role="status">הפנייה נשלחת. ממתינים לאישור.</p>}
        </fieldset>
      </form>}
  </div></section>
}
