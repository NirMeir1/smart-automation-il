// src/components/FAQ.tsx
'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'כמה זמן לוקח להטמיע אוטומציה?',
      answer: 'בדרך כלל תהליך ההטמעה לוקח בין 2-6 שבועות.',
    },
    {
      question: 'האם צריך ידע טכני?',
      answer: 'לא! המערכות שלנו ידידותיות למשתמש.',
    },
    {
      question: 'מה קורה אם משהו משתבש?',
      answer: 'תמיכה מלאה 24/7 עם גיבויים אוטומטיים.',
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">שאלות נפוצות</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 text-right flex justify-between items-center"
              >
                <span className="font-bold">{faq.question}</span>
                <svg className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}