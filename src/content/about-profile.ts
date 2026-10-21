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
      { type: 'p' as const, text: 'יש לי כ־7 שנות ניסיון בפיתוח תוכנה ובטכנולוגיה. אני משלב הבנה עסקית עם תכנון ופיתוח מעשי כדי לבנות פתרון שאפשר לעבוד איתו.' },
    ] : [node]),
    sections: [
      {
        id: 'professional-experience', title: 'ניסיון שמחבר בין טכנולוגיה להבנה עסקית', tone: 'default', kind: 'flow',
        nodes: [
          { type: 'p', text: 'במשך חמש שנים עבדתי בחברה המפתחת פלטפורמת מסחר עולמית, שם התמקדתי בפיתוח תשתיות אוטומציה, עם דגש על בניית פתרונות יציבים, יעילים וניתנים לתחזוקה. הניסיון הזה העניק לי בסיס הנדסי חזק ויכולת להתמודד עם אתגרים טכנולוגיים מורכבים.' },
          { type: 'p', text: 'בהמשך עבדתי כמהנדס פיתוח והטמעת פתרונות (Forward Deployed Engineer – FDE) בסטארטאפ ישראלי המתמחה בפתרונות בינה מלאכותית לארגונים גדולים. במסגרת התפקיד הובלתי פרויקטים מקצה לקצה - מהבנת הצרכים העסקיים והעבודה מול הלקוחות, דרך תכנון ופיתוח הפתרון, ועד להטמעתו בסביבת העבודה האמיתית.' },
          { type: 'p', strongPrefix: 'את השילוב הזה אני מביא ל־Bottomline:', text: 'את השילוב הזה אני מביא ל־Bottomline: היכולת להבין את הבעיה העסקית, לתרגם אותה לפתרון טכנולוגי מתאים, ולבנות אותו בצורה מקצועית שתשרת את הצורך האמיתי.' },
        ],
      },
      {
        id: 'expertise', title: 'איך הניסיון הזה יכול לעזור לכם', tone: 'default', kind: 'cards', columns: 3,
        nodes: [
          { type: 'card', text: 'תוכנה שמתאימה לצורך', nodes: [
            { type: 'p', text: 'בעזרת הנדסת תוכנה וארכיטקטורת פתרונות, אני מתכנן ומפתח תוכנה מותאמת לצורכי העבודה שלכם.' },
          ] },
          { type: 'card', text: 'חיבור בין מערכות ותהליכים', nodes: [
            { type: 'p', text: 'אני משלב בינה מלאכותית, אוטומציה עסקית ותשתיות אוטומציה בהתאם לצרכים של העסק.' },
          ] },
          { type: 'card', text: 'ליווי מהצורך ועד היישום', nodes: [
            { type: 'p', text: 'אני מבצע ניתוח עסקי ומוביל את הפרויקט מהבנת הדרישות ובחינת הפתרון ועד הפיתוח וההטמעה, בעבודה משותפת איתכם.' },
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
