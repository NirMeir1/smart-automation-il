// src/components/Process.tsx
export default function Process() {
  const steps = [
    { number: '01', title: 'אבחון', description: 'ניתוח מעמיק של התהליכים הקיימים' },
    { number: '02', title: 'אפיון', description: 'תכנון פתרונות מותאמים אישית' },
    { number: '03', title: 'אינטגרציה', description: 'יישום והטמעה מלאה' },
    { number: '04', title: 'מדידה ושיפור', description: 'מעקב שוטף ואופטימיזציה' },
  ]

  return (
    <section className="py-20 bg-gray-50 text-navy dark:text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">איך זה עובד?</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-bold text-pink mb-4">{step.number}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
