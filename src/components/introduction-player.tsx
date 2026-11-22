'use client'

import { useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { brand } from '@/lib/brand'
import type { IntroductionVideoMedia } from '@/content/introduction-video'

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`
// Spoken length, e.g. "דקה ו־22 שניות", so screen readers do not read "1:22" as a time of day.
function spokenLength(seconds: number) {
  const minutes = Math.floor(seconds / 60), rest = Math.round(seconds % 60)
  const parts = [minutes === 1 ? 'דקה' : minutes === 2 ? 'שתי דקות' : minutes ? `${minutes} דקות` : '', rest ? `${rest} שניות` : ''].filter(Boolean)
  return parts.join(' ו־')
}

// A compact row (poster thumbnail, title, play button) that opens the native player in place.
// Pressing play reveals the video, moves focus to it and starts playback; native controls take over from there,
// and the video stays keyboard-operable (Space/Enter). The button's hit area covers the whole row.
export function IntroductionPlayer({ media, children }: { media: IntroductionVideoMedia; children?: ReactNode }) {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const label = `הפעלת סרטון ההיכרות${media.duration ? `, באורך ${spokenLength(media.duration)}` : ''}`

  function play() {
    // Render the player first so it can take focus; play() still runs inside the click.
    flushSync(() => setStarted(true))
    const element = video.current
    if (!element) return
    element.focus()
    // A rejected play() (e.g. a browser policy) leaves the native controls available.
    element.play().catch(() => undefined)
  }

  return <div className={started ? 'video-player is-started' : 'video-player'}>
    <div className="video-row">
      {!started && <span className="video-thumb" style={media.poster ? { backgroundImage: `url(${media.poster})` } : undefined} aria-hidden="true">
        <span className="video-thumb-play"><svg viewBox="0 0 24 24" width="18" height="18" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" /></svg></span>
      </span>}
      <div className="video-row-copy">
        {children}
        {!started && <button type="button" className="video-row-play" onClick={play} aria-label={label}>
          <span aria-hidden="true">צפו בסרטון{media.duration ? <> · <bdi dir="ltr">{clock(media.duration)}</bdi></> : null}</span>
        </button>}
      </div>
    </div>
    <div className="video-surface" hidden={!started}>
      <video ref={video} controls tabIndex={0} playsInline preload="none" width={720} height={1280} poster={media.poster}
        aria-label={`סרטון ההיכרות עם מייסד ${brand.name}`} aria-describedby="founder-introduction-description"
        onPlay={() => setStarted(true)}>
        <source src={media.src} type="video/mp4" />
        {media.captions?.map((track, index) => <track key={`${track.language}-${track.src}`} kind="captions" src={track.src} srcLang={track.language} label={track.label} default={index === 0} />)}
        הדפדפן אינו תומך בהפעלת וידאו.
      </video>
    </div>
  </div>
}
