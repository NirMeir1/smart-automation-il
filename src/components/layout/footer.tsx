import Link from 'next/link'
import { ContactLinks } from '@/components/contact-methods'
import { routes } from '@/lib/routes'
import { CopyText } from '@/components/copy-page'
import { FooterTopLink } from './footer-top-link'
import { BrandLogo } from '@/components/brand-logo'
import { brand } from '@/lib/brand'
export function Footer() {
  return <footer className="site-footer"><div className="site-container">
    <div className="footer-top"><div><FooterTopLink href="/" className="wordmark" aria-label="Posiblo — דף הבית"><BrandLogo /></FooterTopLink><p>פתרונות טכנולוגיים שמתחילים בבעיה האמיתית — לא בכלי.</p><p><CopyText text="אוטומציה | AI | מערכות מותאמות | אפליקציות | אתרים | אינטגרציות" /></p></div>
      <div><h2>רוצים לדבר על משהו שמעכב אתכם?</h2><p>ספרו לי מה קורה היום, ונבדוק יחד מה הדרך הנכונה לשפר אותו.</p><FooterTopLink className="action" href="/contact">לקביעת פגישה <span aria-hidden="true">↖</span></FooterTopLink></div></div>
    <ContactLinks includeEmail={false} />
    <nav aria-label="ניווט תחתון" className="footer-navigation">{routes.map(r => <Link key={r.key} href={r.href}>{r.label}</Link>)}</nav>
    <div className="footer-bottom"><nav aria-label="מידע משפטי"><Link href="/legal/privacy">מדיניות פרטיות</Link><Link href="/legal/terms">תנאי שימוש</Link><Link href="/legal/accessibility">הצהרת נגישות</Link></nav><p>© <bdi dir="ltr">{brand.name}</bdi>. כל הזכויות שמורות.</p></div>
  </div></footer>
}
