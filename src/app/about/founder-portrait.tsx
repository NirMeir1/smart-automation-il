import Image from 'next/image'
import { founderProfile } from '@/content/about-profile'
import styles from './about.module.css'

export function FounderPortrait() {
  const { name, photo, linkedInUrl } = founderProfile
  return <div className={styles.profile}>
    <figure className={styles.figure}>
      <div className={styles.portrait}>
        {photo
          ? <Image src={photo.src} width={photo.width} height={photo.height} alt={`${name}, מייסד הסטודיו`} sizes="(max-width: 900px) 90vw, 320px" />
          : <p className={styles.placeholder}>כאן תופיע תמונה מקצועית של {name}</p>}
      </div>
      <figcaption className={styles.caption}>{name}</figcaption>
    </figure>
    {linkedInUrl
      ? <a href={linkedInUrl} className={styles.profileLink} rel="noopener noreferrer">לפרופיל המקצועי שלי בלינקדאין</a>
      : <p className={styles.pendingLink}>קישור לפרופיל המקצועי בלינקדאין יתווסף בהמשך.</p>}
  </div>
}
