import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { CopyPage } from '@/components/copy-page'
import { ContactForm } from '@/components/contact-form'
import { Navigation } from '@/components/layout/navigation'
import { pages } from '@/content/pages'
import { pageTextNodes } from '@/content/schema'
import { routes, pageMetadata } from '@/lib/site'
import { inquirySuccess } from '@/lib/inquiry'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()

describe('Part J pages', () => {
  for (const [index, route] of routes.entries()) it(`${route.href} preserves every customer quote from Part J except documented factual omissions`, () => {
    const source = readFileSync('docs/Bottomline_Codex_Implementation_Prompt.md', 'utf8')
    const deck = source.slice(source.indexOf('### Home page —')).split('## Legal/regulatory priorities')[0]
    const chunk = deck.split(/(?=^### .+ page — )/m).filter(Boolean)[index]
    const { container } = render(<CopyPage pageKey={route.key}>{route.key === 'contact' && <ContactForm enabled={false} />}</CopyPage>)
    const attributes = [...container.querySelectorAll('[placeholder]')].map(input => input.getAttribute('placeholder'))
    // Success is conditional; the form tests verify it renders only after backend confirmation.
    const successText = route.key === 'contact' ? Object.values(inquirySuccess).join(' ') : ''
    const text = normalize([container.textContent, ...attributes, successText, pages[route.key].title, pages[route.key].description].join(' '))
    let internal = false
    for (const line of chunk.split(/\r?\n/)) {
      if (line.startsWith('#### The factual block')) internal = true
      if (internal && line === 'CTA:') internal = false
      if (internal || !line.startsWith('>')) continue
      const quote = normalize(line.replace(/^> ?/, '').replace(/\*\*/g, ''))
      if (!quote || quote.includes('[שם מלא') || quote.startsWith('פגישת ההיכרות הראשונית אינה בתשלום.')) continue
      expect(text, `Missing source quote: ${quote}`).toContain(quote)
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
    const source = readFileSync('docs/Bottomline_Codex_Implementation_Prompt.md', 'utf8')
    expect(source).toContain(page.title)
    expect(source).toContain(page.description)
    expect(rendered).not.toMatch(/Sogomatic|50%|90%|50\+|שם מלא — נדרש להשלמה/)
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
})
