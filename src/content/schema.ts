export const pageKeys = ['home', 'solutions', 'business', 'individuals', 'process', 'about', 'contact'] as const
export type PageKey = typeof pageKeys[number]
export type PagePath = '/' | '/solutions' | '/business' | '/individuals' | '/process' | '/about' | '/contact'
export type InternalHref = PagePath | '/contact#inquiry' | `/contact?intent=${'business' | 'idea' | 'problem'}` | `/contact?intent=${'business' | 'idea' | 'problem'}#inquiry`
export type ParagraphNode = { type: 'p' | 'strong' | 'eyebrow'; text: string }
export type FlowNode = ParagraphNode | { type: 'h3'; text: string } | { type: 'cta'; text: string; href: InternalHref }
export type CardNode = { type: 'card'; text: string; nodes: FlowNode[] }
export type ContentNode = FlowNode | CardNode
type SectionBase = { id: string; title: string; tone: 'default' | 'principle' | 'closing' }
export type ContentSection = SectionBase & (
  { kind: 'flow'; nodes: FlowNode[] } |
  { kind: 'cards'; columns: 2 | 3; nodes: ContentNode[] } |
  { kind: 'faq'; items: { question: string; answer: FlowNode[] }[] }
)
export type PageContent = { title: string; description: string; h1: string; heroDiagram: boolean; hero: FlowNode[]; sections: ContentSection[] }
export type SiteContent = Record<PageKey, PageContent>

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Content must contain objects')
  return value as Record<string, unknown>
}
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Content text must be nonempty')
  return value
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error('Content must contain arrays')
  return value
}
function href(value: unknown): InternalHref {
  const link = text(value)
  if (!/^(?:\/|\/(?:solutions|business|individuals|process|about)|\/contact(?:\?intent=(?:business|idea|problem))?(?:#inquiry)?)$/.test(link)) throw new Error(`Unsupported content destination: ${link}`)
  return link as InternalHref
}
function flowNode(value: unknown): FlowNode {
  const raw = object(value)
  const body = text(raw.text)
  switch (raw.type) {
    case 'p': case 'strong': case 'eyebrow': case 'h3': return { type: raw.type, text: body }
    case 'cta': return { type: 'cta', text: body, href: href(raw.href) }
    default: throw new Error(`Unsupported flow node: ${String(raw.type)}`)
  }
}
function contentNode(value: unknown): ContentNode {
  const raw = object(value)
  return raw.type === 'card' ? { type: 'card', text: text(raw.text), nodes: list(raw.nodes).map(flowNode) } : flowNode(raw)
}
function section(value: unknown): ContentSection {
  const raw = object(value)
  const id = text(raw.id)
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error('Section IDs must be stable ASCII identifiers')
  if (!['default', 'principle', 'closing'].includes(String(raw.tone))) throw new Error('Unsupported section tone')
  const base: SectionBase = { id, title: text(raw.title), tone: raw.tone as SectionBase['tone'] }
  switch (raw.kind) {
    case 'flow': return { ...base, kind: 'flow', nodes: list(raw.nodes).map(flowNode) }
    case 'cards': {
      if (raw.columns !== 2 && raw.columns !== 3) throw new Error('Card sections require two or three columns')
      const nodes = list(raw.nodes).map(contentNode)
      if (!nodes.some(node => node.type === 'card')) throw new Error('Card sections require cards')
      return { ...base, kind: 'cards', columns: raw.columns, nodes }
    }
    case 'faq': return { ...base, kind: 'faq', items: list(raw.items).map(value => {
      const item = object(value)
      const answer = list(item.answer).map(flowNode)
      if (!answer.length) throw new Error('FAQ answers cannot be empty')
      return { question: text(item.question), answer }
    }) }
    default: throw new Error(`Unsupported section kind: ${String(raw.kind)}`)
  }
}

export function parseSiteContent(value: unknown): SiteContent {
  const raw = object(value)
  if (Object.keys(raw).length !== pageKeys.length || pageKeys.some(key => !(key in raw))) throw new Error('Content must provide exactly the seven public pages')
  return Object.fromEntries(pageKeys.map(key => {
    const page = object(raw[key])
    const sections = list(page.sections).map(section)
    if (new Set(sections.map(section => section.id)).size !== sections.length) throw new Error(`Duplicate section IDs on ${key}`)
    if (typeof page.heroDiagram !== 'boolean') throw new Error('Hero diagram must be explicit')
    const result: PageContent = { title: text(page.title), description: text(page.description), h1: text(page.h1), heroDiagram: page.heroDiagram, hero: list(page.hero).map(flowNode), sections }
    return [key, result]
  })) as SiteContent
}

export function pageTextNodes(page: PageContent): { type: string; text: string }[] {
  const flatten = (nodes: ContentNode[]): { type: string; text: string }[] => nodes.flatMap(node => node.type === 'card' ? [{ type: 'h3', text: node.text }, ...node.nodes] : [node])
  return [...page.hero, ...page.sections.flatMap(section => section.kind === 'faq'
    ? section.items.flatMap(item => [{ type: 'h3', text: item.question }, ...item.answer])
    : flatten(section.nodes))]
}
