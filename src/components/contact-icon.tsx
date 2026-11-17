type ContactChannel = 'phone' | 'whatsapp' | 'email'

// Local vector symbols stay sharp and consistent across browsers and platforms.
// Visible link text supplies the accessible name; these symbols are decorative.
export function ContactIcon({ channel }: { channel: ContactChannel }) {
  return <svg className="contact-icon" data-contact-icon={channel} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {channel === 'email' ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> : channel === 'phone' ? <path d="m7 3 3 5-2.5 2a15 15 0 0 0 6.5 6.5l2-2.5 5 3-.5 3a2 2 0 0 1-2 1C10 20 4 14 3 5.5a2 2 0 0 1 1-2Z" /> : <>
      <path d="M20.5 11.7a8.6 8.6 0 0 1-12.8 7.5L3 20.5l1.3-4.6a8.6 8.6 0 1 1 16.2-4.2Z" />
      <path d="m9 7 1.5 3-1.2 1a8 8 0 0 0 3.7 3.7l1-1.2 3 1.5-.5 1.5c-4 1.5-10-4.5-8.5-8.5Z" />
    </>}
  </svg>
}
