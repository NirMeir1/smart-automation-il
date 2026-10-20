import type { IntroductionVideoMedia } from '@/content/introduction-video'

export function IntroductionVideo({ media }: { media?: IntroductionVideoMedia }) {
  return <figure className="introduction-video">
    <div className="video-surface">
      {media ? <video controls playsInline preload="metadata" poster={media.poster} aria-label="סרטון ההיכרות">
        <source src={media.src} />
        {media.captions?.map((track, index) => <track key={`${track.language}-${track.src}`} kind="captions" src={track.src} srcLang={track.language} label={track.label} default={index === 0} />)}
        הדפדפן אינו תומך בהפעלת וידאו.
      </video> : null}
    </div>
    <figcaption>{media ? 'סרטון ההיכרות' : 'כאן יופיע סרטון ההיכרות'}</figcaption>
  </figure>
}
