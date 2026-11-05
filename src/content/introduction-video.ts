export type IntroductionVideoMedia = {
  src: string
  poster?: string
  captions?: { src: string; language: string; label: string }[]
}

// Derived from the owner-supplied footage by scripts/prepare-founder-video.mjs.
export const introductionVideo: IntroductionVideoMedia = {
  src: '/videos/founder-introduction-blurred.mp4',
  poster: '/videos/founder-introduction-poster-blurred.webp',
}
