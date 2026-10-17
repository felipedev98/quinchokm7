<script setup>
import { asset } from '../lib/asset.js'
import { ref, computed, onBeforeUnmount } from 'vue'
import { Pause, Play } from 'lucide-vue-next'
import SectionHeading from './SectionHeading.vue'
import { GALERIA } from '../content.js'

const fotos = [
  { src: '/images/espacio-salon.jpg', label: 'Salón', alt: 'Salón del quincho armado con mesas para un grupo' },
  ...GALERIA,
]

// Con movimiento reducido no hay bucle: la galería se recorre a mano.
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const pausadoPorUsuario = ref(false)
const tocando = ref(false)
let soltarTimer

// El hover y el foco pausan por CSS; el botón y el toque, con data-pausado.
const pausado = computed(() => pausadoPorUsuario.value || tocando.value)

function alternarPausa() {
  pausadoPorUsuario.value = !pausadoPorUsuario.value
}

function empezarToque() {
  clearTimeout(soltarTimer)
  tocando.value = true
}

// En pantallas táctiles se reanuda unos segundos después de soltar.
function terminarToque() {
  clearTimeout(soltarTimer)
  soltarTimer = setTimeout(() => { tocando.value = false }, 3000)
}

onBeforeUnmount(() => clearTimeout(soltarTimer))
</script>

<template>
  <section id="espacio" class="overflow-hidden bg-paper py-16 md:py-28">
    <div class="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-6 gap-y-5 px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Galería" title="Conoce el espacio" emphasis="el espacio" />
      <button
        v-if="!reduceMotion"
        type="button"
        :aria-label="pausadoPorUsuario ? 'Reanudar galería' : 'Pausar galería'"
        aria-controls="carrusel-fotos"
        class="inline-flex size-12 shrink-0 items-center justify-center rounded-md border border-sage text-ink transition-colors duration-150 hover:border-forest hover:text-forest"
        @click="alternarPausa"
      >
        <Play v-if="pausadoPorUsuario" :size="18" :stroke-width="1.5" aria-hidden="true" />
        <Pause v-else :size="18" :stroke-width="1.5" aria-hidden="true" />
      </button>
    </div>

    <div
      v-if="!reduceMotion"
      id="carrusel-fotos"
      data-carrusel
      role="region"
      aria-label="Fotos del quincho"
      :data-pausado="pausado || undefined"
      class="cinta mt-10 md:mt-14"
      @touchstart.passive="empezarToque"
      @touchend="terminarToque"
      @touchcancel="terminarToque"
    >
      <div class="cinta-pista">
        <ul class="flex">
          <li v-for="foto in fotos" :key="foto.src" class="cinta-item">
            <figure>
              <img :src="asset(foto.src)" :alt="foto.alt" loading="lazy" class="aspect-4/5 w-full rounded-lg object-cover" />
              <figcaption class="mt-3 text-sm font-medium">{{ foto.label }}</figcaption>
            </figure>
          </li>
        </ul>
        <!-- Copia para que el bucle no tenga corte; oculta para lectores de pantalla. -->
        <ul class="flex" data-copia aria-hidden="true">
          <li v-for="foto in fotos" :key="`copia-${foto.src}`" class="cinta-item">
            <figure>
              <img :src="asset(foto.src)" alt="" loading="lazy" class="aspect-4/5 w-full rounded-lg object-cover" />
              <figcaption class="mt-3 text-sm font-medium">{{ foto.label }}</figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </div>

    <ul
      v-else
      id="carrusel-fotos"
      data-carrusel
      tabindex="0"
      aria-label="Fotos del quincho"
      class="carrusel-manual mt-10 flex gap-3 overflow-x-auto px-4 pb-2 sm:px-6 md:mt-14 lg:px-8"
    >
      <li v-for="foto in fotos" :key="foto.src" class="w-64 shrink-0 snap-start sm:w-80 lg:w-96">
        <figure>
          <img :src="asset(foto.src)" :alt="foto.alt" loading="lazy" class="aspect-4/5 w-full rounded-lg object-cover" />
          <figcaption class="mt-3 text-sm font-medium">{{ foto.label }}</figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>

<style>
/* Cinta infinita: dos copias idénticas; al desplazar -50% vuelve al inicio sin salto. */
.cinta-pista {
  display: flex;
  width: max-content;
  animation: cinta-desplazar 70s linear infinite;
}

.cinta-item {
  width: 16rem;
  flex-shrink: 0;
  padding-right: 0.75rem;
}

@media (min-width: 40rem) {
  .cinta-item {
    width: 20rem;
  }
}

@media (min-width: 64rem) {
  .cinta-item {
    width: 24rem;
  }
}

.cinta:hover .cinta-pista,
.cinta:focus-within .cinta-pista,
.cinta[data-pausado] .cinta-pista {
  animation-play-state: paused;
}

@keyframes cinta-desplazar {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cinta-pista {
    animation: none;
  }
}

.carrusel-manual {
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1rem;
  scrollbar-width: none;
}
</style>
