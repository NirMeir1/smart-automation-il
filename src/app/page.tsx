import { CopyPage } from '@/components/copy-page'
import { pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('home')
export default function HomePage() { return <CopyPage pageKey="home" /> }
