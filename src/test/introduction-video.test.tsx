import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { IntroductionVideo } from '@/components/introduction-video'

describe('Introduction video', () => {
  it('describes the configured burned-in subtitles without pretending a separate track exists', () => {
    const { container } = render(<IntroductionVideo media={{ src: '/operator.mp4', embeddedCaptions: true }} />)
    expect(screen.getByText(/בסרטון משולבות כתוביות בעברית/)).toBeInTheDocument()
    expect(container.querySelector('track')).toBeNull()
    expect(screen.queryByText(/לסרטון עדיין אין קובץ כתוביות/)).not.toBeInTheDocument()
  })
  it('reserves the media area honestly without fake playback when footage is absent', () => {
    const { container } = render(<IntroductionVideo />)
    expect(screen.getByText('כאן יופיע סרטון ההיכרות')).toBeInTheDocument()
    expect(container.querySelector('.video-surface')).toBeInTheDocument()
    expect(container.querySelector('video, button, img')).toBeNull()
  })

  it('invites playback with a labelled play button that starts the video and hands over to native controls', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    render(<IntroductionVideo media={{ src: '/operator.mp4', embeddedCaptions: true, duration: 82 }} />)
    const button = screen.getByRole('button', { name: 'הפעלת סרטון ההיכרות, באורך דקה ו־22 שניות' })
    expect(button).toHaveTextContent('צפו בסרטון · 1:22')
    fireEvent.click(button)
    expect(play).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: /הפעלת סרטון ההיכרות/ })).not.toBeInTheDocument()
    expect(screen.getByLabelText('סרטון ההיכרות עם מייסד Posiblo')).toHaveFocus()
    play.mockRestore()
  })

  it('supports native controls and captions without autoplay when real media is configured', () => {
    const { container } = render(<IntroductionVideo media={{ src: '/operator.mp4', captions: [{ src: '/operator.he.vtt', language: 'he', label: 'עברית' }] }} />)
    const video = screen.getByLabelText('סרטון ההיכרות עם מייסד Posiblo')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('playsinline')
    expect(video).not.toHaveAttribute('autoplay')
    expect(video).not.toHaveAttribute('loop')
    expect(video).toHaveAttribute('preload', 'none')
    expect(screen.getByRole('link', { name: 'לקביעת פגישת היכרות' })).toHaveAttribute('href', '/contact#inquiry')
    expect(container.querySelector('source')).toHaveAttribute('src', '/operator.mp4')
    expect(container.querySelector('track')).toHaveAttribute('kind', 'captions')
    expect(container.querySelector('track')).toHaveAttribute('srclang', 'he')
    expect(container.querySelector('track')).toHaveAttribute('default')
  })
})
