// src/components/Benefits.tsx
'use client'

export default function Benefits() {
  const items = [
    {
      title: 'שיפור ביצועים עסקיים באמצעות אוטומציה ודיגיטציה',
      description: 'זוכרים את הרגע שבו הגעתם למשרד והרגשתם עמוסים ומבולבלים? וואטסאפים, מיילים, שיחות טלפון, והתחושה שאתם רק מנסים לשרוד ולנווט בתוך העומס.',
      image: '/images/ai.gif',
      fallbackColor: 'from-blue-400 to-purple-400',
    },
    {
      title: 'מהי אוטומציה עסקית? המפתח להצלחה בעידן הדיגיטלי',
      description: 'זוכרים את הלילות בהם ישבתם עד השעות הקטנות מול המחשב, מסדרים חשבוניות, עונים על מיילים ומנסים לעקוב אחרי לידים?',
      image: '/images/graphs.gif',
      fallbackColor: 'from-purple-400 to-pink-400',
    },
    {
      title: 'הבחירה של העסקים המצליחים',
      description: 'נמאס לכם להרגיש כמו עבדים לעבודה השוטפת? מחקרים מראים שאפשר לחסוך עד 50% מזמן העבודה המוקדש נטו למשימות שגרתיות.',
      image: '/images/business.gif',
      fallbackColor: 'from-pink-400 to-yellow-400',
    },
    {
      title: 'קבלת החלטות חכמה בעידן הדיגיטלי',
      description: 'נגמר העידן של ניחושים וקבלת החלטות עסקיות על בסיס אינטואיציה. AI זו המציאות שלכם כאן ועכשיו.',
      image: '/images/meeting.gif',
      fallbackColor: 'from-green-400 to-blue-400',
    },
    {
      title: 'שוברים את תקרת הזכוכית: מגדילים מכירות בקליק',
      description: 'אם אתם מרגישים תקועים במעגל שבו אתם רודפים אחרי לידים ללא הצלחה, אנו מזמינים אתכם להפוך את האתגר להזדמנות.',
      image: '/images/sales.gif',
      fallbackColor: 'from-orange-400 to-red-400',
    },
    {
      title: 'שדרוג מערכת הלידים: יותר לקוחות, פחות מאמץ',
      description: 'כבר עובדים עם מערכת לידים אבל מרגישים שהיא לא עושה את העבודה כמו שאתם באמת רוצים?',
      image: '/images/leads.gif',
      fallbackColor: 'from-indigo-400 to-purple-400',
    },
  ]

  return (
    <section id="thirdFloor" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {items.map((item, index) => (
            <div key={index} className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 ? 'md:flex-row-reverse' : ''}`}>
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-4">{item.title}</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink mb-4"></div>
                <p className="text-gray-800 dark:text-gray-200">{item.description}</p>
              </div>
              <div className={index % 2 ? 'md:order-first' : ''}>
                <div className="relative aspect-square rounded-lg overflow-hidden pointer-events-none z-0">
                  <img 
                    src={item.image} 
                    alt="" 
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className={`hidden absolute inset-0 bg-gradient-to-br ${item.fallbackColor} flex items-center justify-center text-white text-xl`}>
                    Animation
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
