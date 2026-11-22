import { CopyText } from '@/components/copy-page'
import { Icon } from '@/components/icon'

// WAITING FOR REAL PROJECT RESULTS: not placed on any page. Use it only with real, verifiable numbers from
// finished projects that the owner has approved for publication; never with estimates or sample figures.

export type OutcomeItem = {
  value: string
  label: string
  // Optional before -> after pair, shown in reading order with a direction-aware arrow.
  before?: string
  after?: string
}

// 3-4 outcome tiles: a large numeral with its label, separated by hairline dividers. 4 (or 3) columns -> 2 -> 1.
export function OutcomeStrip({ items, label }: { items: readonly OutcomeItem[]; label: string }) {
  return <ul className="outcome-strip" aria-label={label} style={{ '--count': items.length } as React.CSSProperties}>
    {items.map(item => <li className="outcome-tile" key={`${item.value}-${item.label}`}>
      <p className="outcome-value"><bdi>{item.value}</bdi></p>
      <p className="outcome-label"><CopyText text={item.label} /></p>
      {item.before && item.after && <p className="outcome-change">
        <span className="sr-only">לפני: </span><bdi>{item.before}</bdi>
        <Icon name="arrow" size={16} className="outcome-arrow" />
        <span className="sr-only">, אחרי: </span><bdi>{item.after}</bdi>
      </p>}
    </li>)}
  </ul>
}

/* Usage example with obviously fake placeholder data (do not ship):
<OutcomeStrip label="תוצאות לדוגמה" items={[
  { value: '00', label: 'תווית לדוגמה' },
  { value: '00%', label: 'תווית לדוגמה', before: 'X', after: 'Y' },
  { value: '0:00', label: 'תווית לדוגמה' },
]} />
*/
