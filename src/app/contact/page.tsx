import { CopyPage } from '@/components/copy-page'
import { pageMetadata } from '@/lib/site'
import { ContactMethods } from '@/components/contact-methods'
import { ContactForm } from '@/components/contact-form'
import { contactAvailable } from '@/lib/contact-config'
export const dynamic = 'force-dynamic'
export const metadata = pageMetadata('contact')

function NextSteps() {
  return <ol className="contact-steps" aria-label="מה קורה אחרי השליחה">
    <li><span className="step-dot" aria-hidden="true">1</span>ממלאים את הטופס</li>
    <li><span className="step-dot" aria-hidden="true">2</span>אני חוזר אליכם לתיאום</li>
    <li><span className="step-dot" aria-hidden="true">3</span>נפגשים — אונליין או פנים אל פנים</li>
  </ol>
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ intent?: string }> }) {
  const { intent = '' } = await searchParams
  const initialIntent = ['business', 'idea', 'problem'].includes(intent) ? intent : ''
  return <CopyPage pageKey="contact"
    heroAfter={<NextSteps />}
    heroAside={<div className="hero-form"><ContactForm enabled={contactAvailable()} initialIntent={initialIntent} /></div>}
    heroBottom={<ContactMethods />} />
}
