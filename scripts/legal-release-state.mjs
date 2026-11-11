import { readFileSync } from 'node:fs';

// Shared by the production build and the local release check; no env bypass.
export function legalReleaseBlockers() {
  const status = JSON.parse(readFileSync(new URL('../docs/legal-release-status.json', import.meta.url), 'utf8'));
  const blockers = [...status.blockers];
  if (status.status !== 'approved' || !status.reviewedAt || !status.approvalReference) {
    blockers.push('A dated approval record with a review reference is required');
  }
  const pages = ['privacy', 'terms', 'accessibility'].map(name =>
    readFileSync(new URL(`../src/app/legal/${name}/page.tsx`, import.meta.url), 'utf8'));
  const shell = readFileSync(new URL('../src/components/legal-draft.tsx', import.meta.url), 'utf8');
  if (pages.some(page => /להשלמה|LegalDraft/.test(page)) || shell.includes('טרם אושרה לפרסום')) {
    blockers.push('Legal pages still contain draft markers or unresolved details');
  }
  return blockers;
}
