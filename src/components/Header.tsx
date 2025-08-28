// src/components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex justify-center lg:justify-between items-center py-4">
          {imgError ? (
            <div className="h-14 px-6 bg-pink text-white rounded-lg flex items-center font-bold">
              LOGO
            </div>
          ) : (
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={60}
              className="h-14 w-auto"
              onError={() => setImgError(true)}
              priority
            />
          )}
        </div>
      </div>
    </header>
  )
}