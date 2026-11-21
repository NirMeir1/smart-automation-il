'use client'
import { usePathname } from 'next/navigation'
import { ContactIcon } from '@/components/contact-icon'
import { publicContact } from '@/lib/contact-public'

// Phone-width shortcut to the one next step. Hidden on the contact page, where the form is the next step.
export function MobileActionBar() {
  const pathname = usePathname()
  if (pathname === '/contact' || pathname.startsWith('/legal')) return null
  return <div className="mobile-action-bar">
    {/* Native anchor avoids Next 16 appending a repeated #inquiry fragment. */}
    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/contact#inquiry" className="action">לקביעת פגישת היכרות</a>
    <a href={publicContact.whatsappHref} target="_blank" rel="noopener noreferrer" className="mobile-whatsapp" aria-label="כתבו לי בוואטסאפ"><ContactIcon channel="whatsapp" /></a>
  </div>
}
