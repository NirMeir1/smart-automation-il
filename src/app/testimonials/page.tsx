import { Quote, Star, Building2, User } from 'lucide-react'

const testimonials = [
  {
    name: 'דוד כהן',
    role: 'בעל חברת הנהלת חשבונות',
    company: 'כהן הנח"ש',
    rating: 5,
    text: 'הבוט החכם שבנו לי מתחבר ישירות למערכת החשבונות ומפיק דוחות מע״ם אוטומטיים עם AI. חסך לי 15 שעות עבודה בשבוע והכל מתעדכן בזמן אמת עם הבנק!',
  },
  {
    name: 'שרה לוי',
    role: 'מנהלת קליניקה',
    company: 'קליניקת שרה',
    rating: 4,
    text: 'מערכת ה-AI לניהול פגישות פשוט מדהימה! היא מתחברת לוואטסאפ, גוגל קלנדר ומערכת הרפואית שלי. הבוט מנהל בעצמו ביטולים, שינויים ואפילו שולח תזכורות מותאמות אישית.',
  },
  {
    name: 'מיכאל רוזן',
    role: 'סוכן נדל"ן',
    company: 'רוזן נדל"ן',
    rating: 5,
    text: 'הטכנולוגיה שהם יצרו לי פשוט חוסכת עולם! אינטגרציה מלאה בין Zapier, WhatsApp Business API, CRM ומערכות חיצוניות. הלידים מתעבדים אוטומטית והמכירות עלו ב-65%!',
  },
  {
    name: 'רחל אברהם',
    role: 'יועצת עסקית',
    company: 'אברהם ייעוץ',
    rating: 4,
    text: 'החיבור בין כל המערכות שלי עכשיו פועל כמו קסם! API אינטגרציה עם Google Workspace, Notion, ומערכת הביתית. הבוט מכין לי דוחות חכמים ומנתח נתונים עם AI - פשוט מהפכה!',
  },
  {
    name: 'יוסי מזרחי',
    role: 'מנהל סטודיו צילום',
    company: 'מזרחי סטודיו',
    rating: 5,
    text: 'מערכת החכמה שלהם מחברת את הווב-סייט, גוגל קלנדר, WhatsApp ומערכת התשלומים. הכל אוטומטי! מתיאום ועד לחיוב - זמן הניהול ירד מ-20 שעות שבועיות ל-30 דקות!',
  },
  {
    name: 'לינה חליל',
    role: 'רו"ח',
    company: 'חליל חשבונות',
    rating: 4,
    text: 'הטכנולוגיה הזו פתרה לי את הכל! אינטגרציה מלאה עם כל הבנקים, כרטיסי אשראי ומערכות הלקוחות. AI מזהה ומבצע הכל אוטומטית - קידוד, דיווחים ואפילו תזכורות חכמות ללקוחות!',
  }
]

const stats = [
  { number: '50+', label: 'עסקים מרוצים' },
  { number: '5', label: 'שנות ניסיון' },
  { number: 'עד 90%', label: 'חיסכון בזמן' },
  { number: '24/7', label: 'זמינות המערכות' }
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            מה הלקוחות שלנו אומרים
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
           קצת ממה שבעלי עסקים מספרים על החוויה איתנו – ועל איך האוטומציה ו-AI כבר מקלים עליהם את היום-יום:
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < testimonial.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300 fill-gray-300'
                      }`} 
                      style={i < testimonial.rating ? { fill: '#fbbf24', color: '#fbbf24' } : {}}
                    />
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
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">המספרים מדברים בעד עצמם</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            רוצים להיות הבאים ברשימה?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            בואו נראה איך אוטומציה יכולה לשנות גם את העסק שלכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact?type=consultation"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              קבעו שיחת ייעוץ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}