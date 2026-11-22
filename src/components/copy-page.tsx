import Link from 'next/link'
import { pages } from '@/content/pages'
import { introductionVideo } from '@/content/introduction-video'
import { IntroductionVideo } from '@/components/introduction-video'
import { Icon, type IconName } from '@/components/icon'
import { presentation, sectionPresentation, visiblePage, type ColumnsDiagram, type FlowDiagram, type SectionPresentation } from '@/content/presentation'
import { serviceRoutes } from '@/lib/routes'
import { experienceTitle, founderHighlights } from '@/content/about-profile'
import type { CardNode, ContentNode, ContentSection, FlowNode, PageKey } from '@/content/schema'

export function CopyText({ text }: { text: string }) {
  return <>{text.split(/([A-Za-z][A-Za-z0-9.+/-]*(?:[ |•]+[A-Za-z][A-Za-z0-9.+/-]*)*)/g).map((part, index) =>
    /^[A-Za-z]/.test(part) ? <bdi dir="ltr" key={index}>{part}</bdi> : part)}</>
}

function unreachable(value: never): never { throw new Error(`Unrecognized content: ${String(value)}`) }

// Paragraphs that the copy itself labels as illustrations get a distinct, dashed treatment.
const examplePattern = /^(לדוגמה בלבד|זו דוגמה להמחשה|זהו תרחיש להמחשה)/
const isExample = (node: ContentNode) => node.type === 'p' && examplePattern.test(node.text)

type CtaStyle = 'primary' | 'secondary' | 'outline' | 'link' | 'inverse' | 'card'

export function ContentNodeView({ node, cta = 'primary' }: { node: ContentNode; cta?: CtaStyle }) {
  const text = <CopyText text={node.text} />
  switch (node.type) {
    case 'cta': {
      // Native fragment navigation avoids duplicated hashes in the app router.
      const CtaLink = node.href.includes('#') ? 'a' : Link
      return <CtaLink className={cta === 'primary' ? 'action' : `action action-${cta}`} href={node.href}><span>{text}</span><Icon name="arrow" size={20} /></CtaLink>
    }
    case 'eyebrow': return <p className="eyebrow">{text}</p>
    case 'h3': return <h3>{text}</h3>
    case 'strong': return <p className="emphasis">{text}</p>
    case 'p': return <p className={isExample(node) ? 'copy-paragraph example-note' : 'copy-paragraph'}>{node.strongPrefix && node.text.startsWith(node.strongPrefix)
      ? <><strong><CopyText text={node.strongPrefix} /></strong><CopyText text={node.text.slice(node.strongPrefix.length)} /></>
      : text}</p>
    case 'card': return <Card card={node} />
    default: return unreachable(node)
  }
}

function Nodes({ nodes, cta = 'primary', lines }: { nodes: ContentNode[]; cta?: CtaStyle; lines?: SectionPresentation['lines'] }) {
  return <>{nodes.map((node, index) => lines && node.type === 'p' && node.text.includes('\n')
    ? <ItemList key={index} items={node.text.split('\n')} style={lines} />
    : <ContentNodeView node={node} cta={cta} key={index} />)}</>
}

// Each item keeps a trailing space so the list reads as the original sentence sequence.
function ItemList({ items, style, separator }: { items: string[]; style: 'chips' | 'check' | 'cross' | 'tiles'; separator?: string }) {
  const clean = items.map(item => item.trim()).filter(Boolean)
  return <ul className={`item-list item-${style}`}>{clean.map((item, index) => <li key={index}>
    {(style === 'check' || style === 'cross') && <span className="item-mark"><Icon name={style} size={16} /></span>}
    <span><CopyText text={item} /></span>
    {separator && index < clean.length - 1 ? <span className="list-separator" aria-hidden="true">{separator}</span> : ' '}
  </li>)}</ul>
}

function Card({ card, icon, cta = 'outline' }: { card: CardNode; icon?: IconName; cta?: CtaStyle }) {
  return <article className="copy-card">
    {icon && <span className="card-icon"><Icon name={icon} /></span>}
    <h3><CopyText text={card.text} /></h3>
    <Nodes nodes={card.nodes} cta={cta} />
  </article>
}

function splitCards(nodes: ContentNode[]) {
  const first = nodes.findIndex(node => node.type === 'card')
  const last = nodes.length - 1 - [...nodes].reverse().findIndex(node => node.type === 'card')
  return { intro: nodes.slice(0, first), cards: nodes.filter((node): node is CardNode => node.type === 'card'), outro: nodes.slice(last + 1) }
}

function Diagram({ diagram }: { diagram: FlowDiagram | ColumnsDiagram }) {
  if (diagram.kind === 'flow') return <div className="diagram-flow" aria-hidden="true">{diagram.steps.map((step, index) => <div className="diagram-flow-item" key={step}>
    <span className={index === diagram.steps.length - 1 ? 'diagram-step is-last' : 'diagram-step'}>{step}</span>
    {index < diagram.steps.length - 1 && <Icon name="arrow" size={20} className="diagram-arrow" />}
  </div>)}</div>
  return <div className="diagram-columns" aria-hidden="true">{diagram.columns.map(column => <div className={column.primary ? 'diagram-column is-primary' : 'diagram-column'} key={column.title}>
    <strong>{column.title}</strong>{column.items.map(item => <span key={item}>{item}</span>)}
  </div>)}</div>
}

function ExampleFigure({ nodes, diagram }: { nodes: FlowNode[]; diagram?: FlowDiagram | ColumnsDiagram }) {
  return <figure className="example-figure">{diagram && <Diagram diagram={diagram} />}<Nodes nodes={nodes} /></figure>
}

function Heading({ section }: { section: ContentSection }) {
  return <h2 id={`${section.id}-heading`}><CopyText text={section.title} /></h2>
}

const ctas = (nodes: ContentNode[]) => nodes.filter(node => node.type === 'cta')
const nonCtas = (nodes: ContentNode[]) => nodes.filter(node => node.type !== 'cta')

function SectionBody({ section, look, ordinal }: { section: ContentSection; look: SectionPresentation; ordinal: number }) {
  if (section.kind === 'faq') return <div className="split-layout">
    <div className="split-aside"><Heading section={section} /></div>
    <div className="faq-list">{section.items.map(item => <details key={item.question}>
      <summary><span className="question-text"><CopyText text={item.question} /></span><span className="faq-toggle" aria-hidden="true" /></summary>
      <Nodes nodes={item.answer} />
    </details>)}</div>
  </div>

  const nodes: ContentNode[] = section.nodes
  const { intro, cards, outro } = section.kind === 'cards' ? splitCards(nodes) : { intro: nodes, cards: [] as CardNode[], outro: [] as ContentNode[] }

  switch (look.variant) {
    case 'bento': return <>
      <header className="section-header"><Heading section={section} /><Nodes nodes={intro} /></header>
      <div className="card-grid bento">{cards.map((card, index) => <Card card={card} icon={look.icons?.[index]} key={card.text} />)}</div>
      {outro.length > 0 && <div className="section-outro"><Nodes nodes={outro} cta="link" /></div>}
    </>
    case 'split-grid': return <div className="split-layout">
      <div className="split-aside"><Heading section={section} /><Nodes nodes={intro} /><div className="link-stack"><Nodes nodes={outro} cta="link" /></div></div>
      <div className="capability-grid">{cards.map(card => <Card card={card} key={card.text} />)}</div>
    </div>
    case 'doors': return <>
      <header className="section-header is-centered"><Heading section={section} /></header>
      <div className="doors">{cards.map((card, index) => <Card card={card} icon={look.icons?.[index]} key={card.text} />)}</div>
    </>
    case 'timeline': return <>
      <header className="section-header split-header"><div><Heading section={section} /><Nodes nodes={intro} /></div><Nodes nodes={outro} cta="link" /></header>
      <ol className="timeline">{cards.map((card, index) => <li className="timeline-step" key={card.text}>
        <span className="step-dot" aria-hidden="true">{index + 1}</span>
        <h3><CopyText text={card.text} /></h3>
        <Nodes nodes={card.nodes} />
      </li>)}</ol>
    </>
    case 'cards': return <>
      <header className="section-header"><Heading section={section} /><Nodes nodes={intro} /></header>
      <div className="card-grid three">{cards.map((card, index) => <Card card={card} icon={look.icons?.[index]} key={card.text} />)}</div>
      {outro.length > 0 && <div className="section-outro"><Nodes nodes={outro} /></div>}
    </>
    case 'statement': {
      const highlight = look.highlight ?? -1
      const lead = nodes[highlight]
      return <div className="statement-layout">
        <div className="statement-lead"><Heading section={section} />{lead && lead.type !== 'card' && <p className="statement-text"><CopyText text={lead.text} /></p>}</div>
        <div className="statement-body"><Nodes nodes={nodes.filter((_, index) => index !== highlight)} cta="inverse" /></div>
      </div>
    }
    case 'cta-panel': return <div className="cta-panel">
      <div className="cta-panel-copy"><Heading section={section} /><Nodes nodes={nonCtas(nodes)} /></div>
      <div className="cta-panel-actions"><Nodes nodes={ctas(nodes)} /></div>
    </div>
    case 'rows': return <div className="row-layout">
      <span className="row-index" aria-hidden="true">{String(ordinal).padStart(2, '0')}</span>
      <Heading section={section} />
      <div className="row-body copy-flow"><Nodes nodes={nodes} cta="link" /></div>
    </div>
    case 'chips': return <div className="split-layout">
      <div className="split-aside"><Heading section={section} /></div>
      <div className="copy-flow">{nodes.map((node, index) => node.type === 'p' && node.text.includes(' • ')
        ? <ItemList key={index} items={node.text.split(' • ')} style="chips" separator=" • " />
        : <ContentNodeView node={node} key={index} />)}</div>
    </div>
    case 'checklist': return <div className="split-layout">
      <div className="split-aside"><Heading section={section} />{look.lead && <p className="section-lead">{look.lead}</p>}</div>
      <div className="copy-flow">
        <ItemList items={nodes.filter(node => node.type === 'p').map(node => node.text)} style="check" />
        <Nodes nodes={nodes.filter(node => node.type !== 'p')} />
      </div>
    </div>
    case 'tiles': return <>
      <header className="section-header"><Heading section={section} /></header>
      <div className="copy-flow">{nodes.map((node, index) => node.type === 'p'
        ? <ItemList key={index} items={node.text.split('\n')} style="tiles" />
        : <ContentNodeView node={node} key={index} />)}</div>
    </>
    case 'split-links': return <div className="split-layout is-wide-first">
      <div className="copy-flow"><Heading section={section} /><Nodes nodes={nonCtas(nodes)} /></div>
      <div className="link-cards"><Nodes nodes={ctas(nodes)} cta="card" /></div>
    </div>
    case 'steps-panel': {
      const paragraphs = nodes.filter(node => node.type === 'p')
      return <div className="dark-panel steps-panel">
        <div className="steps-panel-lead"><Heading section={section} />{paragraphs[0] && <ContentNodeView node={paragraphs[0]} />}<Nodes nodes={ctas(nodes)} cta="inverse" /></div>
        <ol className="numbered-steps">{paragraphs.slice(1).map((node, index) => <li key={index}><span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><ContentNodeView node={node} /></li>)}</ol>
      </div>
    }
    case 'path-card': return <>
      {look.icon && <span className="card-icon"><Icon name={look.icon} /></span>}
      <Heading section={section} />
      <Nodes nodes={nodes} />
    </>
    case 'feature': return <div className="feature-panel">
      <div className="copy-flow"><Heading section={section} /><Nodes nodes={nodes.filter(node => !isExample(node))} /></div>
      <ExampleFigure nodes={nodes.filter(isExample) as FlowNode[]} diagram={look.diagram} />
    </div>
    case 'cta-band': return <div className="dark-panel cta-band">
      <div className="copy-flow"><Heading section={section} /><Nodes nodes={nonCtas(nodes)} /></div>
      <div className="cta-band-actions">{ctas(nodes).map((node, index) => <ContentNodeView node={node} cta={index === 0 ? 'inverse' : 'link'} key={index} />)}</div>
    </div>
    case 'card': case 'card-tint': case 'rule-card': return <>
      <Heading section={section} />
      <div className="copy-flow"><Nodes nodes={nodes} lines={look.lines} /></div>
    </>
    case 'branches': {
      const branches: FlowNode[][] = []
      for (const node of nodes) {
        if (node.type === 'h3' || !branches.length) branches.push([])
        branches[branches.length - 1].push(node as FlowNode)
      }
      return <>
        <header className="section-header is-centered"><Heading section={section} /></header>
        <ul className="branches">{branches.map((branch, index) => <li className="branch-card" key={index}><Nodes nodes={branch} /></li>)}</ul>
      </>
    }
    case 'experience': {
      const roles = nodes.filter(node => node.type === 'p' && !node.strongPrefix)
      return <>
        <header className="section-header"><Heading section={section} /></header>
        <div className="experience-grid">{roles.map((node, index) => <div className="experience-card" key={index}>
          {look.titles?.[index] && <h3><CopyText text={look.titles[index]} /></h3>}
          <ContentNodeView node={node} />
        </div>)}</div>
        <div className="experience-summary"><Nodes nodes={nodes.filter(node => !roles.includes(node))} /></div>
      </>
    }
    case 'numbered': return <>
      <header className="section-header"><Heading section={section} /></header>
      <ol className="numbered-list">{nodes.map((node, index) => <li key={index}><span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><ContentNodeView node={node} /></li>)}</ol>
    </>
    case 'article': case 'callout': return <>
      <Heading section={section} />
      <div className="copy-flow">{nodes.map((node, index) => isExample(node)
        ? <ExampleFigure key={index} nodes={[node as FlowNode]} diagram={look.diagram} />
        : <ContentNodeView node={node} cta="link" key={index} />)}</div>
    </>
    case 'article-cta': return <>
      <Heading section={section} />
      <div className="copy-flow"><Nodes nodes={nonCtas(nodes)} /></div>
      <div className="cta-band-actions">{ctas(nodes).map((node, index) => <ContentNodeView node={node} cta={index === ctas(nodes).length - 1 ? 'inverse' : 'link'} key={index} />)}</div>
    </>
    case 'note': return <div className="note-layout">
      <Heading section={section} />
      <div className="copy-flow"><Nodes nodes={nodes} /></div>
    </div>
    case 'split': case 'faq': default: return <div className="split-layout">
      <div className="split-aside"><Heading section={section} /></div>
      <div className={section.kind === 'cards' ? 'card-grid three' : 'copy-flow'}><Nodes nodes={nodes} /></div>
    </div>
  }
}

// Sections inside a group or an article column share their parent's container.
const bareVariants = new Set(['path-card', 'card', 'card-tint', 'rule-card', 'article', 'callout', 'article-cta'])

export function ContentSectionView({ section, pageKey, ordinal = 0 }: { section: ContentSection; index?: number; pageKey?: PageKey; ordinal?: number }) {
  const look = pageKey ? sectionPresentation(pageKey, section.id) : { variant: section.kind === 'faq' ? 'faq' as const : section.kind === 'cards' ? 'cards' as const : 'split' as const }
  const tone = section.tone === 'principle' ? ' principle-section' : section.tone === 'closing' ? ' closing-section' : ''
  const body = <SectionBody section={section} look={look} ordinal={ordinal} />
  return <section className={`content-section v-${look.variant}${tone}`} id={section.id} aria-labelledby={`${section.id}-heading`}>
    {bareVariants.has(look.variant) ? body : <div className="site-container">{body}</div>}
  </section>
}

// Who visitors will work with, from owner-supplied facts only (see about-profile.ts).
function FounderStrip({ intro }: { intro?: string }) {
  return <section className="content-section founder-strip" aria-labelledby="founder-strip-heading">
    <div className="site-container founder-layout">
      <div className="founder-copy">
        <h2 id="founder-strip-heading">{experienceTitle}</h2>
        {intro && <p className="copy-paragraph"><CopyText text={intro} /></p>}
        <Link className="action action-link" href="/about"><span>אודות</span><Icon name="arrow" size={20} /></Link>
      </div>
      <ul className="founder-facts">{founderHighlights.map(fact => <li key={fact}>
        <span className="item-mark" aria-hidden="true"><Icon name="check" size={16} /></span>
        <span><CopyText text={fact} /></span>
      </li>)}</ul>
    </div>
  </section>
}

function HeroCopy({ pageKey }: { pageKey: PageKey }) {
  const page = pages[pageKey]
  const look = presentation[pageKey]
  const skip = new Set([...(look.heroAside ?? []), ...(look.heroHidden ?? []), ...(look.heroMoved ?? [])])
  const items = page.hero.map((node, index) => ({ node, index })).filter(({ node, index }) => node.type !== 'eyebrow' && !skip.has(index))
  const blocks: React.ReactNode[] = []
  let firstParagraph = true
  let seenCta = false
  for (let i = 0; i < items.length; i++) {
    const { node, index } = items[i]
    if (node.type === 'cta') {
      const group = [node]
      while (items[i + 1]?.node.type === 'cta') group.push(items[++i].node as FlowNode & { type: 'cta' })
      // Solid styling is reserved for the meeting request; navigation (e.g. back to all solutions) stays secondary.
      blocks.push(<div className="hero-actions" key={`cta-${index}`}>{group.map((cta, position) => <ContentNodeView node={cta} cta={position === 0 && cta.href.startsWith('/contact') ? 'primary' : 'secondary'} key={position} />)}</div>)
      seenCta = true
      continue
    }
    if (node.type === 'p' && seenCta && look.heroChecklistLead && node.text.includes('\n')) {
      blocks.push(<ItemList key={index} items={[look.heroChecklistLead, ...node.text.split('\n')]} style="check" />)
      continue
    }
    if (node.type === 'p' && look.heroNote === index) {
      blocks.push(<p className="hero-note" key={index}><Icon name="info" size={20} /><span><CopyText text={node.text} /></span></p>)
      continue
    }
    if (node.type === 'p' && firstParagraph) {
      firstParagraph = false
      blocks.push(<p className="copy-paragraph hero-lead" key={index}><CopyText text={node.text} /></p>)
      continue
    }
    blocks.push(<ContentNodeView node={node} key={index} />)
  }
  return <>{blocks}</>
}

export function CopyPage({ pageKey, children, heroAside, heroAfter }: { pageKey: PageKey; children?: React.ReactNode; heroAside?: React.ReactNode; heroAfter?: React.ReactNode }) {
  const page = pages[pageKey]
  const look = presentation[pageKey]
  const service = serviceRoutes.find(route => route.key === pageKey)
  const asideNodes = (look.heroAside ?? []).map(index => page.hero[index]).filter(Boolean)
  const hasMedia = page.heroVideo || Boolean(heroAside)
  const layout = hasMedia ? ' has-media' : asideNodes.length ? ' has-aside' : ''
  const visibleSections = visiblePage(pageKey).sections
  const rowSections = visibleSections.filter(section => sectionPresentation(pageKey, section.id).variant === 'rows')

  // Consecutive sections that share a group render side by side in one container.
  const blocks: (ContentSection | { group: string; sections: ContentSection[] })[] = []
  for (const section of visibleSections) {
    const group = sectionPresentation(pageKey, section.id).group
    const last = blocks[blocks.length - 1]
    if (group && last && 'group' in last && last.group === group) last.sections.push(section)
    else blocks.push(group ? { group, sections: [section] } : section)
  }
  const renderSection = (section: ContentSection) => <ContentSectionView section={section} pageKey={pageKey} ordinal={rowSections.indexOf(section) + 1} key={section.id} />

  const sections = look.article
    ? <div className="article-layout site-container">
      <aside className="article-toc"><nav aria-label="תוכן העמוד"><p className="toc-title">בעמוד הזה</p>{visibleSections.filter(section => section.tone !== 'closing').map(section => <a href={`#${section.id}`} key={section.id}><span><CopyText text={section.title} /></span></a>)}</nav></aside>
      <div className="article-body">{visibleSections.map(renderSection)}</div>
    </div>
    : blocks.map(block => 'group' in block
      ? <div className={`section-group group-${block.group}`} key={block.group}><div className="site-container group-grid">{block.sections.map(renderSection)}</div></div>
      : renderSection(block))

  return <>
    <section className={`page-hero${page.heroVideo ? ' home-hero' : ''}${look.article ? ' article-hero' : ''}`}>
      <div className={`site-container hero-layout${layout}`}>
        <div className="hero-copy">
          {service && <nav className="breadcrumb" aria-label="פירורי לחם"><Link href="/solutions">פתרונות</Link><span aria-hidden="true">/</span><span>{service.label}</span></nav>}
          {page.hero.filter(node => node.type === 'eyebrow').map((node, index) => <ContentNodeView node={node} key={index} />)}
          {look.tag && <p className="eyebrow">{look.tag}</p>}
          <h1><CopyText text={page.h1} /></h1>
          <div className="copy-flow hero-flow"><HeroCopy pageKey={pageKey} /></div>
          {look.jumpNav && <nav className="jump-nav" aria-label="סוגי הבעיות בעמוד">{rowSections.map(section => <a href={`#${section.id}`} key={section.id}><span><CopyText text={section.title} /></span></a>)}</nav>}
          {heroAfter}
        </div>
        {asideNodes.length > 0 && <div className={`hero-aside hero-aside-${look.heroAsideStyle ?? 'rule'}`}>{asideNodes.map((node, index) => <ContentNodeView node={node} key={index} />)}</div>}
        {page.heroVideo && <IntroductionVideo media={introductionVideo} />}
        {heroAside}
      </div>
    </section>
    {look.founderStrip && <FounderStrip intro={(look.heroMoved ?? []).map(index => page.hero[index]).find(node => node?.type === 'p')?.text} />}
    {children}
    {sections}
  </>
}
