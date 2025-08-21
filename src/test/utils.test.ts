import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, calculateVAT, getMonthVATDueDate } from '@/lib/utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1000)).toMatch(/1,000/)
      expect(formatCurrency(1000.50)).toMatch(/1,000.50/)
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toMatch(/0/)
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-500)).toMatch(/-500/)
    })
  })

  describe('formatDate', () => {
    it('should format date in DD/MM/YYYY format', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/15\/01\/2024/)
    })
  })

  describe('calculateVAT', () => {
    it('should calculate VAT when included in price', () => {
      const result = calculateVAT(117, true)
      expect(result.net).toBeCloseTo(100, 2)
      expect(result.vat).toBeCloseTo(17, 2)
      expect(result.gross).toBe(117)
    })

    it('should calculate VAT when not included in price', () => {
      const result = calculateVAT(100, false)
      expect(result.net).toBe(100)
      expect(result.vat).toBeCloseTo(17, 2)
      expect(result.gross).toBeCloseTo(117, 2)
    })

    it('should handle zero amount', () => {
      const result = calculateVAT(0, true)
      expect(result.net).toBe(0)
      expect(result.vat).toBe(0)
      expect(result.gross).toBe(0)
    })
  })

  describe('getMonthVATDueDate', () => {
    it('should return 15th of next month', () => {
      const testDate = new Date('2024-01-10')
      const dueDate = getMonthVATDueDate(testDate)
      
      expect(dueDate.getDate()).toBe(15)
      expect(dueDate.getMonth()).toBe(1) // February (0-based)
      expect(dueDate.getFullYear()).toBe(2024)
    })

    it('should handle December correctly', () => {
      const testDate = new Date('2024-12-10')
      const dueDate = getMonthVATDueDate(testDate)
      
      expect(dueDate.getDate()).toBe(15)
      expect(dueDate.getMonth()).toBe(0) // January (0-based)
      expect(dueDate.getFullYear()).toBe(2025)
    })
  })
})