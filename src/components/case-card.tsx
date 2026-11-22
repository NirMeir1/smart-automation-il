import type { ReactNode } from 'react'
import { CopyText } from '@/components/copy-page'

// WAITING FOR REAL PROJECT RESULTS: not placed on any page. Fill it only with a real, owner-approved project
// (title, the tools actually used, and an outcome that can be verified); never with invented cases or clients.

export type CaseCardProps = {
  title: string
  tools: readonly string[]
  outcome: string
  // Optional 16px logo (decorative or with its own alt text), shown before the title.
  logo?: ReactNode
}

export function CaseCard({ title, tools, outcome, logo }: CaseCardProps) {
  return <article className="case-card">
    <h3 className="case-card-title">{logo && <span className="case-card-logo">{logo}</span>}<CopyText text={title} /></h3>
    <ul className="case-card-tools" aria-label="כלים">{tools.map(tool => <li key={tool}><CopyText text={tool} /></li>)}</ul>
    <p className="case-card-outcome"><CopyText text={outcome} /></p>
  </article>
}

/* Usage example with obviously fake placeholder data (do not ship):
<CaseCard title="כותרת פרויקט לדוגמה" tools={['כלי א', 'כלי ב', 'כלי ג']} outcome="כאן תופיע תוצאה אמיתית ומאומתת מפרויקט שהסתיים." />
*/
