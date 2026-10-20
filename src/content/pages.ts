import source from './pages.json' with { type: 'json' }
import { parseSiteContent } from './schema'
import { withFounderProfile } from './about-profile'

const reviewedPages = parseSiteContent(source)
export const pages = { ...reviewedPages, about: withFounderProfile(reviewedPages.about) }
