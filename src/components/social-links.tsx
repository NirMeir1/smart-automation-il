const profiles = [
  { name: 'Facebook', href: 'https://www.facebook.com/posiblo/' },
  { name: 'Instagram', href: 'https://www.instagram.com/posiblo.il/' },
] as const

export function SocialLinks({ showLabel = false }: { showLabel?: boolean }) {
  return <div className="social-links" role="group" aria-label="עקבו אחריי">
    {showLabel && <span aria-hidden="true">עקבו אחריי</span>}
    {profiles.map(({ name, href }) =>
      <a key={name} href={href} aria-label={name}>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {name === 'Facebook'
            ? <path fill="currentColor" d="M14 22v-9h3l.5-3H14V8c0-.9.3-1.5 1.6-1.5h2V3.8c-.3-.1-1.4-.3-2.7-.3C12.2 3.5 10.4 5.1 10.4 8v2H7.5v3h2.9v9z" />
            : <>
              <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </>}
        </svg>
      </a>
    )}
  </div>
}
