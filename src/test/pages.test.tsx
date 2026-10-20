import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { CopyPage } from '@/components/copy-page'
import { ContactForm } from '@/components/contact-form'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { pages } from '@/content/pages'
import { pageTextNodes } from '@/content/schema'
import { routes, pageMetadata } from '@/lib/site'
import { inquirySuccess } from '@/lib/inquiry'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()

describe('Part J pages', () => {
  for (const [index, route] of routes.entries()) it(`${route.href} preserves every customer quote from the authoritative brief`, () => {
    const source = readFileSync('docs/BOTTOMLINE_WEBSITE_BRIEF.md', 'utf8').replaceAll('Bottomline', 'BottomLine')
    const deck = source.slice(source.indexOf('### Home page —')).split('## 8. Functional Requirements')[0]
    const originalChunk = deck.split(/(?=^### .+ page — )/m).filter(Boolean)[index]
    // The owner supplied the founder facts, replacing only the About placeholders.
    const chunk = route.key === 'about'
      ? originalChunk.replace('[שם מלא — נדרש להשלמה]', 'ניר מאיר').replace(/#### The factual block to complete before publication[\s\S]*?(?=CTA:)/, '')
      : originalChunk
    const { container } = render(<CopyPage pageKey={route.key}>{route.key === 'contact' && <ContactForm enabled={false} />}</CopyPage>)
    const attributes = [...container.querySelectorAll('[placeholder]')].map(input => input.getAttribute('placeholder'))
    // Success is conditional; the form tests verify it renders only after backend confirmation.
    const successText = route.key === 'contact' ? Object.values(inquirySuccess).join(' ') : ''
    const text = normalize([container.textContent, ...attributes, successText, pages[route.key].title, pages[route.key].description].join(' '))
    for (const line of chunk.split(/\r?\n/)) {
      if (!line.startsWith('>')) continue
      const quote = normalize(line.replace(/^> ?/, '').replace(/\*\*/g, ''))
      if (!quote) continue
      expect(text, `Missing source quote: ${quote}`).toContain(quote)
    }
    for (const line of chunk.split(/\r?\n/)) {
      if (line.startsWith('#### ') && /[\u0590-\u05ff]/.test(line)) {
        expect(text).toContain(normalize(line.replace(/^#### (Section: )?/, '')))
      }
      if (route.key === 'contact' && /^\*\*.*[\u0590-\u05ff].*\*\*$/.test(line)) {
        expect(text).toContain(normalize(line.replace(/\*\*/g, '').replace(/\\\*/g, '*')))
      }
    }
  })
  for (const route of routes) it(`${route.href} renders its entire reviewed copy and exact metadata`, () => {
    const { container } = render(<CopyPage pageKey={route.key} />)
    const page = pages[route.key]
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(normalize(screen.getByRole('heading', { level: 1 }).textContent!)).toBe(normalize(page.h1))
    const rendered = normalize(container.textContent!)
    for (const node of pageTextNodes(page)) {
      expect(rendered).toContain(normalize(node.text))
    }
    const metadata = pageMetadata(route.key)
    expect(metadata.title).toBe(page.title)
    expect(metadata.description).toBe(page.description)
    const source = readFileSync('docs/BOTTOMLINE_WEBSITE_BRIEF.md', 'utf8').replaceAll('Bottomline', 'BottomLine')
    expect(source).toContain(page.title)
    expect(source).toContain(page.description)
    expect(rendered).not.toMatch(/Sogomatic|50%|90%|50\+/)
    for (const link of container.querySelectorAll('a')) {
      expect(routes.some(r => r.href === link.getAttribute('href')?.split(/[?#]/)[0])).toBe(true)
    }
  })
  it('includes five problem cards, six capabilities, five stages and six native FAQ disclosures', () => {
    const { container } = render(<CopyPage pageKey="home" />)
    const cardCount = (id: string) => {
      const section = pages.home.sections.find(section => section.id === id)
      return section?.kind === 'cards' ? section.nodes.filter(node => node.type === 'card').length : 0
    }
    expect(cardCount('problems')).toBe(5)
    expect(cardCount('capabilities')).toBe(6)
    expect(cardCount('process')).toBe(5)
    expect(container.querySelectorAll('details summary')).toHaveLength(6)
  })
  it('has ordered navigation and Escape returns focus to the mobile toggle', () => {
    render(<Navigation />)
    const button = screen.getByRole('button', { name: 'פתיחת תפריט' })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation').querySelectorAll('a').length).toBe(8)
    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })
  it('preserves every shared navigation/footer quote and legal destination', () => {
    const source = readFileSync('docs/BOTTOMLINE_WEBSITE_BRIEF.md', 'utf8').replaceAll('Bottomline', 'BottomLine')
    const shell = source.split('### Global navigation and footer')[1].split('### Home page —')[0]
    const { container } = render(<><Navigation /><Footer /></>)
    const text = normalize(container.textContent!)
    for (const line of shell.split(/\r?\n/).filter(line => line.startsWith('>'))) {
      // Pipes are source presentation separators; the actual links remain separate controls.
      for (const fragment of line.replace(/^> ?/, '').replace(/\*\*/g, '').split(' | ')) {
        if (fragment.trim()) expect(text).toContain(normalize(fragment))
      }
    }
    for (const path of ['/legal/privacy', '/legal/terms', '/legal/accessibility']) {
      expect(container.querySelector(`a[href="${path}"]`)).toBeInTheDocument()
    }
  })
})
