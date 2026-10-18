import { CalendarDate } from '@internationalized/date'

// Conversión para el calendario de Reka UI. Va aparte de dates.js para que
// @internationalized/date solo se descargue junto con el calendario.
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/

// 'YYYY-MM-DD' -> CalendarDate
export function toCalendarDate(iso) {
  const m = ISO.exec(iso ?? '')
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null
}

export function fromCalendarDate(date) {
  return date.toString()
}
