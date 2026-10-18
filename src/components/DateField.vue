<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import { motion, AnimatePresence, useDragControls } from 'motion-v'
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from 'reka-ui'
import { CalendarDays, X } from 'lucide-vue-next'
import DateCalendar from './DateCalendar.vue'
import { formatLongDate } from '../lib/dates.js'
import { trackOverlay } from '../lib/overlays.js'
import { shouldDismissSheet } from '../lib/gestures.js'
import { pedidoAbrirFecha } from '../lib/lazy.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  min: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  describedby: { type: String, default: undefined },
  // id de la etiqueta visible; el nombre accesible es "Fecha, viernes 11 de diciembre".
  labelledby: { type: String, default: 'etiqueta-fecha' },
})

const emit = defineEmits(['update:modelValue'])

// Celular: panel que sube desde abajo. Escritorio: calendario bajo el campo.
const esEscritorio = useMediaQuery('(min-width: 640px)')
const open = ref(false)
trackOverlay(open)

const texto = computed(() => (props.modelValue ? formatLongDate(props.modelValue) : 'Selecciona'))

function elegir(fecha) {
  emit('update:modelValue', fecha)
  open.value = false
}

// El panel se desmonta al terminar su animación de salida y el foco quedaría en <body>:
// se devuelve al campo para no perder el lugar con teclado o lector de pantalla.
function devolverFoco() {
  const activo = document.activeElement
  if (!activo || activo === document.body) document.getElementById('fecha')?.focus({ preventScroll: true })
}

watch(open, async (abierto) => {
  if (abierto) return
  await nextTick()
  devolverFoco()
})

// En escritorio el calendario va siempre bajo el campo. Si no cabe, se baja la página
// lo justo antes de abrir, en vez de dejar que se dé vuelta y quede bajo la barra superior.
const ALTO_CALENDARIO = 440
const movimiento = usePreferredReducedMotion()

function hacerEspacio(abierto) {
  if (!abierto) return
  const caja = document.getElementById('fecha')?.getBoundingClientRect()
  if (!caja) return
  const falta = caja.bottom + ALTO_CALENDARIO - window.innerHeight
  if (falta > 0) window.scrollBy({ top: falta, behavior: movimiento.value === 'reduce' ? 'auto' : 'smooth' })
}

// Si se tocó el campo provisional mientras cargaba, se abre ahora.
onMounted(() => {
  if (!pedidoAbrirFecha.value) return
  pedidoAbrirFecha.value = false
  if (esEscritorio.value) hacerEspacio(true)
  open.value = true
})

const arrastre = useDragControls()
const panel = ref(null)

function alSoltar(_evento, info) {
  const alto = panel.value?.$el?.offsetHeight ?? panel.value?.offsetHeight ?? 400
  if (shouldDismissSheet(info.offset.y, info.velocity.y, alto)) open.value = false
}

const boton =
  'mt-2 flex h-12 w-full items-center justify-between gap-3 rounded-md border border-sage bg-paper px-4 text-left text-base transition-colors duration-150 hover:border-forest/60 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'
</script>

<template>
  <PopoverRoot v-if="esEscritorio" v-model:open="open" @update:open="hacerEspacio">
    <PopoverTrigger as-child>
      <button
        id="fecha"
        type="button"
        name="fecha"
        :class="boton"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedby"
        :aria-labelledby="`${labelledby} fecha-valor`"
      >
        <span id="fecha-valor" :class="modelValue ? 'text-ink' : 'text-ink/70'">{{ texto }}</span>
        <CalendarDays :size="20" :stroke-width="1.5" class="shrink-0 text-forest" aria-hidden="true" />
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        align="start"
        :side-offset="8"
        :avoid-collisions="false"
        aria-labelledby="titulo-calendario"
        @open-auto-focus.prevent
        class="calendario-popover z-50 w-[22rem] rounded-lg border border-sage bg-paper p-5 text-ink shadow-[0_12px_40px_-16px_rgb(42_46_40/0.45)]"
      >
        <p id="titulo-calendario" class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-forest">Elige la fecha</p>
        <DateCalendar :model-value="modelValue" :min="min" @select="elegir" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>

  <DialogRoot v-else v-model:open="open">
    <DialogTrigger as-child>
      <button
        id="fecha"
        type="button"
        name="fecha"
        :class="boton"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedby"
        :aria-labelledby="`${labelledby} fecha-valor`"
      >
        <span id="fecha-valor" :class="modelValue ? 'text-ink' : 'text-ink/70'">{{ texto }}</span>
        <CalendarDays :size="20" :stroke-width="1.5" class="shrink-0 text-forest" aria-hidden="true" />
      </button>
    </DialogTrigger>
    <DialogPortal>
      <AnimatePresence :on-exit-complete="devolverFoco">
        <DialogOverlay v-if="open" as-child force-mount>
          <motion.div
            class="fixed inset-0 z-50 bg-moss/60"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.2 }"
          />
        </DialogOverlay>
        <DialogContent v-if="open" as-child force-mount @open-auto-focus.prevent>
          <motion.div
            ref="panel"
            class="fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-paper px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-ink"
            drag="y"
            :drag-controls="arrastre"
            :drag-listener="false"
            :drag-constraints="{ top: 0, bottom: 0 }"
            :drag-elastic="{ top: 0, bottom: 0.6 }"
            :initial="{ y: '100%' }"
            :animate="{ y: 0 }"
            :exit="{ y: '100%' }"
            :transition="{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }"
            @drag-end="alSoltar"
          >
            <div class="touch-none pt-3 pb-2" @pointerdown="arrastre.start($event)">
              <div class="mx-auto h-1 w-10 rounded-full bg-sage" aria-hidden="true"></div>
              <div class="mt-3 flex items-center justify-between">
                <DialogTitle class="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-forest">Elige la fecha</DialogTitle>
                <DialogClose
                  class="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-ink"
                  aria-label="Cerrar calendario"
                >
                  <X :size="22" :stroke-width="1.5" aria-hidden="true" />
                </DialogClose>
              </div>
              <DialogDescription class="sr-only">Selecciona el día del evento. Los días pasados no están disponibles.</DialogDescription>
            </div>
            <DateCalendar :model-value="modelValue" :min="min" @select="elegir" />
          </motion.div>
        </DialogContent>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
.calendario-popover {
  transform-origin: var(--reka-popover-content-transform-origin);
}

@media (prefers-reduced-motion: no-preference) {
  .calendario-popover[data-state='open'] {
    animation: calendario-entrar 160ms ease-out;
  }
}

@keyframes calendario-entrar {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
</style>
