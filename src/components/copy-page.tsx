import Link from 'next/link'
import { pages } from '@/content/pages'
import { introductionVideo } from '@/content/introduction-video'
import { IntroductionVideo } from '@/components/introduction-video'
import type { ContentNode, ContentSection, PageKey } from '@/content/schema'

export function CopyText({ text }: { text: string }) {
  return <>{text.split(/([A-Za-z][A-Za-z0-9.+/-]*(?:[ |•]+[A-Za-z][A-Za-z0-9.+/-]*)*)/g).map((part, index) =>
    /^[A-Za-z]/.test(part) ? <bdi dir="ltr" key={index}>{part}</bdi> : part)}</>
}

function unreachable(value: never): never { throw new Error(`Unrecognized content: ${String(value)}`) }

export function ContentNodeView({ node }: { node: ContentNode }) {
  const text = <CopyText text={node.text} />
  switch (node.type) {
    case 'cta': return <Link className="action" href={node.href}>{text}<span aria-hidden="true">↖</span></Link>
    case 'eyebrow': return <p className="eyebrow">{text}</p>
    case 'h3': return <h3>{text}</h3>
    case 'strong': return <p className="emphasis">{text}</p>
    case 'p': return <p className="copy-paragraph">{node.strongPrefix && node.text.startsWith(node.strongPrefix)
      ? <><strong><CopyText text={node.strongPrefix} /></strong><CopyText text={node.text.slice(node.strongPrefix.length)} /></>
      : text}</p>
    case 'card': return <article className="copy-card"><h3>{text}</h3>{node.nodes.map((child, index) => <ContentNodeView node={child} key={index} />)}</article>
    default: return unreachable(node)
  }
}

export function ContentSectionView({ section, index }: { section: ContentSection; index: number }) {
  const tone = section.tone === 'principle' ? 'principle-section' : section.tone === 'closing' ? 'closing-section' : ''
  return <section className={`content-section ${tone}`} id={section.id} aria-labelledby={`${section.id}-heading`}>
    <div className="site-container">
      <div className="section-heading"><span className="section-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h2 id={`${section.id}-heading`}><CopyText text={section.title} /></h2></div>
      {section.kind === 'faq'
        ? <div className="faq-list">{section.items.map(item => <details key={item.question}><summary><span className="question-text"><CopyText text={item.question} /></span><span className="faq-toggle" aria-hidden="true">+</span></summary>{item.answer.map((node, index) => <ContentNodeView node={node} key={index} />)}</details>)}</div>
        : <div className={section.kind === 'cards' ? `card-grid ${section.columns === 2 ? 'two-columns' : ''}` : 'copy-flow'}>{section.nodes.map((node, index) => <ContentNodeView node={node} key={index} />)}</div>}
    </div>
  </section>
}

export function CopyPage({ pageKey, children, heroAside }: { pageKey: PageKey; children?: React.ReactNode; heroAside?: React.ReactNode }) {
  const page = pages[pageKey]
  return <>
    <section className={`page-hero ${page.heroVideo ? 'home-hero' : ''}`}>
      <div className="site-container hero-layout">
        <div className="hero-copy">
          {page.hero.filter(node => node.type === 'eyebrow').map((node, index) => <ContentNodeView node={node} key={index} />)}
          <h1><CopyText text={page.h1} /></h1>
          <div className="copy-flow">{page.hero.filter(node => node.type !== 'eyebrow').map((node, index) => <ContentNodeView node={node} key={index} />)}</div>
        </div>
        {page.heroVideo && <IntroductionVideo media={introductionVideo} />}
        {heroAside}
      </div>
    </section>
    {children}
    {page.sections.map((section, index) => <ContentSectionView section={section} index={index} key={section.id} />)}
  </>
}
