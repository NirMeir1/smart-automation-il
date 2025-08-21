import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    currencyDisplay: 'symbol'
  }).format(amount)
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function calculateVAT(amount: number, isIncluded: boolean = true): { net: number, vat: number, gross: number } {
  const VAT_RATE = 0.17
  
  if (isIncluded) {
    const gross = amount
    const net = gross / (1 + VAT_RATE)
    const vat = gross - net
    return { net, vat, gross }
  } else {
    const net = amount
    const vat = net * VAT_RATE
    const gross = net + vat
    return { net, vat, gross }
  }
}

export function getMonthVATDueDate(date: Date = new Date()): Date {
  const dueDate = new Date(date.getFullYear(), date.getMonth() + 1, 15)
  return dueDate
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}