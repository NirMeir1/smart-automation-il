export type IntroductionVideoMedia = {
  src: string
  poster?: string
  captions?: { src: string; language: string; label: string }[]
}

// Configure only after the operator supplies approved footage and caption files.
export const introductionVideo: IntroductionVideoMedia | undefined = undefined
