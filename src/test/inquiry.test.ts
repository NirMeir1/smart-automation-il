import { describe, expect, it } from 'vitest'
import { emptyInquiry, validateInquiry } from '@/lib/inquiry'

const valid = { ...emptyInquiry, submissionId: '123e4567-e89b-42d3-a456-426614174000', name: 'ישראל ישראלי', contact: '050-1234567', callerType: 'עסק', message: 'תהליך שחוזר על עצמו', privacy: true }
describe('Shared inquiry validation', () => {
  it('accepts phone alone or email alone', () => {
    expect(validateInquiry(valid).errors).toEqual({})
    expect(validateInquiry({ ...valid, contact: 'person@example.test' }).errors).toEqual({})
    expect(validateInquiry({ ...valid, contact: '+972 (52) 123-4567' }).errors).toEqual({})
  })
  it.each(['invalid', '123', '1+2+3+4+5+6+7+8+9', '1234567890123456', 'test@example.test\r\nBcc:x@y.test'])('rejects unusable reply contact %s', contact => {
    expect(validateInquiry({ ...valid, contact }).errors.contact).toBeTruthy()
  })
  it('requires name, contact, caller type, description and explicit service consent', () => {
    expect(Object.keys(validateInquiry({}).errors)).toEqual(expect.arrayContaining(['name', 'contact', 'callerType', 'message', 'privacy']))
    expect(validateInquiry({ ...valid, privacy: 'true' }).errors.privacy).toBeTruthy()
  })
  it.each(['', 'not-a-uuid', '123e4567-e89b-12d3-a456-426614174000'])('rejects invalid retry identifiers: %s', submissionId => {
    expect(validateInquiry({ ...valid, submissionId }).errors.submissionId).toBeTruthy()
  })
  it('rejects oversized, mistyped, enum and spam values', () => {
    expect(validateInquiry({ ...valid, systems: 'a'.repeat(1001), budget: {}, meeting: 'other', callerType: 'n/a', website: 'spam' }).errors).toMatchObject({ systems: expect.any(String), budget: expect.any(String), meeting: expect.any(String), callerType: expect.any(String), website: expect.any(String) })
    expect(validateInquiry({ ...valid, name: { trim: 'oops' } }).errors.name).toBeTruthy()
  })
  it('rejects control bytes while accepting ordinary multiline descriptions', () => {
    expect(validateInquiry({ ...valid, message: 'problem\u0000details' }).errors.message).toBeTruthy()
    expect(validateInquiry({ ...valid, message: 'problem\nmore details\tcontext' }).errors).toEqual({})
  })
})
