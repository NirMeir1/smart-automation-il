// src/app/page.tsx
import Hero from '@/components/Hero'
import Benefits from '@/components/Benefits'
import Integrations from '@/components/Integrations'
import Process from '@/components/Process'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'

export default function HomePage() {
  // Note: <main id="main"> is already provided in RootLayout.
  // Avoid multiple <main> elements per page.
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
        ctaHref="/contact"
        gradient
      />
      {/* ROI widget is rendered globally in layout */}
    </>
  )
}
