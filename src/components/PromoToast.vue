<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { X } from 'lucide-vue-next'
import { PROMO_TEXT } from '../config.js'
import { isPromoDismissed, dismissPromo } from '../lib/promoDismissal.js'
import { overlayOpen } from '../lib/overlays.js'

const props = defineProps({
  active: { type: Boolean, default: false },
  delay: { type: Number, default: 4000 },
})

const visible = ref(false)
const nearForm = ref(false)
const el = ref(null)
let timer
let formObserver

// Se oculta mientras el formulario está a la vista (ahí ya aparece la promoción)
// y mientras haya un panel abierto (menú, calendario o foto ampliada).
const shown = computed(() => visible.value && !nearForm.value && !overlayOpen.value)

onMounted(() => {
  if (!props.active || isPromoDismissed()) return
  timer = setTimeout(() => { visible.value = true }, props.delay)

  const form = document.getElementById('cotiza')
  if (form && typeof IntersectionObserver !== 'undefined') {
    formObserver = new IntersectionObserver((entries) => {
      nearForm.value = entries.at(-1).isIntersecting
    })
    formObserver.observe(form)
  }
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  formObserver?.disconnect()
})

// popover="manual" lo lleva a la capa superior sin bloquear la página ni el foco.
watch(shown, async (v) => {
  if (!v) return
  await nextTick()
  if (typeof el.value?.showPopover === 'function') el.value.showPopover()
})

function close() {
  dismissPromo()
  visible.value = false
  formObserver?.disconnect()
}
</script>

<template>
  <div
    v-if="shown"
    ref="el"
    data-promo
    popover="manual"
    role="status"
    class="promo-toast rounded-lg border border-sage bg-paper py-2 pr-2 pl-4 text-ink shadow-[0_8px_30px_-12px_rgb(42_46_40/0.35)] sm:p-5"
  >
    <div class="flex items-center justify-between gap-3 sm:items-start">
      <p class="hidden text-xs font-semibold uppercase tracking-[0.14em] text-forest sm:block">Beneficio de lanzamiento</p>
      <a
        href="#cotiza"
        class="text-sm font-medium leading-snug text-forest underline-offset-4 hover:underline sm:hidden"
        @click="close"
      >{{ PROMO_TEXT }}</a>
      <button
        type="button"
        aria-label="Cerrar aviso"
        class="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink/70 hover:text-ink sm:-mt-3 sm:-mr-3"
        @click="close"
      >
        <X :size="20" :stroke-width="1.5" aria-hidden="true" />
      </button>
    </div>
    <div class="hidden sm:block">
      <p class="-mt-2 font-serif text-xl leading-snug">{{ PROMO_TEXT }}</p>
      <a
        href="#cotiza"
        class="mt-3 inline-flex min-h-11 items-center rounded-md bg-forest px-5 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-forest/90"
        @click="close"
      >Cotiza tu evento</a>
    </div>
  </div>
</template>

<style>
.promo-toast {
  position: fixed;
  inset: auto 1rem 1rem 1rem;
  z-index: 30;
  width: auto;
  max-width: 22rem;
  margin: 0 0 0 auto;
  overflow: visible;
  transition: opacity 200ms ease, translate 200ms ease;
}

@starting-style {
  .promo-toast:popover-open {
    opacity: 0;
    translate: 0 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .promo-toast {
    transition: none;
  }
}
</style>
