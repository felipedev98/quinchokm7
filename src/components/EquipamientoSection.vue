<script setup>
import SectionHeading from './SectionHeading.vue'
import { EQUIPAMIENTO } from '../content.js'
</script>

<template>
  <section id="equipamiento" class="bg-mist py-16 md:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
        <SectionHeading eyebrow="Equipamiento" title="Todo listo para 35" emphasis="para 35" />
        <p class="max-w-sm text-pretty text-lg leading-relaxed text-ink/70 md:justify-self-end md:pb-2">
          Incluido en el arriendo del espacio completo.
        </p>
      </div>

      <!-- Móvil: filas con ícono a la izquierda. Desde sm: tarjetas con el texto al pie. -->
      <ul class="mt-10 grid gap-2 sm:grid-cols-2 sm:gap-3 md:mt-14 xl:grid-cols-4">
        <li
          v-for="item in EQUIPAMIENTO"
          :key="item.title"
          class="group flex items-center gap-4 rounded-lg bg-paper p-4 text-ink transition-colors duration-200 hover:bg-forest hover:text-paper sm:min-h-52 sm:flex-col sm:items-start sm:gap-0 sm:p-6"
        >
          <component
            :is="item.icon"
            :size="24"
            :stroke-width="1.5"
            class="shrink-0 text-forest transition-colors duration-200 group-hover:text-paper"
            aria-hidden="true"
          />
          <div class="min-w-0 sm:mt-auto sm:w-full sm:pt-8">
            <h3 class="truncate font-sans text-[0.9375rem] font-semibold leading-snug tracking-normal">{{ item.title }}</h3>
            <p class="mt-0.5 text-sm leading-relaxed text-ink/70 transition-colors duration-200 group-hover:text-paper/80 sm:mt-1 sm:line-clamp-2 sm:min-h-[2lh]">{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
