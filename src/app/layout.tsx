// src/app/layout.tsx
import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import ROIWidget from '@/components/ROIWidget'

const heebo = Heebo({ 
  subsets: ['hebrew'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'שיפור ביצועים עסקיים - Sogomatic ניהול תהליכים דיגיטליים בשילוב אינטגרציות ואוטומציות',
  description: 'פתרונות אוטומציה עסקית מתקדמים לחיסכון בזמן ושיפור תהליכים. אינטגרציות חכמות, מדידה ותוצאות מוכחות.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'אוטומציה עסקית - חיסכון של עד 50% בזמן עבודה',
    description: 'פתרונות אוטומציה עסקית מתקדמים לחיסכון בזמן ושיפור תהליכים',
    url: '/',
    siteName: 'Sogomatic',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={heebo.className}>
        <a href="#main" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <Navigation />
        {children}
        <Footer />
        <ROIWidget />
      </body>
    </html>
  )
}
