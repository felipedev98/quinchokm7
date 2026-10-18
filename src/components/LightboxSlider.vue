<script setup>
import { onMounted } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import { animate } from 'motion-v'
import { asset } from '../lib/asset.js'
import { shouldDismissSheet } from '../lib/gestures.js'

// Carrusel de la foto ampliada: la foto sigue al dedo al deslizar a los lados (Embla)
// y se puede cerrar deslizándola hacia abajo.
const props = defineProps({
  fotos: { type: Array, required: true },
  inicio: { type: Number, default: 0 },
  reduceMotion: { type: Boolean, default: false },
})

const emit = defineEmits(['cambio', 'cerrar'])

const [viewport, api] = emblaCarouselVue({ loop: true, startIndex: props.inicio, duration: 30 })

onMounted(() => {
  api.value?.on('select', () => emit('cambio', api.value.selectedScrollSnap()))
})

const imagenActual = () => viewport.value?.querySelector(`[data-indice="${api.value?.selectedScrollSnap() ?? props.inicio}"] img`)

// Deslizar hacia abajo para cerrar: con eventos táctiles (Embla solo toma los gestos laterales).
let inicioToque = null
let vertical = false

function alTocar(evento) {
  const t = evento.touches[0]
  inicioToque = { x: t.clientX, y: t.clientY, tiempo: evento.timeStamp }
  vertical = false
}

function alMover(evento) {
  if (!inicioToque) return
  const t = evento.touches[0]
  const dx = t.clientX - inicioToque.x
  const dy = t.clientY - inicioToque.y
  if (!vertical && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) vertical = true
  if (!vertical) return
  const img = imagenActual()
  if (img) animate(img, { y: Math.max(dy, 0), scale: 1 - Math.min(Math.max(dy, 0) / 1500, 0.15) }, { duration: 0 })
}

function alSoltar(evento) {
  if (!inicioToque || !vertical) {
    inicioToque = null
    return
  }
  const t = evento.changedTouches[0]
  const dy = t.clientY - inicioToque.y
  const velocidad = (dy / Math.max(evento.timeStamp - inicioToque.tiempo, 1)) * 1000
  inicioToque = null
  vertical = false
  if (shouldDismissSheet(dy, velocidad, window.innerHeight)) {
    emit('cerrar')
  } else {
    const img = imagenActual()
    if (img) animate(img, { y: 0, scale: 1 }, { duration: 0.25 })
  }
}

defineExpose({
  imagenActual,
  siguiente: () => api.value?.scrollNext?.(props.reduceMotion),
  anterior: () => api.value?.scrollPrev?.(props.reduceMotion),
})
</script>

<template>
  <div
    ref="viewport"
    class="size-full touch-none overflow-hidden"
    @touchstart.passive="alTocar"
    @touchmove.passive="alMover"
    @touchend="alSoltar"
    @touchcancel="alSoltar"
  >
    <div class="flex h-full">
      <div
        v-for="(foto, i) in fotos"
        :key="foto.src"
        :data-indice="i"
        class="flex h-full w-full shrink-0 items-center justify-center px-4 sm:px-20"
        @click.self="emit('cerrar')"
      >
        <img
          :src="asset(foto.src)"
          :alt="foto.alt"
          :loading="i === inicio ? 'eager' : 'lazy'"
          draggable="false"
          class="max-h-full w-auto max-w-full object-contain select-none"
          style="clip-path: inset(0px round 8px)"
        />
      </div>
    </div>
  </div>
</template>
