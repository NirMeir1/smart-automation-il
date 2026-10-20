import source from './pages.json' with { type: 'json' }
import { parseSiteContent } from './schema'

export const pages = parseSiteContent(source)
