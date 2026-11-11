// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { reviewRetention } from '../../scripts/retention-review.mjs'

const record = (overrides = {}) => ({ reference: '123e4567-e89b-42d3-a456-426614174000', status: 'unconverted', lastMeaningfulInteraction: '2025-11-11', ...overrides })
describe('Offline retention review', () => {
  it('marks a 12-month boundary for manual review without deleting anything', () => {
    expect(reviewRetention([record()], '2026-11-11')).toMatchObject({ mode: 'dry-run', summary: { dueToday: 1 }, items: [{ decision: 'dueToday', dueOn: '2026-11-11' }] })
    expect(reviewRetention([record()], '2026-11-12').summary.overdue).toBe(1)
  })
  it('schedules expiries before the next quarterly review rather than silently keeping them another quarter', () => {
    expect(reviewRetention([record({ lastMeaningfulInteraction: '2025-12-15' })], '2026-11-11')).toMatchObject({ nextQuarterlyReview: '2027-01-01', summary: { scheduleBeforeNextReview: 1 }, items: [{ dueOn: '2026-12-15' }] })
  })
  it('uses a calendar year and clamps leap day', () => {
    expect(reviewRetention([record({ lastMeaningfulInteraction: '2024-02-29' })], '2025-02-28').items[0].dueOn).toBe('2025-02-28')
  })
  it('keeps customer/project records out of the enquiry deletion queue and makes exceptions reviewable', () => {
    expect(reviewRetention([record({ status: 'active_project' })], '2026-11-12').summary.operationalReview).toBe(1)
    expect(reviewRetention([record({ hold: { reason: 'dispute', reviewOn: '2026-12-01' } })], '2026-11-12').summary.held).toBe(1)
    expect(reviewRetention([record({ hold: { reason: 'legal_obligation', reviewOn: '2026-11-01' } })], '2026-11-12').summary.holdReviewDue).toBe(1)
  })
  it('rejects contact details, invalid dates, missing categories and duplicate IDs', () => {
    for (const bad of [record({ name: 'Synthetic name' }), record({ lastMeaningfulInteraction: '2025-02-30' }), record({ lastMeaningfulInteraction: '2027-01-01' }), record({ status: 'unknown' }), record({ hold: { reason: 'dispute' } })]) {
      expect(() => reviewRetention([bad], '2026-11-11')).toThrow()
    }
    expect(() => reviewRetention([record(), record()], '2026-11-11')).toThrow()
  })
  it('rejects an apply/delete request before reading any input or exposing it', () => {
    const result = spawnSync(process.execPath, ['scripts/retention-review.mjs', '--apply'], { encoding: 'utf8', windowsHide: true })
    expect(result.status).toBe(1)
    expect(result.stdout).toBe('')
    expect(result.stderr).toContain('Only dry-run mode is supported')
  })
})
