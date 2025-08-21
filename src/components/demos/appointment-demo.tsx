'use client'

import { useState, useEffect } from 'react'
import { format, addDays, isSameDay } from 'date-fns'
import { he } from 'date-fns/locale'
import { Calendar, Clock, User, Phone, Mail, Eye, CheckCircle } from 'lucide-react'
import { TimeSlot, Booking } from '@/lib/types'
import { slotStorage, bookingStorage, logEvent } from '@/lib/storage'
import { formatDate, generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BookingFormData {
  clientName: string
  clientPhone: string
  clientEmail: string
}

export function AppointmentDemo() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setSlots(slotStorage.get())
    setBookings(bookingStorage.get())
  }

  const getNext7Days = () => {
    const days = []
    for (let i = 1; i <= 7; i++) {
      days.push(addDays(new Date(), i))
    }
    return days
  }

  const getAvailableSlots = (date: Date) => {
    return slots.filter(slot => 
      isSameDay(slot.date, date) && !slot.isBooked
    ).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const handleSlotSelection = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    logEvent('demo_interaction', {
      demo: 'appointment_scheduler',
      action: 'select_slot',
      slot: slot.id
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !formData.clientName) return

    setIsSubmitting(true)

    try {
      const booking: Booking = {
        id: generateId(),
        slotId: selectedSlot.id,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        status: 'confirmed',
        createdAt: new Date(),
        reminderSent: false
      }

      bookingStorage.add(booking)
      slotStorage.update(selectedSlot.id, slot => ({
        ...slot,
        isBooked: true,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail
      }))

      logEvent('demo_interaction', {
        demo: 'appointment_scheduler',
        action: 'book_appointment',
        slot: selectedSlot.id
      })

      setShowConfirmation(true)
      loadData()
      setSelectedSlot(null)
      setFormData({ clientName: '', clientPhone: '', clientEmail: '' })
      
      setTimeout(() => {
        setIsSubmitting(false)
        setShowConfirmation(false)
      }, 3000)
    } catch (error) {
      console.error('Error booking appointment:', error)
      setIsSubmitting(false)
    }
  }

  const handlePreviewReminder = () => {
    setShowPreview(true)
    logEvent('reminder_preview', { demo: 'appointment_scheduler' })
    setTimeout(() => setShowPreview(false), 3000)
  }

  const days = getNext7Days()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <Calendar className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">מתזמן פגישות חכם</h2>
          <p className="text-gray-600">קיבוע פגישות אוטומטי עם תזכורות ללקוחות</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">זמינות השבוע הקרוב</h3>
            <div className="space-y-4">
              {days.map((day) => {
                const availableSlots = getAvailableSlots(day)
                const dayName = format(day, 'EEEE', { locale: he })
                const dayDate = format(day, 'dd/MM', { locale: he })
                
                return (
                  <div key={day.toISOString()} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-800">{dayName} {dayDate}</span>
                    </div>
                    
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotSelection(slot)}
                            className={cn(
                              "p-2 text-sm rounded-md border transition-colors",
                              selectedSlot?.id === slot.id
                                ? "bg-green-100 border-green-500 text-green-700"
                                : "bg-gray-50 border-gray-200 hover:bg-green-50 hover:border-green-300"
                            )}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {slot.startTime} - {slot.endTime}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">אין זמינות להיום</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {selectedSlot && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">נבחר זמן פגישה</h4>
              <div className="text-sm text-blue-700">
                {format(selectedSlot.date, 'EEEE dd/MM/yyyy', { locale: he })} בשעה {selectedSlot.startTime}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {selectedSlot ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">פרטים לקיבוע הפגישה</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם מלא *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="הזן את שמך המלא"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טלפון
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="example@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-colors",
                  isSubmitting 
                    ? "bg-gray-400 text-white cursor-not-allowed" 
                    : "bg-green-600 text-white hover:bg-green-700"
                )}
              >
                <CheckCircle className="w-5 h-5" />
                {isSubmitting ? 'מקבע פגישה...' : 'קבע פגישה'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">בחר זמן פגישה</h3>
              <p className="text-gray-600">בחר זמן זמין מהרשימה משמאל כדי להמשיך</p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">פגישות שנקבעו (דמו)</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {slots.filter(slot => slot.isBooked).slice(-5).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{slot.clientName}</div>
                    <div className="text-xs text-gray-500">
                      {format(slot.date, 'dd/MM')} | {slot.startTime}
                    </div>
                  </div>
                  <button
                    onClick={handlePreviewReminder}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="תזכורת"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">פגישה נקבעה בהצלחה!</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-right mb-4">
              <div className="text-sm">
                <strong>שם:</strong> {formData.clientName}
              </div>
              <div className="text-sm">
                <strong>תאריך:</strong> {selectedSlot && format(selectedSlot.date, 'dd/MM/yyyy')}
              </div>
              <div className="text-sm">
                <strong>שעה:</strong> {selectedSlot?.startTime}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              📅 נוסף ליומן (דמו)
              <br />
              📲 תזכורת נשלחה (דמו)
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-3">תזכורת WhatsApp (דמו)</h3>
            <div className="bg-green-50 border-r-4 border-green-500 p-4 text-right">
              <p className="font-medium">שלום! 👋</p>
              <p className="mt-2">
                זו תזכורת לפגישה שלנו מחר ב-10:00.
              </p>
              <p className="mt-2">
                האם הזמן עדיין מתאים לך? במידה ויש צורך בשינוי, נא הודע לי.
              </p>
              <p className="text-sm text-gray-600 mt-3">🤖 הודעה אוטומטית מאוטומציה חכמה</p>
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">הודעה נשלחה (דמו) ✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}