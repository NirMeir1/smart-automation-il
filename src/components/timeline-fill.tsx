'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// The process steps' connecting line fills to amber, step by step, the first time the list scrolls into view.
// Without JS, or with reduced motion, the CSS default applies: the line is shown fully filled and static.
// The steps' text is never hidden; only the decorative line animates.
export function TimelineFill({ className, children }: { className: string; children: ReactNode }) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const element = list.current
    if (!element || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Already on screen when the page loads (e.g. a restored scroll position): leave it filled.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.6) return
    element.dataset.fill = 'pending'
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.dataset.fill = 'filled'
      observer.disconnect()
    }, { threshold: 0.35 })
    observer.observe(element)
    return () => { observer.disconnect(); delete element.dataset.fill }
  }, [])

  return <ol ref={list} className={className}>{children}</ol>
}
