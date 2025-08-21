import Link from 'next/link'

const footerLinks = {
  company: [
    { name: 'אודותינו', href: '/about' },
    { name: 'צור קשר', href: '/contact' },
    { name: 'המלצות', href: '/testimonials' }
  ],
  services: [
    { name: 'דמואים', href: '/demos' },
    { name: 'מחירון', href: '/pricing' },
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
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">אוטומציה חכמה</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              מומחה באוטומציה עסקית, בוטים חכמים ופתרונות טכנולוגיים מתקדמים לעסקים בישראל
            </p>
          </div>

          <div>
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

          <div>
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

          <div>
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

        <div className="border-t border-[var(--outline)] mt-8 pt-8">
          <p className="text-white/80 text-sm text-center">
            © 2024 אוטומציה חכמה. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  )
}