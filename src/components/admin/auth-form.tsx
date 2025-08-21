'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { validateAdminAuth, setAuthToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface AuthFormProps {
  onAuthenticated: () => void
}

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (validateAdminAuth(password)) {
        setAuthToken('authenticated')
        onAuthenticated()
      } else {
        setError('סיסמה שגויה')
      }
    } catch (error) {
      setError('שגיאה במערכת')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            כניסה לפאנל הניהול
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הכנס סיסמת מנהל לכניסה למערכת
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס סיסמת מנהל"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full flex justify-center py-2 px-4 border border-transparent rounded-md font-medium text-white transition-colors",
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            )}
          >
            {isSubmitting ? 'מתחבר...' : 'התחבר'}
          </button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800 text-sm">
            <p className="font-medium">סיסמת דמו:</p>
            <code className="font-mono">demo2024!</code>
          </div>
        </form>
      </div>
    </div>
  )
}