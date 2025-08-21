import { Check, Star, Zap, Shield } from 'lucide-react'

const pricingPlans = [
  {
    name: 'בסיסי',
    price: '₪2,500',
    period: 'חד פעמי',
    description: 'מושלם לעסקים קטנים שמתחילים עם אוטומציה',
    features: [
      'אוטומציה אחת (VAT/פגישות/לידים)',
      'התקנה ויישום',
      '3 חודשי תמיכה',
      'הדרכה בסיסית',
      'עד 100 פעולות חודשיות'
    ],
    highlighted: false
  },
  {
    name: 'מקצועי',
    price: '₪4,500',
    period: 'חד פעמי',
    description: 'הפתרון הפופולרי ביותר לעסקים בגודל בינוני',
    features: [
      'שתי אוטומציות לבחירה',
      'התקנה ויישום',
      '6 חודשי תמיכה',
      'הדרכה מלאה',
      'עד 500 פעולות חודשיות',
      'דוחות ואנליטיקה',
      'אינטגרציה עם מערכות קיימות'
    ],
    highlighted: true
  },
  {
    name: 'עסקי',
    price: '₪7,500',
    period: 'חד פעמי',
    description: 'פתרון מלא לעסקים גדולים עם צרכים מורכבים',
    features: [
      'כל שלוש האוטומציות',
      'התקנה ויישום',
      '12 חודשי תמיכה',
      'הדרכה מקיפה',
      'ללא הגבלת פעולות',
      'דוחות ואנליטיקה מתקדמים',
      'אינטגרציה מלאה',
      'התאמות אישיות',
      'עדיפות בתמיכה'
    ],
    highlighted: false
  }
]

const additionalServices = [
  {
    name: 'פיתוח מותאם אישית',
    price: 'החל מ-₪10,000',
    description: 'פתרון ייחודי שנבנה במיוחד עבור העסק שלכם'
  },
  {
    name: 'תחזוקה חודשית',
    price: '₪500/חודש',
    description: 'תמיכה מתמשכת, עדכונים ושיפורים'
  },
  {
    name: 'הדרכת צוות',
    price: '₪1,200/יום',
    description: 'הדרכה מקיפה לצוות העבודה שלכם'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            מחירון
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            פתרונות אוטומציה במחירים שקופים וללא הפתעות.
            בחרו את החבילה המתאימה לעסק שלכם.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-lg border-2 p-8 ${
                  plan.highlighted
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      הכי פופולרי
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    <span className="text-gray-600 mr-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`/contact?type=quote&plan=${encodeURIComponent(plan.name)}`}
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  קבלת הצעת מחיר
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            שירותים נוספים
          </h2>
          <div className="space-y-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mr-6">
                    {service.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            למה לבחור בנו?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ערבות 30 יום</h3>
              <p className="text-gray-600">לא מרוצים? נחזיר לכם את הכסף</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">יישום מהיר</h3>
              <p className="text-gray-600">הטמעה תוך 2-4 שבועות</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">דירוג 5 כוכבים</h3>
              <p className="text-gray-600">מבוסס על 50+ ביקורות לקוחות</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">יש לכם שאלות?</h2>
          <p className="text-xl mb-8 opacity-90">
            נשמח לעזור לכם לבחור את הפתרון המתאים ביותר
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact?type=consultation"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              שיחת ייעוץ חינם
            </a>
            <a
              href="/demos"
              className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              נסו דמו
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}