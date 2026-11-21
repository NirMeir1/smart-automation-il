import { pages } from '@/content/pages'
import { visiblePage } from '@/content/presentation'
import { brand, operator } from '@/lib/brand'
import { publicContact } from '@/lib/contact-public'

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export function ProfessionalServiceData() {
  return <JsonLd data={{
    '@context': 'https://schema.org', '@type': 'ProfessionalService',
    name: brand.name, alternateName: 'פוסיבלו', url: brand.origin,
    description: pages.home.description, email: publicContact.email, telephone: publicContact.telephone,
    areaServed: { '@type': 'Country', name: 'Israel' }, inLanguage: 'he',
    founder: { '@type': 'Person', name: operator.name },
  }} />
}

// FAQ rich results must match questions visitors can see, so a hidden FAQ emits nothing.
export function HomeFaqData() {
  const items = visiblePage('home').sections.flatMap(section => section.kind === 'faq' ? section.items : [])
  if (!items.length) return null
  return <JsonLd data={{
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map(item => ({ '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer.map(node => node.text).join('\n\n') },
    })),
  }} />
}
