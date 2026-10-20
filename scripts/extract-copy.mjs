// Run after an approved source-copy update; output is reviewed, static site data.
import fs from 'node:fs';
import { parseSiteContent } from '../src/content/schema.ts';
import { ctaLinks, sectionDefinitions } from '../src/content/structure.ts';
// Approved brand casing update; preserve the original research document.
const source = fs.readFileSync('docs/BOTTOMLINE_WEBSITE_BRIEF.md', 'utf8').replaceAll('Bottomline', 'BottomLine');
const deck = source.split('### Home page — דף הבית')[1].split('## 8. Functional Requirements')[0];
const chunks = ['### Home page — דף הבית' + deck].join('').split(/(?=^### .+ page — )/m).filter(Boolean);
const keys = ['home', 'solutions', 'business', 'individuals', 'process', 'about', 'contact'];
const translations = { 'Home FAQ': 'שאלות שעולות לפני שמתחילים', 'Technical capability block': 'הכלים שאפשר לעבוד איתם', 'Final reassurance': 'לא יודעים אם זה בכלל משהו שאני יכול לעזור בו?', 'The factual block to complete before publication': '[נדרש להשלמה ואימות לפני פרסום:]' };
const clean = s => s.replace(/\*\*/g, '').replace(/\\\*/g, '*').trim();
const pages = {};
chunks.forEach((chunk, pageIndex) => {
  const key = keys[pageIndex];
  const page = { title: '', description: '', h1: '', hero: [], sections: [] };
  let section = null, mode = '', skip = false;
  const lines = chunk.split(/\r?\n/);
  function add(node) { (section ? section.nodes : page.hero).push(node); }
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#### ')) {
      let title = line.slice(5).replace(/^Section: /, '');
      skip = key === 'contact' && title === 'Form';
      if (skip) continue;
      title = translations[title] || title;
      section = { title, nodes: [] };
      page.sections.push(section); mode = ''; continue;
    }
    if (skip) continue;
    if (line.startsWith('>')) {
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^> ?/, '').trim()); i++;
      }
      i--;
      if (mode === 'Meta title') { page.title = clean(quote.join(' ')); mode = ''; continue; }
      if (mode === 'Meta description') { page.description = clean(quote.join(' ')); mode = ''; continue; }
      if (mode === 'H1') { page.h1 = clean(quote.join('\n')); mode = ''; continue; }
      if (/CTA/.test(mode) || mode === 'CTA:' || mode === 'Button:') {
        if (mode === 'Final CTA') {
          section = { title: clean(quote[0]), nodes: [] }; page.sections.push(section);
          const paragraphs = quote.slice(1).join('\n').split(/\n\s*\n/).map(clean).filter(Boolean);
          paragraphs.forEach((text, index) => add({ type: index === paragraphs.length - 1 ? 'cta' : 'p', text }));
        } else add({ type: 'cta', text: clean(quote.join(' ')) });
        mode = ''; continue;
      }
      const paragraphs = quote.join('\n').split(/\n\s*\n/).filter(s => s.trim());
      for (let p of paragraphs) {
        const plines = p.split('\n');
        if (mode === 'Card:') {
          add({ type: 'card', text: clean(plines.shift()), body: clean(plines.join('\n')) }); continue;
        }
        if (/^\*\*.+\*\*$/.test(plines[0]) && plines.length > 1) {
          add({ type: 'h3', text: clean(plines.shift()) });
        }
        if (!plines.length) continue;
        const text = clean(plines.join('\n'));
        add({ type: mode === 'Hero eyebrow' ? 'eyebrow' : /^\*\*.+\*\*$/.test(plines.join('\n')) ? 'strong' : 'p', text });
      }
      mode = ''; continue;
    }
    if (/^\*\*.+\*\*$/.test(line)) {
      const label = clean(line);
      if (['Meta title', 'Meta description', 'Hero eyebrow', 'H1', 'Hero body', 'Primary CTA', 'Secondary CTA', 'Trust microcopy', 'Final CTA'].includes(label)) { mode = label; continue; }
      add({ type: 'h3', text: label }); mode = ''; continue;
    }
    if (['CTA:', 'Card:', 'Closing:', 'Intro:', 'Body:', 'Button:'].includes(line)) mode = line;
  }
  pages[key] = page;
});
function flow(node) {
  if (node.type !== 'cta') return node;
  const href = ctaLinks[node.text];
  if (!href) throw new Error(`Add an explicit destination for CTA: ${node.text}`);
  return { ...node, href };
}

function structureSection(key, source) {
  const definition = sectionDefinitions[key][source.title];
  if (!definition) throw new Error(`Add an explicit section definition for ${key}: ${source.title}`);
  const base = { id: definition.id, title: source.title, tone: definition.tone || 'default' };
  const nodes = source.nodes.filter(node => node.text !== source.title);
  if (definition.kind === 'faq') {
    const items = [];
    for (const node of nodes) {
      if (node.type === 'h3') items.push({ question: node.text, answer: [] });
      else {
        if (!items.length) throw new Error('An FAQ answer needs an explicit question');
        items.at(-1).answer.push(flow(node));
      }
    }
    return { ...base, kind: 'faq', items };
  }
  if (definition.kind === 'cards') {
    const structured = [];
    let card = null;
    for (const node of nodes) {
      if (node.type === 'card') {
        structured.push({ type: 'card', text: node.text, nodes: [{ type: 'p', text: node.body }] });
        card = null;
      } else if (node.type === 'h3') {
        card = { type: 'card', text: node.text, nodes: [] };
        structured.push(card);
      } else if (card && (node.type === 'p' || definition.cardActions && node.type === 'cta')) {
        card.nodes.push(flow(node));
      } else {
        card = null;
        structured.push(flow(node));
      }
    }
    return { ...base, kind: 'cards', columns: definition.columns, nodes: structured };
  }
  return { ...base, kind: 'flow', nodes: nodes.map(flow) };
}

const content = parseSiteContent(Object.fromEntries(Object.entries(pages).map(([key, page]) => [key, {
  ...page, heroVideo: key === 'home', hero: page.hero.map(flow),
  sections: page.sections.map(section => structureSection(key, section)),
}])));
const output = JSON.stringify(content, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync('src/content/pages.json', 'utf8') !== output) throw new Error('Content is stale; run npm run content:generate and review the diff');
  console.log('Reviewed content and regeneration agree.');
} else {
  fs.writeFileSync('src/content/pages.json', output);
  console.log('Generated and validated all seven pages.');
}
