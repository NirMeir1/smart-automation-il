import { operator } from './brand'

export const publicContact = {
  phone: '052-251-8189',
  telephone: '+972-52-251-8189',
  telHref: 'tel:+972522518189',
  whatsappHref: `https://wa.me/972522518189?text=${encodeURIComponent('שלום, הגעתי מהאתר של Posiblo ואשמח לשוחח.')}`,
  email: operator.email,
} as const
