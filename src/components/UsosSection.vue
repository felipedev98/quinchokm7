<script setup>
import SectionHeading from './SectionHeading.vue'
import { USOS } from '../content.js'

const cifras = [
  { value: '35', label: 'personas como máximo' },
  { value: '10 min', label: 'desde el centro de Coyhaique' },
  { value: '1 grupo', label: 'a la vez: el espacio es solo de ustedes' },
]
</script>

<template>
  <section id="celebraciones" class="bg-paper py-16 md:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-2 md:gap-16">
        <SectionHeading eyebrow="Celebraciones" title="Un espacio solo para tu equipo" emphasis="tu equipo" />
        <div class="md:pt-9">
          <p class="text-pretty text-lg leading-relaxed text-ink">
            Arriendas el quincho completo. Mientras celebran, nadie más lo usa.
          </p>
          <dl class="mt-8 border-t border-sage">
            <div v-for="uso in USOS" :key="uso.title" class="border-b border-sage py-4">
              <dt class="text-sm font-semibold">{{ uso.title }}</dt>
              <dd class="mt-1 text-sm leading-relaxed text-ink/70">{{ uso.text }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <ul class="mt-14 grid gap-3 sm:grid-cols-3 md:mt-20">
        <li
          v-for="c in cifras"
          :key="c.value"
          class="grid grid-cols-[7.5rem_1fr] items-center gap-4 rounded-lg border border-sage p-5 sm:block sm:p-6"
        >
          <p class="whitespace-nowrap font-serif text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl">{{ c.value }}</p>
          <p class="text-sm leading-snug text-ink/70 sm:mt-10">{{ c.label }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
