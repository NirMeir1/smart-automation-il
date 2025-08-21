import Link from 'next/link'
import { ArrowLeft, Bot, Calendar, FileText, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-bl from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-[1.5] mb-6">
              אוטומציה חכמה
              <span className="block text-2xl sm:text-[2rem] font-bold text-blue-700 mt-3">לעסק שלך</span>
            </h1>
            <div className="max-w-[70ch] mx-auto mb-10">
              <p className="text-base leading-[1.5] text-gray-700 text-right">
                מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים.
                חסוך זמן יקר ושפר את היעילות העסקית שלך עם פתרונות מותאמים אישית.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/demos"
                className="bg-blue-700 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-blue-800 focus:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center gap-3"
                aria-label="נסו את הדמו האינטראקטיבי שלנו"
              >
                נסו דמו
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact?type=consultation"
                className="border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg text-base font-semibold hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
                aria-label="קבעו שיחת ייעוץ חינמית"
              >
                קבעו שיחת ייעוץ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 leading-[1.5] text-center mb-12">
            פתרונות אוטומציה מתקדמים
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-row-reverse items-start gap-4 mb-4">
                <FileText className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-2">ניהול מס ערך מוסף</h3>
                  <p className="text-base text-gray-600 leading-[1.5]">
                    מערכת חכמה לניהול חשבוניות והוצאות עם חישוב מע״ם אוטומטי ותזכורות לתשלום
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-row-reverse items-start gap-4 mb-4">
                <Calendar className="w-12 h-12 text-green-600 flex-shrink-0" />
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-2">קיבוע פגישות אוטומטי</h3>
                  <p className="text-base text-gray-600 leading-[1.5]">
                    בוט חכם לניהול יומן ושליחת תזכורות ללקוחות באופן אוטומטי
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-row-reverse items-start gap-4 mb-4">
                <MessageSquare className="w-12 h-12 text-purple-600 flex-shrink-0" />
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-2">ניהול לידים אוטומטי</h3>
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
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 leading-[1.5] text-center mb-12">
            למה לבחור בנו?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-3">טכנולוגיה מתקדמת</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">פתרונות מבוססי AI ואוטומציה חכמה</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-3">יישום מהיר</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">התקנה ויישום תוך שבועיים</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-3">תמיכה בעברית</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">מותאם למשתמשים ישראלים</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 leading-[1.5] mb-3">תיעוד מלא</h3>
              <p className="text-base text-gray-600 leading-[1.5] text-right">הדרכה ותמיכה מתמשכת</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-20 bg-blue-700 mt-auto">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-white leading-[1.5] mb-6">מוכנים להתחיל?</h2>
          <div className="max-w-[70ch] mx-auto mb-10">
            <p className="text-base text-blue-100 leading-[1.5] text-right">
              בואו נראה איך אוטומציה יכולה לשנות את העסק שלכם
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
