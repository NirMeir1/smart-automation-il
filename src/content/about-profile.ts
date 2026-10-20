import type { PageContent } from './schema'

// Founder facts supplied by the owner; keep separate from the original research copy.
export const founderProfile: {
  name: string
  photo: { src: string; width: number; height: number } | null
  linkedInUrl: string | null
} = {
  name: 'ניר מאיר',
  photo: null,
  linkedInUrl: null,
}

export function withFounderProfile(original: PageContent): PageContent {
  return {
    ...original,
    hero: original.hero.flatMap((node, index) => index === 0 ? [
      { ...node, text: node.text.replace('[שם מלא — נדרש להשלמה]', founderProfile.name) },
      { type: 'p' as const, text: 'אני מביא איתי כ־7 שנות ניסיון בפיתוח תוכנה ובטכנולוגיה, ומשלב בין הבנה עסקית, תכנון פתרונות ופיתוח מעשי — כדי לעזור לכם להתקדם מהצורך העסקי לפתרון שאפשר לעבוד איתו.' },
    ] : [node]),
    sections: [
      {
        id: 'professional-experience', title: 'ניסיון שמחבר בין פיתוח לצרכים עסקיים', tone: 'default', kind: 'flow',
        nodes: [
          { type: 'p', text: 'במשך חמש שנים ב־eToro עסקתי בפיתוח תשתיות אוטומציה ואוטומציית בדיקות, עם התמחות במסגרות אוטומציה, בתשתיות בדיקה ובהנדסת תוכנה. את הניסיון הזה אני מביא גם לחשיבה על הפתרון שמתאים לכם ולדרך שבה הוא ייבנה.' },
          { type: 'p', text: 'כיום אני עובד ב־Encore/Insait כמהנדס פיתוח והטמעת פתרונות אצל לקוחות (FDE). במסגרת התפקיד אני מפתח ומטמיע פתרונות בינה מלאכותית לארגונים ומוביל פרויקטים מקצה לקצה: מהבנת הדרישות העסקיות ותכנון הפתרון, דרך הפיתוח וההעלאה לאוויר, ועד לעבודה ישירה עם הלקוחות.' },
        ],
      },
      {
        id: 'expertise', title: 'איך הניסיון הזה יכול לעזור לכם', tone: 'default', kind: 'cards', columns: 3,
        nodes: [
          { type: 'card', text: 'תוכנה שמתאימה לצורך', nodes: [
            { type: 'p', text: 'הנדסת תוכנה, פיתוח פתרונות תוכנה מותאמים וארכיטקטורת פתרונות — לתכנון ולבנייה של הכלי שהעבודה שלכם צריכה.' },
          ] },
          { type: 'card', text: 'חיבור בין מערכות ותהליכים', nodes: [
            { type: 'p', text: 'שילוב בינה מלאכותית, אוטומציה עסקית ותשתיות אוטומציה — כדי לחבר יכולות טכנולוגיות לצרכים של העסק.' },
          ] },
          { type: 'card', text: 'ליווי מהצורך ועד היישום', nodes: [
            { type: 'p', text: 'ניתוח עסקי והובלת פרויקטים מקצה לקצה — מהבנת הדרישות ובחינת הפתרון, דרך הפיתוח וההטמעה, ועד לעבודה משותפת עם הלקוח.' },
          ] },
        ],
      },
      ...original.sections.filter(section => section.id !== 'operator-facts'),
      {
        id: 'introduction', title: 'בואו נכיר', tone: 'default', kind: 'flow',
        nodes: [{ type: 'cta', text: 'בואו נכיר', href: '/contact#inquiry' }],
      },
    ],
  }
}
