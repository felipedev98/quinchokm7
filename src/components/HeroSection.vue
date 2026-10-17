<script setup>
import { asset } from '../lib/asset.js'
import { ArrowUpRight } from 'lucide-vue-next'
import SectionHeading from './SectionHeading.vue'
import { whatsappUrl, DIRECT_MESSAGE } from '../lib/whatsapp.js'

const datos = [
  { label: 'Capacidad', value: 'Hasta 35 personas' },
  { label: 'Arriendo', value: 'Por hora o por día' },
  { label: 'Ubicación', value: 'A 10 min del centro' },
]
</script>

<template>
  <section class="px-2 pb-2 sm:px-4 sm:pb-4">
    <div class="relative isolate flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden rounded-xl bg-moss text-paper">
      <img
        :src="asset('images/hero.jpg')"
        alt=""
        fetchpriority="high"
        class="absolute inset-0 -z-10 size-full object-cover"
      />
      <div class="absolute inset-0 -z-10 bg-linear-to-t from-moss via-moss/75 to-moss/45" aria-hidden="true"></div>

      <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pt-20 pb-5 sm:px-8 sm:pb-8">

        <div class="grid gap-6 md:grid-cols-[1fr_minmax(0,18rem)] md:items-end md:gap-12">
          <SectionHeading
            title="Tu equipo merece un lugar distinto"
            emphasis="distinto"
            :level="1"
            tone="dark"
          />
          <div class="md:pb-2">
            <p class="text-pretty text-base leading-relaxed text-paper/85">
              Quincho privado en Coyhaique para celebrar con tu equipo, con parrilla interior y cocina equipada.
            </p>
            <a
              :href="whatsappUrl(DIRECT_MESSAGE)"
              target="_blank"
              rel="noopener"
              class="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Escríbenos por WhatsApp
              <ArrowUpRight :size="18" :stroke-width="1.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div class="mt-7 grid grid-cols-3 border-t border-paper/20 pt-5 md:mt-10 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:pt-6">
          <dl class="contents">
            <div
              v-for="(d, i) in datos"
              :key="d.label"
              class="min-w-0 pr-2"
              :class="i > 0 ? 'border-l border-paper/20 pl-3 sm:pl-6' : ''"
            >
              <dt class="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-paper/65">{{ d.label }}</dt>
              <dd class="mt-1 text-[0.8125rem] font-semibold leading-snug sm:text-base">{{ d.value }}</dd>
            </div>
          </dl>
          <a
            href="#cotiza"
            class="col-span-3 mt-5 inline-flex min-h-12 items-center justify-center rounded-md bg-paper px-7 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-mist md:col-span-1 md:mt-0"
          >
            Cotizar evento
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
