'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'המלצות', href: '/testimonials' },
  { name: 'אודותינו', href: '/about' },
  { name: 'צור קשר', href: '/contact' }
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <nav
        id="navigation"
        className="bg-[var(--card)] border-b border-[var(--outline)] sticky top-0 z-40"
        role="navigation"
        aria-label="תפריט ניווט ראשי"
        style={{ boxShadow: 'var(--shadow)' }}
      >
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-row-reverse items-center gap-6 lg:gap-8">
                {navigation.map((item) => {
                  const isContact = item.name === 'צור קשר'
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'px-3 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        isContact
                          ? 'bg-[var(--accent-from)] text-white hover:bg-[var(--accent-to)] shadow-md'
                          : 'text-[var(--ink)] hover:text-[var(--accent-from)] hover:bg-[var(--muted)]',
                        pathname === item.href && !isContact
                          ? 'text-[var(--accent-from)] bg-[var(--muted)]'
                          : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[var(--ink)] hover:text-[var(--accent-from)] hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-from)]"
                style={{ borderRadius: 'var(--radius-sm)' }}
                aria-label={isOpen ? 'סגור תפריט' : 'פתח תפריט'}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div
              className="px-2 pt-2 pb-3 space-y-1 bg-[var(--card)]"
              style={{ boxShadow: 'var(--shadow)' }}
            >
              {navigation.map((item) => {
                const isContact = item.name === 'צור קשר'
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-3 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      isContact
                        ? 'bg-[var(--accent-from)] text-white hover:bg-[var(--accent-to)] shadow-md text-center'
                        : 'text-[var(--ink)] hover:text-[var(--accent-from)] hover:bg-[var(--muted)]',
                      pathname === item.href && !isContact
                        ? 'text-[var(--accent-from)] bg-[var(--muted)]'
                        : ''
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}