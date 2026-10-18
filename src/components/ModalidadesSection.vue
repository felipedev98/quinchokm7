<script setup>
import { House, UtensilsCrossed, Check } from 'lucide-vue-next'
import SectionHeading from './SectionHeading.vue'
import Reveal from './Reveal.vue'
import { MODALIDADES, modalidadElegida } from '../lib/modalidad.js'

const [espacio, alimentacion] = MODALIDADES

const detalles = {
  espacio: ['Quincho completo y privado', 'Hasta 35 personas', 'Por hora o por día'],
  alimentacion: ['Comida preparada para tu grupo', 'Aseo general incluido', 'Pago único: salón y alimentación'],
}

// Lleva al formulario con la modalidad ya marcada.
function elegir(valor) {
  modalidadElegida.value = valor
}
</script>

<template>
  <section id="arriendo" class="bg-paper py-16 md:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal class="grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
        <SectionHeading eyebrow="Arriendo" title="Dos formas de arrendar" emphasis="arrendar" />
        <p class="max-w-sm text-pretty text-lg leading-relaxed text-ink/70 md:justify-self-end md:pb-2">
          Solo el quincho, o el quincho con la comida lista para tu equipo.
        </p>
      </Reveal>

      <div class="mt-10 grid gap-3 md:mt-14 md:grid-cols-2">
        <Reveal class="flex flex-col rounded-lg border border-sage bg-paper p-6 sm:p-8">
          <House :size="28" :stroke-width="1.5" class="text-forest" aria-hidden="true" />
          <h3 class="mt-6 text-3xl">{{ espacio.titulo }}</h3>
          <p class="mt-2 leading-relaxed text-ink/70">{{ espacio.resumen }}</p>
          <ul class="mt-6 space-y-3 border-t border-sage pt-6">
            <li v-for="d in detalles.espacio" :key="d" class="flex items-center gap-3 text-sm font-medium">
              <Check :size="18" :stroke-width="2" class="shrink-0 text-forest" aria-hidden="true" />{{ d }}
            </li>
          </ul>
          <div class="mt-auto pt-8">
            <a
              href="#cotiza"
              class="inline-flex h-12 items-center justify-center rounded-md border border-forest px-6 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-forest hover:text-paper w-full sm:w-auto"
              @click="elegir(espacio.valor)"
            >
              Cotizar solo el espacio
            </a>
          </div>
        </Reveal>

        <Reveal class="flex flex-col rounded-lg bg-forest p-6 text-paper sm:p-8" :delay="0.1">
          <div class="flex items-start justify-between gap-4">
            <UtensilsCrossed :size="28" :stroke-width="1.5" aria-hidden="true" />
            <span class="rounded-md bg-paper/15 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">Todo incluido</span>
          </div>
          <h3 class="mt-6 text-3xl text-paper">{{ alimentacion.titulo }}</h3>
          <p class="mt-2 leading-relaxed text-paper/80">Preparamos la comida para tu grupo y nos encargamos del aseo.</p>
          <ul class="mt-6 space-y-3 border-t border-paper/20 pt-6">
            <li v-for="d in detalles.alimentacion" :key="d" class="flex items-center gap-3 text-sm font-medium">
              <Check :size="18" :stroke-width="2" class="shrink-0" aria-hidden="true" />{{ d }}
            </li>
          </ul>
          <div class="mt-auto pt-8">
            <a
              href="#cotiza"
              class="inline-flex h-12 items-center justify-center rounded-md bg-paper px-6 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-mist w-full sm:w-auto"
              @click="elegir(alimentacion.valor)"
            >
              Cotizar con alimentación
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
</template>
