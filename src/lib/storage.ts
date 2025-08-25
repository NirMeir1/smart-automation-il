import { Invoice, Expense, TimeSlot, Booking, Lead, EventLog } from './types'
import { generateId } from './utils'

const STORAGE_KEYS = {
  INVOICES: 'smart-automation-invoices',
  EXPENSES: 'smart-automation-expenses', 
  TIME_SLOTS: 'smart-automation-slots',
  BOOKINGS: 'smart-automation-bookings',
  LEADS: 'smart-automation-leads',
  EVENT_LOG: 'smart-automation-events',
  INITIALIZED: 'smart-automation-initialized'
}

class LocalStorage<T extends { id: string }> {
  constructor(private key: string) {}

  get(): T[] {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(this.key)
      return data ? JSON.parse(data, (key, value) => {
        if (key.includes('date') || key.includes('Date') || key.includes('At')) {
          return new Date(value)
        }
        return value
      }) : []
    } catch {
      return []
    }
  }

  set(data: T[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.key, JSON.stringify(data))
  }

  add(item: T): void {
    const current = this.get()
    current.push(item)
    this.set(current)
  }

    update(id: string, updater: (item: T) => T): void {
      const current = this.get()
      const index = current.findIndex((item) => item.id === id)
    if (index !== -1) {
      current[index] = updater(current[index])
      this.set(current)
    }
  }

    delete(id: string): void {
      const current = this.get()
      const filtered = current.filter((item) => item.id !== id)
    this.set(filtered)
  }

  clear(): void {
    this.set([])
  }
}

export const invoiceStorage = new LocalStorage<Invoice>(STORAGE_KEYS.INVOICES)
export const expenseStorage = new LocalStorage<Expense>(STORAGE_KEYS.EXPENSES)
export const slotStorage = new LocalStorage<TimeSlot>(STORAGE_KEYS.TIME_SLOTS)
export const bookingStorage = new LocalStorage<Booking>(STORAGE_KEYS.BOOKINGS)
export const leadStorage = new LocalStorage<Lead>(STORAGE_KEYS.LEADS)
export const eventLogStorage = new LocalStorage<EventLog>(STORAGE_KEYS.EVENT_LOG)

export function resetAllData() {
  invoiceStorage.set([])
  expenseStorage.set([])
  slotStorage.set([])
  bookingStorage.set([])
  leadStorage.set([])
  eventLogStorage.set([])
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  }
  logEvent('admin_reset', { timestamp: new Date() })
}

export function logEvent(type: EventLog['type'], details: Record<string, unknown>) {
  const event: EventLog = {
    id: generateId(),
    type,
    details,
    timestamp: new Date()
  }
  eventLogStorage.add(event)
}