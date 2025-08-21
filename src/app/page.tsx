import Link from 'next/link'
import { ArrowLeft, Bot, Calendar, FileText, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-bl from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-16">
        <div className="max-w-[1200px] margin-inline-auto padding-inline-4 sm:padding-inline-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-[1.5] margin-block-end-6">
              אוטומציה חכמה
              <span className="block text-2xl sm:text-[2rem] font-bold text-blue-700 margin-block-start-3">לעסק שלך</span>
            </h1>
            <div className="max-w-[70ch] margin-inline-auto margin-block-end-10">
              <p className="text-base leading-[1.5] text-gray-700 text-right">
                מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים.
                חסוך זמן יקר ושפר את היעילות העסקית שלך עם פתרונות מותאמים אישית.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/demos"
                className="bg-blue-700 text-white padding-inline-8 padding-block-4 rounded-lg text-base font-semibold hover:bg-blue-800 focus:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center gap-3"
                aria-label="נסו את הדמו האינטראקטיבי שלנו"
              >
                נסו דמו
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact?type=consultation"
                className="border-2 border-blue-700 text-blue-700 padding-inline-8 padding-block-4 rounded-lg text-base font-semibold hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                aria-label="קבעו שיחת ייעוץ חינמית"
              >
                קבעו שיחת ייעוץ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="padding-block-20 bg-white">
        <div className="max-w-[1200px] margin-inline-auto padding-inline-4 sm:padding-inline-6">
          <h2 className="text-2xl font-bold text-gray-900 leading-[1.5] text-center margin-block-end-12">
            פתרונות אוטומציה מתקדמים
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            <div className="bg-white border border-gray-200 rounded-lg padding-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4 margin-block-end-4">
                <FileText className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-2">ניהול מס ערך מוסף</h3>
                  <p className="text-base text-gray-600 leading-[1.5]">
                    מערכת חכמה לניהול חשבוניות והוצאות עם חישוב מע״ם אוטומטי ותזכורות לתשלום
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg padding-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4 margin-block-end-4">
                <Calendar className="w-12 h-12 text-green-600 flex-shrink-0" />
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-2">קיבוע פגישות אוטומטי</h3>
                  <p className="text-base text-gray-600 leading-[1.5]">
                    בוט חכם לניהול יומן ושליחת תזכורות ללקוחות באופן אוטומטי
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg padding-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4 margin-block-end-4">
                <MessageSquare className="w-12 h-12 text-purple-600 flex-shrink-0" />
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-2">ניהול לידים אוטומטי</h3>
                  <p className="text-base text-gray-600 leading-[1.5]">
                    לכידת לידים ומעקב אוטומטי עם תזכורות למכירות ותגובות אוטומטיות
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="padding-block-20 bg-gray-50">
        <div className="max-w-[1200px] margin-inline-auto padding-inline-4 sm:padding-inline-6">
          <h2 className="text-2xl font-bold text-gray-900 leading-[1.5] text-center margin-block-end-12">
            למה לבחור בנו?
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            <div className="bg-white padding-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <Bot className="w-12 h-12 text-blue-600 margin-inline-auto margin-block-end-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-3">טכנולוגיה מתקדמת</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">פתרונות מבוססי AI ואוטומציה חכמה</p>
            </div>
            
            <div className="bg-white padding-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <Zap className="w-12 h-12 text-blue-600 margin-inline-auto margin-block-end-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-3">יישום מהיר</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">התקנה ויישום תוך שבועיים</p>
            </div>
            
            <div className="bg-white padding-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 margin-inline-auto margin-block-end-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-3">תמיכה בעברית</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">מותאם למשתמשים ישראלים</p>
            </div>
            
            <div className="bg-white padding-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <FileText className="w-12 h-12 text-blue-600 margin-inline-auto margin-block-end-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] margin-block-end-3">תיעוד מלא</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">הדרכה ותמיכה מתמשכת</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="padding-block-20 bg-blue-700">
        <div className="max-w-[1200px] margin-inline-auto padding-inline-4 sm:padding-inline-6 text-center">
          <h2 className="text-2xl font-bold text-white leading-[1.5] margin-block-end-6">מוכנים להתחיל?</h2>
          <div className="max-w-[70ch] margin-inline-auto margin-block-end-10">
            <p className="text-base text-blue-100 leading-[1.5] text-right">
              בואו נראה איך אוטומציה יכולה לשנות את העסק שלכם
            </p>
          </div>
        </div>
      </section>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 inset-inline-0 bg-blue-700 border-t border-blue-600 padding-inline-6 padding-block-4 z-30 block sm:hidden h-18">
        <div className="flex gap-3 justify-center">
          <Link
            href="/demos"
            className="bg-white text-blue-700 padding-inline-6 padding-block-3 rounded-lg text-sm font-semibold hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center gap-2 flex-1 justify-center"
            aria-label="נסו דמו אינטראקטיבי"
          >
            נסו דמו
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="border border-white text-white padding-inline-6 padding-block-3 rounded-lg text-sm font-semibold hover:bg-white hover:text-blue-700 focus:bg-white focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center justify-center flex-1"
            aria-label="צרו קשר"
          >
            צרו קשר
          </Link>
        </div>
      </div>
    </div>
  )
}
