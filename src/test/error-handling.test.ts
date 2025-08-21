import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateInput, validators, debounce, throttle, retry } from '@/lib/error-handling'

describe('Error Handling', () => {
  describe('validateInput', () => {
    it('should return empty array for valid input', () => {
      const errors = validateInput('test@example.com', [validators.email])
      expect(errors).toEqual([])
    })

    it('should return errors for invalid input', () => {
      const errors = validateInput('invalid-email', [validators.email])
      expect(errors).toContain('כתובת אימייל לא תקינה')
    })

    it('should validate multiple rules', () => {
      const errors = validateInput('', [validators.required, validators.email])
      expect(errors).toContain('שדה זה הוא חובה')
    })
  })

  describe('validators', () => {
    describe('required', () => {
      it('should reject empty strings', () => {
        expect(validators.required('')).toBe('שדה זה הוא חובה')
        expect(validators.required('   ')).toBe('שדה זה הוא חובה')
      })

      it('should accept non-empty strings', () => {
        expect(validators.required('test')).toBeNull()
      })
    })

    describe('email', () => {
      it('should accept valid emails', () => {
        expect(validators.email('test@example.com')).toBeNull()
        expect(validators.email('user.name@domain.co.il')).toBeNull()
      })

      it('should reject invalid emails', () => {
        expect(validators.email('invalid')).toBe('כתובת אימייל לא תקינה')
        expect(validators.email('test@')).toBe('כתובת אימייל לא תקינה')
      })
    })

    describe('positiveNumber', () => {
      it('should accept positive numbers', () => {
        expect(validators.positiveNumber('123')).toBeNull()
        expect(validators.positiveNumber('45.67')).toBeNull()
      })

      it('should reject negative numbers and zero', () => {
        expect(validators.positiveNumber('0')).toBe('מספר חיובי בלבד')
        expect(validators.positiveNumber('-5')).toBe('מספר חיובי בלבד')
      })
    })
  })

  describe('debounce', () => {
    it('should delay function execution', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should cancel previous calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      debouncedFn('second')

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledOnce()
      expect(mockFn).toHaveBeenCalledWith('second')
    })
  })

  describe('retry', () => {
    it('should succeed on first try', async () => {
      const successFn = vi.fn().mockResolvedValue('success')
      const result = await retry(successFn, 3, 10)
      
      expect(result).toBe('success')
      expect(successFn).toHaveBeenCalledOnce()
    })

    it('should retry on failure', async () => {
      const failFn = vi.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success')

      const result = await retry(failFn, 3, 10)
      
      expect(result).toBe('success')
      expect(failFn).toHaveBeenCalledTimes(3)
    })

    it('should fail after max attempts', async () => {
      const failFn = vi.fn().mockRejectedValue(new Error('always fails'))
      
      await expect(retry(failFn, 2, 10)).rejects.toThrow('always fails')
      expect(failFn).toHaveBeenCalledTimes(2)
    })
  })
})