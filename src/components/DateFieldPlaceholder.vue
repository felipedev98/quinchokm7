<script setup>
import { CalendarDays } from 'lucide-vue-next'
import { cargarDateField, pedidoAbrirFecha } from '../lib/lazy.js'

// Mismo aspecto que DateField mientras se descarga el calendario. Un toque en este
// momento no se pierde: queda pedido y el calendario se abre al cargar.
function pedir() {
  pedidoAbrirFecha.value = true
  cargarDateField()
}
</script>

<template>
  <button
    id="fecha"
    type="button"
    name="fecha"
    aria-busy="true"
    aria-labelledby="etiqueta-fecha fecha-valor"
    class="mt-2 flex h-12 w-full items-center justify-between gap-3 rounded-md border border-sage bg-paper px-4 text-left text-base"
    @click="pedir"
  >
    <span id="fecha-valor" class="text-ink/70">Selecciona</span>
    <CalendarDays :size="20" :stroke-width="1.5" class="shrink-0 text-forest" aria-hidden="true" />
  </button>
</template>
