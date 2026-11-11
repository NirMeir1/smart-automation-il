import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { spawnSync } from 'node:child_process'
import Privacy from '@/app/legal/privacy/page'
import Terms from '@/app/legal/terms/page'
import Accessibility from '@/app/legal/accessibility/page'
import { legalDraftMetadata } from '@/components/legal-draft'

describe('Legal publication content and unchanged release protection', () => {
  it.each([['מדיניות פרטיות', Privacy], ['תנאי שימוש', Terms], ['הצהרת נגישות', Accessibility]] as const)('renders %s with an update date and a direct contact channel', (title, Page) => {
    const { container } = render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
    expect(container.textContent).toContain('עודכן לאחרונה:')
    expect(container.textContent).not.toMatch(/טיוטה|טרם אושרה|להשלמה|localhost:3000|\[.*?\]/)
    expect(legalDraftMetadata(title).title).toBe(`${title} | Posiblo`)
    expect(container.querySelector('time')).toHaveAttribute('dateTime', '2026-11-11')
    expect(container.querySelector('a[href^="mailto:posiblo.contact@gmail.com"]')).toBeInTheDocument()
    expect(container.textContent).toContain('ניר מאיר')
    expect(container.textContent).not.toMatch(/אימות שליטה בתיבה|שם משפטי מלא|מספר עוסק או חברה ומען/)
    expect(legalDraftMetadata(title).robots).toEqual({ index: false, follow: false })
  })
  it('fails the release gate even when indexing is explicitly enabled', () => {
    const result = spawnSync(process.execPath, ['scripts/check-legal-release.mjs'], {
      env: { ...process.env, SITE_INDEXING_ENABLED: 'true' }, encoding: 'utf8', windowsHide: true,
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('RELEASE BLOCKED')
  })
  it('blocks a Vercel production build before an environment flag can publish drafts', () => {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', 'await import("./next.config.mjs")'], {
      env: { ...process.env, VERCEL_ENV: 'production', SITE_INDEXING_ENABLED: 'true' }, encoding: 'utf8', windowsHide: true,
    })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('RELEASE BLOCKED')
  })
})
