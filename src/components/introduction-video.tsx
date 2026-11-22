import Link from 'next/link'
import { IntroductionPlayer } from '@/components/introduction-player'
import type { IntroductionVideoMedia } from '@/content/introduction-video'

// The founder introduction as a compact row under the hero demo: the hero's own CTA stays the one next step.
export function IntroductionVideo({ media }: { media?: IntroductionVideoMedia }) {
  const heading = <h2 id="founder-introduction-heading">בואו נכיר</h2>
  return <section className="introduction-video" dir="rtl" aria-labelledby="founder-introduction-heading">
    {media ? <IntroductionPlayer media={media}>{heading}</IntroductionPlayer> : <>{heading}<div className="video-surface"><p>כאן יופיע סרטון ההיכרות</p></div></>}
    <p className="introduction-description" id="founder-introduction-description">אני מאמין שפתרון טכנולוגי טוב מתחיל בהבנה של הבעיה. בסרטון קצר אני מספר איך אני עובד ואיך אפשר להתקדם יחד.</p>
    {media && !media.captions?.length && <p className="video-a11y">{media.embeddedCaptions ? 'בסרטון משולבות כתוביות בעברית. טרם פורסם תמליל מלא.' : 'לסרטון עדיין אין קובץ כתוביות או תמליל מלא מאומת.'} <Link href="/legal/accessibility">למידע על נגישות הסרטון ולבקשת חלופה נגישה</Link>.</p>}
  </section>
}
