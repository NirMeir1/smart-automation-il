import Link from 'next/link'
import { ArrowLeft, Bot, Calendar, FileText, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-[var(--color-hero)] py-20">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-6">
              אוטומציה חכמה
              <span className="block mt-3">לעסק שלך</span>
            </h1>
            <div className="max-w-[70ch] mx-auto mb-10">
              <p className="text-right text-[var(--color-navy)]">
                מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים.
                חסוך זמן יקר ושפר את היעילות העסקית שלך עם פתרונות מותאמים אישית.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/demos"
                className="bg-white text-[var(--color-navy)] px-8 py-4 rounded-[var(--radius)] text-base font-semibold hover:shadow focus:shadow focus:outline-none transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center gap-3"
                aria-label="נסו את הדמו האינטראקטיבי שלנו"
              >
                נסו דמו
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/contact?type=consultation"
                className="border-2 border-white text-white px-8 py-4 rounded-[var(--radius)] text-base font-semibold hover:bg-white hover:text-[var(--color-navy)] focus:bg-white focus:text-[var(--color-navy)] focus:outline-none transition-colors duration-200 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
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
        <div className="container text-center">
          <h2 className="mb-12">פתרונות אוטומציה מתקדמים</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[var(--gap)] text-right">
            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-center mb-4">
                <FileText className="w-12 h-12 text-[var(--color-accent)] mb-4" />
                <h3 className="mb-2">ניהול מס ערך מוסף</h3>
                <p className="text-[var(--color-text)]">
                  מערכת חכמה לניהול חשבוניות והוצאות עם חישוב מע״ם אוטומטי ותזכורות לתשלום
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-center mb-4">
                <Calendar className="w-12 h-12 text-[var(--color-accent)] mb-4" />
                <h3 className="mb-2">קיבוע פגישות אוטומטי</h3>
                <p className="text-[var(--color-text)]">
                  בוט חכם לניהול יומן ושליחת תזכורות ללקוחות באופן אוטומטי
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-center mb-4">
                <MessageSquare className="w-12 h-12 text-[var(--color-accent)] mb-4" />
                <h3 className="mb-2">ניהול לידים אוטומטי</h3>
                <p className="text-[var(--color-text)]">
                  לכידת לידים ומעקב אוטומטי עם תזכורות למכירות ותגובות אוטומטיות
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[var(--color-muted)]">
        <div className="container text-center">
          <h2 className="mb-12">למה לבחור בנו?</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[var(--gap)]">
            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)] text-center">
              <Bot className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
              <h3 className="mb-3">טכנולוגיה מתקדמת</h3>
              <p className="text-[var(--color-text)] text-right">פתרונות מבוססי AI ואוטומציה חכמה</p>
            </div>

            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)] text-center">
              <Zap className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
              <h3 className="mb-3">יישום מהיר</h3>
              <p className="text-[var(--color-text)] text-right">התקנה ויישום תוך שבועיים</p>
            </div>

            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)] text-center">
              <MessageSquare className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
              <h3 className="mb-3">תמיכה בעברית</h3>
              <p className="text-[var(--color-text)] text-right">מותאם למשתמשים ישראלים</p>
            </div>

            <div className="bg-white p-6 rounded-[var(--radius)] shadow-[0_6px_18px_rgba(0,0,0,0.06)] text-center">
              <FileText className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-4" />
              <h3 className="mb-3">תיעוד מלא</h3>
              <p className="text-[var(--color-text)] text-right">הדרכה ותמיכה מתמשכת</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-20 bg-[var(--color-accent)] mt-auto">
        <div className="container text-center">
          <h2 className="text-white mb-6">מוכנים להתחיל?</h2>
          <div className="max-w-[70ch] mx-auto mb-10">
            <p className="text-white text-right">
              בואו נראה איך אוטומציה יכולה לשנות את העסק שלכם
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
