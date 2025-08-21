'use client'

import { useEffect } from 'react'
import { initializeData, logEvent } from '@/lib/storage'
import { measureWebVitals } from '@/lib/performance'
import { ErrorBoundary } from '@/components/error-boundary'

interface ClientProviderProps {
  children: React.ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
  useEffect(() => {
    // Initialize demo data
    initializeData()
    
    // Log page view
    logEvent('page_view', { path: window.location.pathname })
    
    // Start performance monitoring
    measureWebVitals()
    
    // Performance observer for navigation timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            logEvent('page_view', {
              path: window.location.pathname,
              loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              firstPaint: navEntry.responseEnd - navEntry.fetchStart
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      
      return () => observer.disconnect()
    }
  }, [])

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}