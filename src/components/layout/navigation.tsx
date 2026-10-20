'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { routes } from '@/lib/routes'
export function Navigation() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  return <header className="site-header" onKeyDown={event => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus() }
  }}>
    <div className="site-container header-row">
      <Link href="/" className="wordmark" aria-label="BottomLine — דף הבית" onClick={() => setOpen(false)}><bdi dir="ltr">BottomLine<span>_</span></bdi></Link>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'} onClick={() => setOpen(!open)}>{open ? 'סגירה ×' : 'תפריט ☰'}</button>
      <nav id="primary-navigation" aria-label="ניווט ראשי" className={open ? 'primary-nav is-open' : 'primary-nav'}>
        {routes.map(route => <Link href={route.href} key={route.key} aria-current={pathname === route.href ? 'page' : undefined} onClick={() => setOpen(false)}>{route.label}</Link>)}
        <Link href="/contact#inquiry" className="action header-action" onClick={() => setOpen(false)}>לקביעת פגישת היכרות <span aria-hidden="true">↖</span></Link>
      </nav>
    </div>
  </header>
}
