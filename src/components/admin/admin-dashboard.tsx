'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  RefreshCcw, 
  Trash2, 
  Eye, 
  AlertTriangle,
  LogOut,
  BarChart3,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { 
  invoiceStorage, 
  expenseStorage, 
  slotStorage, 
  bookingStorage, 
  leadStorage, 
  eventLogStorage,
  resetAllData 
} from '@/lib/storage'
import { removeAuthToken } from '@/lib/auth'
import { EventLog } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [events, setEvents] = useState<EventLog[]>([])
  const [stats, setStats] = useState({
    invoices: 0,
    expenses: 0,
    slots: 0,
    bookings: 0,
    leads: 0,
    events: 0
  })
  const [isResetting, setIsResetting] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'data' | 'events'>('overview')

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    const invoices = invoiceStorage.get()
    const expenses = expenseStorage.get()
    const slots = slotStorage.get()
    const bookings = bookingStorage.get()
    const leads = leadStorage.get()
    const eventList = eventLogStorage.get()

    setStats({
      invoices: invoices.length,
      expenses: expenses.length,
      slots: slots.length,
      bookings: bookings.length,
      leads: leads.length,
      events: eventList.length
    })

    setEvents(eventList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50))
  }

  const handleReset = async () => {
    setIsResetting(true)
    try {
      resetAllData()
      loadData()
      setShowConfirmReset(false)
    } catch (error) {
      console.error('Error resetting data:', error)
    } finally {
      setIsResetting(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    onLogout()
  }

  const clearAllData = () => {
    invoiceStorage.clear()
    expenseStorage.clear()
    slotStorage.clear()
    bookingStorage.clear()
    leadStorage.clear()
    eventLogStorage.clear()
    loadData()
  }

  const eventTypeColors = {
    page_view: 'bg-blue-100 text-blue-800',
    demo_interaction: 'bg-green-100 text-green-800',
    form_submit: 'bg-purple-100 text-purple-800',
    reminder_preview: 'bg-yellow-100 text-yellow-800',
    admin_reset: 'bg-red-100 text-red-800'
  }

  const eventTypeLabels = {
    page_view: 'צפייה בדף',
    demo_interaction: 'פעולה בדמו',
    form_submit: 'שליחת טופס',
    reminder_preview: 'תצוגת תזכורת',
    admin_reset: 'איפוס מנהל'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">פאנל ניהול</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              התנתק
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { key: 'overview', label: 'סקירה', icon: BarChart3 },
            { key: 'data', label: 'ניהול נתונים', icon: Database },
            { key: 'events', label: 'יומן אירועים', icon: Eye }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center",
                selectedTab === key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {selectedTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">הכנסות/הוצאות</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.invoices + stats.expenses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">פגישות</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.bookings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">לידים</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.leads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">אירועים</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.events}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">אירועים אחרונים</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {events.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        eventTypeColors[event.type]
                      )}>
                        {eventTypeLabels[event.type]}
                      </span>
                      <span className="text-sm font-medium">{event.details.demo || event.details.path || 'כללי'}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(event.timestamp)} {event.timestamp.toLocaleTimeString('he-IL')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ניהול נתוני דמו</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">סטטיסטיקות נוכחיות:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>חשבוניות:</span>
                      <span className="font-medium">{stats.invoices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>הוצאות:</span>
                      <span className="font-medium">{stats.expenses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>זמנים זמינים:</span>
                      <span className="font-medium">{stats.slots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>פגישות מקובעות:</span>
                      <span className="font-medium">{stats.bookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>לידים:</span>
                      <span className="font-medium">{stats.leads}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">פעולות ניהול:</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowConfirmReset(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      איפוס לנתונים בסיסיים
                    </button>
                    
                    <button
                      onClick={clearAllData}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      מחיקת כל הנתונים
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">הערה חשובה</h4>
                    <p className="text-sm text-yellow-700">
                      פעולות אלו ישפיעו על כל הדמואים באתר. איפוס יחזיר נתוני דמו בסיסיים, 
                      מחיקה תמחק הכל לגמרי.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'events' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">יומן אירועים מפורט</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      eventTypeColors[event.type]
                    )}>
                      {eventTypeLabels[event.type]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(event.timestamp)} {event.timestamp.toLocaleTimeString('he-IL')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <pre className="whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded text-xs">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showConfirmReset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-3">אישור איפוס נתונים</h3>
            <p className="text-gray-600 mb-6">
              פעולה זו תמחק את כל הנתונים הנוכחיים ותחזיר נתוני דמו בסיסיים. האם אתה בטוח?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md font-medium transition-colors",
                  isResetting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                )}
              >
                {isResetting ? 'מאפס...' : 'כן, אפס נתונים'}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}