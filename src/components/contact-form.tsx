'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { callerTypes, emptyInquiry, Inquiry, InquiryErrors, inquiryLimits, inquirySuccess, meetingFormats, privacyAcknowledgement, unavailableMessage, validateInquiry } from '@/lib/inquiry'

export function ContactForm({ enabled }: { enabled: boolean }) {
  const [values, setValues] = useState<Inquiry>({ ...emptyInquiry })
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState('')
  const [attempt, setAttempt] = useState(0)
  const summary = useRef<HTMLDivElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const intent = new URLSearchParams(window.location.search).get('intent') || ''
    setValues(v => ({ ...v, startedAt: Date.now(), intent, callerType: intent === 'business' ? 'עסק' : intent === 'idea' ? 'יזם/ת' : '' }))
  }, [])
  useEffect(() => { if (success) confirmation.current?.focus() }, [success])
  useEffect(() => { summary.current?.focus() }, [failure, attempt])

  function change<K extends keyof Inquiry>(key: K, value: Inquiry[K]) {
    setValues(v => ({ ...v, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }
  const errorFor = (key: keyof Inquiry) => errors[key] ? <p className="field-error" id={`${key}-error`}>{errors[key]}</p> : null
  const attrs = (key: keyof typeof inquiryLimits) => ({
    id: key, name: key, value: values[key], maxLength: inquiryLimits[key],
    'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `${key}-error` : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => change(key, event.target.value),
  })
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (pending || !enabled) return
    setFailure('')
    setAttempt(n => n + 1)
    const validation = validateInquiry(values)
    setErrors(validation.errors)
    if (Object.keys(validation.errors).length) return
    setPending(true)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: AbortSignal.timeout(20000),
      })
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        if (result.errors) setErrors(result.errors)
        setFailure(typeof result.error === 'string' ? result.error : 'הפנייה לא נשלחה. נסו שוב בהמשך.')
        return
      }
      setSuccess(true)
      setValues({ ...emptyInquiry })
    } catch {
      setFailure('לא התקבל אישור שליחה. ייתכן שהפנייה נשלחה, אך לא ניתן לאשר זאת כרגע. אפשר לנסות שוב בהמשך.')
    } finally { setPending(false) }
  }

  return <section className="inquiry-section" id="inquiry" aria-label="טופס פנייה"><div className="site-container form-container">
    {!enabled && <p className="availability-notice" role="status">{unavailableMessage}</p>}
    {success ? <div ref={confirmation} tabIndex={-1} className="form-success" role="status"><h2>{inquirySuccess.title}</h2><p>{inquirySuccess.body}</p></div> :
      <form onSubmit={submit} noValidate aria-busy={pending}>
        {(failure || Object.values(errors).some(Boolean)) && <div ref={summary} tabIndex={-1} className="error-summary" role="alert"><h2>לא ניתן להשלים את השליחה</h2>{failure && <p>{failure}</p>}<ul>{Object.entries(errors).filter(([, message]) => message).map(([key, message]) => <li key={key}><a href={`#${key}`}>{message}</a></li>)}</ul></div>}
        <fieldset disabled={!enabled || pending} className="form-fields">
          <legend className="sr-only">ספרו לי מה אתם מנסים לפתור.</legend>
          <div className="form-grid">
            <div className="field"><label htmlFor="name">שם מלא *</label><input {...attrs('name')} placeholder="איך לפנות אליכם?" autoComplete="name" required />{errorFor('name')}</div>
            <div className="field"><label htmlFor="contact">טלפון או אימייל *</label><input {...attrs('contact')} placeholder="איפה הכי נוח לחזור אליכם?" autoComplete="off" dir="auto" required />{errorFor('contact')}</div>
          </div>
          <div className="field"><label htmlFor="callerType">אני פונה בתור *</label><select {...attrs('callerType')} required><option value="">בחרו אפשרות</option>{callerTypes.map(type => <option key={type}>{type}</option>)}</select>{errorFor('callerType')}</div>
          <div className="field"><label htmlFor="message">מה הייתם רוצים לפתור? *</label><textarea {...attrs('message')} required rows={6} placeholder="ספרו לי במילים שלכם. מה קורה היום? מה מעכב, מתסכל או פשוט לוקח יותר מדי זמן?" />{errorFor('message')}</div>
          <div className="field"><label htmlFor="systems">אם רלוונטי — באילו כלים או מערכות אתם משתמשים היום?</label><textarea {...attrs('systems')} dir="auto" rows={2} placeholder="לדוגמה: WhatsApp, Gmail, Sheets, CRM, מערכת חשבוניות, אתר..." />{errorFor('systems')}</div>
          <div className="field"><label htmlFor="budget">יש טווח השקעה משוער שחשוב לדעת?</label><input {...attrs('budget')} aria-describedby={errors.budget ? 'budget-help budget-error' : 'budget-help'} /><p className="field-help" id="budget-help">לא חובה. גם &quot;עדיין לא יודע/ת&quot; זו תשובה מצוינת.</p>{errorFor('budget')}</div>
          <fieldset className="meeting-options" id="meeting" aria-describedby={errors.meeting ? 'meeting-error' : undefined}><legend>איך תרצו להיפגש?</legend><div>{meetingFormats.map(format => <label key={format}><input type="radio" name="meeting" value={format} checked={values.meeting === format} onChange={() => change('meeting', format)} />{format}</label>)}</div>{errorFor('meeting')}</fieldset>
          <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input {...attrs('website')} tabIndex={-1} autoComplete="off" /></div>
          <div className="field"><label className="privacy-label" htmlFor="privacy"><input id="privacy" name="privacy" type="checkbox" required aria-label={privacyAcknowledgement} checked={values.privacy} onChange={event => change('privacy', event.target.checked)} aria-invalid={!!errors.privacy} aria-describedby={errors.privacy ? 'privacy-error' : undefined} /><span>{privacyAcknowledgement.split('מדיניות הפרטיות')[0]}<Link href="/legal/privacy">מדיניות הפרטיות</Link>.</span></label>{errorFor('privacy')}</div>
          <button type="submit" className="action" disabled={!enabled || pending}>{pending ? 'שולחים את הפנייה…' : 'שליחת הפנייה'}<span aria-hidden="true">↖</span></button>
          {pending && <p role="status">הפנייה נשלחת. ממתינים לאישור.</p>}
        </fieldset>
      </form>}
  </div></section>
}
