'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(m => m.DotLottieReact),
  { ssr: false }
)

type Props = {
  src: string
  className?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
  /** Reserve space to avoid layout shift (e.g., 'aspect-[16/9] h-auto') */
  reserveClassName?: string
}

export default function LottieLazy({
  src,
  className,
  reserveClassName = 'aspect-[4/3]',
  loop = true,
  autoplay = true,
  speed = 1
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const [shouldAutoplay, setShouldAutoplay] = useState(autoplay)

  // Respect reduced motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShouldAutoplay(false)
    }
  }, [])

  // IntersectionObserver (no deps)
  useEffect(() => {
    if (!ref.current || inView) return
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { root: null, rootMargin: '160px', threshold: 0.01 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [inView])

  const containerClass = useMemo(
    () => `${reserveClassName} ${className ?? ''}`.trim(),
    [reserveClassName, className]
  )

  return (
    <div ref={ref} className={containerClass} aria-label="animation">
      {inView && (
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay={shouldAutoplay}
          speed={speed}
          className="w-full h-full"
        />
      )}
    </div>
  )
}