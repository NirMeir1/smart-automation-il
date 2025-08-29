import Hero from '@/components/Hero'
import Logos from '@/components/Logos'
import Benefits from '@/components/Benefits'
import Integrations from '@/components/Integrations'
import Process from '@/components/Process'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <Logos />
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
      </main>
      {/* ROI widget now rendered globally in layout */}
    </>
  )
}
