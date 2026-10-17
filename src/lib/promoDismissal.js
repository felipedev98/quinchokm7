const KEY = 'qkm7-promo-cerrada'

// localStorage puede no existir o lanzar error (modo privado, cookies bloqueadas).
// En ese caso el aviso se muestra igual y solo se cierra para esta visita.
export function isPromoDismissed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function dismissPromo() {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    // sin persistencia disponible
  }
}
