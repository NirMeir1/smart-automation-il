import { CopyPage } from '@/components/copy-page'
import { pageMetadata } from '@/lib/site'
import { ContactForm } from '@/components/contact-form'
import { contactAvailable } from '@/lib/contact-config'
export const dynamic = 'force-dynamic'
export const metadata = pageMetadata('contact')
export default function ContactPage() { return <CopyPage pageKey="contact"><ContactForm enabled={contactAvailable()} /></CopyPage> }
