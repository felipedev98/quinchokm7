<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { MessageCircle, CircleAlert, ChevronDown } from 'lucide-vue-next'
import { PROMO_TEXT } from '../config.js'
import { EVENT_TYPES, validateQuote, buildQuoteMessage, whatsappUrl, openWhatsApp, todayIso } from '../lib/whatsapp.js'

const props = defineProps({
  promoActive: { type: Boolean, default: false },
})

const quote = reactive({
  tipo: '',
  personas: '',
  fecha: '',
  nombre: '',
  lugar: '',
  documento: '',
})

const attempted = ref(false)
const formEl = ref(null)
const today = todayIso()

// Los errores aparecen recién al intentar enviar, y desde ahí se recalculan
// mientras la persona corrige.
const errors = computed(() => (attempted.value ? validateQuote(quote, { today }) : {}))

const FIELD_ORDER = ['tipo', 'personas', 'fecha', 'nombre', 'documento']

async function onSubmit() {
  attempted.value = true
  const first = FIELD_ORDER.find((f) => errors.value[f])
  if (first) {
    await nextTick()
    formEl.value?.querySelector(`[name="${first}"]`)?.focus()
    return
  }
  openWhatsApp(whatsappUrl(buildQuoteMessage(quote, { promoActive: props.promoActive })))
}

const control =
  'mt-2 block h-12 w-full rounded-md border border-sage bg-paper px-4 text-base text-ink transition-colors duration-150 placeholder:text-ink/45 hover:border-forest/60 focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'
const selectControl = `${control} appearance-none pr-11`
const label = 'block text-sm font-semibold'
const groupTitle = 'text-xs font-semibold uppercase tracking-[0.14em] text-forest'
const errorText = 'mt-2 flex items-center gap-1.5 text-sm font-medium'
</script>

<template>
  <form ref="formEl" novalidate @submit.prevent="onSubmit">
    <fieldset>
      <legend :class="groupTitle">Tu evento</legend>

      <div class="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label for="tipo" :class="label">Tipo de evento</label>
          <div class="relative">
            <select
              id="tipo"
              v-model="quote.tipo"
              name="tipo"
              :class="[selectControl, !quote.tipo && 'text-ink/70']"
              :aria-invalid="errors.tipo ? 'true' : undefined"
              :aria-describedby="errors.tipo ? 'error-tipo' : undefined"
            >
              <option value="" disabled>Selecciona</option>
              <option v-for="tipo in EVENT_TYPES" :key="tipo" :value="tipo" class="text-ink">{{ tipo }}</option>
            </select>
            <ChevronDown :size="18" :stroke-width="1.5" class="pointer-events-none absolute right-4 bottom-3.75" aria-hidden="true" />
          </div>
          <p v-if="errors.tipo" id="error-tipo" :class="errorText">
            <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.tipo }}
          </p>
        </div>

        <div>
          <label for="personas" :class="label">Cantidad de personas</label>
          <input
            id="personas"
            v-model="quote.personas"
            name="personas"
            type="number"
            inputmode="numeric"
            min="1"
            max="35"
            placeholder="Hasta 35"
            :class="control"
            :aria-invalid="errors.personas ? 'true' : undefined"
            :aria-describedby="errors.personas ? 'error-personas' : undefined"
          />
          <p v-if="errors.personas" id="error-personas" :class="errorText">
            <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.personas }}
          </p>
        </div>

        <div class="sm:col-span-2">
          <label for="fecha" :class="label">Fecha</label>
          <input
            id="fecha"
            v-model="quote.fecha"
            name="fecha"
            type="date"
            :min="today"
            :class="control"
            :aria-invalid="errors.fecha ? 'true' : undefined"
            :aria-describedby="errors.fecha ? 'error-fecha ayuda-fecha' : 'ayuda-fecha'"
          />
          <p v-if="errors.fecha" id="error-fecha" :class="errorText">
            <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.fecha }}
          </p>
          <p id="ayuda-fecha" class="mt-2 text-sm text-ink/70">Los horarios disponibles te los confirmamos por WhatsApp.</p>
        </div>
      </div>
    </fieldset>

    <fieldset class="mt-8 border-t border-sage pt-7">
      <legend class="float-left w-full" :class="groupTitle">Tus datos</legend>

      <div class="clear-both grid gap-5 pt-5 sm:grid-cols-2">
        <div>
          <label for="nombre" :class="label">Nombre</label>
          <input
            id="nombre"
            v-model="quote.nombre"
            name="nombre"
            type="text"
            autocomplete="name"
            :class="control"
            :aria-invalid="errors.nombre ? 'true' : undefined"
            :aria-describedby="errors.nombre ? 'error-nombre' : undefined"
          />
          <p v-if="errors.nombre" id="error-nombre" :class="errorText">
            <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.nombre }}
          </p>
        </div>
        <div>
          <label for="lugar" :class="label">Lugar de trabajo <span class="font-normal text-ink/70">(opcional)</span></label>
          <input id="lugar" v-model="quote.lugar" name="lugar" type="text" autocomplete="organization" :class="control" />
        </div>
        <div class="sm:col-span-2">
          <label for="documento" :class="label">Documento tributario</label>
          <div class="relative">
            <select
              id="documento"
              v-model="quote.documento"
              name="documento"
              :class="[selectControl, !quote.documento && 'text-ink/70']"
              :aria-invalid="errors.documento ? 'true' : undefined"
              :aria-describedby="errors.documento ? 'error-documento' : undefined"
            >
              <option value="" disabled>Selecciona</option>
              <option value="boleta" class="text-ink">Boleta</option>
              <option value="factura" class="text-ink">Factura</option>
            </select>
            <ChevronDown :size="18" :stroke-width="1.5" class="pointer-events-none absolute right-4 bottom-3.75" aria-hidden="true" />
          </div>
          <p v-if="errors.documento" id="error-documento" :class="errorText">
            <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.documento }}
          </p>
        </div>
      </div>
    </fieldset>

    <div class="mt-8 space-y-3">
      <p v-if="promoActive" class="rounded-md bg-mist px-4 py-3 text-sm font-medium text-forest">
        {{ PROMO_TEXT }}
      </p>
      <button
        type="submit"
        class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-forest px-7 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-forest/90"
      >
        <MessageCircle :size="20" :stroke-width="1.5" aria-hidden="true" />
        Enviar por WhatsApp
      </button>
    </div>
  </form>
</template>
