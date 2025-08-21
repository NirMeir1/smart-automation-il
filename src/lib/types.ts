export interface Invoice {
  id: string
  amount: number
  isVATIncluded: boolean
  date: Date
  note: string
  type: 'income' | 'expense'
}

export interface Expense {
  id: string
  amount: number
  isVATIncluded: boolean
  date: Date
  note: string
  category: string
}

export interface TimeSlot {
  id: string
  date: Date
  startTime: string
  endTime: string
  isBooked: boolean
  clientName?: string
  clientPhone?: string
  clientEmail?: string
}

export interface Booking {
  id: string
  slotId: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  status: 'confirmed' | 'cancelled'
  createdAt: Date
  reminderSent: boolean
}

export interface Lead {
  id: string
  name: string
  phone?: string
  email?: string
  source: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  createdAt: Date
  followUpDate: Date
  lastContact?: Date
}

export interface EventLog {
  id: string
  type: 'page_view' | 'demo_interaction' | 'form_submit' | 'reminder_preview' | 'admin_reset'
  details: Record<string, unknown>
  timestamp: Date
  userId?: string
}

export interface VATSummary {
  totalIncome: number
  totalExpenses: number
  netVAT: number
  dueDate: Date
}