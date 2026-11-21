'use client'

import { useRef, useState } from 'react'
import { brand } from '@/lib/brand'
import type { IntroductionVideoMedia } from '@/content/introduction-video'

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`
// Spoken length, e.g. "דקה ו־22 שניות", so screen readers do not read "1:22" as a time of day.
function spokenLength(seconds: number) {
  const minutes = Math.floor(seconds / 60), rest = Math.round(seconds % 60)
  const parts = [minutes === 1 ? 'דקה' : minutes === 2 ? 'שתי דקות' : minutes ? `${minutes} דקות` : '', rest ? `${rest} שניות` : ''].filter(Boolean)
  return parts.join(' ו־')
}

// A large play invitation over the poster. Native controls take over once playback starts,
// and the video itself stays keyboard-operable (Space/Enter) throughout.
export function IntroductionPlayer({ media }: { media: IntroductionVideoMedia }) {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const label = `הפעלת סרטון ההיכרות${media.duration ? `, באורך ${spokenLength(media.duration)}` : ''}`

  function play() {
    const element = video.current
    if (!element) return
    setStarted(true)
    element.focus()
    // A rejected play() (e.g. a browser policy) leaves the native controls available.
    element.play().catch(() => undefined)
  }

  return <div className={started ? 'video-player is-started' : 'video-player'}>
    <video ref={video} controls tabIndex={0} playsInline preload="none" width={720} height={1280} poster={media.poster}
      aria-label={`סרטון ההיכרות עם מייסד ${brand.name}`} aria-describedby="founder-introduction-description"
      onPlay={() => setStarted(true)} onEnded={() => setStarted(false)}>
      <source src={media.src} type="video/mp4" />
      {media.captions?.map((track, index) => <track key={`${track.language}-${track.src}`} kind="captions" src={track.src} srcLang={track.language} label={track.label} default={index === 0} />)}
      הדפדפן אינו תומך בהפעלת וידאו.
    </video>
    {!started && <button type="button" className="video-play" onClick={play} aria-label={label}>
      <span className="video-play-circle" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" /></svg>
      </span>
      <span className="video-play-label" aria-hidden="true">צפו בסרטון{media.duration ? <> · <bdi dir="ltr">{clock(media.duration)}</bdi></> : null}</span>
    </button>}
  </div>
}
