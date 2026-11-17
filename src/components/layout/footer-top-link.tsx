'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

export function FooterTopLink({ href, className, children, 'aria-label': ariaLabel }: { href: '/' | '/contact'; className: string; children: ReactNode; 'aria-label'?: string }) {
  return <Link href={href} className={className} aria-label={ariaLabel} onNavigate={() => {
    if (window.location.pathname === href) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }}>{children}</Link>
}
