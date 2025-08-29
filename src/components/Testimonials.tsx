// src/components/Testimonials.tsx
export default function Testimonials() {
  const testimonials = [
    {
      text: 'מערכת סוגומטיק נכנסה לארגון וחוללה מהפך דיגיטלית...',
      name: 'יוסי כהן',
      company: 'מנכ"ל חברת הייטק',
    },
    {
      text: 'הופתענו מהקלות, הפשטות והמהירות בהקמת תהליכים...',
      name: 'מירי לוי',
      company: 'סמנכ"ל תפעול',
    },
  ]

  return (
    <section id="seventhFloor" className="py-20 bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">לקוחות מספרים עלינו</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg mb-6 italic text-gray-800">"{item.text}"</p>
              <div>
                <div className="font-bold text-gray-900">{item.name}</div>
                <div className="text-gray-600">{item.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
