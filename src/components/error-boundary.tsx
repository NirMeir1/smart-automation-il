'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { logError } from '@/lib/error-handling'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, {
      component: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    })

    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">אופס! משהו השתבש</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              אירעה שגיאה בלתי צפויה. אנחנו עובדים על תיקון הבעיה. 
              אם השגיאה ממשיכה להופיע, נא ליצור איתנו קשר.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                רענן דף
              </button>
              
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                חזור לדף הבית
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-right">
                <summary className="cursor-pointer text-sm text-[var(--ink)] hover:text-[var(--accent-from)] min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-from)] focus-visible:ring-offset-2 transition-colors">
                  פרטי השגיאה (פיתוח)
                </summary>
                <pre className="mt-2 p-4 bg-[var(--muted)] text-xs text-[var(--ink)] overflow-auto text-left" style={{ borderRadius: 'var(--radius-sm)' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// React 18 compatible error boundary hook
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    logError(error, errorInfo as unknown as Record<string, unknown>)
  }
}