export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus()
        e.preventDefault()
      }
    }
  }

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const closeButton = container.querySelector('[data-dismiss]') as HTMLElement
      if (closeButton) closeButton.click()
    }
  }

  container.addEventListener('keydown', handleTabKey)
  container.addEventListener('keydown', handleEscapeKey)
  
  // Focus first element
  firstFocusable?.focus()

  return () => {
    container.removeEventListener('keydown', handleTabKey)
    container.removeEventListener('keydown', handleEscapeKey)
  }
}

export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export function isReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In a real app, you'd use a more comprehensive color library
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 1
  
  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function getLuminance({ r, g, b }: { r: number, g: number, b: number }): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}