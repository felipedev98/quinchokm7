<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import SectionHeading from './SectionHeading.vue'
import Reveal from './Reveal.vue'
import QuoteForm from './QuoteForm.vue'
import { whatsappUrl, DIRECT_MESSAGE } from '../lib/whatsapp.js'

defineProps({
  promoActive: { type: Boolean, default: false },
})

const pasos = [
  { title: 'Cuéntanos tu evento', text: 'Tipo, cantidad de personas y fecha.' },
  { title: 'Revisa horarios y precio', text: 'Te responden los dueños por WhatsApp.' },
  { title: 'Reserva tu fecha', text: 'Emitimos boleta o factura.' },
]
</script>

<template>
  <section id="cotiza" class="bg-paper px-2 sm:px-4">
    <div class="rounded-xl bg-moss py-16 text-paper md:py-24">
      <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow="Cotización" title="Cotiza tu evento" emphasis="evento" tone="dark" />
          <p class="mt-6 max-w-md text-pretty text-lg leading-relaxed text-paper/80">
            Arriendo por hora o por día. Te responden directamente los dueños.
          </p>

          <ol class="mt-10 border-t border-paper/20">
            <li
              v-for="(paso, i) in pasos"
              :key="paso.title"
              class="grid grid-cols-[4.75rem_1fr] gap-x-3 border-b border-paper/20 py-5"
            >
              <span class="mt-0.5 inline-flex h-6 items-center justify-self-start rounded-md bg-paper/10 px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]">Paso {{ i + 1 }}</span>
              <div>
                <h3 class="font-sans text-base font-semibold tracking-normal">{{ paso.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-paper/70">{{ paso.text }}</p>
              </div>
            </li>
          </ol>

          <a
            :href="whatsappUrl(DIRECT_MESSAGE)"
            target="_blank"
            rel="noopener"
            class="mt-6 inline-block py-3 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Prefiero escribir directo por WhatsApp<ArrowUpRight :size="18" :stroke-width="1.5" class="ml-1.5 inline-block align-[-4px]" aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal class="rounded-lg bg-paper p-5 text-ink sm:p-8" :delay="0.15">
          <QuoteForm :promo-active="promoActive" />
        </Reveal>
      </div>
    </div>
  </section>
</template>
