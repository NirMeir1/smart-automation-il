'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Below 768px the CSS turns the card grid into a horizontal scroll-snap row (desktop keeps the grid).
// While the row actually scrolls, it becomes a labelled, focusable region so arrow keys can scroll it,
// and the decorative dots follow the scroll position. Without JS the row still scrolls by touch and the
// cards stay fully visible.
export function CardCarousel({ className, label, count, children }: { className: string; label: string; count: number; children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const element = row.current
    if (!element) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const overflow = element.scrollWidth - element.clientWidth
        setScrollable(overflow > 1)
        // scrollLeft runs negative in RTL; the absolute value works in both directions.
        setActive(overflow > 1 ? Math.round(Math.abs(element.scrollLeft) / overflow * (count - 1)) : 0)
      })
    }
    const resize = new ResizeObserver(update)
    resize.observe(element)
    element.addEventListener('scroll', update, { passive: true })
    return () => { cancelAnimationFrame(frame); resize.disconnect(); element.removeEventListener('scroll', update) }
  }, [count])

  return <>
    <div ref={row} className={className} {...(scrollable ? { tabIndex: 0, role: 'region', 'aria-label': label } : {})}>{children}</div>
    <div className="carousel-dots" aria-hidden="true">{Array.from({ length: count }, (_, index) => <span key={index} className={index === active ? 'is-active' : undefined} />)}</div>
  </>
}
