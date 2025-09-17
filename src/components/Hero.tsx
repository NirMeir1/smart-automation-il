// src/components/Hero.tsx
'use client'

import LeadForm from './LeadForm'            // keep: mounts once; renders via portal
import { PainPointForm } from './sections/pain-point-form'

export default function Hero() {
  return (
    <section
      id="firstFloor"
      className="relative bg-gradient-to-br from-blue-50 to-purple-50 pb-28" 
      // pb-28 ensures the fixed bottom bar doesn't cover content
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 pt-28 lg:pt-32">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Copy/content */}
          <div className="lg:col-span-4 text-center lg:text-right space-y-4">
            <p className="text-xl font-bold">חוסכים זמן, מגדילים רווחים:</p>
            <h1 className="text-4xl lg:text-5xl leading-tight">
              <span className="text-pink">אוטומציה עסקית </span>
              <strong className="block font-normal">
                שחוסכת לכם עד 50% מזמן העבודה במשרד
              </strong>
            </h1>
            <p className="text-lg">תנו לנו להראות לכם איך נוכל לשפר את העסק שלכם!</p>
          </div>
        </div>

        {/* Pain-point free text form (in-flow) */}
        <div className="mt-10">
          <PainPointForm />
        </div>
      </div>

      {/* Mount the sticky LeadForm once; it will render via portal to document.body */}
      <LeadForm />
    </section>
  )
}