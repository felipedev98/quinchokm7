<script setup>
import { computed } from 'vue'
import { today, getLocalTimeZone } from '@internationalized/date'
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarPrev,
  CalendarNext,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
} from 'reka-ui'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { toCalendarDate, fromCalendarDate } from '../lib/calendarDate.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  min: { type: String, default: '' },
})

const emit = defineEmits(['select'])

const valor = computed(() => toCalendarDate(props.modelValue))
const minimo = computed(() => toCalendarDate(props.min) ?? undefined)
// Abre en el mes de la fecha elegida; si no hay, en el mes actual.
const inicio = computed(() => valor.value ?? minimo.value ?? today(getLocalTimeZone()))

function elegir(fecha) {
  if (fecha) emit('select', fromCalendarDate(fecha))
}

const navegacion =
  'inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors duration-150 hover:bg-mist disabled:pointer-events-none disabled:opacity-30'
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    :model-value="valor"
    :default-placeholder="inicio"
    :min-value="minimo"
    locale="es-CL"
    :week-starts-on="1"
    weekday-format="short"
    fixed-weeks
    prevent-deselect
    initial-focus
    class="w-full"
    @update:model-value="elegir"
  >
    <CalendarHeader class="flex items-center justify-between">
      <CalendarPrev :class="navegacion" aria-label="Mes anterior">
        <ChevronLeft :size="20" :stroke-width="1.5" aria-hidden="true" />
      </CalendarPrev>
      <CalendarHeading class="font-serif text-xl first-letter:uppercase" />
      <CalendarNext :class="navegacion" aria-label="Mes siguiente">
        <ChevronRight :size="20" :stroke-width="1.5" aria-hidden="true" />
      </CalendarNext>
    </CalendarHeader>

    <CalendarGrid v-for="mes in grid" :key="mes.value.toString()" class="mt-4 w-full border-collapse select-none">
      <CalendarGridHead>
        <CalendarGridRow class="grid grid-cols-7">
          <CalendarHeadCell
            v-for="dia in weekDays"
            :key="dia"
            class="pb-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink/70"
          >{{ dia.replace('.', '') }}</CalendarHeadCell>
        </CalendarGridRow>
      </CalendarGridHead>
      <CalendarGridBody>
        <CalendarGridRow v-for="(semana, i) in mes.rows" :key="i" class="grid grid-cols-7">
          <CalendarCell v-for="fecha in semana" :key="fecha.toString()" :date="fecha" class="flex justify-center p-0.5">
            <CalendarCellTrigger
              :day="fecha"
              :month="mes.value"
              class="inline-flex size-11 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest data-[today]:border data-[today]:border-forest data-[selected]:bg-forest data-[selected]:text-paper data-[disabled]:pointer-events-none data-[disabled]:text-ink/30 data-[outside-view]:text-ink/30 sm:size-10"
            />
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
</template>
