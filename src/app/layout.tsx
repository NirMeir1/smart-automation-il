// src/app/layout.tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

const heebo = localFont({
  src: './fonts/Heebo-Variable.ttf',
  weight: '100 900',
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = { title: 'Bottomline', robots: { index: false, follow: false } }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.className} ${heebo.variable}`}>
        <a href="#main" className="skip-link" tabIndex={0}>
          דלג לתוכן הראשי
        </a>
        <Navigation />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
