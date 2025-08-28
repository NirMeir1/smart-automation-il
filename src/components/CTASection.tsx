// src/components/CTASection.tsx
interface Props {
  title: string
  description: string
  ctaText: string
  gradient?: boolean
}

export default function CTASection({ title, description, ctaText, gradient }: Props) {
  return (
    <section className={`py-20 ${gradient ? 'gradient-primary text-white' : 'bg-blue-50'}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
        <button className="yellow-button">{ctaText}</button>
      </div>
    </section>
  )
}