import Link from 'next/link'
import Image from 'next/image'
import { Bot, Calendar, FileText, MessageSquare, Zap } from 'lucide-react'
import { PainPointForm } from '@/components/sections/pain-point-form'

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-6">
              <span className="text-[var(--navy)]">אוטומציה </span>
              <span 
                className="bg-clip-text text-transparent" 
                style={{ 
                  backgroundImage: 'var(--accent)',
                  WebkitBackgroundClip: 'text'
                }}
              >
                חכמה לעסק
              </span>
              <span className="text-[var(--navy)]">{'\u00A0'}שלך</span>
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
                className="rounded-full px-10 py-5 min-h-[56px] text-lg text-white font-semibold inline-flex flex-row-reverse items-center justify-center gap-3 transition-transform hover:scale-105 hover:shadow-[var(--shadow)] focus-visible:scale-105 focus-visible:shadow-[var(--shadow)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
                style={{ background: 'var(--accent)' }}
                aria-label="קבעו שיחת ייעוץ חינמית"
              >
                <Calendar className="w-5 h-5" />
                קבעו שיחת ייעוץ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Form Section - Moved here */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="mb-3">ספרו לי על הבעיה בעסק</h2>
            <p className="text-[var(--ink)] max-w-[70ch] mx-auto">
              כתבו בקצרה את הכאב התפעולי שחוזר על עצמו – אחזור אליכם עם הצעה לפתרון אוטומטי.
            </p>
          </div>
          <PainPointForm />
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-white">
        <div className="container text-center">
          <h2 className="mb-12">פתרונות אוטומציה מתקדמים</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <FileText className="w-10 h-10 text-[var(--accent-from)] mb-4" />
                <h3 className="mb-2">ניהול מס ערך מוסף</h3>
                <p className="text-[var(--ink)]">
                  מערכת חכמה לניהול חשבוניות והוצאות עם חישוב מע״ם אוטומטי ותזכורות לתשלום
                </p>
              </div>
            </div>

            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <Calendar className="w-10 h-10 text-[var(--accent-from)] mb-4" />
                <h3 className="mb-2">קביעת פגישות חכמה</h3>
                <p className="text-[var(--ink)]">
                  בוט WhatsApp שמתאם פגישות אוטומטית, מנהל ביטולים ושולח תזכורות ללקוחות
                </p>
              </div>
            </div>

            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center mb-4">
                <MessageSquare className="w-10 h-10 text-[var(--accent-from)] mb-4" />
                <h3 className="mb-2">ניהול לידים אוטומטי</h3>
                <p className="text-[var(--ink)]">
                  איסוף ומיון לידים מכל הערוצים, מענה ראשוני אוטומטי ומעקב חכם אחרי התקדמות
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="mb-12">למה לבחור בנו?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] text-center hover:shadow-lg transition-shadow">
              <Bot className="w-10 h-10 text-[var(--accent-from)] mx-auto mb-4" />
              <h3 className="mb-3">טכנולוגיה מתקדמת</h3>
              <p className="text-[var(--ink)] text-right">פתרונות מבוססי AI ואוטומציה חכמה</p>
            </div>

            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] text-center hover:shadow-lg transition-shadow">
              <Zap className="w-10 h-10 text-[var(--accent-from)] mx-auto mb-4" />
              <h3 className="mb-3">יישום מהיר</h3>
              <p className="text-[var(--ink)] text-right">התקנה ויישום תוך שבועיים</p>
            </div>

            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] text-center hover:shadow-lg transition-shadow">
              <MessageSquare className="w-10 h-10 text-[var(--accent-from)] mx-auto mb-4" />
              <h3 className="mb-3">תמיכה בעברית</h3>
              <p className="text-[var(--ink)] text-right">מותאם למשתמשים ישראלים</p>
            </div>

            <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] text-center hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-[var(--accent-from)] mx-auto mb-4" />
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
            <div className="flex flex-col md:flex-row gap-8">
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
                  <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow)] h-full flex flex-col items-center hover:shadow-lg transition-shadow">
                    <span className="text-2xl font-bold text-[var(--accent-from)] mb-3">{index + 1}</span>
                    <h3 className="mb-4 text-lg font-semibold">{item.step}</h3>
                    <p className="text-[var(--ink)] text-right">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="py-20 bg-gray-50">
          <div className="container text-center">
            <h2 className="mb-12">המספרים מדברים</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '98%', label: 'שביעות רצון לקוחות' },
                { value: '200+', label: 'עסקים מרוצים' },
                { value: '60%', label: 'חיסכון בזמן ממוצע' },
                { value: '24/7', label: 'תמיכה זמינה' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-[var(--accent-from)] mb-2">{stat.value}</div>
                  <div className="text-[var(--ink)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 text-white" style={{ background: 'var(--accent)' }}>
          <div className="container text-center">
            <h2 className="text-white mb-8">עובדים עם הכלים שאתם אוהבים</h2>
            <div className="text-white mb-8 text-center text-right">
              תוך שימוש בכלים מהחזית הטכנולוגית
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {[
                'Monday', 'ClickUp', 'Slack', 'Gmail', 'WhatsApp', 'Telegram',
                'Sheets', 'Forms', 'Calendar', 'OpenAI', 'Claude', 'Perplexity'
              ].map(tool => (
                <div
                  key={tool}
                  className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20 bg-white">
          <div className="container text-center">
            <h2 className="mb-12">דוגמאות מהשטח</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-4)]">
              {[
                { title: 'רו״ח עצמאי', subtitle: 'ניהול מע״ם אוטומטי', detail: 'חיסכון של 10 שעות בחודש', link: '/testimonials' },
                { title: 'קליניקה', subtitle: 'קביעת תורים בוואטסאפ', detail: 'ירידה של 80% בביטולים', link: '/testimonials' },
                { title: 'סוכנות נדל״ן', subtitle: 'ניהול לידים אוטומטי', detail: 'עלייה של 40% במכירות', link: '/testimonials' },
              ].map(study => (
                <Link
                  key={study.title}
                  href={study.link}
                  className="bg-[var(--card)] rounded-[var(--radius)] shadow-[var(--shadow)] p-10 flex flex-col items-center hover:scale-105 transition-transform focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
                >
                  <h3 className="font-bold text-lg mb-2">{study.title}</h3>
                  <p className="text-[var(--ink)] mb-1">{study.subtitle}</p>
                  <p className="font-semibold text-[var(--accent-from)]">{study.detail}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-center mb-12">שאלות נפוצות</h2>
              {[
                { q: 'כמה זמן לוקח להקים מערכת?', a: 'בדרך כלל כשבועיים מרגע האפיון.' },
                { q: 'האם יש התחייבות?', a: 'לא, שיחת היכרות ללא עלות.' },
                { q: 'האם המערכת תומכת בעברית?', a: 'כן, כל הממשקים וההודעות מותאמים לעברית.' },
                { q: 'מה קורה אם יש תקלה?', a: 'אנחנו זמינים לתמיכה מלאה.' },
                { q: 'אפשר לשלב עם מערכות קיימות?', a: 'בוודאי, אנו עובדים עם מגוון כלים.' },
                { q: 'איך מתחילים?', a: 'פשוט קבעו שיחת ייעוץ ונשמח לעזור.' },
              ].map(item => (
                <details key={item.q} className="bg-[var(--card)] p-6 rounded-[var(--radius)] shadow-[var(--shadow)] mb-4">
                  <summary className="cursor-pointer font-semibold">{item.q}</summary>
                  <p className="mt-4 text-[var(--ink)]">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final Section */}
        <section className="py-20 mt-auto text-white" style={{ background: 'var(--accent)' }}>
          <div className="container text-center">
            <h2 className="text-white mb-6">מוכנים להתחיל?</h2>
            <div className="max-w-[70ch] mx-auto mb-10">
              <p className="text-white text-right">שיחת היכרות ללא עלות וללא התחייבות</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact?type=consultation"
                className="inline-flex items-center justify-center gap-3 bg-white text-[var(--navy)] px-10 py-5 min-h-[56px] rounded-full font-semibold hover:shadow-[var(--shadow)] focus-visible:shadow-[var(--shadow)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--navy)] transition-colors duration-200"
              >
                קבעו שיחת ייעוץ
              </Link>
              <a
                href="tel:050"
                className="rounded-full px-10 py-5 min-h-[56px] text-white font-semibold inline-flex items-center justify-center gap-3 transition-transform hover:scale-105 hover:shadow-[var(--shadow)] focus-visible:scale-105 focus-visible:shadow-[var(--shadow)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
                style={{ background: 'var(--accent)' }}
              >
                מעוניינים לשמוע?
              </a>
            </div>
          </div>
        </section>
    </div>
  )
}