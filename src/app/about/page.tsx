import { CopyPage } from '@/components/copy-page'
import { pageMetadata } from '@/lib/site'
import { FounderPortrait } from './founder-portrait'
import styles from './about.module.css'
export const metadata = pageMetadata('about')
export default function AboutPage() {
  return <article dir="rtl" className={styles.about}><CopyPage pageKey="about" heroAside={<FounderPortrait />} /></article>
}
