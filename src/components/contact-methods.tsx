import { publicContact } from '@/lib/contact-public'
import { ContactIcon } from './contact-icon'

export function ContactLinks({ includeEmail = true }: { includeEmail?: boolean }) {
  return <div className="direct-contact-links">
    <a href={publicContact.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="שליחת הודעה בוואטסאפ" data-analytics-whatsapp><ContactIcon channel="whatsapp" /><span>וואטסאפ</span></a>
    <a href={publicContact.telHref} aria-label={`שיחת טלפון למספר ${publicContact.phone}`}><ContactIcon channel="phone" /><bdi dir="ltr">{publicContact.phone}</bdi></a>
    {includeEmail && <a href={`mailto:${publicContact.email}`} aria-label={`שליחת אימייל לכתובת ${publicContact.email}`}><ContactIcon channel="email" /><bdi dir="ltr">{publicContact.email}</bdi></a>}
  </div>
}

export function ContactMethods() {
  return <section className="direct-contact site-container" aria-labelledby="direct-contact-heading">
    <h2 id="direct-contact-heading">אפשר גם ליצור קשר ישירות</h2>
    <ContactLinks />
    <p>אני עונה לכל פנייה בתוך יום עסקים אחד.</p>
  </section>
}
