import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { HomeFaqData, JsonLd, ProfessionalServiceData } from '@/components/structured-data'
import { CopyPage } from '@/components/copy-page'
import { pages } from '@/content/pages'

describe('Structured data', () => {
  it('serializes only the approved public business facts', () => {
    const { container } = render(<ProfessionalServiceData />)
    const json = JSON.parse(container.querySelector('script')!.textContent!)
    expect(json).toEqual({ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Posiblo', alternateName: 'פוסיבלו', url: 'https://posiblo.com', description: pages.home.description, email: 'posiblo.contact@gmail.com', telephone: '+972-52-251-8189', areaServed: { '@type': 'Country', name: 'Israel' }, inLanguage: 'he', founder: { '@type': 'Person', name: 'ניר מאיר' } })
    for (const key of ['address', 'aggregateRating', 'review', 'priceRange', 'openingHours', 'geo']) expect(json).not.toHaveProperty(key)
  })
  it('derives every FAQ question and plain answer from the visible content', () => {
    const { container } = render(<><HomeFaqData /><CopyPage pageKey="home" /></>)
    const json = JSON.parse(container.querySelector('script')!.textContent!)
    expect(json['@type']).toBe('FAQPage')
    expect(json.mainEntity).toHaveLength(container.querySelectorAll('details').length)
    const items = pages.home.sections.flatMap(section => section.kind === 'faq' ? section.items : [])
    expect(json.mainEntity.map((item: { name: string }) => item.name)).toEqual(items.map(item => item.question))
    expect(json.mainEntity.map((item: { acceptedAnswer: { text: string } }) => item.acceptedAnswer.text)).toEqual(items.map(item => item.answer.map(node => node.text).join('\n\n')))
  })
  it('escapes script boundaries without changing the parsed data', () => {
    const value = '</script><script>alert(1)</script>'
    const { container } = render(<JsonLd data={{ value }} />)
    expect(container.querySelectorAll('script')).toHaveLength(1)
    expect(container.querySelector('script')!.textContent).not.toContain('<')
    expect(JSON.parse(container.querySelector('script')!.textContent!).value).toBe(value)
  })
})
