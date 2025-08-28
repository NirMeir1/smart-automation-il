// src/components/ROIWidget.tsx
'use client'

import { useState, useEffect } from 'react'

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
    
    setResults({ 
      monthly: Math.round(monthly), 
      yearly: Math.round(yearly) 
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-pink text-white rounded-full p-4 shadow-lg hover:bg-pink/90"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 left-6 bg-white rounded-lg shadow-xl w-80 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">מחשבון ROI</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500">×</button>
      </div>
      
      <div className="space-y-3">
        <input
          type="number"
          placeholder="דקות ביום"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="תעריף לשעה (₪)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button onClick={calculate} className="w-full bg-pink text-white py-2 rounded">
          חשב חיסכון
        </button>
        
        {results.monthly > 0 && (
          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-sm">חיסכון חודשי</div>
            <div className="text-2xl font-bold text-pink">₪{results.monthly.toLocaleString()}</div>
            <div className="text-sm mt-2">חיסכון שנתי</div>
            <div className="text-xl font-bold">₪{results.yearly.toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  )
}