<script setup>
import { ref, watch, nextTick, onBeforeUnmount, defineAsyncComponent } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import AutoScroll from 'embla-carousel-auto-scroll'
import { usePreferredReducedMotion } from '@vueuse/core'
import { Pause, Play } from 'lucide-vue-next'
import SectionHeading from './SectionHeading.vue'
import Reveal from './Reveal.vue'
import { cargarLightbox } from '../lib/lazy.js'

// Si la descarga falla (sin conexión, o una publicación nueva borró los archivos viejos),
// la galería vuelve a la normalidad en vez de quedar trabada.
const Lightbox = defineAsyncComponent(() =>
  cargarLightbox().catch((error) => {
    restablecer()
    throw error
  }),
)
import { asset } from '../lib/asset.js'
import { trackOverlay } from '../lib/overlays.js'
import { GALERIA } from '../content.js'

const fotos = GALERIA

// Con movimiento reducido no avanza sola; deslizar sigue funcionando.
const reduceMotion = usePreferredReducedMotion().value === 'reduce'

// ~50 px/s a 60 cuadros por segundo. Se detiene al arrastrar y lo reanudamos
// nosotros, para respetar la pausa del usuario y la foto ampliada.
const REANUDAR_TRAS = 2500
const [emblaRef, emblaApi] = emblaCarouselVue(
  { loop: true, align: 'start', dragFree: true },
  [AutoScroll({ speed: 0.8, startDelay: REANUDAR_TRAS, playOnInit: !reduceMotion, stopOnInteraction: true, stopOnMouseEnter: false, stopOnFocusIn: true })],
)

const pausadoPorUsuario = ref(false)
const encima = ref(false)
const abierta = ref(null)
// La foto ampliada se monta recién la primera vez que se abre.
const usada = ref(false)
const ampliada = ref(false)
trackOverlay(ampliada)

const autoScroll = () => emblaApi.value?.plugins()?.autoScroll

function puedeAvanzar() {
  return !reduceMotion && !pausadoPorUsuario.value && !encima.value && abierta.value === null
}

function reanudar(demora = 0) {
  if (puedeAvanzar()) autoScroll()?.play(demora)
}

function detener() {
  autoScroll()?.stop()
}

function alternarPausa() {
  pausadoPorUsuario.value = !pausadoPorUsuario.value
  if (pausadoPorUsuario.value) detener()
  else reanudar()
}

// Al tocar la galería, Embla la detiene. Al soltar: si el dedo deslizó las fotos, retoma
// unos segundos después; si no (un toque, o bajar la página con el dedo encima), de inmediato.
// Se registra cuando Embla ya existe (al cargar todavía no está).
let posicionAlTocar = 0
const posicion = (api) => api.internalEngine().location.get()

let registrado = false
watch(emblaApi, (api) => {
  if (!api || registrado) return
  registrado = true
  api.on('pointerDown', () => { posicionAlTocar = posicion(api) })
  api.on('pointerUp', () => {
    const deslizo = Math.abs(posicion(api) - posicionAlTocar) > 4
    reanudar(deslizo ? REANUDAR_TRAS : 0)
  })
}, { immediate: true })

// Foto ampliada
const botones = ref([])

// Solo un mouse real pausa al estar encima. En celular un toque dispara un mouseenter
// de compatibilidad sin su mouseleave, y la galería quedaba detenida para siempre.
//
// Al cerrar la foto ampliada el cursor suele quedar sobre la galería (donde se hizo clic):
// no se toma como "mouse encima" hasta que salga y vuelva a entrar.
let ignorarEntrada = false

function alEntrarPuntero(evento) {
  if (evento.pointerType !== 'mouse' || ignorarEntrada) return
  encima.value = true
  detener()
}

function alSalirPuntero(evento) {
  if (evento.pointerType !== 'mouse') return
  ignorarEntrada = false
  encima.value = false
  reanudar()
}

let inicial = null

function abrir(i) {
  inicial = i
  // La vista ampliada tapa la galería: el mouse deja de estar "encima" de ella.
  encima.value = false
  usada.value = true
  detener()
  abierta.value = i
  ampliada.value = true
}

// Al cerrar en otra foto, la galería salta a ella (sin animación, tapada por la vista ampliada)
// para que la foto se encoja hasta su lugar (lo anima Lightbox) y el foco vuelva a ella.
// Solo salta si se cambió de foto o si su miniatura quedó fuera de la vista;
// si no, la galería se queda donde estaba.
function saltarA(i) {
  const r = rectDe(i)
  const aLaVista = r && r.width > 0 && r.right > 0 && r.left < window.innerWidth
  if (i !== inicial || !aLaVista) emblaApi.value?.scrollTo(i, true)
}

function restablecer() {
  abierta.value = null
  ampliada.value = false
  usada.value = false
  reanudar()
}

function rectDe(i) {
  return botones.value[i]?.querySelector('img')?.getBoundingClientRect() ?? null
}

function cerrar(i) {
  ignorarEntrada = true
  abierta.value = null
  ampliada.value = false
  nextTick(() => {
    botones.value[i]?.focus({ preventScroll: true })
    // Retoma de inmediato: la espera de REANUDAR_TRAS es solo para después de arrastrar.
    reanudar(0)
  })
}

onBeforeUnmount(() => detener())

const boton =
  'inline-flex size-12 shrink-0 items-center justify-center rounded-md border border-sage text-ink transition-colors duration-150 hover:border-forest hover:text-forest'
</script>

<template>
  <section id="espacio" class="overflow-hidden bg-mist py-16 md:py-28">
    <Reveal class="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-6 gap-y-5 px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Galería" title="Conoce el espacio" emphasis="el espacio" />
      <button
        v-if="!reduceMotion"
        type="button"
        :aria-label="pausadoPorUsuario ? 'Reanudar galería' : 'Pausar galería'"
        aria-controls="carrusel-fotos"
        :class="boton"
        @click="alternarPausa"
      >
        <Play v-if="pausadoPorUsuario" :size="18" :stroke-width="1.5" aria-hidden="true" />
        <Pause v-else :size="18" :stroke-width="1.5" aria-hidden="true" />
      </button>
    </Reveal>

    <div
      id="carrusel-fotos"
      ref="emblaRef"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos del quincho"
      class="carrusel mt-10 overflow-hidden md:mt-14"
      @pointerenter="alEntrarPuntero"
      @pointerleave="alSalirPuntero"
    >
      <div class="flex touch-pan-y">
        <div
          v-for="(foto, i) in fotos"
          :key="foto.src"
          class="w-64 shrink-0 pr-3 sm:w-80 lg:w-96"
          role="group"
          aria-roledescription="foto"
          :aria-label="`${i + 1} de ${fotos.length}`"
        >
          <div>
            <button
              :ref="(el) => (botones[i] = el)"
              type="button"
              data-foto
              class="block w-full cursor-zoom-in rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              :aria-label="`Ampliar: ${foto.alt}`"
              @click="abrir(i)"
            >
              <div class="aspect-4/5 w-full">
                <img
                  :src="asset(foto.src)"
                  :alt="foto.alt"
                  loading="lazy"
                  draggable="false"
                  class="size-full rounded-lg object-cover"
                  :class="{ invisible: abierta === i }"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Lightbox
      v-if="usada"
      v-model:index="abierta"
      :fotos="fotos"
      :reduce-motion="reduceMotion"
      :rect-de="rectDe"
      :antes-de-cerrar="saltarA"
      @close="cerrar"
    />
  </section>
</template>

<style>
/* El carrusel se alinea con el contenedor a la izquierda y sangra hasta el borde derecho. */
.carrusel {
  padding-left: max(1rem, calc((100% - 80rem) / 2 + 1rem));
}

@media (min-width: 40rem) {
  .carrusel {
    padding-left: max(1.5rem, calc((100% - 80rem) / 2 + 1.5rem));
  }
}

@media (min-width: 64rem) {
  .carrusel {
    padding-left: max(2rem, calc((100% - 80rem) / 2 + 2rem));
  }
}
</style>
