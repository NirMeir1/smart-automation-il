// src/components/Hero.tsx
'use client'

import LeadForm from './LeadForm'
import { PainPointForm } from './sections/pain-point-form'
import { useState } from 'react'

export default function Hero() {
  const [showForm, setShowForm] = useState(true)

  return (
    <section 
      id="firstFloor" 
      className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
      style={{ 
        backgroundImage: "url('/bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 pt-32">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 text-center lg:text-right space-y-4">
            <p className="text-xl font-bold">חוסכים זמן, מגדילים רווחים:</p>
            <h1 className="text-4xl lg:text-5xl">
              <span className="text-pink">אוטומציה עסקית </span>
              <strong className="block font-normal">שחוסכת לכם עד 50% מזמן העבודה במשרד</strong>
            </h1>
            <p className="text-lg">תנו לנו להראות לכם איך נוכל לשפר את העסק שלכם!</p>
          </div>
          
          <div className="lg:col-span-8">
            <video
              className="w-full rounded-lg"
              autoPlay
              muted
              loop
              playsInline
              poster="/video-poster.jpg"
            >
              <source src="/video.mp4" type="video/mp4" />
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-2xl text-gray-500">Video coming soon</p>
              </div>
            </video>
          </div>
        </div>
        {/* Free-text pain point form below the hero text */}
        <div className="mt-10">
          <PainPointForm />
        </div>
      </div>

      {/* Contact Form Section */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white transition-all ${showForm ? '' : 'translate-y-full'}`}>
        <div className="container mx-auto px-4">
          <div className="lp-contact p-6 relative">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid lg:grid-cols-4 gap-6 items-center">
              <div className="lg:col-span-1">
                <p className="text-lg font-bold">
                  לשפר ביצועים <strong>ועד 30% הגדלה בהכנסות ממכירות</strong> – אל תשאירו כסף על הרצפה!
                </p>
              </div>
              <div className="lg:col-span-3">
                <LeadForm />
              </div>
            </div>
            
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="yellow-button mx-auto block mt-4"
              >
                לחצו עליי להשארת פרטים!
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
