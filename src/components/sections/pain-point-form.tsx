'use client'

import { useState } from 'react'
import { addDays } from 'date-fns'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { leadStorage, logEvent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import type { Lead } from '@/lib/types'
import { Send } from 'lucide-react'

export function PainPointForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    problem: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [key]: e.target.value })
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
    }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'שם מלא הוא שדה חובה'
    if (!form.email.trim()) e.email = 'אימייל הוא שדה חובה'
    else if (!/^[^\s@]@[^\s@]\.[^\s@]$/.test(form.email)) e.email = 'כתובת אימייל לא תקינה'
    if (!form.problem.trim()) e.problem = 'תיאור הבעיה הוא שדה חובה'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const lead: Lead = {
        id: generateId(),
        name: form.name,
        phone: form.phone,
        email: form.email,
        source: 'טופס בעיית עסק - דף הבית',
        message: `תיאור הבעיה:\n${form.problem}`,
        status: 'new',
        createdAt: new Date(),
        followUpDate: addDays(new Date(), 1),
      }
      leadStorage.add(lead)
      logEvent('form_submit', { form: 'pain_point', leadId: lead.id })
      toast?.success('ההודעה נשלחה', 'נחזור אליך עד 24 שעות.')
      setForm({ name: '', email: '', phone: '', problem: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="bg-[var(--card)] rounded-[var(--radius)] shadow-[var(--shadow)] p-6 md:p-8 text-right"
        aria-labelledby="pain-form-title"
      >
        <h3 id="pain-form-title" className="mb-4">מה כואב לכם ביומיום?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">שם מלא *</label>
            <input
              type="text"
              value={form.name}
              onChange={onChange('name')}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[var(--outline)] focus:ring-[var(--accent-from)]'
              )}
              placeholder="לדוגמה: ניר מאיר"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && <p id="err-name" className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">אימייל *</label>
            <input
              type="email"
              value={form.email}
              onChange={onChange('email')}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[var(--outline)] focus:ring-[var(--accent-from)]'
              )}
              placeholder="example@domain.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
            />
            {errors.email && <p id="err-email" className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">טלפון</label>
            <input
              type="tel"
              value={form.phone}
              onChange={onChange('phone')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-[var(--outline)] focus:ring-[var(--accent-from)]"
              placeholder="050-0000000"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">תאר/י את הבעיה *</label>
          <textarea
            value={form.problem}
            onChange={onChange('problem')}
            rows={5}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
              errors.problem ? 'border-red-500 focus:ring-red-500' : 'border-[var(--outline)] focus:ring-[var(--accent-from)]'
            )}
            placeholder="לדוגמה: אני מעדכן ידנית חשבוניות וגוזל לי 30 דקות כל יום…"
            aria-invalid={!!errors.problem}
            aria-describedby={errors.problem ? 'err-problem' : undefined}
          />
          {errors.problem && <p id="err-problem" className="mt-1 text-sm text-red-600">{errors.problem}</p>}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white',
            submitting ? 'bg-gray-400 cursor-not-allowed' : ''
          )}
          style={{ background: 'var(--accent)' }}
        >
          <Send className="w-5 h-5" />
          {submitting ? 'שולח…' : 'שליחה'}
        </button>
        <div className="sr-only" aria-live="polite" />
      </form>
    </div>
  )
}