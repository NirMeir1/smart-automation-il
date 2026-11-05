import type { PageKey, PagePath } from '@/content/schema'

export const routes = [
  { key: 'home', href: '/', label: 'דף הבית' },
  { key: 'solutions', href: '/solutions', label: 'פתרונות' },
  { key: 'business', href: '/business', label: 'לעסקים' },
  { key: 'individuals', href: '/individuals', label: 'לפרטיים וליזמים' },
  { key: 'process', href: '/process', label: 'איך עובדים יחד' },
  { key: 'about', href: '/about', label: 'אודות' },
  { key: 'contact', href: '/contact', label: 'בואו נכיר' },
] as const satisfies readonly { key: PageKey; href: PagePath; label: string }[]

// Service pages are public inventory, without crowding the primary navigation.
export const serviceRoutes = [
  { key: 'businessAutomation', href: '/solutions/business-automation', label: 'אוטומציה עסקית' },
  { key: 'systemsIntegration', href: '/solutions/systems-integration', label: 'חיבור בין מערכות' },
] as const satisfies readonly { key: PageKey; href: PagePath; label: string }[]
export const publicRoutes = [...routes, ...serviceRoutes]
