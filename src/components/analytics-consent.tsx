'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { analyticsLocation, analyticsReferrer, measurePage, stopAnalytics, trackAnalytics } from '@/lib/analytics'

const storageKey = 'posiblo-analytics-consent-v1'
type Choice = 'granted' | 'denied'
let temporaryChoice: Choice | null = null

function readChoice(): Choice | null {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored === 'granted' || stored === 'denied' ? stored : temporaryChoice
  } catch { return temporaryChoice }
}

function subscribe(listener: () => void) {
  window.addEventListener(storageKey, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(storageKey, listener)
    window.removeEventListener('storage', listener)
  }
}

const serverChoice = () => undefined

export function AnalyticsConsent({ id }: { id: string }) {
  const choice = useSyncExternalStore<Choice | null | undefined>(subscribe, readChoice, serverChoice)
  const pathname = usePathname()
  const [editing, setEditing] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const settings = useRef<HTMLButtonElement>(null)
  const landing = useRef<URL | null>(null)
  const previousPage = useRef<{ pathname: string; href: string } | null>(null)
  const visible = choice === null || editing

  useEffect(() => {
    landing.current ??= analyticsLocation(location.href)
    if (choice !== 'granted') {
      stopAnalytics()
      previousPage.current = null
      return
    }
    if (previousPage.current?.pathname === pathname) return

    const current = analyticsLocation(location.href)
    // Attribute the first measured page to the landing campaign even after an internal navigation.
    if (!previousPage.current && !current.search) current.search = landing.current.search
    const referrer = previousPage.current?.href ?? analyticsReferrer(document.referrer)
    measurePage(id, current.href, referrer)
    previousPage.current = { pathname, href: current.href }
  }, [choice, id, pathname])

  useEffect(() => {
    if (choice !== 'granted') return
    function recordWhatsApp(event: MouseEvent) {
      if (event.type === 'auxclick' && event.button !== 1) return
      if (event.target instanceof Element && event.target.closest('a[data-analytics-whatsapp]')) {
        trackAnalytics('whatsapp_click')
      }
    }
    document.addEventListener('click', recordWhatsApp)
    document.addEventListener('auxclick', recordWhatsApp)
    return () => {
      document.removeEventListener('click', recordWhatsApp)
      document.removeEventListener('auxclick', recordWhatsApp)
    }
  }, [choice])

  useEffect(() => { if (editing) heading.current?.focus() }, [editing])

  function saveChoice(next: Choice) {
    if (next === 'denied') stopAnalytics()
    try { localStorage.setItem(storageKey, next) } catch { temporaryChoice = next }
    window.dispatchEvent(new Event(storageKey))
    if (editing) settings.current?.focus()
    setEditing(false)
  }

  return <>
    <button ref={settings} type="button" className="analytics-settings" aria-expanded={visible} aria-controls={visible ? 'analytics-consent' : undefined} onClick={() => setEditing(true)}>העדפות עוגיות</button>
    {visible && <section id="analytics-consent" className="analytics-consent" aria-labelledby="analytics-consent-title">
      <h2 ref={heading} id="analytics-consent-title" tabIndex={-1}>עוגיות למדידת השימוש באתר</h2>
      <p>באישורכם נשתמש ב־Google Analytics למדידת ביקורים ופעולות באתר. תוכלו לשנות את הבחירה בכל עת. <Link href="/legal/privacy">מדיניות הפרטיות</Link></p>
      <div className="analytics-consent-actions">
        <button type="button" className="action" onClick={() => saveChoice('granted')}>אישור מדידה</button>
        <button type="button" className="action" onClick={() => saveChoice('denied')}>ללא מדידה</button>
      </div>
    </section>}
  </>
}
