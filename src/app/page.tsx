// src/app/page.tsx
import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'

// Lazy-load heavier sections (improves TTI)
const Benefits = dynamic(() => import('@/components/Benefits'), { ssr: true })
const Integrations = dynamic(() => import('@/components/Integrations'), { ssr: true })
const Process = dynamic(() => import('@/components/Process'), { ssr: true })
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true })
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: true })

export default function HomePage() {
  // <main> is in RootLayout. Keep fragment here.
  return (
    <>
      <Hero />
      <Benefits />
      <Integrations />
      <Process />
      <Testimonials />
      <FAQ />
      <CTASection
        title="מוכנים להתחיל?"
        description="השאירו פרטים ונחזור אליכם עם פתרון מותאם אישית"
        ctaText="קבעו שיחת ייעוץ"
        gradient
      />
      {/* ROI widget is rendered globally in layout */}
    </>
  )
}