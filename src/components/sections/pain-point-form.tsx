'use client'

import React, { useRef, useState } from 'react'
import { addDays } from 'date-fns'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { leadStorage, logEvent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import type { Lead } from '@/lib/types'
import { Send, Loader2 } from 'lucide-react'

export function PainPointForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    problem: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const statusRef = useRef<HTMLDivElement>(null)

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
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'כתובת אימייל לא תקינה'
      if (!form.problem.trim()) e.problem = 'תיאור הבעיה הוא שדה חובה'
      setErrors(e)
      return Object.keys(e).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return
      setSubmitting(true)
      setResult(null)
      
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: `תיאור הבעיה:\n${form.problem}`,
            source: 'טופס בעיית עסק - דף הבית'
          })
        })

        // Local backup/tracking
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
        
        // Success UI
        toast?.success('ההודעה נשלחה', 'נחזור אליך עד 24 שעות.')
        setForm({ name: '', email: '', phone: '', problem: '' })
        setResult({ type: 'success', message: 'ההודעה נשלחה!' })
      } catch {
        // Simple error UI
        toast?.error?.('שגיאה בשליחה', 'נסו שוב.')
        setResult({ type: 'error', message: 'שגיאה בשליחה' })
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
        <h3 id="pain-form-title" className="mb-6 text-xl md:text-2xl font-bold text-white leading-relaxed">
          ספר לנו על משימות שחוזרות על עצמן או לוקחות לך זמן יקר – אנחנו נבחן איך נכון להטמיע אוטומציה ו/או AI כדי לפתור אותן בשבילך.
          <br />
          מלא את הפרטים בטופס הקצר כאן למטה:    
        </h3>

        {result && (
          <div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
            className={cn(
              'mb-4 rounded-md px-4 py-3 text-sm flex items-start justify-between gap-4',
              result.type === 'success'
                ? 'bg-green-50 text-green-900 border border-green-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            )}
          >
            <span>{result.message}</span>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="shrink-0 rounded p-1 leading-none opacity-70 hover:opacity-100 focus:outline-none focus:ring-2"
              aria-label="סגירת הודעה"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">שם מלא *</label>
            <input
              type="text"
              value={form.name}
              onChange={onChange('name')}
              className={cn(
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-400',
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
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-400',
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-[var(--outline)] focus:ring-[var(--accent-from)] bg-white text-gray-900 placeholder:text-gray-400"
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
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-400',
              errors.problem ? 'border-red-500 focus:ring-red-500' : 'border-[var(--outline)] focus:ring-[var(--accent-from)]'
            )}
            placeholder="לדוגמה: אני מעדכן ידנית חשבוניות וגוזל לי 30 דקות כל יום…"
            aria-invalid={!!errors.problem}
            aria-describedby={errors.problem ? 'err-problem' : undefined}
          />
          {errors.problem && <p id="err-problem" className="mt-1 text-sm text-red-600">{errors.problem}</p>}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white shadow-2xl transition-all duration-300 transform relative overflow-hidden',
              submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4ADE80] hover:bg-[#22C55E] hover:scale-105 hover:shadow-[0_20px_40px_rgba(74,222,128,0.4)] border-2 border-white/20 hover:border-white/40'
            )}
            aria-label="שליחה"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {submitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                שולח…
              </>
            ) : (
              <>
                <Send className="w-6 h-6 animate-pulse" aria-hidden="true" />
                שליחה
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}