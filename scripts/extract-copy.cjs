// Run after an approved source-copy update; output is reviewed, static site data.
const fs = require('node:fs');
const source = fs.readFileSync('docs/Bottomline_Codex_Implementation_Prompt.md', 'utf8');
const deck = source.split('### Home page — דף הבית')[1].split('## Legal/regulatory priorities')[0];
const chunks = ['### Home page — דף הבית' + deck].join('').split(/(?=^### .+ page — )/m).filter(Boolean);
const keys = ['home', 'solutions', 'business', 'individuals', 'process', 'about', 'contact'];
const translations = { 'Home FAQ': 'שאלות שעולות לפני שמתחילים', 'Technical capability block': 'הכלים שאפשר לעבוד איתם', 'Final reassurance': 'לא יודעים אם זה בכלל משהו שאני יכול לעזור בו?' };
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
      skip = title === 'The factual block to complete before publication' || (key === 'contact' && title === 'Form');
      if (skip) continue;
      title = translations[title] || title;
      section = { title, nodes: [] };
      page.sections.push(section); mode = ''; continue;
    }
    if (skip && line === 'CTA:' && key === 'about') skip = false;
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
        if (key === 'about' && p.includes('[שם מלא')) continue;
        if (mode === 'Card:') {
          add({ type: 'card', text: clean(plines.shift()), body: clean(plines.join('\n')) }); continue;
        }
        if (/^\*\*.+\*\*$/.test(plines[0]) && plines.length > 1) {
          add({ type: 'h3', text: clean(plines.shift()) });
        }
        if (!plines.length) continue;
        let text = clean(plines.join('\n'));
        if (section?.title === 'שאלות שעולות לפני שמתחילים' && section.nodes.at(-1)?.text === 'פגישת ההיכרות עולה כסף?') {
          text = 'את תנאי פגישת ההיכרות נתאם מראש. המטרה שלה היא להבין את הצורך ולבדוק התאמה. בפרויקטים מורכבים שדורשים אפיון או בדיקת היתכנות מעמיקה, ייתכן שיומלץ על שלב אפיון נפרד בתשלום לפני הפיתוח.';
        }
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
fs.mkdirSync('src/content', { recursive: true });
fs.writeFileSync('src/content/pages.json', JSON.stringify(pages, null, 2) + '\n');
console.log(Object.entries(pages).map(([key,p]) => `${key}: ${p.sections.length} sections, ${p.title}`).join('\n'));
