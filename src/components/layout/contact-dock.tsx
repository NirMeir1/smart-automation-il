'use client'

import Link from 'next/link'
import { Phone, MessageCircle, Mail } from 'lucide-react'

export function ContactDock() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 h-16 pb-safe-bottom"
      style={{ background: 'var(--accent)' }}
    >
      <div className="container h-full flex justify-center items-center gap-4">
        <Link
          href="https://wa.me/972"
          className="bg-white text-[var(--navy)] px-5 py-4 min-h-[44px] rounded-[var(--radius)] shadow-[var(--shadow)] font-semibold inline-flex items-center justify-center gap-3 min-w-[180px] transition-all duration-200 hover:scale-[1.02] hover:shadow-[var(--shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
          וואטסאפ
        </Link>
        <Link
          href="tel:0500000000"
          className="bg-white text-[var(--navy)] px-5 py-4 min-h-[44px] rounded-[var(--radius)] shadow-[var(--shadow)] font-semibold inline-flex items-center justify-center gap-3 min-w-[180px] transition-all duration-200 hover:scale-[1.02] hover:shadow-[var(--shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
          aria-label="Call"
        >
          <Phone className="w-5 h-5" />
          התקשרו
        </Link>
        <Link
          href="/contact"
          className="bg-white text-[var(--navy)] px-5 py-4 min-h-[44px] rounded-[var(--radius)] shadow-[var(--shadow)] font-semibold inline-flex items-center justify-center gap-3 min-w-[180px] transition-all duration-200 hover:scale-[1.02] hover:shadow-[var(--shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent-from)]"
          aria-label="Form"
        >
          <Mail className="w-5 h-5" />
          טופס
        </Link>
      </div>
    </div>
  )
}
