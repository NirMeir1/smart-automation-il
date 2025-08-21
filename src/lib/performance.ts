import { useEffect, useState, useRef } from 'react'

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(label: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const duration = performance.now() - startTime
      this.recordMetric(label, duration)
    }
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    this.metrics.get(label)!.push(value)
    
    // Keep only last 100 measurements
    const values = this.metrics.get(label)!
    if (values.length > 100) {
      values.shift()
    }
  }

  getMetrics(): Record<string, { avg: number, min: number, max: number, count: number }> {
    const result: Record<string, { avg: number, min: number, max: number, count: number }> = {}
    
    this.metrics.forEach((values, label) => {
      result[label] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      }
    })
    
    return result
  }
}

// Custom hooks for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRun = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }
    }, delay - (Date.now() - lastRun.current))

    return () => clearTimeout(handler)
  }, [value, delay])

  return throttledValue
}

export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, ...options }
    )

    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [ref, options])

  return isVisible
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Memoization utilities
export function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  getKey?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new Map<string, Return>()

  return (...args: Args): Return => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// Image optimization utilities
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 75
): string {
  // In a real app, you'd integrate with your image optimization service
  // For now, return the original src
  return src
}

// Bundle size utilities
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export function dynamicImport<T = unknown>(
  importFn: () => Promise<T>
): Promise<T> {
  return importFn().catch(error => {
    console.error('Dynamic import failed:', error)
    throw error
  })
}

// Web Vitals monitoring
export function measureWebVitals() {
  if (typeof window === 'undefined') return

  const monitor = PerformanceMonitor.getInstance()

  // First Contentful Paint
  const paintEntries = performance.getEntriesByType('paint')
  paintEntries.forEach(entry => {
    monitor.recordMetric(entry.name, entry.startTime)
  })

  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    monitor.recordMetric('largest-contentful-paint', lastEntry.startTime)
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // First Input Delay
  new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      monitor.recordMetric('first-input-delay', entry.processingStart - entry.startTime)
    })
  }).observe({ entryTypes: ['first-input'] })
}

// Resource hints
export function prefetchResource(href: string, type: 'script' | 'style' | 'font' | 'image' = 'script') {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  if (type === 'font') {
    link.as = 'font'
    link.crossOrigin = 'anonymous'
  } else if (type === 'image') {
    link.as = 'image'
  }
  document.head.appendChild(link)
}

export function preconnect(href: string) {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = href
  document.head.appendChild(link)
}