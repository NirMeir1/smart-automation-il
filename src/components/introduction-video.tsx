import Link from 'next/link'
import type { IntroductionVideoMedia } from '@/content/introduction-video'

export function IntroductionVideo({ media }: { media?: IntroductionVideoMedia }) {
  return <section className="introduction-video" dir="rtl" aria-labelledby="founder-introduction-heading">
    <div className="introduction-copy">
      <h2 id="founder-introduction-heading">בואו נכיר</h2>
      <p id="founder-introduction-description">אני מאמין שפתרון טכנולוגי טוב מתחיל בהבנה של הבעיה. בסרטון קצר אני מספר איך אני עובד ואיך אפשר להתקדם יחד.</p>
    </div>
    <div className="video-surface">
      {media ? <video controls playsInline preload="none" width={720} height={1280} poster={media.poster} aria-label="סרטון ההיכרות עם מייסד BottomLine" aria-describedby="founder-introduction-description">
        <source src={media.src} type="video/mp4" />
        {media.captions?.map((track, index) => <track key={`${track.language}-${track.src}`} kind="captions" src={track.src} srcLang={track.language} label={track.label} default={index === 0} />)}
        הדפדפן אינו תומך בהפעלת וידאו.
      </video> : <p>כאן יופיע סרטון ההיכרות</p>}
    </div>
    <div className="introduction-next-step">
      <Link className="action" href="/contact#inquiry">לקביעת פגישת היכרות<span aria-hidden="true">↖</span></Link>
      <p>לא צריך להגיע עם אפיון או לדעת מראש מה הפתרון.</p>
    </div>
  </section>
}
