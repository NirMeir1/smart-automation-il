import { Invoice, Expense, TimeSlot, Booking, Lead, EventLog } from './types'
import { generateId, getMonthVATDueDate } from './utils'

const STORAGE_KEYS = {
  INVOICES: 'smart-automation-invoices',
  EXPENSES: 'smart-automation-expenses', 
  TIME_SLOTS: 'smart-automation-slots',
  BOOKINGS: 'smart-automation-bookings',
  LEADS: 'smart-automation-leads',
  EVENT_LOG: 'smart-automation-events',
  INITIALIZED: 'smart-automation-initialized'
}

class LocalStorage<T> {
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
    const index = current.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      current[index] = updater(current[index])
      this.set(current)
    }
  }

  delete(id: string): void {
    const current = this.get()
    const filtered = current.filter((item: any) => item.id !== id)
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

export function generateSeedData() {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const sampleInvoices: Invoice[] = [
    {
      id: generateId(),
      amount: 5000,
      isVATIncluded: true,
      date: new Date(thisMonth.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
      note: 'אתר אינטרנט לעסק קטן',
      type: 'income'
    },
    {
      id: generateId(),
      amount: 2500,
      isVATIncluded: true,
      date: new Date(thisMonth.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
      note: 'אוטומציה לניהול לקוחות',
      type: 'income'
    }
  ]

  const sampleExpenses: Expense[] = [
    {
      id: generateId(),
      amount: 300,
      isVATIncluded: true,
      date: new Date(thisMonth.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
      note: 'שרתים ותחזוקה',
      category: 'hosting'
    },
    {
      id: generateId(),
      amount: 150,
      isVATIncluded: true,
      date: new Date(thisMonth.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000),
      note: 'כלי עבודה ותוכנות',
      category: 'tools'
    }
  ]

  const sampleSlots: TimeSlot[] = []
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    const slots = ['09:00', '10:30', '14:00', '15:30']
    
    slots.forEach(startTime => {
      const [hours, minutes] = startTime.split(':').map(Number)
      const endTime = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      
      sampleSlots.push({
        id: generateId(),
        date,
        startTime,
        endTime,
        isBooked: Math.random() > 0.7
      })
    })
  }

  const sampleLeads: Lead[] = [
    {
      id: generateId(),
      name: 'דניאל כהן',
      email: 'daniel@example.com',
      phone: '050-1234567',
      source: 'גוגל',
      message: 'מעוניין באוטומציה לעסק שלי',
      status: 'new',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      followUpDate: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    },
    {
      id: generateId(),
      name: 'שרה לוי',
      email: 'sara@example.com',
      source: 'המלצה',
      message: 'צריכה עזרה עם אתר ומערכת ניהול',
      status: 'contacted',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      followUpDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      lastContact: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    }
  ]

  invoiceStorage.set(sampleInvoices)
  expenseStorage.set(sampleExpenses)
  slotStorage.set(sampleSlots)
  bookingStorage.set([])
  leadStorage.set(sampleLeads)
  eventLogStorage.set([])

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  }
}

export function initializeData() {
  if (typeof window === 'undefined') return
  
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (!initialized) {
    generateSeedData()
  }
}

export function resetAllData() {
  generateSeedData()
  logEvent('admin_reset', { timestamp: new Date() })
}

export function logEvent(type: EventLog['type'], details: Record<string, any>) {
  const event: EventLog = {
    id: generateId(),
    type,
    details,
    timestamp: new Date()
  }
  eventLogStorage.add(event)
}