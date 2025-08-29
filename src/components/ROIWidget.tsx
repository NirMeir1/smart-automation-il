// src/components/ROIWidget.tsx
'use client'

import { useState } from 'react'

export default function ROIWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [minutes, setMinutes] = useState('')
  const [rate, setRate] = useState('')
  const [results, setResults] = useState({ monthly: 0, yearly: 0 })

  const calculate = () => {
    const m = parseFloat(minutes) || 0
    const r = parseFloat(rate) || 0
    const daily = (m / 60) * r * 0.5
    const monthly = daily * 22
    const yearly = monthly * 12

    setResults({ monthly: Math.round(monthly), yearly: Math.round(yearly) })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-24 md:top-24 md:bottom-auto md:right-6 z-[60] bg-pink text-white rounded-full px-5 py-4 shadow-xl hover:bg-pink/90 hover:scale-105 transition-transform flex items-center gap-3 animate-pulse"
        aria-label="מחשבון החיסכון"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold">מחשבון החיסכון</span>
      </button>
    )
  }

  return (
    <div className="fixed right-6 bottom-24 md:top-24 md:bottom-auto md:right-6 z-[60] bg-white rounded-xl shadow-2xl w-[22rem] p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-navy">מחשבון ROI</h3>
          <p className="text-sm text-gray-600 mt-1">מחשב בקצרה כמה כסף וזמן תוכלו לחסוך בעזרת אוטומציה לפי דקות ביום והעלות לשעה.</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="סגירה">×</button>
      </div>

      <div className="space-y-3">
        <input
          type="number"
          placeholder="כמה דקות ביום הולכות על משימות חוזרות?"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink/50"
        />
        <input
          type="number"
          placeholder="עלות שעתית (₪)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink/50"
        />
        <button onClick={calculate} className="w-full bg-pink text-white py-3 rounded-lg font-semibold hover:bg-pink/90">
          חשב חיסכון
        </button>

        {results.monthly > 0 && (
          <div className="bg-gray-50 p-4 rounded text-center">
            <div className="text-sm">חיסכון חודשי משוער</div>
            <div className="text-2xl font-bold text-pink">₪{results.monthly.toLocaleString()}</div>
            <div className="text-sm mt-2">חיסכון שנתי</div>
            <div className="text-xl font-bold">₪{results.yearly.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  )
}
