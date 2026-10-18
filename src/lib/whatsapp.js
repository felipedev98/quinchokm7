import { WHATSAPP_NUMBER } from '../config.js'
import { formatLongDate } from './dates.js'

export const EVENT_TYPES = ['Fin de año', 'Aniversario', 'Despedida', 'Reunión o capacitación', 'Otro']

export const DIRECT_MESSAGE = 'Hola, quiero cotizar un evento en QuinchoKM7.'

const EVENT_PHRASES = {
  'Fin de año': 'una fiesta de fin de año',
  Aniversario: 'un aniversario',
  Despedida: 'una despedida',
  'Reunión o capacitación': 'una reunión o capacitación',
  Otro: 'un evento',
}

function toInt(value) {
  if (value === '' || value === null || value === undefined) return NaN
  const n = Number(value)
  return Number.isInteger(n) ? n : NaN
}

function inRange(value, min, max) {
  const n = toInt(value)
  return n >= min && n <= max
}

function plural(n, singular, pluralForm) {
  return `${n} ${n === 1 ? singular : pluralForm}`
}

function greeting(nombre, lugar) {
  if (nombre && lugar) return `Hola, soy ${nombre} (${lugar}).`
  if (nombre) return `Hola, soy ${nombre}.`
  if (lugar) return `Hola (${lugar}).`
  return 'Hola.'
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// Fecha local de hoy en formato 'YYYY-MM-DD' (en-CA usa ese formato).
export function todayIso() {
  return new Date().toLocaleDateString('en-CA')
}

export function validateQuote(quote, { today = todayIso() } = {}) {
  const errors = {}
  if (!EVENT_TYPES.includes(quote.tipo)) errors.tipo = 'Elige el tipo de evento.'
  if (!inRange(quote.personas, 1, 35)) errors.personas = 'Indica entre 1 y 35 personas.'
  if (!ISO_DATE.test(quote.fecha ?? '')) errors.fecha = 'Elige la fecha del evento.'
  else if (quote.fecha < today) errors.fecha = 'Elige una fecha desde hoy en adelante.'
  if (!(quote.nombre ?? '').trim()) errors.nombre = 'Escribe tu nombre.'
  if (quote.documento !== 'boleta' && quote.documento !== 'factura') errors.documento = 'Elige boleta o factura.'
  return errors
}

export function buildQuoteMessage(quote, { promoActive }) {
  const nombre = (quote.nombre ?? '').trim()
  const lugar = (quote.lugar ?? '').trim()
  const personas = toInt(quote.personas)

  const parts = [
    greeting(nombre, lugar),
    `Quiero cotizar ${EVENT_PHRASES[quote.tipo]} para ${plural(personas, 'persona', 'personas')} el ${formatLongDate(quote.fecha)}.`,
    '¿Qué horarios tienen disponibles?',
  ]
  if (quote.documento === 'factura') parts.push('Necesito factura.')
  if (quote.documento === 'boleta') parts.push('Necesito boleta.')
  if (promoActive) parts.push('Vi el 15% de lanzamiento.')
  return parts.join(' ')
}

// Sin 'noopener' para poder detectar el bloqueo: window.open devuelve null cuando
// el navegador (o el navegador interno de Instagram/Facebook) bloquea la pestaña.
export function openWhatsApp(url, w = window) {
  const win = w.open(url, '_blank')
  if (win) win.opener = null
  else w.location.href = url
}

export function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
