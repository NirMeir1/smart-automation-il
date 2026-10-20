import type { Metadata } from 'next'
export const legalDraftMetadata = (title: string): Metadata => ({ title: `${title} — טיוטה לעיון | BottomLine`, robots: { index: false, follow: false } })
export function LegalDraft({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="site-container legal-page"><p className="eyebrow">BottomLine</p><h1>{title}</h1><p className="availability-notice"><strong>טיוטה לעיון בלבד — טרם אושרה לפרסום.</strong><br />נדרשים השלמת פרטים ובדיקה מקצועית לפני השקת האתר לציבור. אין כאן הצהרה על עמידה בדרישות הדין.</p>{children}</article>
}
