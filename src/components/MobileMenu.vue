<script setup>
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion-v'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { ref } from 'vue'
import { X, ArrowRight, MessageCircle } from 'lucide-vue-next'
import { WHATSAPP_DISPLAY } from '../config.js'
import { whatsappUrl, DIRECT_MESSAGE } from '../lib/whatsapp.js'
import { shouldDismissDrawer } from '../lib/gestures.js'

// Panel del menú móvil. Se descarga aparte (ver SiteHeader) para no retrasar la portada.
const props = defineProps({
  open: { type: Boolean, default: false },
  links: { type: Array, required: true },
  activa: { type: String, default: '' },
  // Botón que abrió el menú: recibe el foco al cerrar con Escape o la X.
  retorno: { type: Object, default: null },
})

const emit = defineEmits(['update:open'])

// Al elegir un link, el foco va a esa sección (con preventScroll, para no cortar
// el desplazamiento hacia el ancla) en vez de volver al botón de menú.
let destino = null

function irA(href) {
  destino = href
  emit('update:open', false)
}

// Al abrir, el foco va al panel (no a la X), así no aparece un recuadro sobre el botón.
function alAbrirAutofoco(evento) {
  evento.preventDefault()
  evento.target?.focus?.({ preventScroll: true })
}

function alCerrarAutofoco(evento) {
  const seccion = destino && document.querySelector(destino)
  destino = null
  evento.preventDefault()
  if (seccion) {
    if (!seccion.hasAttribute('tabindex')) seccion.setAttribute('tabindex', '-1')
    seccion.focus({ preventScroll: true })
  } else {
    props.retorno?.focus?.({ preventScroll: true })
  }
}

// Arrastre hacia la derecha para cerrar; el velo se aclara mientras se arrastra.
const x = useMotionValue(0)
const anchoPanel = ref(320)
const opacidadVelo = useTransform(x, (valor) => 1 - Math.min(Math.max(valor / anchoPanel.value, 0), 1))

function alEmpezarArrastre(evento) {
  anchoPanel.value = evento.target?.closest?.('[role="dialog"]')?.offsetWidth || 320
}

function alSoltar(_evento, info) {
  if (shouldDismissDrawer(info.offset.x, info.velocity.x, anchoPanel.value)) emit('update:open', false)
}
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">

    <DialogPortal>
      <AnimatePresence>
        <DialogOverlay v-if="open" as-child force-mount>
          <motion.div
            class="fixed inset-0 z-50 md:hidden"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.2 }"
          >
            <motion.div class="absolute inset-0 bg-moss/60" :style="{ opacity: opacidadVelo }" />
          </motion.div>
        </DialogOverlay>

        <DialogContent v-if="open" as-child force-mount @open-auto-focus="alAbrirAutofoco" @close-auto-focus="alCerrarAutofoco">
          <motion.div
            tabindex="-1"
            class="fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(20rem,85vw)] flex-col bg-paper text-ink outline-none md:hidden"
            :style="{ x }"
            drag="x"
            :drag-constraints="{ left: 0, right: 0 }"
            :drag-elastic="{ left: 0, right: 1 }"
            :drag-momentum="false"
            :initial="{ x: '100%' }"
            :animate="{ x: 0 }"
            :exit="{ x: '100%' }"
            :transition="{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }"
            @drag-start="alEmpezarArrastre"
            @drag-end="alSoltar"
          >
            <DialogTitle class="sr-only">Menú</DialogTitle>
            <DialogDescription class="sr-only">Secciones del sitio y contacto.</DialogDescription>

            <div class="flex h-18 shrink-0 items-center justify-end px-4">
              <DialogClose
                class="inline-flex size-11 items-center justify-center rounded-md text-ink"
                aria-label="Cerrar menú"
              >
                <X :size="24" :stroke-width="1.5" aria-hidden="true" />
              </DialogClose>
            </div>

            <nav aria-label="Menú móvil" class="flex-1 overflow-y-auto px-6 pt-4">
              <ul class="space-y-1">
                <motion.li
                  v-for="(link, i) in links"
                  :key="link.href"
                  :initial="{ opacity: 0, x: 16 }"
                  :animate="{ opacity: 1, x: 0 }"
                  :transition="{ duration: 0.3, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }"
                >
                  <a
                    :href="link.href"
                    class="group flex min-h-14 items-center justify-between font-serif text-[1.75rem] leading-tight transition-colors duration-150"
                    :class="activa === link.href.slice(1) ? 'text-forest' : 'text-ink'"
                    :aria-current="activa === link.href.slice(1) ? 'location' : undefined"
                    @click="irA(link.href)"
                  >
                    {{ link.label }}
                    <ArrowRight
                      :size="20"
                      :stroke-width="1.5"
                      class="text-ink/40 transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </motion.li>
              </ul>
            </nav>

            <div class="shrink-0 space-y-3 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <a
                href="#cotiza"
                class="flex h-12 items-center justify-center rounded-md bg-forest px-6 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-forest/90"
                @click="irA('#cotiza')"
              >
                Cotiza tu evento
              </a>
              <a
                :href="whatsappUrl(DIRECT_MESSAGE)"
                target="_blank"
                rel="noopener"
                class="flex h-12 items-center justify-center gap-2 rounded-md border border-forest px-6 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-forest hover:text-paper"
              >
                <MessageCircle :size="20" :stroke-width="1.5" aria-hidden="true" />
                WhatsApp {{ WHATSAPP_DISPLAY }}
              </a>
            </div>
          </motion.div>
        </DialogContent>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>
</template>
