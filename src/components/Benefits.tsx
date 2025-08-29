// src/components/Benefits.tsx
'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

// Lazy, SSR-safe Lottie player
const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(m => m.DotLottieReact),
  { ssr: false }
)

function LottieLazy({
  src,
  className,
  reserveClassName = 'aspect-square',
  loop = true,
  autoplay = true,
  speed = 1,
}: {
  src: string
  className?: string
  reserveClassName?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const [shouldAutoplay, setShouldAutoplay] = useState(autoplay)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShouldAutoplay(false)
    }
  }, [])

  useEffect(() => {
    if (!ref.current || inView) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { rootMargin: '160px', threshold: 0.01 }
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

type Item = {
  title: string
  description: string
  kind: 'gif' | 'lottie'
  src: string
  fallbackColor: string
  aspect?: string
}

export default function Benefits() {
  const items: Item[] = [
    {
      title: 'שיפור ביצועים עסקיים באמצעות אוטומציה ודיגיטציה',
      description:
        'זוכרים את הרגע שבו הגעתם למשרד והרגשתם עמוסים ומבולבלים? וואטסאפים, מיילים, שיחות טלפון, והתחושה שאתם רק מנסים לשרוד ולנווט בתוך העומס.',
      kind: 'lottie',
      src: 'https://lottie.host/28766545-a904-4957-b454-1db137c9cf67/FqADIyBlAI.lottie', // ✅ First new animation
      fallbackColor: 'from-blue-400 to-purple-400',
      aspect: 'aspect-[16/10]',
    },
    {
      title: 'מהי אוטומציה עסקית? המפתח להצלחה בעידן הדיגיטלי',
      description:
        'זוכרים את הלילות בהם ישבתם עד השעות הקטנות מול המחשב, מסדרים חשבוניות, עונים על מיילים ומנסים לעקוב אחרי לידים?',
      kind: 'lottie',
      src: 'https://lottie.host/c9b06b1f-6550-469f-9034-1b4fc74ad6a2/oGP9CWe5hQ.lottie', // ✅ Second new animation
      fallbackColor: 'from-purple-400 to-pink-400',
      aspect: 'aspect-[16/10]',
    },
    {
      title: 'הבחירה של העסקים המצליחים',
      description:
        'נמאס לכם להרגיש כמו עבדים לעבודה השוטפת? מחקרים מראים שאפשר לחסוך עד 50% מזמן העבודה המוקדש נטו למשימות שגרתיות.',
      kind: 'lottie',
      src: 'https://lottie.host/4096380b-a237-468b-832f-bb99a32d2a2a/BvTzEaW5e2.lottie', // ✅ Third new animation
      fallbackColor: 'from-pink-400 to-yellow-400',
      aspect: 'aspect-[16/10]',
    },
    {
      title: 'קבלת החלטות חכמה בעידן הדיגיטלי',
      description:
        'נגמר העידן של ניחושים וקבלת החלטות עסקיות על בסיס אינטואיציה. AI זו המציאות שלכם כאן ועכשיו.',
      kind: 'lottie',
      src: "https://lottie.host/612f6525-c7ee-4be7-b2aa-6e3062f05d57/MVhDAd3K4L.lottie",
      fallbackColor: 'from-green-400 to-blue-400',
      aspect: 'aspect-[16/10]',
    },
    {
      title: 'שוברים את תקרת הזכוכית: מגדילים מכירות בקליק',
      description:
        'אם אתם מרגישים תקועים במעגל שבו אתם רודפים אחרי לידים ללא הצלחה, אנו מזמינים אתכם להפוך את האתגר להזדמנות.',
      kind: 'lottie',
      src: "https://lottie.host/c43f792b-6b78-4571-bb59-308955316bf6/HlVje0JSCT.lottie",
      fallbackColor: 'from-orange-400 to-red-400',
      aspect: 'aspect-[16/10]',
    },
    {
      title: 'שדרוג מערכת הלידים: יותר לקוחות, פחות מאמץ',
      description:
        'כבר עובדים עם מערכת לידים אבל מרגישים שהיא לא עושה את העבודה כמו שאתם באמת רוצים?',
      kind: 'lottie',
      src: "https://lottie.host/19442f0f-0a80-46ca-ac17-09a7903c9bee/E1kYhqnQWt.lottie",
      fallbackColor: 'from-indigo-400 to-purple-400',
      aspect: 'aspect-[16/10]',
    },
  ]

  return (
    <section id="thirdFloor" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div>
                <h3 className="text-2xl font-bold text-navy dark:text-white mb-4">
                  {item.title}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink mb-4" />
                <p className="text-gray-800 dark:text-gray-200">{item.description}</p>
              </div>

              <div className={index % 2 ? 'md:order-first' : ''}>
                <div
                  className={`
                    relative overflow-hidden rounded-lg z-0
                    ${item.aspect ?? 'aspect-square'}
                  `}
                >
                  {item.kind === 'gif' ? (
                    <img
                      src={item.src}
                      alt=""
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : (
                    <LottieLazy
                      src={item.src}
                      reserveClassName={item.aspect ?? 'aspect-square'}
                      className="pointer-events-none"
                    />
                  )}

                  <div
                    className={`hidden absolute inset-0 bg-gradient-to-br ${item.fallbackColor} 
                                flex items-center justify-center text-white text-xl`}
                    aria-hidden="true"
                  >
                    Animation
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}