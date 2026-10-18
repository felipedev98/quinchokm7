<script setup>
import { ref, onMounted } from 'vue'
import { usePreferredReducedMotion, useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  as: { type: String, default: 'div' },
  delay: { type: Number, default: 0 },
})

// Aparición con CSS (sin motion-v) para no retrasar la carga de la portada.
// Con movimiento reducido el contenido se ve de inmediato.
const reduce = usePreferredReducedMotion().value === 'reduce'
const visible = ref(reduce)
const el = ref(null)

onMounted(() => {
  if (visible.value) return
  const { stop } = useIntersectionObserver(
    el,
    ([entrada]) => {
      if (!entrada?.isIntersecting) return
      visible.value = true
      stop()
    },
    // Se activa cuando el bloque ya subió un poco en la pantalla, para que se alcance a ver.
    { threshold: 0.1, rootMargin: '0px 0px -12% 0px' },
  )
})

// El retraso (cascada) va solo en opacidad y desplazamiento; los colores del hover
// no esperan. Mismo orden que `transition` en .reveal.
const estilo = () =>
  visible.value
    ? reduce ? undefined : { transitionDelay: `${props.delay}s, ${props.delay}s, 0s, 0s, 0s` }
    : { opacity: 0, transform: 'translateY(32px)' }
</script>

<template>
  <component :is="as" ref="el" :class="{ reveal: !reduce }" :style="estilo()"><slot /></component>
</template>

<style>
.reveal {
  /* Incluye colores para no pisar los hover de los elementos envueltos (p. ej. tarjetas). */
  transition:
    opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 800ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
}
</style>
