const dateFormat = new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

// 'YYYY-MM-DD' -> 'viernes 11 de diciembre'. Fecha y formato van ambos en UTC
// para que la zona horaria del visitante no corra el día.
export function formatLongDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return dateFormat.format(new Date(Date.UTC(y, m - 1, d))).replace(',', '')
}
