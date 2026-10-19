import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

if (typeof window !== 'undefined') {
  const storage = () => ({ getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn() })
  Object.defineProperty(window, 'localStorage', { value: storage(), configurable: true })
  Object.defineProperty(window, 'sessionStorage', { value: storage(), configurable: true })
  Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation(query => ({ matches: false, media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() })) })
  global.IntersectionObserver = vi.fn().mockImplementation(function () { return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() } })
  global.ResizeObserver = vi.fn().mockImplementation(function () { return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() } })
}
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})
