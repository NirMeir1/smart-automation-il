import type { PageContent, PageKey } from './schema'
import { pages } from './pages'
import type { IconName } from '@/components/icon'

// Presentation only: layout choices per page and section. Copy stays in pages.json.
export type SectionVariant =
  | 'bento' | 'split-grid' | 'doors' | 'timeline' | 'statement' | 'faq' | 'cta-panel'
  | 'rows' | 'chips' | 'checklist' | 'tiles' | 'split-links' | 'steps-panel'
  | 'path-card' | 'feature' | 'cta-band' | 'card' | 'card-tint' | 'branches' | 'split'
  | 'rule-card' | 'experience' | 'numbered' | 'cards' | 'article' | 'callout' | 'article-cta' | 'note'

export type FlowDiagram = { kind: 'flow'; steps: string[] }
export type ColumnsDiagram = { kind: 'columns'; columns: { title: string; items: string[]; primary?: boolean }[] }

export type SectionPresentation = {
  variant: SectionVariant
  // Consecutive sections with the same group render side by side.
  group?: string
  icons?: IconName[]
  icon?: IconName
  // Short orienting line under the heading (owner-approved design copy).
  lead?: string
  // Index of the node shown as the large statement in a 'statement' section.
  highlight?: number
  // Multi-line paragraphs inside the section render as this kind of list.
  lines?: 'chips' | 'check' | 'cross'
  diagram?: FlowDiagram | ColumnsDiagram
  whatsapp?: boolean
  // Kept in the approved copy source but not rendered (owner asked for a shorter page).
  hidden?: boolean
}

export type PagePresentation = {
  tag?: string
  // Hero node indices (into page.hero) shown in the side column instead of the main column.
  heroAside?: number[]
  heroAsideStyle?: 'quote' | 'rule'
  // Hero node index shown as an information note.
  heroNote?: number
  // Owner-approved reassurance prepended to the hero checklist.
  heroChecklistLead?: string
  jumpNav?: boolean
  article?: boolean
  // Hero node indices (into page.hero) kept in the approved copy but not rendered.
  heroHidden?: number[]
  sections: Record<string, SectionPresentation>
}

export const presentation: Record<PageKey, PagePresentation> = {
  home: {
    heroChecklistLead: 'פגישת היכרות ראשונה ללא תשלום',
    // Shorter home page: the process and offering paragraphs are covered by /process and /solutions.
    heroHidden: [2, 3],
    sections: {
      problems: { variant: 'bento', icons: ['copy', 'link', 'alert', 'gear', 'bulb'] },
      capabilities: { variant: 'split-grid', hidden: true },
      audiences: { variant: 'doors', icons: ['briefcase', 'person'] },
      process: { variant: 'timeline' },
      principle: { variant: 'statement', highlight: 0, hidden: true },
      faq: { variant: 'faq', hidden: true },
      closing: { variant: 'cta-panel', whatsapp: true },
    },
  },
  solutions: {
    jumpNav: true,
    sections: {
      'manual-work': { variant: 'rows' },
      integrations: { variant: 'rows' },
      'custom-tools': { variant: 'rows' },
      products: { variant: 'rows' },
      'customer-experience': { variant: 'rows' },
      'appropriate-ai': { variant: 'rows' },
      toolbox: { variant: 'chips' },
    },
  },
  business: {
    tag: 'לעסקים',
    heroAside: [1],
    heroAsideStyle: 'quote',
    sections: {
      symptoms: { variant: 'checklist', lead: 'מזהים את עצמכם באחד מאלה? זו נקודת התחלה טובה.' },
      processes: { variant: 'tiles' },
      'existing-systems': { variant: 'split-links' },
      'first-contact': { variant: 'steps-panel' },
    },
  },
  individuals: {
    tag: 'לפרטיים וליזמים',
    heroNote: 3,
    sections: {
      // Source order puts MVP between the idea and the two tool paths, so the idea gets its own row.
      'product-idea': { variant: 'split' },
      'personal-tools': { variant: 'path-card', group: 'paths', icon: 'wrench' },
      'personal-automation': { variant: 'path-card', group: 'paths', icon: 'repeat' },
      mvp: { variant: 'feature', diagram: { kind: 'columns', columns: [
        { title: 'גרסה ראשונה', items: ['בקשת שירות', 'טיפול בבקשה מצד נותן השירות'], primary: true },
        { title: 'יכול להישאר להמשך', items: ['סליקה', 'אפליקציות נפרדות', 'דו״חות מתקדמים'] },
      ] } },
      'simpler-solutions': { variant: 'cta-band' },
    },
  },
  process: {
    tag: 'איך עובדים יחד',
    heroAside: [0, 1, 2],
    heroAsideStyle: 'rule',
    sections: {
      discovery: { variant: 'card', group: 'meeting', lines: 'chips' },
      preparation: { variant: 'card-tint', group: 'meeting', lines: 'cross' },
      'next-steps': { variant: 'branches' },
      'scope-and-cost': { variant: 'split' },
      delivery: { variant: 'rule-card', group: 'delivery' },
      handover: { variant: 'rule-card', group: 'delivery' },
    },
  },
  about: {
    tag: 'אודות',
    sections: {
      'professional-experience': { variant: 'experience' },
      expertise: { variant: 'cards', icons: ['code', 'link', 'route'] },
      'direct-ownership': { variant: 'statement', highlight: 1 },
      principles: { variant: 'numbered' },
      introduction: { variant: 'cta-panel' },
    },
  },
  contact: {
    sections: {
      reassurance: { variant: 'note' },
    },
  },
  businessAutomation: {
    article: true,
    sections: {
      'when-to-automate': { variant: 'article' },
      'lead-workflow': { variant: 'article', diagram: { kind: 'flow', steps: ['פנייה מטופס באתר', 'נפתחת במערכת לקוחות', 'מקבלת אחראי', 'תזכורת אם לא טופלה בזמן'] } },
      scope: { variant: 'article' },
      dependencies: { variant: 'callout' },
      validation: { variant: 'article' },
      'next-step': { variant: 'article-cta' },
    },
  },
  systemsIntegration: {
    article: true,
    sections: {
      'disconnected-systems': { variant: 'article' },
      'integration-example': { variant: 'article', diagram: { kind: 'flow', steps: ['טופס באתר', 'פנייה במערכת לקוחות', 'אישור של אדם', 'הנהלת חשבונות'] } },
      'api-constraints': { variant: 'callout' },
      reliability: { variant: 'article' },
      discovery: { variant: 'article' },
      'next-step': { variant: 'article-cta' },
    },
  },
}

export function sectionPresentation(page: PageKey, id: string): SectionPresentation {
  return presentation[page].sections[id] ?? { variant: 'split' }
}

// The page as visitors see it: approved copy minus the hero nodes and sections hidden above.
export function visiblePage(page: PageKey): PageContent {
  const look = presentation[page]
  const heroHidden = new Set(look.heroHidden ?? [])
  return {
    ...pages[page],
    hero: pages[page].hero.filter((_, index) => !heroHidden.has(index)),
    sections: pages[page].sections.filter(section => !sectionPresentation(page, section.id).hidden),
  }
}
