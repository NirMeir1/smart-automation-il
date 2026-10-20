import type { InternalHref, PageKey } from './schema'

type SectionDefinition = { id: string; kind?: 'cards' | 'faq'; columns?: 2 | 3; cardActions?: boolean; tone?: 'principle' | 'closing' }
export const sectionDefinitions: Record<PageKey, Record<string, SectionDefinition>> = {
  home: {
    'נשמע מוכר?': { id: 'problems', kind: 'cards', columns: 3 },
    'אז מה Bottomline עושה?': { id: 'capabilities', kind: 'cards', columns: 3 },
    'לעסקים וגם לאנשים': { id: 'audiences', kind: 'cards', columns: 2, cardActions: true },
    'איך זה עובד': { id: 'process', kind: 'cards', columns: 3 },
    'לא כל דבר צריך AI': { id: 'principle', tone: 'principle' },
    'שאלות שעולות לפני שמתחילים': { id: 'faq', kind: 'faq' },
    'יש משהו שיושב לכם בראש כבר יותר מדי זמן?': { id: 'closing', tone: 'closing' },
  },
  solutions: {
    'לעבוד פחות ידנית': { id: 'manual-work' }, 'לחבר מערכות שלא מדברות': { id: 'integrations' },
    'לבנות כלי שלא קיים': { id: 'custom-tools' }, 'להפוך רעיון למוצר': { id: 'products' },
    'לשפר את החוויה מול לקוחות': { id: 'customer-experience' }, 'להשתמש ב-AI במקום הנכון': { id: 'appropriate-ai' },
    'הכלים שאפשר לעבוד איתם': { id: 'toolbox' },
  },
  business: {
    'מתי כדאי לדבר?': { id: 'symptoms' }, 'מה אפשר לשפר?': { id: 'processes' },
    'לא מחליפים מערכת רק כי אפשר': { id: 'existing-systems' }, 'איך מתחילים?': { id: 'first-contact' },
  },
  individuals: {
    'רעיון לאפליקציה או מוצר': { id: 'product-idea' }, MVP: { id: 'mvp' },
    'כלי אישי או מערכת מותאמת': { id: 'personal-tools' }, 'אוטומציה אישית': { id: 'personal-automation' },
    'לא כל רעיון צריך אפליקציה': { id: 'simpler-solutions' },
  },
  process: {
    'פגישת ההיכרות': { id: 'discovery' }, 'מה לא צריך להכין': { id: 'preparation' },
    'אחרי הפגישה': { id: 'next-steps' }, 'בזמן הפרויקט': { id: 'delivery' }, 'בסוף': { id: 'handover' },
  },
  about: { 'למה לעבוד ישירות?': { id: 'direct-ownership' }, 'במה אני מאמין': { id: 'principles' } },
  contact: { 'לא יודעים אם זה בכלל משהו שאני יכול לעזור בו?': { id: 'reassurance' } },
}

// Links are editorial configuration, never inferred from visible wording during rendering.
export const ctaLinks: Record<string, InternalHref> = {
  'לקביעת פגישת היכרות': '/contact#inquiry', 'ספרו לי מה מעכב אתכם': '/contact?intent=problem#inquiry',
  'בואו נדבר על מה שקורה אצלכם': '/contact#inquiry', 'פתרונות לעסקים': '/business',
  'פתרונות לפרטיים וליזמים': '/individuals', 'איך נראית פגישת ההיכרות?': '/process',
  'יש משימה שחוזרת על עצמה? דברו איתי': '/contact?intent=problem#inquiry',
  'ספרו לי מה מעכב את העסק': '/contact?intent=business', 'בואו נדבר על הרעיון': '/contact?intent=idea',
  'בואו נכיר': '/contact#inquiry',
}
