import Link from 'next/link'

const footerLinks = {
  company: [
    { name: 'אודותינו', href: '/about' },
    { name: 'צור קשר', href: '/contact' },
    { name: 'המלצות', href: '/testimonials' }
  ],
  services: [
    { name: 'שיחת ייעוץ', href: '/contact?type=consultation' }
  ],
  legal: [
    { name: 'תנאי שימוש', href: '/legal/terms' },
    { name: 'מדיניות פרטיות', href: '/legal/privacy' }
  ]
}

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start justify-items-center md:justify-items-start max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-3">אוטומציה חכמה</h3>
            <p className="text-white/80 text-base md:text-sm leading-relaxed max-w-xl">
              מומחה באוטומציה עסקית, אינטגרציות AI, בוטים חכמים ופתרונות טכנולוגיים מתקדמים לעסקים בישראל
            </p>
          </div>

          <div className="text-right">
            <h4 className="text-sm font-semibold mb-4 text-white">החברה</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h4 className="text-sm font-semibold mb-4 text-white">שירותים</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <h4 className="text-sm font-semibold mb-4 text-white">משפטי</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-white/70 text-sm">
          © 2024 אוטומציה חכמה. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  )
}
