import Link from 'next/link'
import { ContactLinks } from '@/components/contact-methods'
import { routes } from '@/lib/routes'
import { CopyText } from '@/components/copy-page'
import { FooterTopLink } from './footer-top-link'
import { BrandLogo } from '@/components/brand-logo'
import { Icon } from '@/components/icon'
import { brand } from '@/lib/brand'
import { AnalyticsConsent } from '@/components/analytics-consent'
import { SocialLinks } from '@/components/social-links'

const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim()

export function Footer() {
  return <footer className="site-footer"><div className="site-container">
    <div className="footer-top">
      <div className="footer-brand"><FooterTopLink href="/" className="wordmark" aria-label="Posiblo — דף הבית"><BrandLogo light /></FooterTopLink><p className="footer-tagline">פתרונות טכנולוגיים שמתחילים בבעיה האמיתית — לא בכלי.</p><ul className="footer-services">{['אוטומציה', 'AI', 'מערכות מותאמות', 'אפליקציות', 'אתרים', 'אינטגרציות'].map(service => <li key={service}><CopyText text={service} /></li>)}</ul></div>
      <nav aria-label="ניווט תחתון" className="footer-navigation">{routes.map(r => <Link key={r.key} href={r.href}>{r.label}</Link>)}</nav>
      <div className="footer-contact"><h2>רוצים לדבר על משהו שמעכב אתכם?</h2><p>ספרו לי מה קורה היום, ונבדוק יחד מה הדרך הנכונה לשפר אותו.</p><ContactLinks includeEmail={false} /><FooterTopLink className="action action-inverse" href="/contact"><span>לקביעת פגישה</span><Icon name="arrow" size={20} /></FooterTopLink><SocialLinks /></div>
    </div>
    {/* Decorative outlined wordmark above the bottom row; hidden from assistive tech, never selectable or clickable. */}
    <div className="footer-wordmark" aria-hidden="true" dir="ltr">{brand.name}</div>
    <div className="footer-bottom"><nav aria-label="מידע משפטי"><Link href="/legal/privacy">מדיניות פרטיות</Link><Link href="/legal/terms">תנאי שימוש</Link><Link href="/legal/accessibility">הצהרת נגישות</Link>{measurementId && /^G-[A-Z0-9]+$/.test(measurementId) && <AnalyticsConsent id={measurementId} />}</nav><p>© <bdi dir="ltr">{brand.name}</bdi>. כל הזכויות שמורות.</p></div>
  </div></footer>
}
