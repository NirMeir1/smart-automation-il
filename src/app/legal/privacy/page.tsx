export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">מדיניות פרטיות</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              אוטומציה חכמה מתחייבת להגן על פרטיותכם. מדיניות הפרטיות הזו מסבירה איך אנחנו
              אוספים, משתמשים ומגינים על המידע שלכם.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. מידע שאנו אוספים</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>מידע אישי:</strong></p>
                <ul className="space-y-2 mr-6">
                  <li>• שם מלא</li>
                  <li>• כתובת אימייל</li>
                  <li>• מספר טלפון</li>
                  <li>• שם חברה (אופציונלי)</li>
                  <li>• תוכן הודעות שנשלחות דרך האתר</li>
                </ul>
                
                <p><strong>מידע טכני:</strong></p>
                <ul className="space-y-2 mr-6">
                  <li>• כתובת IP</li>
                  <li>• סוג דפדפן</li>
                  <li>• זמן ביקור</li>
                  <li>• דפים שנצפו</li>
                  <li>• פעולות שבוצעו בדמואים (למטרות שיפור השירות)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. איך אנו משתמשים במידע</h2>
              <ul className="space-y-3 text-gray-700 mr-6">
                <li>• <strong>מתן שירות:</strong> לספק את השירותים המבוקשים ולהשיב על פניות</li>
                <li>• <strong>שיפור השירות:</strong> לשפר את האתר והשירותים שלנו</li>
                <li>• <strong>תקשורת:</strong> ליצור קשר לגבי שירותים ועדכונים</li>
                <li>• <strong>אבטחה:</strong> להגן על האתר ולמנוע שימוש לרעה</li>
                <li>• <strong>חוקיות:</strong> לעמוד בדרישות חוקיות</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. נתוני דמו</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>הערה חשובה:</strong> כל הנתונים בדמואים הם דמיים ולא אמיתיים.
                  הם נשמרים רק למטרות הדגמה ויכולים להימחק או להתאפס בכל עת.
                </p>
              </div>
              <ul className="space-y-2 text-gray-700 mr-6">
                <li>• נתוני הדמואים נשמרים באופן מקומי בדפדפן שלכם</li>
                <li>• לא נשלחים נתוני דמו לשרתים שלנו</li>
                <li>• המידע עשוי להימחק עם ניקוי המטמון או איפוס הדמו</li>
                <li>• אין לפרסם מידע רגיש או אמיתי בדמואים</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
              <div className="space-y-4 text-gray-700">
                <p>אנחנו לא מוכרים, משכירים או מעבירים מידע אישי לצדדים שלישיים, למעט:</p>
                <ul className="space-y-2 mr-6">
                  <li>• ספקי שירות שעוזרים לנו להפעיל את האתר (עם הגנת פרטיות מתאימה)</li>
                  <li>• במקרה של דרישה חוקית או צו בית משפט</li>
                  <li>• להגנה על הזכויות והביטחון שלנו או של אחרים</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. אבטחת מידע</h2>
              <div className="space-y-4 text-gray-700">
                <p>אנחנו נוקטים באמצעי אבטחה מתאימים כדי להגן על המידע שלכם:</p>
                <ul className="space-y-2 mr-6">
                  <li>• הצפנת תקשורת (HTTPS)</li>
                  <li>• גישה מוגבלת למידע רק לעובדים מורשים</li>
                  <li>• עדכונים שוטפים של מערכות האבטחה</li>
                  <li>• ניטור פעילות חשודה</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. הזכויות שלכם</h2>
              <div className="space-y-4 text-gray-700">
                <p>יש לכם הזכות:</p>
                <ul className="space-y-2 mr-6">
                  <li>• לדעת איזה מידע יש לנו עליכם</li>
                  <li>• לבקש תיקון מידע שגוי</li>
                  <li>• לבקש מחיקת המידע שלכם</li>
                  <li>• להתנגד להשימוש במידע שלכם</li>
                  <li>• לבקש העברת המידע לגורם אחר</li>
                </ul>
                <p>
                  לממש זכויות אלו, צרו קשר אמנו ב:
                  <a href="mailto:privacy@smart-automation.co.il" className="text-blue-600 hover:underline mr-2">
                    privacy@smart-automation.co.il
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. עוגיות (Cookies)</h2>
              <div className="space-y-4 text-gray-700">
                <p>אנחנו משתמשים בעוגיות לשיפור הביקור באתר:</p>
                <ul className="space-y-2 mr-6">
                  <li>• <strong>עוגיות הכרחיות:</strong> לתפקוד בסיסי של האתר</li>
                  <li>• <strong>עוגיות פונקציונליות:</strong> לשמירת העדפות המשתמש</li>
                  <li>• <strong>עוגיות אנליטיות:</strong> לשיפור הביצועים</li>
                </ul>
                <p>תוכלו לנהל או לחסום עוגיות דרך הגדרות הדפדפן.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. עדכונים למדיניות</h2>
              <p className="text-gray-700">
                עשויים להיות עדכונים למדיניות הפרטיות מדי פעם. שינויים משמעותיים יפורסמו באתר
                ו/או נשלח הודעה בדואל. המשך השימוש באתר מהווה הסכמה לשינויים.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-gray-900 mb-4">9. יצירת קשר</h2>
              <div className="space-y-2 text-gray-700">
                <p>לשאלות בנוגע למדיניות הפרטיות:</p>
                <p>
                  אימייל:
                  <a href="mailto:privacy@smart-automation.co.il" className="text-blue-600 hover:underline mr-2">
                    privacy@smart-automation.co.il
                  </a>
                </p>
                <p>
                  טלפון:
                  <a href="tel:+972501234567" className="text-blue-600 hover:underline mr-2">
                    050-1234567
                  </a>
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                מדיניות הפרטיות עודכנה לאחרונה: דצמבר 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}