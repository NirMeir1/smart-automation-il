'use client'

import { useState, useEffect } from 'react'
import { AuthForm } from '@/components/admin/auth-form'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { isAuthenticated } from '@/lib/auth'

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsAuth(isAuthenticated())
    setIsLoading(false)
  }, [])

  const handleAuthenticated = () => {
    setIsAuth(true)
  }

  const handleLogout = () => {
    setIsAuth(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>טוען...</p>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return <AuthForm onAuthenticated={handleAuthenticated} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}