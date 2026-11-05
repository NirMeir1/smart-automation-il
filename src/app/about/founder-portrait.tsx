import Image from 'next/image'
import { founderProfile } from '@/content/about-profile'
import styles from './about.module.css'

export function FounderPortrait() {
  const { name, photo, linkedInUrl } = founderProfile
  if (!photo && !linkedInUrl) return null
  return <div className={styles.profile}>
    {photo && <figure className={styles.figure}>
      <div className={styles.portrait}>
        <Image src={photo.src} width={photo.width} height={photo.height} alt={`${name}, מייסד הסטודיו`} sizes="(max-width: 900px) 90vw, 320px" />
      </div>
      <figcaption className={styles.caption}>{name}</figcaption>
    </figure>}
    {linkedInUrl && <a href={linkedInUrl} className={styles.profileLink} rel="noopener noreferrer">לפרופיל המקצועי שלי בלינקדאין</a>}
  </div>
}
