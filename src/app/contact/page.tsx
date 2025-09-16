'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { leadStorage, logEvent } from '@/lib/storage'
import type { Lead } from '@/lib/types'
import { generateId } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
  contactType: string
}

const contactTypes = [
  { value: 'general', label: 'פנייה כללית' },
  { value: 'consultation', label: 'שיחת ייעוץ' },
  { value: 'quote', label: 'בקשת הצעת מחיר' },
  { value: 'support', label: 'תמיכה טכנית' }
]

const contactInfo = [
  { icon: Phone, label: 'טלפון', value: '052-2518189', href: 'tel:+972522518189' },
  { icon: Mail, label: 'אימייל', value: 'info@smart-automation.co.il', href: 'mailto:info@smart-automation.co.il' },
  { icon: MapPin, label: 'מיקום', value: 'כפר סבא, ישראל', href: null },
  { icon: Clock, label: 'שעות פעילות', value: 'א׳-ה׳ 9:00-18:00', href: null }
]

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  )
}

function ContactPageContent() {
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    contactType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const type = searchParams.get('type')
    const plan = searchParams.get('plan')

    if (type) setFormData(prev => ({ ...prev, contactType: type }))
    if (plan) {
      const decoded = decodeURIComponent(plan)
      setFormData(prev => ({
        ...prev,
        subject: `בקשת הצעת מחיר עבור חבילת ${decoded}`,
        message: `היי, אני מעוניין/ת לקבל הצעת מחיר עבור חבילת ${decoded}. נא ליצור איתי קשר.`
      }))
    }
  }, [searchParams])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'שם מלא הוא שדה חובה'
    if (!formData.email.trim()) newErrors.email = 'אימייל הוא שדה חובה'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'כתובת אימייל לא תקינה'
    if (!formData.message.trim()) newErrors.message = 'הודעה היא שדה חובה'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const followUpDate = addDays(new Date(), 1)
      const newLead: Lead = {
        id: generateId(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: 'טופס יצירת קשר',
        message: `${formData.subject ? `נושא: ${formData.subject}\n` : ''}${formData.message}${
          formData.company ? `\nחברה: ${formData.company}` : ''
        }`,
        status: 'new',
        createdAt: new Date(),
        followUpDate
      }

      leadStorage.add(newLead)
      logEvent('form_submit', {
        form: 'contact',
        contactType: formData.contactType,
        leadId: newLead.id
      })

      setShowSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        contactType: 'general'
      })
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange =
    (field: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">צור קשר</h1>
          <p className="text-xl text-gray-600 leading-relaxed">נשמח לשמוע מכם ולעזור לכם למצוא את הפתרון המתאים לעסק שלכם</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Right column (contact details) — fixed contrast on dark card */}
            <div className="rounded-2xl bg-[var(--navy)] text-white p-8">
              <h2 className="text-2xl font-bold mb-6">פרטי יצירת קשר</h2>

              <div className="space-y-6">
                {contactInfo.map((item, idx) => (
                  <div key={idx} className="flex flex-row-reverse items-start gap-4">
                    <div className="p-3 rounded-lg bg-white/10">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold mb-1">{item.label}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white/80 underline-offset-2 hover:underline focus:underline transition"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white/80">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-lg bg-green-600/10 ring-1 ring-green-500/30">
                <h3 className="font-semibold text-green-200 mb-3">למה לפנות אלינו?</h3>
                <ul className="space-y-2 text-green-100">
                  <li>• ייעוץ ללא עלות</li>
                  <li>• מענה תוך 24 שעות</li>
                  <li>• פתרון מותאם אישית</li>
                  <li>• ליווי מקצועי לאורך כל הדרך</li>
                </ul>
              </div>
            </div>

            {/* Left column (form) */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">שלחו לנו הודעה</h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleChange('name')}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-500',
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      )}
                      placeholder="הזן את שמך המלא"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">אימייל *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-500',
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      )}
                      placeholder="example@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                      placeholder="050-1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">חברה</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={handleChange('company')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                      placeholder="שם החברה (רשות)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סוג הפנייה</label>
                  <select
                    value={formData.contactType}
                    onChange={handleChange('contactType')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                  >
                    {contactTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">נושא</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                    placeholder="נושא ההודעה (רשות)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעה *</label>
                  <textarea
                    value={formData.message}
                    onChange={handleChange('message')}
                    rows={6}
                    className={cn(
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder:text-gray-500',
                      errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    )}
                    placeholder="ספר לנו על הצרכים שלך ואיך נוכל לעזור..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors',
                    isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">תודה על פנייתך!</h3>
            <p className="text-gray-600 mb-6">קיבלנו את הודעתך ונחזור אליך תוך 24 שעות.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              📧 תגובה אוטומטית נשלחה לאימייל
              <br />
              📅 תזכורת למעקב נוספה למערכת
            </div>
          </div>
        </div>
      )}
    </div>
  )
}