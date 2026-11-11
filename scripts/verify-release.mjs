// Local release verification. Builds with public production SEO settings and NO delivery credentials.
// Never deploy this contact-disabled test artifact; rebuild with approved production configuration.
import './check-legal-release.mjs';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { chromium, expect } from '@playwright/test';
import { publicRoutes, serviceRoutes } from '../src/lib/routes.ts';
import { brand, operator } from '../src/lib/brand.ts';
import { browserTestEnvironment } from './browser-test-env.mjs';

if (process.exitCode) process.exit(process.exitCode);

const env = { ...process.env, ...browserTestEnvironment, NEXT_PUBLIC_SITE_URL: brand.origin,
  SITE_INDEXING_ENABLED: 'true', VERCEL_ENV: 'production', NODE_ENV: 'production' };
const next = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));
if (!process.argv.includes('--skip-build')) {
  const build = spawnSync(process.execPath, [next, 'build'], { env, stdio: 'inherit', windowsHide: true });
  if (build.error) throw build.error;
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const base = 'http://127.0.0.1:3102';
const server = spawn(process.execPath, [next, 'start', '--hostname', '127.0.0.1', '--port', '3102'], {
  env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
});
let serverLog = '';
server.stdout.on('data', data => { serverLog += data; });
server.stderr.on('data', data => { serverLog += data; });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Local server exited: ${serverLog}`);
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* starting */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Local production server started');
  const html = new Map();
  for (const route of publicRoutes) {
    const response = await fetch(base + route.href, { redirect: 'manual' });
    assert.equal(response.status, 200, route.href);
    assert.doesNotMatch(response.headers.get('x-robots-tag') ?? '', /noindex|nofollow/i);
    const document = new JSDOM(await response.text()).window.document;
    assert.equal(document.documentElement.lang, 'he');
    assert.equal(document.documentElement.dir, 'rtl');
    assert.equal(document.querySelectorAll('h1').length, 1);
    assert.ok(document.querySelector('main').textContent.length > 200);
    assert.equal(document.querySelector('meta[name="robots"]').content, 'index, follow', route.href);
    assert.equal(document.querySelector('link[rel="canonical"]').href, brand.origin + route.href);
    assert.ok(document.querySelector('meta[name="description"]').content.length > 20);
    assert.ok(document.title.includes('Posiblo'));
    assert.equal(document.querySelector('meta[property="og:site_name"]').content, 'Posiblo');
    assert.equal(document.querySelector('meta[property="og:url"]').content, 'https://posiblo.com' + route.href);
    // Check rendered copy separately from Next.js hydration payloads.
    const visibleBody = document.body.cloneNode(true);
    visibleBody.querySelectorAll('script, style').forEach(node => node.remove());
    assert.doesNotMatch(visibleBody.textContent, /bottomline/i);
    html.set(route.href, document);
  }
  assert.equal(new Set([...html.values()].map(document => document.title)).size, publicRoutes.length);
  const xml = new JSDOM(await (await fetch(base + '/sitemap.xml')).text(), { contentType: 'application/xml' });
  const locations = [...xml.window.document.querySelectorAll('loc')].map(node => node.textContent);
  assert.deepEqual(locations, publicRoutes.map(route => brand.origin + route.href));
  const robots = await (await fetch(base + '/robots.txt')).text();
  assert.ok(robots.includes('Sitemap: https://posiblo.com/sitemap.xml'));
  const searchRules = robots.split(/User-Agent: GPTBot/i)[0];
  assert.match(searchRules, /User-Agent: \*\s+Allow: \//i);
  for (const path of ['/admin', '/api/', '/thanks']) assert.ok(searchRules.includes(`Disallow: ${path}`));
  assert.ok(!searchRules.includes('Disallow: /legal/'));
  for (const bot of ['GPTBot', 'Google-Extended', 'ClaudeBot', 'CCBot']) {
    assert.ok(robots.includes(`User-Agent: ${bot}`));
  }
  assert.match(robots.slice(searchRules.length), /Disallow: \/(?:\r?\n|$)/);
  for (const path of ['/legal/privacy', '/legal/terms', '/legal/accessibility']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    const document = new JSDOM(await response.text()).window.document;
    assert.match(document.querySelector('meta[name="robots"]').content, /noindex/);
  }
  for (const path of ['/admin', '/unknown-release-check']) assert.equal((await fetch(base + path)).status, 404);
  for (const [path, status] of [['/testimonials', 308], ['/thanks', 307]]) {
    assert.equal((await fetch(base + path, { redirect: 'manual' })).status, status);
  }
  const checked = new Set();
  for (const document of html.values()) for (const link of document.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (href.startsWith('mailto:')) {
      assert.equal(href.split('?')[0], `mailto:${operator.email}`);
      continue;
    }
    assert.ok(href.startsWith('/') || href.startsWith('#'), `Internal destination: ${href}`);
    const url = new URL(href, base + [...html].find(([, value]) => value === document)[0]);
    if (checked.has(url.href)) continue;
    checked.add(url.href);
    const response = await fetch(url);
    assert.equal(response.status, 200, href);
    if (url.hash) {
      const destination = new JSDOM(await response.text()).window.document;
      assert.ok(destination.getElementById(url.hash.slice(1)), `Fragment: ${href}`);
    }
  }
  for (const route of serviceRoutes) {
    for (const parent of ['/', '/solutions', '/business']) {
      assert.ok(html.get(parent).querySelector(`a[href="${route.href}"]`), `${parent} discovers ${route.href}`);
    }
    assert.ok(html.get(route.href).querySelector('a[href="/solutions"]'));
  }
  const evidence = mkdtempSync(join(tmpdir(), 'bottomline-release-qa-'));
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const issues = [];
  const page = await browser.newPage();
  page.on('pageerror', error => issues.push(error.message));
  page.on('console', message => { if (message.type() === 'error') issues.push(message.text()); });
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    for (const route of [publicRoutes[0], ...serviceRoutes]) {
      await page.goto(base + route.href);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.title(), html.get(route.href).title);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), brand.origin + route.href);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index, follow');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: join(evidence, `${route.key}-${label}.png`), fullPage: true });
    }
    await page.getByRole('main').getByRole('link', { name: /איך נראית/ }).click();
    await expect(page).toHaveURL(base + '/process');
    assert.equal(new URL(page.url()).pathname, '/process');
    await page.getByRole('main').getByRole('link', { name: /לקביעת פגישת/ }).click();
    await expect(page).toHaveURL(base + '/contact#inquiry');
    assert.equal(new URL(page.url()).pathname, '/contact');
    await page.locator('#inquiry').waitFor();
  }
  assert.deepEqual(issues, []);
  console.log(`PASS: ${publicRoutes.length} production pages, canonicals, SSR, robots, sitemap, legal/404/redirects; ${checked.size} internal links/fragments; Edge desktop/mobile service→process→contact. Screenshots: ${evidence}`);
} finally {
  await browser?.close();
  server.kill();
}
