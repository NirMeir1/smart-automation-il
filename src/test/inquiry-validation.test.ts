import { describe, expect, it } from 'vitest'
import { emptyInquiry, inquiryLimits, validEmail, validPhone, validateInquiry } from '@/lib/inquiry'

const inquiry = { ...emptyInquiry, name: 'ישראל ישראלי', email: 'person@example.com', callerType: 'עסק', message: 'רוצה לשפר תהליך קיים', privacy: true, submissionId: '123e4567-e89b-42d3-a456-426614174000' }

describe('Contact validation regression cases', () => {
  it.each(['0522345678', '052-234-5678', '052 234 5678', '(052) 234-5678', '03-6123456', '02-6234567', '072-2345678', '+972522345678', '+972 (52) 234-5678', '+1 415 555 2671', '+44 20 7946 0958'])('accepts a valid national/international phone format: %s', phone => {
    expect(validPhone(phone)).toBe(true)
    expect(validateInquiry({ ...inquiry, phone }).errors).toEqual({})
  })
  it.each(['05238349823983', '052234567', '05223456789', '0000000000', '123456789', '522345678', '0521234567', '+999522345678', '+97252234567899', 'call 0522345678', '0522345678 ext 2', '0522345678\n', '05+22345678', '((052))2345678', '(0522345678', '052)2345678', '052/2345678'])('rejects invalid or embedded phone data: %s', phone => {
    expect(validPhone(phone)).toBe(false)
  })
  it.each(['person@example.com', 'person+website@example.co.il', "o'connor@example.com", 'Person.Name@EXAMPLE.COM', 'person@sub-domain.example.com'])('accepts a normal email address: %s', email => {
    expect(validEmail(email)).toBe(true)
  })
  it.each(['person..name@example.com', '.person@example.com', 'person.@example.com', 'person@example..com', 'person@-example.com', 'person@example-.com', 'person@localhost', 'person@example.c', 'person @example.com', 'person@example.com other', 'a'.repeat(65) + '@example.com', 'person@' + 'a'.repeat(64) + '.com', 'person@example.com\r\nBcc:other@example.com'])('rejects malformed email addresses: %s', email => {
    expect(validEmail(email)).toBe(false)
  })
  it.each(['ישראל', 'Zoë O’Connor', 'عبد الله', '李'])('allows real names without requiring two words or Latin-only letters: %s', name => {
    expect(validateInquiry({ ...inquiry, name }).errors).toEqual({})
  })
  it.each(['', '   ', '123456', '\u200b', 'ישראל\nישראלי', 'ישראל\tישראלי'])('rejects empty, numeric-only or multiline names: %s', name => {
    expect(validateInquiry({ ...inquiry, name }).errors.name).toBeTruthy()
  })
  it.each([' ', '\n\t', '\u200b\u200e'])('requires visible message content: %s', message => {
    expect(validateInquiry({ ...inquiry, message }).errors.message).toBeTruthy()
  })
  it('trims pasted contact details and keeps optional fields optional', () => {
    const result = validateInquiry({ ...inquiry, email: ' person+site@example.com ', phone: ' 052-2345678 ', systems: '', budget: '', meeting: '' })
    expect(result.errors).toEqual({})
    expect(result.data.email).toBe('person+site@example.com')
    expect(result.data.phone).toBe('052-2345678')
  })
  it.each(['name', 'message', 'systems', 'budget'] as const)('enforces the %s length boundary on the server', key => {
    expect(validateInquiry({ ...inquiry, [key]: 'א'.repeat(inquiryLimits[key]) }).errors[key]).toBeUndefined()
    expect(validateInquiry({ ...inquiry, [key]: 'א'.repeat(inquiryLimits[key] + 1) }).errors[key]).toBeTruthy()
  })
  it('does not accept truthy strings as privacy consent', () => {
    for (const privacy of ['true', 'on', 1, null, undefined]) expect(validateInquiry({ ...inquiry, privacy }).errors.privacy).toBeTruthy()
  })
})
