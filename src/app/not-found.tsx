import Link from 'next/link'
export default function NotFound() {
  return <section className="site-container legal-page"><p className="eyebrow">404</p><h1>העמוד שחיפשתם לא נמצא.</h1><p>אפשר להתחיל מדף הבית או לספר לי מה אתם מנסים לפתור.</p><Link className="action" href="/">לדף הבית</Link><Link className="text-link" href="/contact">בואו נכיר</Link></section>
}
