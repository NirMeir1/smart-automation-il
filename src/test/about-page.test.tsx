import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage from '@/app/about/page'
import { pages } from '@/content/pages'
import { founderProfile, withFounderProfile } from '@/content/about-profile'
import { parseSiteContent } from '@/content/schema'
import original from '@/content/pages.json'

describe('About founder profile', () => {
  it('presents the supplied experience in Hebrew with explicit RTL and isolated company names', () => {
    const { container } = render(<AboutPage />)
    expect(container.querySelector('article[dir="rtl"]')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.textContent).toContain('ניר מאיר')
    expect(container.textContent).toContain('כ־7 שנות ניסיון')
    expect(container.textContent).toContain('במשך חמש שנים ב־eToro')
    expect(container.textContent).toContain('כיום אני עובד ב־Encore/Insait')
    expect(container.textContent).toContain('ארכיטקטורת פתרונות')
    expect(container.textContent).toContain('ניתוח עסקי')
    expect([...container.querySelectorAll('bdi[dir="ltr"]')].map(element => element.textContent)).toEqual(expect.arrayContaining(['eToro', 'Encore/Insait', 'FDE']))
  })
  it('shows honest photo and LinkedIn placeholders with no broken media or social links', () => {
    const { container } = render(<AboutPage />)
    expect(founderProfile.photo).toBeNull()
    expect(founderProfile.linkedInUrl).toBeNull()
    expect(screen.getByText('כאן תופיע תמונה מקצועית של ניר מאיר')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('a[href*="linkedin"], a[href*="github"], a[href="#"]')).not.toBeInTheDocument()
    expect(container.textContent).not.toContain('GitHub')
    expect(container.textContent).not.toContain('נדרש להשלמה')
    expect(screen.getByRole('link', { name: /בואו נכיר/ })).toHaveAttribute('href', '/contact#inquiry')
  })
  it('preserves the existing positioning and direct-work sections without duplicating the placeholder block', () => {
    const { container } = render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'למה לעבוד ישירות?' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'במה אני מאמין' })).toBeInTheDocument()
    expect(container.querySelector('#operator-facts')).not.toBeInTheDocument()
    expect(container.querySelectorAll('#professional-experience')).toHaveLength(1)
  })
  it('applies only the About update and leaves the original source and other six pages intact', () => {
    const reviewed = parseSiteContent(original)
    const snapshot = structuredClone(reviewed.about)
    withFounderProfile(reviewed.about)
    expect(reviewed.about).toEqual(snapshot)
    for (const key of ['home', 'solutions', 'business', 'individuals', 'process', 'contact'] as const) expect(pages[key]).toEqual(reviewed[key])
  })
})
