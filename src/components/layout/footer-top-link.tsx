'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

export function FooterTopLink({ href, className, children }: { href: '/' | '/contact'; className: string; children: ReactNode }) {
  return <Link href={href} className={className} onNavigate={() => {
    if (window.location.pathname === href) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }}>{children}</Link>
}
