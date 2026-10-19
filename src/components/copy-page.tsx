import Link from 'next/link'
import pages from '@/content/pages.json'
import { PageKey } from '@/lib/site'

type Node = { type: string; text: string; body?: string }

export function CopyText({ text }: { text: string }) {
  return <>{text.split(/([A-Za-z][A-Za-z0-9.+/-]*(?:[ |•]+[A-Za-z][A-Za-z0-9.+/-]*)*)/g).map((part, index) =>
    /^[A-Za-z]/.test(part) ? <bdi dir="ltr" key={index}>{part}</bdi> : part)}</>
}

export function ctaDestination(text: string) {
  if (text === 'פתרונות לעסקים') return '/business'
  if (text === 'פתרונות לפרטיים וליזמים') return '/individuals'
  if (text === 'איך נראית פגישת ההיכרות?') return '/process'
  if (text.includes('העסק')) return '/contact?intent=business'
  if (text.includes('הרעיון')) return '/contact?intent=idea'
  if (text.includes('מעכב') || text.includes('משימה')) return '/contact?intent=problem#inquiry'
  return '/contact#inquiry'
}

function CopyNode({ node }: { node: Node }) {
  const text = <CopyText text={node.text} />
  if (node.type === 'cta') return <Link className="action" href={ctaDestination(node.text)}>{text}<span aria-hidden="true">↖</span></Link>
  if (node.type === 'eyebrow') return <p className="eyebrow">{text}</p>
  if (node.type === 'h3') return <h3>{text}</h3>
  if (node.type === 'strong') return <p className="emphasis">{text}</p>
  if (node.type === 'card') return <article className="copy-card"><h3>{text}</h3><p><CopyText text={node.body || ''} /></p></article>
  return <p className="copy-paragraph">{text}</p>
}

function NodeList({ nodes, cards = false, cardCtas = false }: { nodes: Node[]; cards?: boolean; cardCtas?: boolean }) {
  const elements = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (cards && node.type === 'h3') {
      const body: Node[] = []
      while (i + 1 < nodes.length && (nodes[i + 1].type === 'p' || cardCtas && nodes[i + 1].type === 'cta')) body.push(nodes[++i])
      elements.push(<article className="copy-card" key={i}><h3><CopyText text={node.text} /></h3>{body.map((n, j) => <CopyNode key={j} node={n} />)}</article>)
    } else elements.push(<CopyNode key={i} node={node} />)
  }
  return <div className={cards ? 'card-grid' : 'copy-flow'}>{elements}</div>
}

export function CopyPage({ pageKey, children }: { pageKey: PageKey; children?: React.ReactNode }) {
  const page = pages[pageKey]
  const home = pageKey === 'home'
  return <>
    <section className={`page-hero ${home ? 'home-hero' : ''}`}>
      <div className="site-container hero-layout">
        <div className="hero-copy">
          {page.hero.filter(n => n.type === 'eyebrow').map((n, i) => <CopyNode node={n} key={i} />)}
          <h1><CopyText text={page.h1} /></h1>
          <NodeList nodes={page.hero.filter(n => n.type !== 'eyebrow')} />
        </div>
        {home && <div className="problem-diagram" aria-hidden="true"><span className="diagram-index">Bottomline / 01</span><div className="diagram-scatter"><span>רעיון</span><span>תהליך</span><span>בעיה</span></div><div className="diagram-line" /><div className="diagram-core">קודם מבינים.</div><div className="diagram-line" /><div className="diagram-result">הפתרון שמתאים לכם <span>↙</span></div></div>}
      </div>
    </section>
    {children}
    {page.sections.map((section, i) => {
      const faq = home && i === 5
      const cards = home && [0, 1, 2, 3].includes(i)
      return <section key={section.title} className={`content-section ${home && i === 2 ? 'audience-section' : ''} ${home && i === 4 ? 'principle-section' : ''} ${i === page.sections.length - 1 && home ? 'closing-section' : ''}`}>
        <div className="site-container">
          <div className="section-heading"><span className="section-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h2><CopyText text={section.title} /></h2></div>
          {faq ? <div className="faq-list">{section.nodes.filter(n => n.type === 'h3').map((question, j) => <details key={question.text}><summary><span className="question-text"><CopyText text={question.text} /></span><span className="faq-toggle" aria-hidden="true">+</span></summary><p><CopyText text={section.nodes[j * 2 + 1]?.text || ''} /></p></details>)}</div> : <NodeList nodes={section.nodes.filter(n => n.text !== section.title)} cards={cards} cardCtas={home && i === 2} />}
        </div>
      </section>
    })}
  </>
}
