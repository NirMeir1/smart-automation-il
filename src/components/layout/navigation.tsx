'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { routes } from '@/lib/routes'
import { BrandLogo } from '@/components/brand-logo'
import { Icon } from '@/components/icon'
import { brand } from '@/lib/brand'
export function Navigation() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  return <header className="site-header" onKeyDown={event => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus() }
  }}>
    <div className="site-container header-row">
      <Link href="/" className="wordmark" aria-label={`${brand.name} — דף הבית`} onClick={() => setOpen(false)}><BrandLogo /></Link>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} size={22} /><span>{open ? 'סגירה' : 'תפריט'}</span></button>
      <nav id="primary-navigation" aria-label="ניווט ראשי" className={open ? 'primary-nav is-open' : 'primary-nav'}>
        {routes.map(route => <Link href={route.href} key={route.key} aria-current={pathname === route.href ? 'page' : undefined} onClick={() => setOpen(false)}>{route.label}</Link>)}
        {/* Native anchor avoids Next 16 appending a repeated #inquiry fragment. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/contact#inquiry" className="action header-action" onClick={() => setOpen(false)}>לקביעת פגישת היכרות</a>
      </nav>
    </div>
  </header>
}
