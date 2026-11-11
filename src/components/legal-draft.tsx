import type { Metadata } from 'next'
import { brand } from '@/lib/brand'
export const legalDraftMetadata = (title: string): Metadata => ({ title: `${title} | ${brand.name}`, description: `${title} של Posiblo — מידע על השימוש באתר ודרכי יצירת קשר.`, robots: { index: false, follow: false } })
export function LegalDraft({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="site-container legal-page" dir="rtl"><p className="eyebrow"><bdi dir="ltr">{brand.name}</bdi></p><h1>{title}</h1><p>עודכן לאחרונה: <time dateTime="2026-11-11">11 בנובמבר 2026</time></p>{children}</article>
}
