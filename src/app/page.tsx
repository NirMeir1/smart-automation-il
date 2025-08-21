import Link from 'next/link'
import { ArrowLeft, Bot, Calendar, FileText, MessageSquare, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-6 text-[var(--navy)]">
              אוטומציה <span className="bg-clip-text text-transparent" style={{ background: 'var(--accent-gradient)' }}>חכמה לעסק</span> שלך
            </h1>
            <div className="max-w-[70ch] mx-auto mb-10">
              <p className="text-right text-[var(--navy)]">
                מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים.
                חסוך זמן יקר ושפר את היעילות העסקית שלך עם פתרונות מותאמים אישית.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact?type=consultation"
                className="rounded-full px-8 py-4 text-white font-semibold inline-flex items-center gap-3"
                style={{ background: 'var(--accent-gradient)' }}
                aria-label="קבעו שיחת ייעוץ חינמית"
              >
                קבעו שיחת ייעוץ
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/demos"
                className="text-[var(--purple)] underline font-semibold min-w-[44px] min-h-[44px] inline-flex items-center gap-3"
                aria-label="נסו את הדמו האינטראקטיבי שלנו"
              >
                נסו דמו
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
            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)]">
              <div className="flex flex-col items-center mb-4">
                <FileText className="w-12 h-12 text-[var(--accent)] mb-4" />
                <h3 className="mb-2">ניהול מס ערך מוסף</h3>
                <p className="text-[var(--ink)]">
                  מערכת חכמה לניהול חשבוניות והוצאות עם חישוב מע״ם אוטומטי ותזכורות לתשלום
                </p>
              </div>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)]">
              <div className="flex flex-col items-center mb-4">
                <Calendar className="w-12 h-12 text-[var(--accent)] mb-4" />
                <h3 className="mb-2">קיבוע פגישות אוטומטי</h3>
                <p className="text-[var(--ink)]">
                  בוט חכם לניהול יומן ושליחת תזכורות ללקוחות באופן אוטומטי
                </p>
              </div>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)]">
              <div className="flex flex-col items-center mb-4">
                <MessageSquare className="w-12 h-12 text-[var(--accent)] mb-4" />
                <h3 className="mb-2">ניהול לידים אוטומטי</h3>
                <p className="text-[var(--ink)]">
                  לכידת לידים ומעקב אוטומטי עם תזכורות למכירות ותגובות אוטומטיות
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[var(--muted)]">
        <div className="container text-center">
          <h2 className="mb-12">למה לבחור בנו?</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[var(--gap)]">
            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)] text-center">
              <Bot className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
              <h3 className="mb-3">טכנולוגיה מתקדמת</h3>
              <p className="text-[var(--ink)] text-right">פתרונות מבוססי AI ואוטומציה חכמה</p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)] text-center">
              <Zap className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
              <h3 className="mb-3">יישום מהיר</h3>
              <p className="text-[var(--ink)] text-right">התקנה ויישום תוך שבועיים</p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)] text-center">
              <MessageSquare className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
              <h3 className="mb-3">תמיכה בעברית</h3>
              <p className="text-[var(--ink)] text-right">מותאם למשתמשים ישראלים</p>
            </div>

            <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)] text-center">
              <FileText className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
              <h3 className="mb-3">תיעוד מלא</h3>
              <p className="text-[var(--ink)] text-right">הדרכה ותמיכה מתמשכת</p>
            </div>
          </div>
        </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="container text-center">
            <h2 className="mb-12">איך זה עובד?</h2>
            <div className="flex flex-col md:flex-row gap-[var(--gap)]">
              {[{
                step: 'מיפוי',
                desc: 'נזהה את הצרכים והיעדים',
              },
              {
                step: 'בנייה',
                desc: 'נבנה את הפתרון המתאים',
              },
              {
                step: 'הטמעה',
                desc: 'נשלב בעסק שלכם',
              },
              {
                step: 'תמיכה',
                desc: 'נלווה אתכם לאורך הדרך',
              }].map((item, index) => (
                <div key={item.step} className="flex-1">
                  <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)] h-full flex flex-col items-center">
                    <span className="text-2xl font-bold text-[var(--accent)] mb-3">{index + 1}</span>
                    <h3 className="mb-2">{item.step}</h3>
                    <p className="text-[var(--ink)] text-right">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="py-20 bg-[var(--muted)]">
          <div className="container text-center">
            <h2 className="mb-12">לקוחות וביצועים</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 mb-10">
              <img src="/vercel.svg" alt="Vercel" className="h-8 w-auto" />
              <img src="/next.svg" alt="Next" className="h-8 w-auto" />
              <img src="/globe.svg" alt="Globe" className="h-8 w-auto" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[var(--gap)]">
              <div className="text-center">
                <p className="text-4xl font-bold text-[var(--accent)]">+25%</p>
                <p className="text-[var(--ink)]">המרות</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[var(--accent)]">-40</p>
                <p className="text-[var(--ink)]">שעות עבודה לחודש</p>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20 bg-white">
          <div className="container text-center">
            <h2 className="mb-12">סיפורי הצלחה</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[var(--gap)] text-right">
              <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)]">
                <h3 className="mb-2 text-center">חברת תוכנה</h3>
                <p className="mb-4 text-[var(--ink)]">הפחתת זמן תיאום פגישות ב-60%</p>
                <Link href="#" className="text-[var(--accent)] underline">לפרטים</Link>
              </div>
              <div className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)]">
                <h3 className="mb-2 text-center">סטודיו דיגיטל</h3>
                <p className="mb-4 text-[var(--ink)]">+30% לידים בחודש הראשון</p>
                <Link href="#" className="text-[var(--accent)] underline">לפרטים</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[var(--muted)]">
          <div className="container text-right">
            <h2 className="text-center mb-12">שאלות נפוצות</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { q: 'כמה זמן לוקח ליישם את הפתרון?', a: 'בדרך כלל כשבועיים מרגע האפיון.' },
                { q: 'האם יש התחייבות?', a: 'לא, שיחת היכרות ללא עלות.' },
                { q: 'האם המערכת תומכת בעברית?', a: 'כן, כל הממשקים וההודעות מותאמים לעברית.' },
                { q: 'מה קורה אם יש תקלה?', a: 'אנחנו זמינים לתמיכה מלאה.' },
                { q: 'אפשר לשלב עם מערכות קיימות?', a: 'בוודאי, אנו עובדים עם מגוון כלים.' },
                { q: 'איך מתחילים?', a: 'פשוט קבעו שיחת ייעוץ ונשמח לעזור.' },
              ].map(item => (
                <details key={item.q} className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)]">
                  <summary className="cursor-pointer font-semibold">{item.q}</summary>
                  <p className="mt-4 text-[var(--ink)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final Section */}
        <section className="py-20 mt-auto text-white" style={{ background: 'var(--accent-gradient)' }}>
          <div className="container text-center">
            <h2 className="text-white mb-6">מוכנים להתחיל?</h2>
            <div className="max-w-[70ch] mx-auto mb-10">
              <p className="text-white text-right">שיחת היכרות ללא עלות וללא התחייבות</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact?type=consultation"
                className="bg-white text-[var(--navy)] px-8 py-4 rounded-[var(--radius)] font-semibold hover:shadow focus:shadow focus:outline-none transition-colors duration-200"
              >
                קבעו שיחת ייעוץ
              </Link>
              <Link
                href="/demos"
                className="border-2 border-white text-white px-8 py-4 rounded-[var(--radius)] font-semibold hover:bg-white hover:text-[var(--navy)] focus:bg-white focus:text-[var(--navy)] focus:outline-none transition-colors duration-200"
              >
                צפו בדוגמאות
              </Link>
            </div>
          </div>
        </section>
    </div>
  )
}
