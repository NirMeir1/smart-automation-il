'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { announceToScreenReader } from '@/lib/accessibility'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps extends Toast {
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
}

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}

export function ToastComponent({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = icons[type]

  useEffect(() => {
    // Announce to screen readers
    announceToScreenReader(`${type}: ${title}${message ? ` - ${message}` : ''}`)

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Allow fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [id, type, title, message, duration, onClose])

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border transition-all duration-300",
        "shadow-[var(--shadow)] bg-[var(--card)]",
        styles[type],
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      )}
      style={{ borderRadius: 'var(--radius-sm)' }}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconStyles[type])} />
      
      <div className="flex-1 min-w-0">
        <div className="font-medium">{title}</div>
        {message && <div className="text-sm mt-1">{message}</div>}
      </div>
      
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(id), 300)
        }}
        className="flex-shrink-0 p-1 hover:bg-[var(--muted)] transition-colors"
        style={{ borderRadius: 'var(--radius-sm)' }}
        aria-label="סגור הודעה"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast container and hook
interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

let toastContext: ToastContextType | null = null

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Make methods available globally
  toastContext = { addToast, removeToast }

  return (
    <div className="fixed top-4 left-4 z-[100] space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

// Global toast functions
export const toast = {
  success: (title: string, message?: string) => 
    toastContext?.addToast({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    toastContext?.addToast({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) => 
    toastContext?.addToast({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    toastContext?.addToast({ type: 'info', title, message }),
}