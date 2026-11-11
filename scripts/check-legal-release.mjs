// Read-only local gate. Never deploys, modifies accounts or removes draft labels.
import { legalReleaseBlockers } from './legal-release-state.mjs';
const blockers = legalReleaseBlockers();
if (blockers.length) {
  console.error('RELEASE BLOCKED: legal documents remain drafts. Complete docs/Legal_Launch_Audit.md and record actual approval; an environment flag cannot approve these documents.');
  for (const blocker of blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
}
