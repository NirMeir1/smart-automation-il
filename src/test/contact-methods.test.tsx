import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { ContactMethods } from '@/components/contact-methods'
import { Footer } from '@/components/layout/footer'
import { publicContact } from '@/lib/contact-public'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

describe('Public contact methods', () => {
  it('exposes the approved phone, email, WhatsApp message and response promise', () => {
    render(<ContactMethods />)
    expect(screen.getByRole('heading', { name: 'אפשר גם ליצור קשר ישירות' })).toBeInTheDocument()
    const whatsapp = screen.getByRole('link', { name: 'שליחת הודעה בוואטסאפ' })
    expect(whatsapp).toHaveAttribute('href', publicContact.whatsappHref)
    expect(new URL(whatsapp.getAttribute('href')!).searchParams.get('text')).toBe('שלום, הגעתי מהאתר של Posiblo ואשמח לשוחח.')
    expect(whatsapp).toHaveAttribute('target', '_blank')
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer')
    const phone = screen.getByRole('link', { name: /שיחת טלפון/ })
    expect(phone).toHaveAttribute('href', 'tel:+972522518189')
    expect(phone.querySelector('bdi')).toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('link', { name: /שליחת אימייל/ })).toHaveAttribute('href', 'mailto:posiblo.contact@gmail.com')
    expect(screen.getByText('אני עונה לכל פנייה בתוך יום עסקים אחד.')).toBeInTheDocument()
  })
  it('keeps the footer logo home link, legal navigation, phone and WhatsApp accessible', () => {
    render(<Footer />)
    const footer = within(screen.getByRole('contentinfo'))
    expect(footer.getByRole('link', { name: 'Posiblo — דף הבית' })).toHaveAttribute('href', '/')
    expect(footer.getByRole('img', { name: 'Posiblo' })).toHaveAttribute('src', '/brand/posiblo-logo.svg')
    expect(footer.getByRole('link', { name: /שיחת טלפון/ })).toHaveAttribute('href', publicContact.telHref)
    expect(footer.getByRole('link', { name: 'שליחת הודעה בוואטסאפ' })).toHaveAttribute('href', publicContact.whatsappHref)
    expect(footer.getByRole('link', { name: 'מדיניות פרטיות' })).toHaveAttribute('href', '/legal/privacy')
  })
})
