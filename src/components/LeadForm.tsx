// src/components/LeadForm.tsx
'use client'

import { useState, FormEvent } from 'react'

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    consent: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        window.location.href = '/thanks'
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="שם מלא*"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-3 border rounded-lg w-full"
        />
        
        <input
          type="text"
          placeholder="שם חברה*"
          required
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="px-4 py-3 border rounded-lg w-full"
        />
        
        <input
          type="tel"
          placeholder="נייד*"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="px-4 py-3 border rounded-lg w-full"
        />
        
        <input
          type="email"
          placeholder="מייל*"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-3 border rounded-lg w-full"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="yellow-button w-full"
        >
          אשמח לשמוע פרטים!
        </button>
      </div>
      
      <label className="flex items-center gap-2 mt-4 text-sm">
        <input
          type="checkbox"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
        />
        <span>אשמח לקבל דיוור ומידע בעולמות האוטומציה</span>
      </label>
    </form>
  )
}