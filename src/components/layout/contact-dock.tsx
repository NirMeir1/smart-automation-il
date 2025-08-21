'use client'

import Link from 'next/link'
import { Phone, MessageCircle, Mail } from 'lucide-react'

export function ContactDock() {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-[var(--accent)] px-6 py-4 z-50 flex justify-center gap-4 shadow-[var(--shadow)]">
      <Link
        href="https://wa.me/972"
        className="bg-white text-[var(--navy)] px-4 py-2 rounded-[var(--radius)] font-semibold inline-flex items-center gap-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        וואטסאפ
      </Link>
      <Link
        href="tel:0500000000"
        className="bg-white text-[var(--navy)] px-4 py-2 rounded-[var(--radius)] font-semibold inline-flex items-center gap-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Call"
      >
        <Phone className="w-5 h-5" />
        התקשרו
      </Link>
      <Link
        href="/contact"
        className="bg-white text-[var(--navy)] px-4 py-2 rounded-[var(--radius)] font-semibold inline-flex items-center gap-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Form"
      >
        <Mail className="w-5 h-5" />
        טופס
      </Link>
    </div>
  )
}
