// Offline review only. No provider SDK, network, credentials, deletion or scheduler.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Expected a calendar date');
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== value) throw new Error('Invalid calendar date');
  return parsed;
}
function iso(value) { return value.toISOString().slice(0, 10); }
function expiry(value) {
  const current = date(value);
  const year = current.getUTCFullYear() + 1, month = current.getUTCMonth();
  const day = Math.min(current.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  return new Date(Date.UTC(year, month, day));
}

export function reviewRetention(records, asOf) {
  const now = date(asOf);
  if (!Array.isArray(records)) throw new Error('Expected an array of minimal review records');
  const nextReview = new Date(Date.UTC(now.getUTCFullYear(), Math.floor(now.getUTCMonth() / 3) * 3 + 3, 1));
  const seen = new Set();
  const summary = { overdue: 0, dueToday: 0, scheduleBeforeNextReview: 0, retained: 0, operationalReview: 0, held: 0, holdReviewDue: 0 };
  const items = records.map(record => {
    const { reference, status, lastMeaningfulInteraction, hold } = record || {};
    if (Object.keys(record || {}).some(key => !['reference', 'status', 'lastMeaningfulInteraction', 'hold'].includes(key))) {
      throw new Error('Only minimal metadata is permitted; omit names, contacts and message contents');
    }
    if (typeof reference !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reference) || seen.has(reference)) {
      throw new Error('Each record needs a unique random UUID reference');
    }
    seen.add(reference);
    if (!['unconverted', 'active_project', 'customer'].includes(status)) throw new Error('Unknown record category');
    const last = date(lastMeaningfulInteraction);
    if (+last > +now) throw new Error('Interaction date is in the future');
    let decision, dueOn;
    if (hold !== undefined) {
      if (!hold || Object.keys(hold).some(key => !['reason', 'reviewOn'].includes(key)) ||
          !['legal_obligation', 'dispute', 'rights_request'].includes(hold.reason)) throw new Error('Invalid retention exception');
      const review = date(hold.reviewOn);
      decision = +review <= +now ? 'holdReviewDue' : 'held';
    } else if (status !== 'unconverted') decision = 'operationalReview';
    else {
      const due = expiry(lastMeaningfulInteraction);
      dueOn = iso(due);
      decision = +due < +now ? 'overdue' : +due === +now ? 'dueToday' : +due <= +nextReview ? 'scheduleBeforeNextReview' : 'retained';
    }
    summary[decision]++;
    return { reference, decision, ...(dueOn ? { dueOn } : {}) };
  });
  return { mode: 'dry-run', asOf, nextQuarterlyReview: iso(nextReview), total: records.length, summary, items };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => !['--input', '--as-of', '--details', '--dry-run'].includes(arg) && arg.startsWith('--'))) {
      throw new Error('Unsupported option; deletion and apply modes do not exist');
    }
    const inputIndex = args.indexOf('--input');
    if (inputIndex === -1 || !args[inputIndex + 1] || args[inputIndex + 1].startsWith('--')) throw new Error('Provide --input with a private metadata JSON file');
    const asOfIndex = args.indexOf('--as-of');
    const asOf = asOfIndex === -1
      ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
      : args[asOfIndex + 1];
    const report = reviewRetention(JSON.parse(readFileSync(args[inputIndex + 1], 'utf8')), asOf);
    if (!args.includes('--details')) delete report.items;
    console.log(JSON.stringify(report, null, 2));
  } catch {
    // Do not echo paths, JSON, dates or raw exceptions from private input.
    console.error('Review could not run. Check the minimal input schema and dates in docs/Retention_Operations.md. Only dry-run mode is supported.');
    process.exitCode = 1;
  }
}
