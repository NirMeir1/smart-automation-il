import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
export const metadata: Metadata = { title: 'סביבת הדגמה מקומית | Bottomline', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return children
}
