<script setup>
import { reactive, ref, computed, nextTick, watch, defineAsyncComponent } from 'vue'
import { MessageCircle, CircleAlert, ChevronDown, House, UtensilsCrossed, CircleCheck, Pencil } from 'lucide-vue-next'
import { PROMO_TEXT } from '../config.js'
import DateFieldPlaceholder from './DateFieldPlaceholder.vue'
import { cargarDateField } from '../lib/lazy.js'
import { MODALIDADES, modalidadElegida } from '../lib/modalidad.js'
import { formatLongDate } from '../lib/dates.js'

const DateField = defineAsyncComponent({ loader: cargarDateField, loadingComponent: DateFieldPlaceholder, delay: 0 })
import { EVENT_TYPES, validateQuote, buildQuoteMessage, whatsappUrl, openWhatsApp, todayIso } from '../lib/whatsapp.js'

const props = defineProps({
  promoActive: { type: Boolean, default: false },
})

const quote = reactive({
  modalidad: modalidadElegida.value,
  tipo: '',
  personas: '',
  fecha: '',
  nombre: '',
  lugar: '',
  documento: '',
})

// Si se eligió una modalidad desde la sección "Dos formas de arrendar", llega ya marcada.
watch(modalidadElegida, (valor) => { if (valor) quote.modalidad = valor })

const iconos = { espacio: House, alimentacion: UtensilsCrossed }

// En el formulario va primero la opción con alimentación.
const opcionesModalidad = [...MODALIDADES].reverse()

const documentos = [
  { valor: 'boleta', texto: 'Boleta' },
  { valor: 'factura', texto: 'Factura' },
]

const attempted = ref(false)
const formEl = ref(null)
const panelEl = ref(null)
const tituloEl = ref(null)
// Enlace del último mensaje armado. Con él se muestra la confirmación en vez del formulario.
const enlace = ref('')
const today = todayIso()

// Los errores aparecen recién al intentar enviar, y desde ahí se recalculan
// mientras la persona corrige.
const errors = computed(() => (attempted.value ? validateQuote(quote, { today }) : {}))

const FIELD_ORDER = ['modalidad', 'tipo', 'personas', 'fecha', 'nombre', 'documento']

async function onSubmit() {
  attempted.value = true
  const first = FIELD_ORDER.find((f) => errors.value[f])
  if (first) {
    await nextTick()
    formEl.value?.querySelector(`[name="${first}"]`)?.focus()
    return
  }
  enlace.value = whatsappUrl(buildQuoteMessage(quote, { promoActive: props.promoActive }))
  openWhatsApp(enlace.value)
}

function enfocarFecha() {
  formEl.value?.querySelector('#fecha')?.focus()
}

// Resumen de lo que se mandó, para la confirmación.
const resumen = computed(() => {
  const filas = [
    ['Modalidad', MODALIDADES.find((m) => m.valor === quote.modalidad)?.titulo],
    ['Evento', `${quote.tipo}, ${quote.personas} ${Number(quote.personas) === 1 ? 'persona' : 'personas'}`],
    ['Fecha', quote.fecha && formatLongDate(quote.fecha)],
    ['Documento', documentos.find((d) => d.valor === quote.documento)?.texto],
  ]
  return filas.filter(([, valor]) => valor)
})

// Al aparecer la confirmación: el foco pasa a su título y, como el formulario era más alto,
// la página se acomoda para mostrar la tarjeta completa bajo la barra superior.
function alMostrarConfirmacion() {
  tituloEl.value?.focus({ preventScroll: true })
  panelEl.value?.parentElement?.scrollIntoView({ block: 'nearest' })
}

// Campo que recibe el foco al volver al formulario (se monta recién terminado el fundido).
let enfocarAlVolver = ''

function alEntrar(el) {
  if (el === panelEl.value) alMostrarConfirmacion()
  else formEl.value?.querySelector(enfocarAlVolver)?.focus({ preventScroll: true })
}

// Vuelve al formulario con los datos tal cual, para corregir algo.
function editar() {
  enfocarAlVolver = 'button[type="submit"]'
  enlace.value = ''
}

function nuevaCotizacion() {
  Object.assign(quote, { modalidad: '', tipo: '', personas: '', fecha: '', nombre: '', lugar: '', documento: '' })
  modalidadElegida.value = ''
  attempted.value = false
  enfocarAlVolver = '[name="modalidad"]'
  enlace.value = ''
}

const control =
  'mt-2 block h-12 w-full rounded-md border border-sage bg-paper px-4 text-base text-ink transition-colors duration-150 placeholder:text-ink/45 hover:border-forest/60 focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-forest aria-[invalid=true]:border-2 aria-[invalid=true]:border-ink'
const selectControl = `${control} appearance-none pr-11`
const label = 'block text-sm font-semibold'
const groupTitle = 'text-xs font-semibold uppercase tracking-[0.14em] text-forest'
const errorText = 'mt-2 flex items-center gap-1.5 text-sm font-medium'
</script>

<template>
  <Transition name="cambio" mode="out-in" @after-enter="alEntrar">
    <div v-if="enlace" key="listo" ref="panelEl" class="flex flex-1 flex-col">
      <p :class="groupTitle" class="flex items-center gap-2">
        <CircleCheck :size="18" :stroke-width="2" aria-hidden="true" />Mensaje listo
      </p>
      <h3 ref="tituloEl" tabindex="-1" class="mt-4 text-3xl text-balance focus:outline-none">Revísalo y envíalo en
        WhatsApp</h3>
      <p class="mt-3 max-w-md leading-relaxed text-ink/70">
        Te abrimos WhatsApp con tu cotización escrita. Al enviarla, los dueños te responden con horarios y precio.
      </p>

      <div class="mt-7 rounded-md border border-sage">
        <div class="flex items-center justify-between gap-4 border-b border-sage py-1 pr-1 pl-4">
          <p class="text-sm font-semibold">Tu cotización</p>
          <button type="button"
            class="inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-forest transition-colors duration-150 hover:bg-mist/60"
            @click="editar">
            <Pencil :size="16" :stroke-width="1.5" aria-hidden="true" />Editar
          </button>
        </div>
        <dl class="divide-y divide-sage/60 px-4 text-sm">
          <div v-for="[campo, valor] in resumen" :key="campo" class="flex justify-between gap-4 py-3">
            <dt class="text-ink/70">{{ campo }}</dt>
            <dd class="text-right font-medium first-letter:uppercase">{{ valor }}</dd>
          </div>
        </dl>
      </div>

      <a :href="enlace" target="_blank" rel="noopener"
        class="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-forest px-7 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-forest/90">
        <MessageCircle :size="20" :stroke-width="1.5" aria-hidden="true" />
        Abrir WhatsApp otra vez
      </a>

      <p class="mt-auto pt-8 text-center text-sm text-ink/70">
        ¿Otro evento?
        <button type="button" class="font-semibold text-forest underline underline-offset-4 hover:text-forest/80"
          @click="nuevaCotizacion">
          Haz una nueva cotización
        </button>
      </p>
    </div>
    <form v-else key="form" ref="formEl" novalidate @submit.prevent="onSubmit">
      <fieldset>
        <legend :class="groupTitle">Tu evento</legend>

        <fieldset class="mt-5" :aria-describedby="errors.modalidad ? 'error-modalidad' : undefined">
          <legend :class="label">¿Cómo quieres arrendar?</legend>
          <div class="mt-2 grid gap-3 sm:grid-cols-2">
            <label v-for="m in opcionesModalidad" :key="m.valor"
              class="relative flex h-12 cursor-pointer items-center gap-3 rounded-md border bg-paper px-4 transition-colors duration-150 hover:border-forest/60 has-checked:border-forest has-checked:bg-mist/60 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest"
              :class="errors.modalidad ? 'border-2 border-ink' : 'border-sage'">
              <input v-model="quote.modalidad" type="radio" name="modalidad" :value="m.valor" class="peer sr-only"
                :aria-invalid="errors.modalidad ? 'true' : undefined" />
              <component :is="iconos[m.valor]" :size="22" :stroke-width="1.5" class="shrink-0 text-forest"
                aria-hidden="true" />
              <span class="text-sm font-semibold">{{ m.titulo }}</span>
            </label>
          </div>
          <p v-if="errors.modalidad" id="error-modalidad" :class="errorText">
            <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.modalidad }}
          </p>
        </fieldset>

        <div class="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label for="tipo" :class="label">Tipo de evento</label>
            <div class="relative">
              <select id="tipo" v-model="quote.tipo" name="tipo"
                :class="[selectControl, 'selector', !quote.tipo && 'text-ink/70']"
                :aria-invalid="errors.tipo ? 'true' : undefined"
                :aria-describedby="errors.tipo ? 'error-tipo' : undefined">
                <option value="" disabled>Selecciona</option>
                <option v-for="tipo in EVENT_TYPES" :key="tipo" :value="tipo" class="text-ink">{{ tipo }}</option>
              </select>
              <ChevronDown :size="18" :stroke-width="1.5" class="pointer-events-none absolute right-4 bottom-3.75"
                aria-hidden="true" />
            </div>
            <p v-if="errors.tipo" id="error-tipo" :class="errorText">
              <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.tipo }}
            </p>
          </div>

          <div>
            <label for="personas" :class="label">Cantidad de personas</label>
            <input id="personas" v-model="quote.personas" name="personas" type="number" inputmode="numeric" min="1"
              max="35" placeholder="Hasta 35" :class="control" :aria-invalid="errors.personas ? 'true' : undefined"
              :aria-describedby="errors.personas ? 'error-personas' : undefined" />
            <p v-if="errors.personas" id="error-personas" :class="errorText">
              <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.personas }}
            </p>
          </div>

          <div class="sm:col-span-2">
            <!-- Como en los demás campos, la etiqueta solo enfoca; el calendario se abre desde el campo. -->
            <label id="etiqueta-fecha" for="fecha" :class="label" @click.prevent="enfocarFecha">Fecha</label>
            <DateField v-model="quote.fecha" :min="today" :invalid="!!errors.fecha"
              :describedby="errors.fecha ? 'error-fecha ayuda-fecha' : 'ayuda-fecha'" />
            <p v-if="errors.fecha" id="error-fecha" :class="errorText">
              <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.fecha }}
            </p>
            <p id="ayuda-fecha" class="mt-2 text-sm text-ink/70">Los horarios disponibles te los confirmamos por
              WhatsApp.</p>
          </div>
        </div>
      </fieldset>

      <fieldset class="mt-8 border-t border-sage pt-7">
        <legend class="float-left w-full" :class="groupTitle">Tus datos</legend>

        <div class="clear-both grid gap-5 pt-5 sm:grid-cols-2">
          <div>
            <label for="nombre" :class="label">Nombre</label>
            <input id="nombre" v-model="quote.nombre" name="nombre" type="text" autocomplete="name" :class="control"
              :aria-invalid="errors.nombre ? 'true' : undefined"
              :aria-describedby="errors.nombre ? 'error-nombre' : undefined" />
            <p v-if="errors.nombre" id="error-nombre" :class="errorText">
              <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.nombre }}
            </p>
          </div>
          <div>
            <label for="lugar" :class="label">Lugar de trabajo <span
                class="font-normal text-ink/70">(opcional)</span></label>
            <input id="lugar" v-model="quote.lugar" name="lugar" type="text" autocomplete="organization"
              :class="control" />
          </div>
          <fieldset class="sm:col-span-2" :aria-describedby="errors.documento ? 'error-documento' : undefined">
            <legend :class="label">Documento tributario</legend>
            <div class="mt-2 grid grid-cols-2 gap-3">
              <label v-for="doc in documentos" :key="doc.valor"
                class="flex h-12 cursor-pointer items-center justify-center rounded-md border bg-paper text-sm font-semibold transition-colors duration-150 hover:border-forest/60 has-checked:border-forest has-checked:bg-mist/60 has-checked:text-forest has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest"
                :class="errors.documento ? 'border-2 border-ink' : 'border-sage'">
                <input v-model="quote.documento" type="radio" name="documento" :value="doc.valor" class="sr-only"
                  :aria-invalid="errors.documento ? 'true' : undefined" />
                {{ doc.texto }}
              </label>
            </div>
            <p v-if="errors.documento" id="error-documento" :class="errorText">
              <CircleAlert :size="16" :stroke-width="2" aria-hidden="true" />{{ errors.documento }}
            </p>
          </fieldset>
        </div>
      </fieldset>

      <div class="mt-8 space-y-3">
        <p v-if="promoActive" class="rounded-md bg-mist px-4 py-3 text-sm font-medium text-forest">
          {{ PROMO_TEXT }}
        </p>
        <button type="submit"
          class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-forest px-7 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-forest/90">
          <MessageCircle :size="20" :stroke-width="1.5" aria-hidden="true" />
          Enviar por WhatsApp
        </button>
      </div>
    </form>
  </Transition>
</template>

<style scoped>
.cambio-enter-active,
.cambio-leave-active {
  transition: opacity 200ms ease;
}

.cambio-enter-from,
.cambio-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

  .cambio-enter-active,
  .cambio-leave-active {
    transition: none;
  }
}
</style>
