// src/components/Logos.tsx
'use client'

import { useState } from 'react'

export default function Logos() {
  const logoFiles = [
    'client1.png',
    'client2.png', 
    'client3.png',
    'client4.png',
    'client5.png',
  ]

  return (
    <section id="secondFloor" className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-2xl text-navy inline-flex items-center gap-2">
            בין לקוחותינו:
            <span className="inline-block w-8 h-8 bg-pink rounded-full"></span>
          </p>
        </div>
        
        <div className="flex overflow-x-auto gap-8 justify-center">
          {[...logoFiles, ...logoFiles].map((logo, i) => (
            <div key={i} className="flex-shrink-0">
              <img
                src={`/logos/${logo}`}
                alt=""
                className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden h-16 w-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Logo {(i % 5) + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}