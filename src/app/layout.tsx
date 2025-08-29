// src/app/layout.tsx
import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import ROIWidget from '@/components/ROIWidget'

const heebo = Heebo({
  subsets: ['hebrew'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title:
    'שיפור ביצועים עסקיים - Sogomatic ניהול תהליכים דיגיטליים בשילוב אינטגרציות ואוטומציות',
  description:
    'פתרונות אוטומציה עסקית מתקדמים לחיסכון בזמן ושיפור תהליכים. אינטגרציות חכמות, מדידה ותוצאות מוכחות.',
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
      <body className={`${heebo.className} ${heebo.variable}`}>
        <a href="#main" className="skip-link">
          דלג לתוכן הראשי
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <ROIWidget />
      </body>
    </html>
  )
}