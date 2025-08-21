'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'בית', href: '/' },
  { name: 'דמואים', href: '/demos' },
  { name: 'אודותינו', href: '/about' },
  { name: 'מחירון', href: '/pricing' },
  { name: 'המלצות', href: '/testimonials' },
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
      
      <nav id="navigation" className="bg-white shadow-sm border-b" role="navigation" aria-label="תפריט ניווט ראשי">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              אוטומציה חכמה
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-reverse space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  'hover:text-blue-600 hover:bg-blue-50',
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  'hover:text-blue-600 hover:bg-blue-50',
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700'
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