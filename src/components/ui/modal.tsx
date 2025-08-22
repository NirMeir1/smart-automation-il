'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { trapFocus } from '@/lib/accessibility'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement>()

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocus.current = document.activeElement as HTMLElement
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      
      // Set up focus trap
      if (modalRef.current) {
        const cleanup = trapFocus(modalRef.current)
        return () => {
          cleanup()
          document.body.style.overflow = 'unset'
          // Restore focus to the previously focused element
          previousFocus.current?.focus()
        }
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-[var(--card)] mx-4 max-h-[90vh] overflow-y-auto",
          "shadow-[var(--shadow)]",
          {
            'max-w-sm': size === 'sm',
            'max-w-md': size === 'md',
            'max-w-lg': size === 'lg',
            'max-w-4xl': size === 'xl',
          }
        )}
        style={{ borderRadius: 'var(--radius)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--outline)]">
          <h2 id="modal-title" className="text-xl font-semibold text-[var(--navy)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            data-dismiss="true"
            className="p-2 hover:bg-[var(--muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-from)]"
            style={{ borderRadius: 'var(--radius-sm)' }}
            aria-label="סגור חלון"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}