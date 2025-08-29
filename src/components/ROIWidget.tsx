// src/components/ROIWidget.tsx
'use client'

import { useState, KeyboardEvent, useCallback } from 'react'

export default function ROIWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [minutes, setMinutes] = useState('') // user input: minutes per day
  const [rate, setRate] = useState('') // user input: ₪ per hour

  // Results are stored as raw numbers; rounding only at display time (best practice)
  const [results, setResults] = useState<{ weekly: number; monthly: number; yearly: number } | null>(null)

  const blockNonNumeric = (e: KeyboardEvent<HTMLInputElement>, allowDecimal = false) => {
    const blocked = ['e', 'E', '+', '-']
    if (!allowDecimal) blocked.push('.')
    if (blocked.includes(e.key)) e.preventDefault()
  }

  const toILS = (v: number) => `₪${Math.round(v).toLocaleString('he-IL')}`

  const calculate = useCallback(() => {
    const m = Number.isFinite(parseFloat(minutes)) ? parseFloat(minutes) : 0
    const r = Number.isFinite(parseFloat(rate)) ? parseFloat(rate) : 0

    const safeM = Math.max(0, m)
    const safeR = Math.max(0, r)

    // Authoritative math (no mid-rounding):
    // daily_hours   = minutes / 60
    // daily_saving  = daily_hours * hourly_rate
    // weekly        = daily_saving * 5
    // monthly       = daily_saving * 23
    // yearly        = daily_saving * 276
    const dailyHours = safeM / 60
    const dailySaving = dailyHours * safeR

    const weekly = dailySaving * 5
    const monthly = dailySaving * 23
    const yearly = dailySaving * 276

    setResults({ weekly, monthly, yearly })
  }, [minutes, rate])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-24 md:top-24 md:bottom-auto md:right-6 z-[60] bg-pink text-white rounded-full px-5 py-4 shadow-xl hover:bg-pink/90 hover:scale-105 transition-transform flex items-center gap-3 animate-pulse"
        aria-label="מחשבון החיסכון"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold">מחשבון החיסכון</span>
      </button>
    )
  }

  return (
    <div className="fixed right-6 bottom-24 md:top-24 md:bottom-auto md:right-6 z-[60] bg-white rounded-xl shadow-2xl w-[22rem] p-5" dir="rtl" aria-live="polite">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-navy">מחשבון ROI — כמה תחסכו בזמן וכסף?</h3>
          <p className="text-sm text-gray-700 mt-1">המחשבון מראה כמה כסף תחסוך כשאתה מחליף עבודה ידנית באוטומציה.</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="סגירה">×</button>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-gray-800">
          כמה דקות ביום מוקדשות לעבודה ידנית בעסק שלך?
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={0}
            step={1}
            onKeyDown={(e) => blockNonNumeric(e, false)}
            aria-label="דקות עבודה ידנית ביום"
            placeholder="לדוגמא: 60"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink/50 placeholder:text-gray-600 text-right"
          />
        </label>

        <label className="block text-sm text-gray-800">
          מהו הערך הכספי של שעת עבודה שלך (בשקלים)?
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            onKeyDown={(e) => blockNonNumeric(e, true)}
            aria-label="עלות לשעת עבודה בשקלים"
            placeholder="לדוגמא: 200"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink/50 placeholder:text-gray-600 text-right"
          />
        </label>

        <button
          onClick={calculate}
          className="w-full bg-pink text-white py-3 rounded-lg font-semibold hover:bg-pink/90"
        >
          חשב חיסכון
        </button>

        {results && (results.weekly > 0 || results.monthly > 0 || results.yearly > 0) && (
          <div className="bg-gray-50 p-4 rounded text-center">
            <div className="text-sm mt-1 text-gray-800">חיסכון שבועי</div>
            <div className="text-xl font-bold text-gray-900">{toILS(results.weekly)}</div>

            <div className="text-sm mt-4 text-gray-800">חיסכון חודשי</div>
            <div className="text-2xl font-bold text-gray-900">{toILS(results.monthly)}</div>

            <div className="text-sm mt-4 text-gray-800">חיסכון שנתי</div>
            <div className="text-2xl font-bold text-red-600">{toILS(results.yearly)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
