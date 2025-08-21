'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { he } from 'date-fns/locale'
import { Plus, FileText, Calendar, Eye, Trash2 } from 'lucide-react'
import { Invoice, Expense, VATSummary } from '@/lib/types'
import { invoiceStorage, expenseStorage, logEvent } from '@/lib/storage'
import { calculateVAT, formatCurrency, formatDate, getMonthVATDueDate, generateId } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TaxFormData {
  amount: string
  isVATIncluded: boolean
  note: string
  type: 'income' | 'expense'
}

export function TaxDemo() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [formData, setFormData] = useState<TaxFormData>({
    amount: '',
    isVATIncluded: true,
    note: '',
    type: 'income'
  })
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setInvoices(invoiceStorage.get())
    setExpenses(expenseStorage.get())
  }

  const calculateVATSummary = (): VATSummary => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const monthlyInvoices = invoices.filter(inv => 
      inv.date >= monthStart && inv.date <= monthEnd && inv.type === 'income'
    )
    const monthlyExpenses = expenses.filter(exp => 
      exp.date >= monthStart && exp.date <= monthEnd
    )

    let totalIncomeVAT = 0
    let totalExpenseVAT = 0

    monthlyInvoices.forEach(invoice => {
      const { vat } = calculateVAT(invoice.amount, invoice.isVATIncluded)
      totalIncomeVAT += vat
    })

    monthlyExpenses.forEach(expense => {
      const { vat } = calculateVAT(expense.amount, expense.isVATIncluded)
      totalExpenseVAT += vat
    })

    return {
      totalIncome: monthlyInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalExpenses: monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      netVAT: totalIncomeVAT - totalExpenseVAT,
      dueDate: getMonthVATDueDate(now)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.note) return

    setIsSubmitting(true)

    try {
      const amount = parseFloat(formData.amount)
      const newEntry = {
        id: generateId(),
        amount,
        isVATIncluded: formData.isVATIncluded,
        date: new Date(),
        note: formData.note
      }

      if (formData.type === 'income') {
        const invoice: Invoice = { ...newEntry, type: 'income' }
        invoiceStorage.add(invoice)
      } else {
        const expense: Expense = { ...newEntry, category: 'general' }
        expenseStorage.add(expense)
      }

      logEvent('demo_interaction', {
        demo: 'tax_assistant',
        action: 'add_entry',
        type: formData.type,
        amount
      })

      loadData()
      setFormData({ amount: '', isVATIncluded: true, note: '', type: 'income' })
      
      setTimeout(() => setIsSubmitting(false), 500)
    } catch (error) {
      console.error('Error adding entry:', error)
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: string, type: 'invoice' | 'expense') => {
    if (type === 'invoice') {
      invoiceStorage.delete(id)
    } else {
      expenseStorage.delete(id)
    }
    loadData()
    logEvent('demo_interaction', { demo: 'tax_assistant', action: 'delete_entry' })
  }

  const handlePreviewReminder = () => {
    setShowPreview(true)
    logEvent('reminder_preview', { demo: 'tax_assistant' })
    setTimeout(() => setShowPreview(false), 3000)
  }

  const vatSummary = calculateVATSummary()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">עוזר מס ערך מוסף חכם</h2>
          <p className="text-gray-600">ניהול חשבוניות והוצאות עם חישוב מע״ם אוטומטי</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>הכנסה</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>הוצאה</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סכום
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVATIncluded}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVATIncluded: e.target.checked }))}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>כולל מע״ם</span>
              </label>
            </div>

            {formData.amount && (
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                {(() => {
                  const { net, vat, gross } = calculateVAT(parseFloat(formData.amount) || 0, formData.isVATIncluded)
                  return (
                    <div className="space-y-1">
                      <div>סכום נטו: {formatCurrency(net)}</div>
                      <div>מע״ם: {formatCurrency(vat)}</div>
                      <div className="font-semibold">סה״כ: {formatCurrency(gross)}</div>
                    </div>
                  )
                })()}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הערה
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="תיאור קצר..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
                isSubmitting 
                  ? "bg-gray-400 text-white cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <Plus className="w-4 h-4" />
              {isSubmitting ? 'מוסיף...' : 'הוסף רשומה'}
            </button>
          </form>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">סיכום מע״ם החודש</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>סה״כ הכנסות:</span>
                <span className="font-medium">{formatCurrency(vatSummary.totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>סה״כ הוצאות:</span>
                <span className="font-medium">{formatCurrency(vatSummary.totalExpenses)}</span>
              </div>
              <div className="border-t border-green-200 pt-2">
                <div className="flex justify-between text-base font-semibold">
                  <span>מע״ם לתשלום:</span>
                  <span className={cn(
                    vatSummary.netVAT > 0 ? 'text-red-600' : 'text-green-600'
                  )}>
                    {formatCurrency(Math.abs(vatSummary.netVAT))}
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  תאריך לתשלום: {formatDate(vatSummary.dueDate)}
                </div>
              </div>
            </div>
            <button
              onClick={handlePreviewReminder}
              className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              תזכורת לתשלום (דמו)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">רשומות החודש הנוכחי</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {[...invoices.filter(inv => inv.type === 'income'), ...expenses]
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 10)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        'type' in item && item.type === 'income'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}>
                        {'type' in item && item.type === 'income' ? 'הכנסה' : 'הוצאה'}
                      </span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="text-sm text-gray-600 truncate">{item.note}</div>
                    <div className="text-xs text-gray-500">{formatDate(item.date)}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, 'type' in item ? 'invoice' : 'expense')}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-3">תזכורת WhatsApp (דמו)</h3>
            <div className="bg-green-50 border-r-4 border-green-500 p-4 text-right">
              <p className="font-medium">שלום! 👋</p>
              <p className="mt-2">
                זו תזכורת ידידותית שתשלום מע״ם בסך {formatCurrency(Math.abs(vatSummary.netVAT))} 
                {' '}מתאחר ב-{formatDate(vatSummary.dueDate)}.
              </p>
              <p className="mt-2">האם תרצה שאכין עבורך את הטופס לתשלום?</p>
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