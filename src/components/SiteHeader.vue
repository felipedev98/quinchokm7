<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useWindowScroll, useIntersectionObserver } from '@vueuse/core'
import { Menu } from 'lucide-vue-next'
import { asset } from '../lib/asset.js'
import { trackOverlay } from '../lib/overlays.js'
import { cargarMobileMenu } from '../lib/lazy.js'

// El panel del menú (Reka UI + motion-v) se descarga aparte: al estar ocioso,
// o apenas el dedo o el mouse se acercan al botón.
// Si la descarga falla, el botón vuelve a quedar listo para reintentar.
const MobileMenu = defineAsyncComponent(() =>
  cargarMobileMenu().catch((error) => {
    open.value = false
    menuUsado.value = false
    throw error
  }),
)

const links = [
  { href: '#celebraciones', label: 'Celebraciones' },
  { href: '#equipamiento', label: 'Equipamiento' },
  { href: '#arriendo', label: 'Arriendo' },
  { href: '#espacio', label: 'Espacio' },
  { href: '#ubicacion', label: 'Ubicación' },
]

// Sombra de la barra al hacer scroll.
const { y } = useWindowScroll()

// Menú móvil
const open = ref(false)
const menuUsado = ref(false)
const openBtn = ref(null)
trackOverlay(open)

function precargarMenu() {
  cargarMobileMenu()
}

function abrirMenu() {
  menuUsado.value = true
  open.value = true
}

// Sección visible, para marcar su link en el menú.
const activa = ref('')
const visibles = new Map()
let detener = () => { }

onMounted(() => {
  const secciones = links.map((l) => document.querySelector(l.href)).filter(Boolean)
  if (!secciones.length) return
  const { stop } = useIntersectionObserver(
    secciones,
    (entradas) => {
      for (const e of entradas) visibles.set(e.target.id, e.isIntersecting)
      activa.value = links.map((l) => l.href.slice(1)).find((id) => visibles.get(id)) ?? ''
    },
    { threshold: 0.4 },
  )
  detener = stop
})

onBeforeUnmount(() => detener())
</script>

<template>
  <header
    class="barra-entrada group sticky top-0 z-40 bg-paper/90 backdrop-blur-md transition-shadow duration-300 data-scrolled:shadow-[0_6px_24px_-12px_rgb(42_46_40/0.35)]"
    :data-scrolled="y > 8 || undefined">
    <div
      class="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 transition-[height] duration-300 ease-out group-data-scrolled:h-18 sm:h-24 sm:px-6 sm:group-data-scrolled:h-20 lg:px-8">
      <a href="#" class="shrink-0">
        <img :src="asset('km7-logo.svg')" alt="QuinchoKM7" width="515" height="79"
          class="h-6 w-auto origin-left transition-transform duration-300 ease-out sm:h-8 sm:group-data-scrolled:scale-90" />
      </a>

      <nav aria-label="Principal" class="ml-auto hidden md:block">
        <ul class="flex items-center gap-8 text-sm font-medium">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="py-2 transition-colors duration-150 hover:text-forest"
              :class="activa === link.href.slice(1) ? 'text-forest' : 'text-ink/80'"
              :aria-current="activa === link.href.slice(1) ? 'location' : undefined">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-1 md:ml-8">
        <a href="#cotiza"
          class="inline-flex min-h-11 items-center whitespace-nowrap rounded-md bg-forest px-4 text-[0.8125rem] font-semibold text-paper transition-colors duration-200 hover:bg-forest/90 sm:px-5 sm:text-sm">
          <span class="sm:hidden">Cotizar</span>
          <span class="hidden sm:inline">Cotiza tu evento</span>
        </a>

        <button ref="openBtn" type="button"
          class="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-ink md:hidden"
          aria-label="Abrir menú" aria-haspopup="dialog" :aria-expanded="String(open)" @pointerenter="precargarMenu"
          @touchstart.passive="precargarMenu" @focus="precargarMenu" @click="abrirMenu">
          <Menu :size="24" :stroke-width="1.5" aria-hidden="true" />
        </button>
        <MobileMenu v-if="menuUsado" v-model:open="open" :links="links" :activa="activa" :retorno="openBtn" />
      </div>
    </div>
  </header>
</template>

<style>
/* La barra entra desde arriba al cargar. */
@media (prefers-reduced-motion: no-preference) {
  .barra-entrada {
    animation: barra-bajar 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
}

@keyframes barra-bajar {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
