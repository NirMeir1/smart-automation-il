import { CopyPage } from '@/components/copy-page'
import { pageMetadata } from '@/lib/site'
import { ContactForm } from '@/components/contact-form'
import { contactAvailable } from '@/lib/contact-config'
export const dynamic = 'force-dynamic'
export const metadata = pageMetadata('contact')
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ intent?: string }> }) {
  const { intent = '' } = await searchParams
  const initialIntent = ['business', 'idea', 'problem'].includes(intent) ? intent : ''
  return <CopyPage pageKey="contact"><ContactForm enabled={contactAvailable()} initialIntent={initialIntent} /></CopyPage>
}
