import { CopyPage } from '@/components/copy-page'
import { pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('about')
export default function AboutPage() { return <CopyPage pageKey="about" /> }
