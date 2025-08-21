const ADMIN_PASSWORD = 'demo2024!'

export function validateAdminAuth(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('admin_token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('admin_token', token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('admin_token')
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return getAuthToken() === 'authenticated'
}