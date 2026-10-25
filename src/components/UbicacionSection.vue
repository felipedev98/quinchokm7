<script setup>
import { asset } from '../lib/asset.js'
import { Navigation } from 'lucide-vue-next'
import SectionHeading from './SectionHeading.vue'
import Reveal from './Reveal.vue'
import { COORDS } from '../config.js'
import { osmEmbedUrl, directionsUrl } from '../lib/maps.js'
</script>

<template>
  <section id="ubicacion" class="bg-paper py-16 md:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal class="grid gap-10 md:grid-cols-2 md:gap-16">
        <SectionHeading eyebrow="Ubicación" title="A 10 minutos del centro" emphasis="centro" />

        <div class="md:pt-9">

          <p class="text-pretty text-lg leading-relaxed">
            Sector tranquilo con estacionamiento dentro del recinto.
          </p>
          <p class="mt-3 text-pretty leading-relaxed text-ink/70">Camino Coyhaique Alto KM 7, Parcelas Entre Vientos,
            parcela C-4.</p>
          <a :href="directionsUrl(COORDS)" target="_blank" rel="noopener"
            class="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-forest px-6 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-forest hover:text-paper">
            <Navigation :size="20" :stroke-width="1.5" aria-hidden="true" />
            Cómo llegar
          </a>
        </div>
      </Reveal>

      <Reveal class="mt-12 grid gap-3 md:mt-16 md:grid-cols-[1.4fr_1fr]" :delay="0.1">
        <!-- La barra inferior del mapa (enlaces de OpenStreetMap) queda fuera del recorte.
             La licencia exige el crédito, así que va uno propio en la esquina. -->
        <div
          class="relative aspect-square w-full overflow-hidden rounded-lg border border-sage sm:aspect-[4/3] md:aspect-auto md:h-full md:min-h-96">
          <iframe :src="osmEmbedUrl(COORDS)" title="Mapa de ubicación de QuinchoKM7" loading="lazy"
            referrerpolicy="no-referrer" class="absolute inset-x-0 top-0 h-[calc(100%+2rem)] w-full"></iframe>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener"
            class="absolute right-2 bottom-2 rounded-sm bg-paper/85 px-1.5 py-0.5 text-[0.6875rem] text-ink/70 transition-colors duration-150 hover:text-forest">
            © OpenStreetMap
          </a>
        </div>
        <img :src="asset('images/quincho/quincho-km7-exterior-coyhaique.webp')"
          alt="Exterior del QuinchoKM7 rodeado de álamos, con la cordillera nevada de fondo" loading="lazy"
          class="hidden aspect-[4/5] w-full rounded-lg object-cover md:block" />
      </Reveal>
    </div>
  </section>
</template>
