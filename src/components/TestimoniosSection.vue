<script setup>
import SectionHeading from './SectionHeading.vue'
import { TESTIMONIOS } from '../content.js'
</script>

<template>
  <section id="testimonios" class="bg-paper py-16 md:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading title="Testimonios" />
      <ul class="mt-10 grid gap-8 md:mt-14 md:grid-cols-3">
        <li v-for="(t, i) in TESTIMONIOS" :key="i" class="border-t border-sage pt-6">
          <blockquote class="font-serif text-xl leading-snug">{{ t.quote }}</blockquote>
          <p class="mt-4 text-sm text-ink/70">{{ t.author }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
