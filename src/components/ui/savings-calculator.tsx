'use client'

import { useMemo, useState } from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'

export function SavingsCalculator() {
  const [open, setOpen] = useState(false)
  const [minutesPerDay, setMinutesPerDay] = useState<string>('')
  const [hourlyRate, setHourlyRate] = useState<string>('')
  const [showResults, setShowResults] = useState(false)

  const results = useMemo(() => {
    const m = Math.max(0, Number(minutesPerDay) || 0)
    const rate = Math.max(0, Number(hourlyRate) || 0)
    const monthlyMinutes = m * 22 // ימי עבודה בחודש (הנחה)
    const yearlyMinutes = monthlyMinutes * 12
    const monthlyHours = monthlyMinutes / 60
    const yearlyHours = yearlyMinutes / 60
    const moneyMonthly = monthlyHours * rate
    const moneyYearly = yearlyHours * rate
    const nf = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 })
    const cf = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })
    return {
      monthlyMinutes: cf.format(monthlyMinutes),
      yearlyMinutes: cf.format(yearlyMinutes),
      monthlyHours: nf.format(monthlyHours),
      yearlyHours: nf.format(yearlyHours),
      moneyMonthly: cf.format(moneyMonthly),
      moneyYearly: cf.format(moneyYearly),
    }
  }, [minutesPerDay, hourlyRate])

  return (
    <div
      className="fixed left-4 bottom-24 z-50"
      aria-live="polite"
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-[var(--shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
        aria-expanded={open}
        aria-controls="savings-calculator-panel"
        style={{ background: 'var(--accent)' }}
      >
        <Calculator className="w-5 h-5" />
        מחשבון חיסכון
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="savings-calculator-panel"
          className="mt-3 w-[320px] max-w-[90vw] bg-[var(--card)] rounded-[var(--radius)] shadow-[var(--shadow)] border border-[var(--outline)] p-4 text-right"
          role="region"
          aria-label="מחשבון חיסכון בזמן ועלות"
        >
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">דקות ביום *</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={minutesPerDay}
                onChange={(e) => setMinutesPerDay(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-[var(--outline)] focus:ring-[var(--accent-from)]"
                placeholder="לדוגמה: 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">שכר לשעה (₪) *</label>
              <input
                inputMode="decimal"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value.replace(/[^\d.]/g, ''))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-[var(--outline)] focus:ring-[var(--accent-from)]"
                placeholder="לדוגמה: 120"
              />
            </div>
            <button
              onClick={() => setShowResults(true)}
              className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-full text-white font-semibold"
              style={{ background: 'var(--accent)' }}
            >
              חשב
            </button>
            {showResults && (
              <div className="mt-2 bg-[var(--muted)] rounded-lg p-3 text-sm">
                <div className="mb-1"><strong>חיסכון חודשי:</strong> {results.monthlyMinutes} דק׳ (~{results.monthlyHours} שעות) • ₪{results.moneyMonthly}</div>
                <div className="mb-1"><strong>חיסכון שנתי:</strong> {results.yearlyMinutes} דק׳ (~{results.yearlyHours} שעות) • ₪{results.moneyYearly}</div>
                <div className="text-xs text-gray-600 mt-2">* החישוב מבוסס על 22 ימי עבודה בחודש.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}