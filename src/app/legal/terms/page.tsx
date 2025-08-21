export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">תנאי השימוש</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              תנאי השימוש הבאים חלים על השימוש באתר אוטומציה חכמה ובשירותים המוצעים בו.
              בכניסה לאתר ובשימוש בשירותים, אתה מסכים לתנאים אלה.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. הגדרות</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>&quot;החברה&quot;</strong> - אוטומציה חכמה</li>
                <li>• <strong>&quot;האתר&quot;</strong> - האתר הדיגיטלי של החברה</li>
                <li>• <strong>&quot;השירותים&quot;</strong> - כל השירותים המוצעים באתר ו/או על ידי החברה</li>
                <li>• <strong>&quot;המשתמש&quot;</strong> - כל אדם המשתמש באתר או בשירותים</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. השימוש באתר</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  השימוש באתר מותר למטרות לגיטימיות בלבד. אסור לעשות שימוש באתר למטרות בלתי חוקיות
                  או בדרך הפוגעת בזכויות אחרים.
                </p>
                <p>
                  הדמואים המוצגים באתר הם לצורכי הדגמה בלבד ואינם מהווים שירות פעיל.
                  כל הנתונים המוצגים הם דמי ולא אמיתיים.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. קניין רוחני</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  כל התוכן באתר, לרבות טקסט, גרפיקה, לוגואים, איקונים, תמונות, קטעי אודיו,
                  הורדות דיגיטליות וקוד, הוא רכושה הבלעדי של החברה.
                </p>
                <p>
                  אסור להעתיק, לשכפל, להפיץ או להשתמש בתוכן ללא אישור מראש ובכתב מהחברה.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. שירותים מקצועיים</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  השירותים הניתנים על ידי החברה הם שירותי אוטומציה וייעוץ טכנולוגי.
                  המחירים והתנאים עשויים להשתנות ללא הודעה מראש.
                </p>
                <p>
                  החברה שומרת לעצמה את הזכות לסרב למתן שירותים לכל לקוח מכל סיבה שהיא.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. הגבלת אחריות</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  החברה לא תהיה אחראית לכל נזק ישיר או עקיף הנובע מהשימוש באתר או בשירותים,
                  לרבות אובדן רווחים, נתונים או הפרעות עסקיות.
                </p>
                <p>
                  השימוש באתר ובשירותים הוא על אחריותך הבלעדית.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. שינויים בתנאים</h2>
              <p className="text-gray-700">
                החברה רשאית לעדכן את תנאי השימוש בכל עת. שינויים יכנסו לתוקף מיד עם פרסומם באתר.
                המשך השימוש באתר לאחר השינוי מהווה הסכמה לתנאים החדשים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. דין חל וסמכות שיפוט</h2>
              <p className="text-gray-700">
                תנאי השימוש יהיו כפופים לדיני מדינת ישראל. כל סכסוך יידון בבתי המשפט המוסמכים בישראל.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. יצירת קשר</h2>
              <p className="text-gray-700">
                לשאלות לגבי תנאי השימוש, ניתן ליצור קשר עמנו בכתובת:
                <a href="mailto:info@smart-automation.co.il" className="text-blue-600 hover:underline mr-2">
                  info@smart-automation.co.il
                </a>
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                תנאי השימוש עודכנו לאחרונה: דצמבר 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}