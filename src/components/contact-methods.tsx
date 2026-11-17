import { publicContact } from '@/lib/contact-public'

export function ContactLinks({ includeEmail = true }: { includeEmail?: boolean }) {
  return <div className="direct-contact-links">
    <a href={publicContact.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="שליחת הודעה בוואטסאפ">וואטסאפ</a>
    <a href={publicContact.telHref} aria-label={`שיחת טלפון למספר ${publicContact.phone}`}><bdi dir="ltr">{publicContact.phone}</bdi></a>
    {includeEmail && <a href={`mailto:${publicContact.email}`} aria-label={`שליחת אימייל לכתובת ${publicContact.email}`}><bdi dir="ltr">{publicContact.email}</bdi></a>}
  </div>
}

export function ContactMethods() {
  return <section className="direct-contact site-container" aria-labelledby="direct-contact-heading">
    <h2 id="direct-contact-heading">אפשר גם ליצור קשר ישירות</h2>
    <ContactLinks />
    <p>אני עונה לכל פנייה בתוך יום עסקים אחד.</p>
  </section>
}
