import { ref, computed, watch, onBeforeUnmount } from 'vue'

// Cuántos paneles (menú, calendario, foto ampliada) están abiertos ahora.
const abiertos = ref(0)

export const overlayOpen = computed(() => abiertos.value > 0)

// Registra un panel: suma mientras `open` sea true y descuenta al desmontarse abierto.
export function trackOverlay(open) {
  let contado = false
  const sincronizar = (valor) => {
    if (valor && !contado) abiertos.value++
    if (!valor && contado) abiertos.value--
    contado = !!valor
  }
  watch(open, sincronizar, { immediate: true, flush: 'sync' })
  onBeforeUnmount(() => sincronizar(false))
}
