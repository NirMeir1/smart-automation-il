import { execFileSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { pages } from '@/content/pages'
import { parseSiteContent } from '@/content/schema'
import { ContentNodeView, ContentSectionView } from '@/components/copy-page'

describe('explicit content structures', () => {
  it('regenerates exactly from the authoritative source without writing files', () => {
    expect(execFileSync(process.execPath, ['scripts/extract-copy.mjs', '--check'], { encoding: 'utf8' })).toContain('regeneration agree')
  })

  it.each([
    ['missing page', (draft: typeof pages) => { delete (draft as Partial<typeof pages>).about }],
    ['duplicate ID', (draft: typeof pages) => { draft.home.sections[1].id = draft.home.sections[0].id }],
    ['unknown kind', (draft: typeof pages) => { Object.assign(draft.home.sections[0], { kind: 'unknown' }) }],
    ['external CTA', (draft: typeof pages) => { draft.home.hero.push({ type: 'cta', text: 'Action', href: 'https://external.invalid' } as never) }],
    ['missing CTA destination', (draft: typeof pages) => { draft.home.hero.push({ type: 'cta', text: 'Action' } as never) }],
    ['empty FAQ answer', (draft: typeof pages) => { const faq = draft.home.sections.find(section => section.kind === 'faq'); if (faq?.kind === 'faq') faq.items[0].answer = [] }],
  ])('rejects %s at the content boundary', (_name, mutate) => {
    const draft = structuredClone(pages)
    mutate(draft)
    expect(() => parseSiteContent(draft)).toThrow()
  })

  it('keeps FAQ behavior when a section moves to a different position', () => {
    const faq = pages.home.sections.find(section => section.kind === 'faq')!
    const { container } = render(<ContentSectionView section={faq} index={0} />)
    expect(container.querySelectorAll('details summary')).toHaveLength(6)
    expect(container.querySelector('section')).toHaveAttribute('id', faq.id)
  })

  it('renders a flow section at the former FAQ position', () => {
    const flow = pages.home.sections.find(section => section.kind === 'flow')!
    const { container } = render(<ContentSectionView section={flow} index={5} />)
    expect(container.querySelectorAll('details')).toHaveLength(0)
    expect(container.querySelector('.copy-flow')).toBeInTheDocument()
  })

  it('keeps the explicit CTA destination when its caption changes', () => {
    render(<ContentNodeView node={{ type: 'cta', text: 'An edited caption', href: '/contact?intent=idea#inquiry' }} />)
    expect(screen.getByRole('link', { name: /An edited caption/ })).toHaveAttribute('href', '/contact?intent=idea#inquiry')
  })
})
