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
          <p class="mt-3 text-pretty leading-relaxed text-ink/70">KM 7, Coyhaique. El mapa muestra el punto exacto.</p>
          <a
            :href="directionsUrl(COORDS)"
            target="_blank"
            rel="noopener"
            class="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-forest px-6 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-forest hover:text-paper"
          >
            <Navigation :size="20" :stroke-width="1.5" aria-hidden="true" />
            Cómo llegar
          </a>
        </div>
      </Reveal>

      <Reveal class="mt-12 grid gap-3 md:mt-16 md:grid-cols-[1.4fr_1fr]" :delay="0.1">
        <iframe
          :src="osmEmbedUrl(COORDS)"
          title="Mapa de ubicación de QuinchoKM7"
          loading="lazy"
          referrerpolicy="no-referrer"
          class="aspect-square w-full rounded-lg border border-sage sm:aspect-[4/3] md:aspect-auto md:h-full md:min-h-96"
        ></iframe>
        <img
          :src="asset('images/espacio-exterior.jpg')"
          alt="Exterior del quincho y su entorno"
          loading="lazy"
          class="hidden aspect-[4/5] w-full rounded-lg object-cover md:block"
        />
      </Reveal>
    </div>
  </section>
</template>
