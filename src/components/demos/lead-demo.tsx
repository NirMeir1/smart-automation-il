'use client'

import { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns'
import { he } from 'date-fns/locale'
import { MessageSquare, User, Phone, Mail, Send, Eye, Calendar, Trash2 } from 'lucide-react'
import { Lead } from '@/lib/types'
import { leadStorage, logEvent } from '@/lib/storage'
import { formatDate, generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface LeadFormData {
  name: string
  phone: string
  email: string
  source: string
  message: string
}

const leadSources = [
  'גוגל',
  'פייסבוק', 
  'המלצה',
  'אתר',
  'אחר'
]

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  new: 'חדש',
  contacted: 'נוצר קשר',
  qualified: 'מתעניין',
  converted: 'הומר',
  closed: 'סגור'
}

export function LeadDemo() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    source: 'גוגל',
    message: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationData, setConfirmationData] = useState<Lead | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLeads(leadStorage.get())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.message) return

    setIsSubmitting(true)

    try {
      const followUpDate = addDays(new Date(), 3)
      
      const newLead: Lead = {
        id: generateId(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        message: formData.message,
        status: 'new',
        createdAt: new Date(),
        followUpDate
      }

      leadStorage.add(newLead)

      logEvent('demo_interaction', {
        demo: 'lead_capture',
        action: 'submit_lead',
        source: formData.source
      })

      logEvent('form_submit', {
        form: 'lead_capture',
        leadId: newLead.id
      })

      setConfirmationData(newLead)
      setShowConfirmation(true)
      loadData()
      setFormData({
        name: '',
        phone: '',
        email: '',
        source: 'גוגל',
        message: ''
      })
      
      setTimeout(() => {
        setIsSubmitting(false)
        setShowConfirmation(false)
        setConfirmationData(null)
      }, 4000)
    } catch (error) {
      console.error('Error adding lead:', error)
      setIsSubmitting(false)
    }
  }

  const handlePreviewAutoReply = () => {
    setShowPreview(true)
    logEvent('reminder_preview', { demo: 'lead_capture' })
    setTimeout(() => setShowPreview(false), 3000)
  }

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    leadStorage.update(leadId, lead => ({
      ...lead,
      status: newStatus,
      lastContact: newStatus === 'contacted' ? new Date() : lead.lastContact
    }))
    loadData()
    logEvent('demo_interaction', {
      demo: 'lead_capture', 
      action: 'status_change',
      leadId,
      newStatus
    })
  }

  const handleDelete = (leadId: string) => {
    leadStorage.delete(leadId)
    loadData()
    logEvent('demo_interaction', { demo: 'lead_capture', action: 'delete_lead' })
  }

  const sortedLeads = leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <MessageSquare className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">לכידת לידים ומעקב אוטומטי</h2>
          <p className="text-gray-600">טופס יצירת קשר חכם עם מעקב ותגובות אוטומטיות</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">צור קשר</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם מלא *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="הזן את שמך המלא"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טלפון
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="example@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                איך הגעת אלינו?
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {leadSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הודעה *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ספר לנו על הצרכים שלך..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-colors",
                isSubmitting 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-purple-600 text-white hover:bg-purple-700"
              )}
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'שולח...' : 'שלח פנייה'}
            </button>
          </form>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">מה קורה אחר כך?</h4>
            <ul className="space-y-2 text-sm text-purple-700">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                תגובה אוטומטית מיידית
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                תזכורת למעקב תוך 3 ימים
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                מעקב אישי עד למכירה
              </li>
            </ul>
            <button
              onClick={handlePreviewAutoReply}
              className="mt-3 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              תגובה אוטומטית (דמו)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">לידים אחרונים</h3>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {sortedLeads.slice(0, 10).map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{lead.name}</span>
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        statusColors[lead.status]
                      )}>
                        {statusLabels[lead.status]}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      )}
                      <div className="text-xs">מקור: {lead.source}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{lead.message}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>נוצר: {formatDate(lead.createdAt)}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    מעקב: {formatDate(lead.followUpDate)}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                    className="text-xs border rounded px-2 py-1 bg-white"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showConfirmation && confirmationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">תודה על פנייתך!</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-right mb-4">
              <div className="text-sm">
                <strong>שם:</strong> {confirmationData.name}
              </div>
              <div className="text-sm">
                <strong>מעקב מתוזמן:</strong> {formatDate(confirmationData.followUpDate)}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
              📧 תגובה אוטומטית נשלחה (דמו)
              <br />
              📅 תזכורת למעקב נוספה (דמו)
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-3">תגובה אוטומטית (דמו)</h3>
            <div className="bg-blue-50 border-r-4 border-blue-500 p-4 text-right">
              <p className="font-medium">שלום וברכה! 👋</p>
              <p className="mt-2">
                תודה על פנייתך! קיבלנו את הודעתך ונחזור אליך תוך 24 שעות.
              </p>
              <p className="mt-2">
                בינתיים, מוזמן לעיין בדוגמאות העבודות שלנו באתר.
              </p>
              <p className="mt-2 font-medium">
                מצפים לעבוד איתך! ✨
              </p>
              <p className="text-sm text-gray-600 mt-3">🤖 הודעה אוטומטית מאוטומציה חכמה</p>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">תגובה נשלחה (דמו) ✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}