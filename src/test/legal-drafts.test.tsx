import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import Privacy from '@/app/legal/privacy/page'
import Terms from '@/app/legal/terms/page'
import Accessibility from '@/app/legal/accessibility/page'
import { legalDocumentMetadata } from '@/components/legal-document'

// Exercise rejected releases in isolated fixtures without changing the real approval record.
function checkReleaseFixture(overrides: Record<string, unknown>, production = false, marker?: string) {
  const fixture = mkdtempSync(join(tmpdir(), 'posiblo-legal-release-'))
  try {
    for (const file of [
      'next.config.mjs', 'scripts/legal-release-state.mjs', 'scripts/check-legal-release.mjs',
      'src/components/legal-document.tsx', ...['privacy', 'terms', 'accessibility'].map(name => `src/app/legal/${name}/page.tsx`),
    ]) {
      const destination = join(fixture, file)
      mkdirSync(dirname(destination), { recursive: true })
      copyFileSync(file, destination)
    }
    mkdirSync(join(fixture, 'docs'))
    const status = JSON.parse(readFileSync('docs/legal-release-status.json', 'utf8'))
    writeFileSync(join(fixture, 'docs/legal-release-status.json'), JSON.stringify({ ...status, ...overrides }))
    if (marker) writeFileSync(join(fixture, 'src/app/legal/privacy/page.tsx'), marker)
    return spawnSync(process.execPath, production
      ? ['--input-type=module', '-e', 'await import("./next.config.mjs")']
      : ['scripts/check-legal-release.mjs'], {
      cwd: fixture,
      env: { ...process.env, VERCEL_ENV: 'production', SITE_INDEXING_ENABLED: 'true' },
      encoding: 'utf8', windowsHide: true,
    })
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
}

describe('Legal publication content and unchanged release protection', () => {
  it.each([['מדיניות פרטיות', Privacy], ['תנאי שימוש', Terms], ['הצהרת נגישות', Accessibility]] as const)('renders %s with an update date and a direct contact channel', (title, Page) => {
    const { container } = render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
    expect(container.textContent).toContain('עודכן לאחרונה:')
    expect(container.textContent).not.toMatch(/טיוטה|טרם אושרה|להשלמה|localhost:3000|\[.*?\]/)
    expect(legalDocumentMetadata(title).title).toBe(`${title} | Posiblo`)
    expect(container.querySelector('time')).toHaveAttribute('dateTime', '2026-11-11')
    expect(container.querySelector('a[href^="mailto:posiblo.contact@gmail.com"]')).toBeInTheDocument()
    expect(container.textContent).toContain('ניר מאיר')
    expect(container.textContent).not.toMatch(/אימות שליטה בתיבה|שם משפטי מלא|מספר עוסק או חברה ומען/)
    expect(legalDocumentMetadata(title).robots).toEqual({ index: false, follow: false })
  })
  it('accepts the current owner-approved release', () => {
    const result = checkReleaseFixture({})
    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
  })
  it.each([
    { status: 'draft' },
    { reviewedAt: null },
    { approvalReference: null },
    { blockers: ['Outstanding requirement'] },
  ])('rejects an incomplete release record even with indexing enabled: %j', overrides => {
    const result = checkReleaseFixture(overrides)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('RELEASE BLOCKED')
  })
  it('blocks a Vercel production build before an environment flag can publish drafts', () => {
    const result = checkReleaseFixture({ status: 'draft' }, true)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('RELEASE BLOCKED')
  })
  it('loads the Vercel production config for the approved release', () => {
    const result = checkReleaseFixture({}, true)
    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
  })
  it.each(['LegalDraft', 'להשלמה'])('still rejects a draft source marker: %s', marker => {
    const result = checkReleaseFixture({}, false, marker)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Legal pages still contain draft markers')
  })
})
