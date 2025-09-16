import { CheckCircle, Target, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            אוטומציה חכמה שמקדמת את העסק שלך
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            אנחנו מפתחים פתרונות מותאמים אישית שמורידים ממך משימות שגרתיות, מייעלים את התהליכים היומיומיים ומאפשרים לך להתמקד במה שחשוב באמת!
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-items-center">
            <div className="text-right lg:text-right max-w-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">המשימה שלנו</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
               אנחנו מאמינים שכל עסק בישראל יכול – ואפילו צריך – להיעזר בטכנולוגיה מתקדמת כדי לצמוח ולהתפתח. המשימה שלנו היא להפוך משימות שגרתיות ומייגעות לתהליכים אוטומטיים וחכמים. אנחנו עושים זאת באמצעות פיתוח מותאם אישית, יצירת אינטגרציות למערכות שונות ושילוב פתרונות AI חדשניים. 
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-right">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">חיסכון בזמן</h3>
                    <p className="text-gray-600">עד 90% חיסכון בזמן על משימות שגרתיות</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-right">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">דיוק מלא</h3>
                    <p className="text-gray-600">מזעור טעויות אנוש במשימות קריטיות</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-right">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">זמינות המערכות 24/7</h3>
                    <p className="text-gray-600">המערכות עובדות עבורכם מסביב לשעון</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 w-full max-w-md mx-auto lg:mx-0">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">עסקים מרוצים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                  <div className="text-gray-600">שנות ניסיון</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">עד 90%</div>
                  <div className="text-gray-600">חיסכון בזמן</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">זמינות המערכות</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            הערכים שמובילים אותנו
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">מותאם אישית</h3>
              <p className="text-gray-600">
                כל פתרון שאנחנו בונים מותאם במיוחד לצרכים הייחודיים של העסק שלכם
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">שירות אישי</h3>
              <p className="text-gray-600">
                אנחנו מלווים אתכם לאורך כל הדרך - מההתחלה ועד ההצלחה
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">חדשנות</h3>
              <p className="text-gray-600">
                אנחנו תמיד בחזית הטכנולוגיה כדי להביא לכם את הפתרונות הטובים ביותר
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">מוכנים להתחיל?</h2>
          <p className="text-xl mb-8 opacity-90">
            בואו נכיר ונראה איך אנחנו יכולים לעזור לעסק שלכם לצמוח
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact?type=consultation"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              קבעו שיחת ייעוץ
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}