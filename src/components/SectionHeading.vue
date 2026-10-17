<script setup>
import { computed } from 'vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  emphasis: { type: String, default: '' },
  level: { type: Number, default: 2 },
  tone: { type: String, default: 'light' },
})

const parts = computed(() => {
  const i = props.emphasis ? props.title.indexOf(props.emphasis) : -1
  if (i === -1) return { before: props.title, em: '', after: '' }
  return {
    before: props.title.slice(0, i),
    em: props.emphasis,
    after: props.title.slice(i + props.emphasis.length),
  }
})

const dark = computed(() => props.tone === 'dark')
</script>

<template>
  <div>
    <p
      v-if="eyebrow"
      class="mb-5 text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em]"
      :class="dark ? 'text-paper/80' : 'text-forest'"
    >
      {{ eyebrow }}
    </p>
    <component
      :is="`h${level}`"
      class="leading-[1.02]"
      :class="[
        level === 1 ? 'text-[2.875rem] sm:text-6xl lg:text-[5.25rem]' : 'text-[2.5rem] sm:text-5xl lg:text-6xl',
        dark ? 'text-paper' : 'text-ink',
      ]"
    >{{ parts.before }}<em
        v-if="parts.em"
        class="italic"
        :class="dark ? 'text-paper' : 'text-forest'"
      >{{ parts.em }}</em>{{ parts.after }}</component>
  </div>
</template>
