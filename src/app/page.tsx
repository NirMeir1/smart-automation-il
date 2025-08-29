import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Logos from '@/components/Logos'
import Benefits from '@/components/Benefits'
import Integrations from '@/components/Integrations'
import Process from '@/components/Process'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTASection'
import ROIWidget from '@/components/ROIWidget'

export default function HomePage() {
  return (
    <>
      <Header />
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
      <ROIWidget />
    </>
  )
}
