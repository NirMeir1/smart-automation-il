import { Icon } from '@/components/icon'

// Illustrative example only (labelled "דוגמה"): a generic booking request, no client, brand or result claims.
// The visual layer is aria-hidden and the visually hidden caption describes it, so screen readers hear it once.
// The steps reveal once in sequence (CSS only) and hold; every step keeps its space, so nothing shifts.
// Under prefers-reduced-motion the global rule removes the animation and the final state shows at once.
export function HeroDemo() {
  return <figure className="hero-demo">
    <figcaption className="sr-only">דוגמה להמחשה: לקוחה שולחת הודעה ומבקשת לקבוע תור לתספורת ביום חמישי אחר הצהריים. המערכת מזהה מההודעה את השם, השירות והמועד המבוקש, רושמת את התור ביומן ושולחת ללקוחה הודעת אישור.</figcaption>
    <div className="demo-body" aria-hidden="true">
      <span className="demo-tag">דוגמה</span>
      <ol className="demo-steps">
        <li className="demo-step" style={{ '--i': 0 } as React.CSSProperties}>
          <p className="demo-step-label"><span className="demo-step-number">1</span>הודעה נכנסת</p>
          <div className="demo-bubble is-incoming"><p>היי, אפשר לקבוע תור לתספורת ביום חמישי אחר הצהריים? תודה, דנה</p></div>
        </li>
        <li className="demo-step" style={{ '--i': 1 } as React.CSSProperties}>
          <p className="demo-step-label"><span className="demo-step-number">2</span>המערכת מזהה את הפרטים</p>
          <ul className="demo-fields">
            <li><span>שם</span>דנה</li>
            <li><span>שירות</span>תספורת</li>
            <li><span>מועד מבוקש</span>חמישי, אחר הצהריים</li>
          </ul>
        </li>
        <li className="demo-step" style={{ '--i': 2 } as React.CSSProperties}>
          <p className="demo-step-label"><span className="demo-step-number">3</span>נרשם ביומן ונשלח אישור</p>
          <div className="demo-result">
            <span className="demo-check"><Icon name="check" size={16} /></span>
            <span><strong>יום חמישי, 16:30</strong> · תספורת · דנה</span>
          </div>
          <div className="demo-bubble is-outgoing"><p>היי דנה, התור שלך לתספורת נקבע ליום חמישי ב־16:30. נתראה!</p></div>
        </li>
      </ol>
    </div>
  </figure>
}
