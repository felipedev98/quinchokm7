// Reglas de gestos compartidas por el menú, el calendario y la foto ampliada.
// Se cierra o avanza si el arrastre supera una distancia o se suelta con velocidad.
const VELOCIDAD = 500

export function shouldDismissDrawer(offsetX, velocityX, width) {
  return offsetX > width * 0.3 || velocityX > VELOCIDAD
}

export function shouldDismissSheet(offsetY, velocityY, height) {
  return offsetY > height * 0.3 || velocityY > VELOCIDAD
}

export function swipeIntent(offsetX, offsetY, velocityX, velocityY) {
  const horizontal = Math.abs(offsetX) + Math.abs(velocityX) / 10 >= Math.abs(offsetY) + Math.abs(velocityY) / 10
  if (horizontal) {
    if (offsetX < -60 || velocityX < -VELOCIDAD) return 'next'
    if (offsetX > 60 || velocityX > VELOCIDAD) return 'prev'
    return null
  }
  if (offsetY > 100 || velocityY > VELOCIDAD) return 'close'
  return null
}

// FLIP: transformación (x, y, scale) que lleva la foto ampliada al rectángulo `destino`.
// `rect` es lo que mide la foto ahora y `actual` la transformación que ya tiene
// (por ejemplo, el arrastre al cerrar deslizando), que se descuenta para partir de su base.
export function flipDesde(destino, rect, actual) {
  const escala = actual.scale || 1
  const baseX = rect.left + rect.width / 2 - actual.x
  const baseY = rect.top + rect.height / 2 - actual.y
  const baseAncho = rect.width / escala
  return {
    x: destino.left + destino.width / 2 - baseX,
    y: destino.top + destino.height / 2 - baseY,
    scale: destino.width / baseAncho,
  }
}

// FLIP con recorte: escala la foto para cubrir el rectángulo `destino` (como object-cover)
// y calcula cuánto recortar por lado, en píxeles de la foto sin escalar, para que lo visible
// tenga exactamente la forma de la miniatura. `radio` es el borde redondeado de la miniatura.
export function flipCubrir(destino, rect, actual, radio = 0) {
  const escalaActual = actual.scale || 1
  const baseAncho = rect.width / escalaActual
  const baseAlto = rect.height / escalaActual
  const baseX = rect.left + rect.width / 2 - actual.x
  const baseY = rect.top + rect.height / 2 - actual.y
  const scale = Math.max(destino.width / baseAncho, destino.height / baseAlto)
  const horizontal = Math.max(0, (baseAncho - destino.width / scale) / 2)
  const vertical = Math.max(0, (baseAlto - destino.height / scale) / 2)
  return {
    x: destino.left + destino.width / 2 - baseX,
    y: destino.top + destino.height / 2 - baseY,
    scale,
    recorte: { arriba: vertical, derecha: horizontal, abajo: vertical, izquierda: horizontal },
    radio: radio / scale,
  }
}

export function recorteCss({ arriba, derecha, abajo, izquierda }, radio) {
  return `inset(${arriba}px ${derecha}px ${abajo}px ${izquierda}px round ${radio}px)`
}
