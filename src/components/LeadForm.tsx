// src/components/LeadForm.tsx
'use client'

import { useEffect, useRef, useState, FormEvent } from 'react'
import { createPortal } from 'react-dom'

type Status = 'idle' | 'submitting' | 'success' | 'error'

declare global {
  interface Window {
    __LEADFORM_MOUNTED__?: boolean
  }
}

export default function LeadForm() {
  // Singleton guard with stable hook order
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.__LEADFORM_MOUNTED__) return
    window.__LEADFORM_MOUNTED__ = true
    setCanRender(true)
    return () => {
      window.__LEADFORM_MOUNTED__ = false
    }
  }, [])

  return canRender ? <LeadFormInner /> : null
}

function LeadFormInner() {
  // ⬇️ No conditional returns before hooks (prevents hooks-order errors)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    consent: true,
  })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const liveRegionRef = useRef<HTMLDivElement>(null)

  const setField =
    (key: keyof typeof formData) =>
    (value: string | boolean) =>
      setFormData((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'יש להזין שם מלא'
    if (!formData.company.trim()) e.company = 'יש להזין שם חברה'
    if (!/^[0-9+()\-\s]{6,}$/.test(formData.phone)) e.phone = 'מספר נייד אינו תקין'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'כתובת מייל אינה תקינה'
    return e
  }

  const announce = (msg: string) => {
    if (liveRegionRef.current) liveRegionRef.current.textContent = msg
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return

    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      setStatus('error')
      announce('טופס לא תקין. תקנו את השדות')
      return
    }

    setStatus('submitting')
    announce('שולח...')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      announce('נשלח בהצלחה!')
      window.location.assign('/thanks')
    } catch {
      setStatus('error')
      announce('שגיאה בשליחה')
    }
  }

  return createPortal(
    <div
      className="
        fixed inset-x-0 bottom-0 z-[2147483647] isolate
        pointer-events-none
      "
      id="leadform-root"
    >
      <div className="pointer-events-auto mx-auto w-full max-w-7xl px-4">
        <form
          onSubmit={handleSubmit}
          dir="rtl"
          className="
            w-full rounded-t-xl border-t p-4 lg:p-5
            bg-white/95 backdrop-blur shadow-lg ring-1 ring-black/5
            mix-blend-normal
          "
        >
          {/* a11y live feedback */}
          <div ref={liveRegionRef} aria-live="polite" className="sr-only" />

          <div className="grid gap-3 lg:grid-cols-5">
            <input
              id="lead-name"
              type="text"
              placeholder="שם מלא*"
              required
              value={formData.name}
              onChange={(e) => setField('name')(e.target.value)}
              className="
                px-4 py-3 border border-gray-300 rounded-lg w-full
                bg-white text-gray-900 placeholder:text-gray-500
                caret-gray-900 focus:outline-none focus:ring-2
                focus:ring-yellow-400 focus:border-yellow-400
              "
            />
            <input
              id="lead-company"
              type="text"
              placeholder="שם חברה*"
              required
              value={formData.company}
              onChange={(e) => setField('company')(e.target.value)}
              className="
                px-4 py-3 border border-gray-300 rounded-lg w-full
                bg-white text-gray-900 placeholder:text-gray-500
                caret-gray-900 focus:outline-none focus:ring-2
                focus:ring-yellow-400 focus:border-yellow-400
              "
            />
            <input
              id="lead-phone"
              type="tel"
              placeholder="נייד*"
              required
              value={formData.phone}
              onChange={(e) => setField('phone')(e.target.value)}
              className="
                px-4 py-3 border border-gray-300 rounded-lg w-full
                bg-white text-gray-900 placeholder:text-gray-500
                caret-gray-900 focus:outline-none focus:ring-2
                focus:ring-yellow-400 focus:border-yellow-400
              "
            />
            <input
              id="lead-email"
              type="email"
              placeholder="מייל*"
              required
              value={formData.email}
              onChange={(e) => setField('email')(e.target.value)}
              className="
                px-4 py-3 border border-gray-300 rounded-lg w-full
                bg-white text-gray-900 placeholder:text-gray-500
                caret-gray-900 focus:outline-none focus:ring-2
                focus:ring-yellow-400 focus:border-yellow-400
              "
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="
                yellow-button w-full px-4 py-3 rounded-lg font-medium
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {status === 'submitting' ? 'שולח...' : 'אשמח לשמוע פרטים!'}
            </button>
          </div>

          <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setField('consent')(e.target.checked)}
              className="h-4 w-4 accent-yellow-400"
            />
            <span>אשמח לקבל דיוור ומידע בעולמות האוטומציה</span>
          </label>

          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600">שגיאה בשליחה, נסו שוב.</p>
          )}
          {status === 'success' && (
            <p className="mt-2 text-sm text-green-600">נשלח בהצלחה!</p>
          )}
        </form>
      </div>
    </div>,
    document.body
  )
}