import { describe, expect, it } from 'vitest'
import { inquiryAutoReply } from '@/lib/inquiry-autoreply'

describe('Hebrew confirmation email presentation', () => {
  it('uses the approved follow-up with no response deadline in either format', () => {
    const followUp = 'תודה על הפנייה. קיבלתי אותה ואחזור אליך כדי לתאם פגישת היכרות.'
    const document = new DOMParser().parseFromString(inquiryAutoReply.html, 'text/html')
    expect(inquiryAutoReply.text.split('\n\n')).toContain(followUp)
    expect(Array.from(document.querySelectorAll('p'), paragraph => paragraph.textContent)).toContain(followUp)
    expect(inquiryAutoReply.text).not.toContain('יום עסקים')
    expect(document.body.textContent).not.toContain('יום עסקים')
  })
  it('uses explicit RTL and right alignment throughout, with an isolated LTR phone', () => {
    const document = new DOMParser().parseFromString(inquiryAutoReply.html, 'text/html')
    expect(document.documentElement.lang).toBe('he')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.body.dir).toBe('rtl')
    for (const paragraph of document.querySelectorAll('p')) {
      expect(paragraph.dir).toBe('rtl')
      expect(paragraph.style.textAlign).toBe('right')
    }
    const phone = document.querySelector('a')!
    expect(phone.dir).toBe('ltr')
    expect(phone.textContent).toBe('052-251-8189')
    expect(phone.style.whiteSpace).toBe('nowrap')
  })
  it('ends with the embedded logo rather than a text wordmark, while keeping a plain-text fallback', () => {
    const document = new DOMParser().parseFromString(inquiryAutoReply.html, 'text/html')
    const logo = document.querySelector('img')!
    expect(logo.getAttribute('src')).toBe('cid:posiblo-logo')
    expect(logo.getAttribute('alt')).toBe('לוגו Posiblo')
    expect(logo.getAttribute('width')).toBe('160')
    expect(document.body.textContent).not.toContain('Posiblo')
    expect(document.body.textContent).toContain('ניר מאיר')
    expect(document.querySelectorAll('script, iframe, img[src^="http"]')).toHaveLength(0)
    expect(inquiryAutoReply.text.trim()).toMatch(/ניר מאיר$/)
    expect(inquiryAutoReply.text).not.toContain('Posiblo')
  })
})
