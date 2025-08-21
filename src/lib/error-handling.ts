import { eventLogStorage } from './storage'

export interface ErrorInfo {
  message: string
  stack?: string
  component?: string
  props?: Record<string, unknown>
  url?: string
  timestamp: Date
}

export class AppError extends Error {
  public readonly code: string
  public readonly isOperational: boolean

  constructor(message: string, code: string = 'GENERIC_ERROR', isOperational: boolean = true) {
    super(message)
    this.code = code
    this.isOperational = isOperational
    this.name = 'AppError'

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export function logError(error: Error | ErrorInfo, context?: Record<string, unknown>) {
  const errorInfo: ErrorInfo = error instanceof Error ? {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
    ...context
  } : error

  // Log to storage for admin review
  eventLogStorage.add({
    id: Math.random().toString(36).substr(2, 9),
    type: 'demo_interaction',
    details: {
      error: true,
      message: errorInfo.message,
      stack: errorInfo.stack,
      component: errorInfo.component,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context
    },
    timestamp: errorInfo.timestamp
  })

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', errorInfo)
  }
}

export function handleAsyncError<T>(
  promise: Promise<T>,
  errorMessage: string = 'An unexpected error occurred'
): Promise<T | null> {
  return promise.catch((error: Error) => {
    logError(error, { asyncOperation: errorMessage })
    return null
  })
}

export function createErrorBoundary() {
  return class ErrorBoundary extends Error {
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    static componentDidCatch(error: Error, errorInfo: unknown) {
      logError(error, { 
        component: 'ErrorBoundary',
        errorInfo 
      })
    }
  }
}

export function validateInput<T>(
  input: T,
  validators: Array<(value: T) => string | null>
): string[] {
  return validators
    .map(validator => validator(input))
    .filter((error): error is string => error !== null)
}

export const validators = {
  required: (value: string) => 
    !value?.trim() ? 'שדה זה הוא חובה' : null,
  
  email: (value: string) => 
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
      ? 'כתובת אימייל לא תקינה' : null,
  
  phone: (value: string) => 
    value && !/^[\d\-\+\(\)\s]+$/.test(value) 
      ? 'מספר טלפון לא תקין' : null,
  
  minLength: (min: number) => (value: string) =>
    value && value.length < min 
      ? `מינימום ${min} תווים` : null,
  
  maxLength: (max: number) => (value: string) =>
    value && value.length > max 
      ? `מקסימום ${max} תווים` : null,
  
  numeric: (value: string) => 
    value && !/^\d+(\.\d+)?$/.test(value) 
      ? 'ערך מספרי בלבד' : null,
  
  positiveNumber: (value: string) => 
    value && (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
      ? 'מספר חיובי בלבד' : null
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    const attempt = async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        attempts++
        if (attempts >= maxAttempts) {
          reject(error)
        } else {
          setTimeout(attempt, delay * attempts)
        }
      }
    }
    
    attempt()
  })
}