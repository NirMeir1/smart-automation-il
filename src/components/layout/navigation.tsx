'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'דמואים', href: '/demos' },
  { name: 'המלצות', href: '/testimonials' },
  { name: 'אודותינו', href: '/about' },
  { name: 'צור קשר', href: '/contact' }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Skip Links */}
      <a
        href="#main-content"
        className="skip-link"
      >
        עבור לתוכן הראשי
      </a>
      <a
        href="#navigation"
        className="skip-link"
      >
        עבור לתפריט ניווט
      </a>
      
      <nav id="navigation" className="bg-[var(--card)] border-b border-[var(--outline)] sticky top-0 z-40" role="navigation" aria-label="תפריט ניווט ראשי" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="container">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-row-reverse items-center gap-6 lg:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]',
                    'hover:text-[var(--accent-from)] hover:bg-[var(--muted)]',
                    pathname === item.href
                      ? 'text-[var(--accent-from)] bg-[var(--muted)]'
                      : 'text-[var(--ink)]'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg min-h-[44px] text-white font-semibold transition-transform hover:scale-105 hover:shadow-[var(--shadow)] focus-visible:scale-105 focus-visible:shadow-[var(--shadow)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
              style={{ background: 'var(--accent)' }}
            >
              מעוניינים לשמוע?
            </Link>
          </div>

          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-[var(--accent-from)] hover:opacity-80 transition-colors"
            >
              אוטומציה חכמה
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[var(--ink)] hover:text-[var(--accent-from)] hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-from)]"
              style={{ borderRadius: 'var(--radius-sm)' }}
              aria-label={isOpen ? 'סגור תפריט' : 'פתח תפריט'}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[var(--card)]" style={{ boxShadow: 'var(--shadow)' }}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]',
                  'hover:text-[var(--accent-from)] hover:bg-[var(--muted)]',
                  pathname === item.href
                    ? 'text-[var(--accent-from)] bg-[var(--muted)]'
                    : 'text-[var(--ink)]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      </nav>
    </>
  )
}