import Link from 'next/link'
import { Icon } from '@/components/icon'
import { IntroductionPlayer } from '@/components/introduction-player'
import type { IntroductionVideoMedia } from '@/content/introduction-video'

export function IntroductionVideo({ media }: { media?: IntroductionVideoMedia }) {
  return <section className="introduction-video" dir="rtl" aria-labelledby="founder-introduction-heading">
    <div className="introduction-copy">
      <h2 id="founder-introduction-heading">בואו נכיר</h2>
      <p id="founder-introduction-description">אני מאמין שפתרון טכנולוגי טוב מתחיל בהבנה של הבעיה. בסרטון קצר אני מספר איך אני עובד ואיך אפשר להתקדם יחד.</p>
    </div>
    <div className="video-surface">
      {media ? <IntroductionPlayer media={media} /> : <p>כאן יופיע סרטון ההיכרות</p>}
    </div>
    <div className="introduction-next-step">
      {media && !media.captions?.length && <p>{media.embeddedCaptions ? 'בסרטון משולבות כתוביות בעברית. טרם פורסם תמליל מלא.' : 'לסרטון עדיין אין קובץ כתוביות או תמליל מלא מאומת.'} <Link href="/legal/accessibility">למידע על נגישות הסרטון ולבקשת חלופה נגישה</Link>.</p>}
      {/* Native navigation avoids duplicate fragments on repeated contact anchors. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="action" href="/contact#inquiry"><span>לקביעת פגישת היכרות</span><Icon name="arrow" size={20} /></a>
      <p>לא צריך להגיע עם אפיון או לדעת מראש מה הפתרון.</p>
    </div>
  </section>
}
