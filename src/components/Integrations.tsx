// src/components/Integrations.tsx
export default function Integrations() {
  const items = [
    { title: 'HubSpot CRM', desc: 'ניהול לידים ולקוחות בצורה פשוטה.' },
    { title: 'Google Workspace (Gmail / Drive / Sheets)', desc: 'שיתוף מסמכים, ניהול מיילים וטפסים – הכול במקום אחד.' },
    { title: 'Calendly', desc: 'קביעת פגישות אוטומטית, בלי שיחות טלפון חוזרות.' },
    { title: 'WhatsApp (Click-to-Chat / Cloud API)', desc: 'מענה מיידי ללקוחות בערוץ שהם כבר משתמשים בו.' },
    { title: 'Trello', desc: 'ניהול משימות ופרויקטים בקלות, מתאים לצוותים קטנים.' },
    { title: 'Make.com', desc: 'אוטומציה חכמה המחברת בין כלים שונים, כולל חבילת התחלה חינמית.' },
    { title: 'חשבונית ירוקה / iCount / EZcount', desc: 'הפקת חשבוניות וקבלות באופן אוטומטי לאחר תשלום.' },
    { title: 'bit לעסקים', desc: 'קבלת תשלומים מיידיים ונוחים ישירות לנייד.' },
    { title: 'Facebook / Instagram Leads', desc: 'קליטה אוטומטית של לידים מהפרסום ברשתות החברתיות.' },
  ]

  return (
    <section className="py-20 text-navy dark:text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">ניהול עסק פשוט שמתממשק לכלים המוכרים:</h2>
        <h3 className="text-center text-lg text-gray-700 dark:text-gray-300 mb-12">
          המערכת שלנו מתממשקת בקלות עם הכלים המוכרים והנפוצים ביותר – כך שתוכל להמשיך לעבוד בסביבה נוחה, בלי להסתבך ובלי עלויות מיותרות
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-right flex flex-col h-full"
            >
              <div className="text-lg font-semibold text-gray-900 mb-2">{item.title}</div>
              <div className="text-sm text-gray-700">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
