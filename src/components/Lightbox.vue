<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { motion, AnimatePresence, animate } from 'motion-v'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { X, ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { flipCubrir, recorteCss } from '../lib/gestures.js'
import LightboxSlider from './LightboxSlider.vue'

const props = defineProps({
  fotos: { type: Array, required: true },
  // Índice de la foto abierta, o null si está cerrada.
  index: { type: Number, default: null },
  reduceMotion: { type: Boolean, default: false },
  // Rectángulo de la miniatura i en la galería (para crecer desde ahí y volver a ella).
  rectDe: { type: Function, default: () => null },
  // Se llama antes de animar el cierre: la galería salta a la foto i.
  antesDeCerrar: { type: Function, default: () => {} },
})

const emit = defineEmits(['update:index', 'close', 'exit-complete'])

// Posición propia: varios toques seguidos avanzan desde la última, sin esperar al padre.
const actual = ref(props.index)
watch(() => props.index, (i) => { actual.value = i })

const abierta = computed(() => actual.value !== null)
const foto = computed(() => (abierta.value ? props.fotos[actual.value] : null))
const total = computed(() => props.fotos.length)

const slider = ref(null)

function fijar(i) {
  actual.value = i
  emit('update:index', i)
}

// Flechas y teclado: el carrusel anima el paso; la posición se actualiza al instante
// para que varios toques seguidos avancen desde la última.
function ir(paso) {
  fijar((actual.value + paso + total.value) % total.value)
  if (paso > 0) slider.value?.siguiente()
  else slider.value?.anterior()
}

// La foto crece desde su miniatura y, al cerrar, vuelve a la miniatura de la foto que
// se está viendo (técnica FLIP con recorte, animando el elemento con animate()).
const cerrando = ref(false)
// Oculta (visibility) hasta aplicar la posición inicial; opacity no sirve porque motion la fija en línea.
const lista = ref(props.reduceMotion)
// Curva suave que desacelera al final, como el gesto de soltar una foto.
const CURVA = [0.32, 0.72, 0, 1]
const RADIO = 8
const SIN_RECORTE = recorteCss({ arriba: 0, derecha: 0, abajo: 0, izquierda: 0 }, RADIO)

const valido = (r) => r && r.width > 0 && r.height > 0
const elemento = () => slider.value?.imagenActual()
const cuadro = () => new Promise((r) => requestAnimationFrame(() => r()))

// Transformación que tiene la foto ahora (incluye el arrastre al cerrar deslizando).
function transformacion(el) {
  const m = new DOMMatrix(getComputedStyle(el).transform)
  return { x: m.e, y: m.f, scale: m.a || 1 }
}

function haciaMiniatura(miniatura, el) {
  const d = flipCubrir(miniatura, el.getBoundingClientRect(), transformacion(el), RADIO)
  return { x: d.x, y: d.y, scale: d.scale, clipPath: recorteCss(d.recorte, d.radio) }
}

async function animarEntrada() {
  const el = elemento()
  const origen = props.rectDe(actual.value)
  if (props.reduceMotion || !el || !valido(origen)) {
    lista.value = true
    return
  }
  await el.decode?.().catch(() => {})
  if (!valido(el.getBoundingClientRect())) {
    lista.value = true
    return
  }
  const d = haciaMiniatura(origen, el)
  animate(
    el,
    { x: [d.x, 0], y: [d.y, 0], scale: [d.scale, 1], clipPath: [d.clipPath, SIN_RECORTE] },
    { duration: 0.42, ease: CURVA },
  )
  // Se muestra recién cuando ya está en la posición de la miniatura.
  await cuadro()
  lista.value = true
}

watch(abierta, async (valor) => {
  if (!valor) return
  // Cada apertura parte oculta: los valores de movimiento conservan el cierre anterior.
  lista.value = props.reduceMotion
  await nextTick()
  animarEntrada()
}, { immediate: true })

async function cerrar() {
  if (actual.value === null || cerrando.value) return
  cerrando.value = true
  const i = actual.value
  props.antesDeCerrar(i)
  // Embla dibuja el salto de la galería en el cuadro siguiente: se espera antes de medir la miniatura.
  await nextTick()
  await cuadro()
  await cuadro()
  const el = elemento()
  const destino = props.rectDe(i)
  if (!props.reduceMotion && el && valido(destino)) {
    await animate(el, haciaMiniatura(destino, el), { duration: 0.38, ease: CURVA })
  }
  cerrando.value = false
  emit('close', i)
}

function alCambiarAbierto(valor) {
  if (!valor) cerrar()
}

function alTeclear(evento) {
  if (evento.key === 'ArrowRight') ir(1)
  if (evento.key === 'ArrowLeft') ir(-1)
}


const flecha =
  'absolute hidden size-12 items-center justify-center rounded-md border border-paper/30 text-paper transition duration-150 hover:bg-paper/10 sm:inline-flex'
</script>

<template>
  <DialogRoot :open="abierta" @update:open="alCambiarAbierto">
    <DialogPortal>
      <AnimatePresence :on-exit-complete="() => emit('exit-complete')">
        <DialogOverlay v-if="abierta" as-child force-mount>
          <motion.div
            class="fixed inset-0 z-50 bg-moss/95"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: cerrando ? 0 : 1 }"
            :transition="{ duration: cerrando ? 0.34 : 0.3, ease: CURVA }"
            :exit="{ opacity: 0 }"
          />
        </DialogOverlay>

        <DialogContent
          v-if="abierta"
          as-child
          force-mount
          @keydown="alTeclear"
          @open-auto-focus.prevent
          @close-auto-focus.prevent
        >
          <div class="fixed inset-0 z-50 flex flex-col text-paper outline-none" tabindex="-1">
            <DialogTitle class="sr-only">{{ foto.alt }}</DialogTitle>
            <DialogDescription class="sr-only">Foto {{ actual + 1 }} de {{ total }}. Usa las flechas para cambiar de foto.</DialogDescription>

            <div class="flex h-18 shrink-0 items-center justify-between px-4 transition-opacity duration-200 sm:px-6" :class="{ 'opacity-0': cerrando }">
              <p class="text-sm font-medium tabular-nums text-paper/80">{{ actual + 1 }} de {{ total }}</p>
              <DialogClose
                class="inline-flex size-12 items-center justify-center rounded-md text-paper hover:bg-paper/10"
                aria-label="Cerrar foto"
              >
                <X :size="24" :stroke-width="1.5" aria-hidden="true" />
              </DialogClose>
            </div>

            <div class="relative flex min-h-0 flex-1 items-center justify-center">
              <LightboxSlider
                ref="slider"
                :fotos="fotos"
                :inicio="actual"
                :reduce-motion="reduceMotion"
                :class="{ invisible: !lista }"
                @cambio="fijar"
                @cerrar="cerrar"
              />
              <button type="button" aria-label="Foto anterior" :class="[flecha, 'left-6', { 'opacity-0': cerrando }]" @click="ir(-1)">
                <ArrowLeft :size="20" :stroke-width="1.5" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Foto siguiente" :class="[flecha, 'right-6', { 'opacity-0': cerrando }]" @click="ir(1)">
                <ArrowRight :size="20" :stroke-width="1.5" aria-hidden="true" />
              </button>
            </div>

            <div class="shrink-0 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center transition-opacity duration-200 sm:px-6" :class="{ 'opacity-0': cerrando }">
              <p class="text-xs text-paper/60 sm:hidden">Desliza para ver más</p>
            </div>
          </div>
        </DialogContent>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>
</template>
