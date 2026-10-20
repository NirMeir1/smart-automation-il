import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntroductionVideo } from '@/components/introduction-video'

describe('Introduction video', () => {
  it('reserves the media area honestly without fake playback when footage is absent', () => {
    const { container } = render(<IntroductionVideo />)
    expect(screen.getByText('כאן יופיע סרטון ההיכרות')).toBeInTheDocument()
    expect(container.querySelector('.video-surface')).toBeInTheDocument()
    expect(container.querySelector('video, button, img')).toBeNull()
  })

  it('supports native controls and captions without autoplay when real media is configured', () => {
    const { container } = render(<IntroductionVideo media={{ src: '/operator.mp4', captions: [{ src: '/operator.he.vtt', language: 'he', label: 'עברית' }] }} />)
    const video = screen.getByLabelText('סרטון ההיכרות')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('playsinline')
    expect(video).not.toHaveAttribute('autoplay')
    expect(container.querySelector('source')).toHaveAttribute('src', '/operator.mp4')
    expect(container.querySelector('track')).toHaveAttribute('kind', 'captions')
    expect(container.querySelector('track')).toHaveAttribute('srclang', 'he')
    expect(container.querySelector('track')).toHaveAttribute('default')
  })
})
