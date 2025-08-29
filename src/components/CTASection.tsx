// src/components/CTASection.tsx
import Link from 'next/link'

interface Props {
  title: string
  description: string
  ctaText: string
  /** Destination for the CTA button (defaults to /contact) */
  ctaHref?: string
  gradient?: boolean
}

export default function CTASection({
  title,
  description,
  ctaText,
  ctaHref = '/contact',
  gradient,
}: Props) {
  return (
    <section
      className={`py-20 ${
        gradient
          ? 'bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white'
          : 'bg-blue-50 text-[var(--foreground)]'
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>

        <Link
          href={ctaHref}
          className="inline-block px-10 py-4 text-lg md:text-xl font-semibold rounded-xl
                     bg-red-500 text-white shadow-lg
                     transition-all duration-200
                     hover:bg-red-400 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  )
}