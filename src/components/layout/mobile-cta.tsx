'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function MobileCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 bg-[var(--color-accent)] border-t border-[var(--color-accent)]/80 px-6 py-4 z-50 sm:hidden">
      <div className="flex gap-3 justify-center">
        <Link
          href="/demos"
          className="bg-white text-[var(--color-navy)] px-6 py-3 rounded-[var(--radius)] text-sm font-semibold hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-accent)] transition-colors duration-200 flex-1 inline-flex items-center justify-center gap-2"
          aria-label="נסו דמו אינטראקטיבי"
        >
          נסו דמו
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <Link
          href="/contact"
          className="border border-white text-white px-6 py-3 rounded-[var(--radius)] text-sm font-semibold hover:bg-white hover:text-[var(--color-navy)] focus:bg-white focus:text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-accent)] transition-colors duration-200 flex-1 inline-flex items-center justify-center"
          aria-label="צרו קשר"
        >
          צרו קשר
        </Link>
      </div>
    </div>
  )
}
