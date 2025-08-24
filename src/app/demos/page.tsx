'use client'

import { TaxDemo } from '@/components/demos/tax-demo'
import { AppointmentDemo } from '@/components/demos/appointment-demo'
import { LeadDemo } from '@/components/demos/lead-demo'
import { logEvent } from '@/lib/storage'
import { useEffect } from 'react'

export default function DemosPage() {
  useEffect(() => {
    logEvent('page_view', { path: '/demos' })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            דמואים אינטראקטיביים
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            נסו בעצמכם את המערכות החכמות שלנו. כל דמו הוא מערכת מלאה ופונקציונלית שמדמה 
            את הפעולות האמיתיות של הפתרון.
          </p>
        </div>

        <div className="space-y-16">
          <section id="tax-demo">
            <TaxDemo />
          </section>

          <section id="appointment-demo">
            <AppointmentDemo />
          </section>

          <section id="lead-demo">
            <LeadDemo />
          </section>
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-8 text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">התרשמתם? בואו נתחיל לעבוד!</h2>
          <p className="text-lg mb-6 opacity-90">
            נשמח להתאים פתרון ייחודי לעסק שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact?type=consultation"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              קבעו שיחת ייעוץ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}