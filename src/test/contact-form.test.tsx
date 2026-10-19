import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ContactForm } from '@/components/contact-form'
import { inquirySuccess, privacyAcknowledgement, unavailableMessage } from '@/lib/inquiry'

const fetchMock = vi.fn()
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal('fetch', fetchMock) })
function fill(contact = '0501234567') {
  fireEvent.change(screen.getByLabelText('שם מלא *'), { target: { value: 'ישראל' } })
  fireEvent.change(screen.getByLabelText('טלפון או אימייל *'), { target: { value: contact } })
  fireEvent.change(screen.getByLabelText('אני פונה בתור *'), { target: { value: 'עסק' } })
  fireEvent.change(screen.getByLabelText('מה הייתם רוצים לפתור? *'), { target: { value: 'רוצה לשפר את התהליך' } })
  fireEvent.click(screen.getByRole('checkbox', { name: privacyAcknowledgement }))
}
describe('Contact form', () => {
  it('discloses missing configuration and disables collection/submission', () => {
    render(<ContactForm enabled={false} />)
    expect(screen.getByText(unavailableMessage)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /שליחת הפנייה/ })).toBeDisabled()
    expect(screen.getByLabelText('שם מלא *')).toBeDisabled()
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('provides accessible client validation before submitting', () => {
    render(<ContactForm enabled />)
    fireEvent.click(screen.getByRole('button', { name: /שליחת הפנייה/ }))
    expect(screen.getByRole('alert')).toHaveFocus()
    expect(screen.getByLabelText('שם מלא *')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('link', { name: 'יש למלא שם מלא.' })).toHaveAttribute('href', '#name')
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it.each(['0501234567', 'person@example.test'])('confirms only backend success for %s', async contact => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    render(<ContactForm enabled />); fill(contact)
    fireEvent.click(screen.getByRole('button', { name: /שליחת הפנייה/ }))
    await screen.findByRole('heading', { name: inquirySuccess.title })
    expect(screen.getByRole('status')).toHaveFocus()
    expect(screen.getByText(inquirySuccess.body)).toBeInTheDocument()
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.contact).toBe(contact); expect(sent.privacy).toBe(true)
    expect(sent).not.toHaveProperty('marketingConsent')
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
  it('retains entered data and shows failure on server or network error', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'לא נשלח' }) }).mockRejectedValueOnce(new Error('network'))
    render(<ContactForm enabled />); fill()
    fireEvent.click(screen.getByRole('button', { name: /שליחת הפנייה/ }))
    expect(await screen.findByText('לא נשלח')).toBeInTheDocument()
    expect(screen.getByLabelText('שם מלא *')).toHaveValue('ישראל')
    expect(screen.queryByText(inquirySuccess.title)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /שליחת הפנייה/ }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('לא התקבל אישור שליחה'))
  })
  it('disables repeat submit while awaiting confirmation and never trusts an empty 200 response', async () => {
    let resolve!: (value: unknown) => void
    fetchMock.mockReturnValue(new Promise(r => { resolve = r }))
    render(<ContactForm enabled />); fill()
    fireEvent.click(screen.getByRole('button', { name: /שליחת הפנייה/ }))
    expect(screen.getByRole('button', { name: /שולחים/ })).toBeDisabled()
    resolve({ ok: true, json: async () => ({}) })
    await screen.findByRole('alert')
    expect(screen.queryByText(inquirySuccess.title)).not.toBeInTheDocument()
  })
  it('offers all three meeting formats, optional budget/tools and links the actual privacy page', () => {
    render(<ContactForm enabled />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'אין העדפה' })).toBeChecked()
    expect(screen.getByRole('link', { name: 'מדיניות הפרטיות' })).toHaveAttribute('href', '/legal/privacy')
    expect(screen.getByLabelText('יש טווח השקעה משוער שחשוב לדעת?')).not.toBeRequired()
  })
})
