import { Quote, Star, Building2, User } from 'lucide-react'

const testimonials = [
  {
    name: 'דוד כהן',
    role: 'בעל חברת הנהלת חשבונות',
    company: 'כהן הנח"ש',
    rating: 5,
    text: 'המערכת לניהול מע״ם חסכה לי שעות של עבודה כל חודש. החישובים מדויקים והתזכורות מגיעות בדיוק בזמן. השירות מעולה והתמיכה מקצועית.',
    image: '/testimonials/david.jpg'
  },
  {
    name: 'שרה לוי',
    role: 'מנהלת קליניקה',
    company: 'קליניקת שרה',
    rating: 5,
    text: 'מערכת קיבוע הפגישות שינתה לי את החיים! כבר לא צריכה לטפל בהזמנות כל יום, הכל אוטומטי. הלקוחות מרוצים והתזכורות מפחיתות משמעותית את מספר הביטולים.',
    image: '/testimonials/sara.jpg'
  },
  {
    name: 'מיכאל רוזן',
    role: 'סוכן נדל"ן',
    company: 'רוזן נדל"ן',
    rating: 5,
    text: 'מערכת הלידים פשוט מדהימה. כל פנייה מקבלת מענה מיידי והמעקב אחר הלקוחות הפוטנציאליים מסודר ויעיל. עליתי ב-40% במכירות!',
    image: '/testimonials/michael.jpg'
  },
  {
    name: 'רחל אברהם',
    role: 'יועצת עסקית',
    company: 'אברהם ייעוץ',
    rating: 5,
    text: 'הצוות של אוטומציה חכמה מקצועי ומסור. הם הבינו בדיוק מה אני צריכה ובנו פתרון שמתאים בדיוק לעסק שלי. הכי שווה השקעה שעשיתי!',
    image: '/testimonials/rachel.jpg'
  },
  {
    name: 'יוסי מזרחי',
    role: 'מנהל סטודיו צילום',
    company: 'מזרחי סטודיו',
    rating: 5,
    text: 'אחרי שהתקנו את המערכת, זמן התיאום של הפגישות צומצם מ-2 שעות ליום ל-10 דקות בשבוע. יכול להתמקד בצילום במקום בניהול.',
    image: '/testimonials/yossi.jpg'
  },
  {
    name: 'לינה חליל',
    role: 'רו"ח',
    company: 'חליל חשבונות',
    rating: 5,
    text: 'מערכת מע״ם הפכה להיות חלק בלתי נפרד מהעבודה היומיומית שלי. חיסכון מהותי בזמן וירידה משמעותית בטעויות. ממליצה בחום!',
    image: '/testimonials/lina.jpg'
  }
]

const stats = [
  { number: '50+', label: 'עסקים מרוצים' },
  { number: '98%', label: 'שביעות רצון' },
  { number: '60%', label: 'חיסכון בזמן ממוצע' },
  { number: '24/7', label: 'תמיכה זמינה' }
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            מה הלקוחות שלנו אומרים
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            קראו המלצות אמיתיות מבעלי עסקים שכבר נהנים מפתרונות האוטומציה שלנו
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute top-0 right-0 w-8 h-8 text-blue-100" />
                  <p className="text-gray-700 leading-relaxed pr-10">
                    {testimonial.text}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Building2 className="w-3 h-3" />
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">המספרים מדברים בעד עצמם</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            רוצים להיות הבאים ברשימה?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            בואו נראה איך אוטומציה יכולה לשנות גם את העסק שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demos"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              נסו דמו
            </a>
            <a
              href="/contact?type=consultation"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              קבעו שיחת ייעוץ
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-4">ערבות שביעות רצון</h3>
            <p className="text-green-700 leading-relaxed">
              אנחנו כל כך בטוחים באיכות השירות שלנו, שאנחנו מציעים ערבות מלאה של 30 יום.
              לא מרוצים מהתוצאות? נחזיר לכם את הכסף, ללא שאלות.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}