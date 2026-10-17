<script setup>
import { asset } from '../lib/asset.js'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { WHATSAPP_DISPLAY } from '../config.js'
import { whatsappUrl, DIRECT_MESSAGE } from '../lib/whatsapp.js'

const links = [
  { href: '#celebraciones', label: 'Celebraciones' },
  { href: '#equipamiento', label: 'Equipamiento' },
  { href: '#espacio', label: 'Espacio' },
  { href: '#ubicacion', label: 'Ubicación' },
]

const expanded = ref(false)
const scrolled = ref(false)
const drawer = ref(null)
const scroller = ref(null)
const sheet = ref(null)
const openBtn = ref(null)
let observer
let focusTarget = null

const cssSupports = (...args) => typeof CSS !== 'undefined' && CSS.supports(...args)

// El panel es un scroller horizontal con dos puntos de anclaje:
// izquierda = cerrado (espaciador), derecha = abierto (panel).
// Así el gesto de deslizar para cerrar lo maneja el navegador.
// Sin soporte de popover (iOS < 17) se usa position: fixed con la clase is-open.
function showLayer() {
  if (typeof drawer.value.showPopover === 'function') drawer.value.showPopover()
  else drawer.value.classList.add('is-open')
}

function hideLayer() {
  if (typeof drawer.value?.hidePopover === 'function') drawer.value.hidePopover()
  else drawer.value?.classList.remove('is-open')
}

async function openDrawer() {
  showLayer()
  if (!cssSupports('scroll-initial-target', 'nearest')) {
    scroller.value.scrollTo({ left: 0, behavior: 'instant' })
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  }
  scroller.value.scrollTo({ left: scroller.value.scrollWidth, behavior: 'auto' })
}

// target: ancla elegida en el menú. Al cerrar, el foco va a esa sección
// con preventScroll; enfocar el botón cortaría el scroll hacia el ancla.
function closeDrawer(target = null) {
  focusTarget = target
  scroller.value?.scrollTo({ left: 0, behavior: 'auto' })
}

function restoreFocus() {
  const section = focusTarget && document.querySelector(focusTarget)
  focusTarget = null
  if (section) {
    if (!section.hasAttribute('tabindex')) section.setAttribute('tabindex', '-1')
    section.focus({ preventScroll: true })
  } else {
    openBtn.value?.focus({ preventScroll: true })
  }
}

function pagina() {
  return document.getElementById('pagina')
}

function onOpened() {
  if (expanded.value) return
  expanded.value = true
  if (pagina()) pagina().inert = true
  document.addEventListener('keydown', onKeydown)
  sheet.value?.focus()
}

function onClosed() {
  if (!expanded.value) return
  expanded.value = false
  hideLayer()
  if (pagina()) pagina().inert = false
  document.removeEventListener('keydown', onKeydown)
  restoreFocus()
}

function onKeydown(event) {
  if (event.key === 'Escape') closeDrawer()
}

function onDrawerClick(event) {
  if (!sheet.value.contains(event.target)) closeDrawer()
}

function onBackdropScroll() {
  const ratio = scroller.value.scrollLeft / sheet.value.offsetWidth
  drawer.value.style.setProperty('--drawer-backdrop', Math.min(Math.max(ratio, 0), 1))
}

function onPageScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onPageScroll()
  window.addEventListener('scroll', onPageScroll, { passive: true })
  const threshold = 1 / window.innerWidth
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries.at(-1)
      if (entry.intersectionRatio < threshold) onClosed()
      if (entry.intersectionRatio === 1) onOpened()
    },
    { root: drawer.value, threshold: [threshold, 1] },
  )
  observer.observe(sheet.value)

  if (!cssSupports('animation-timeline: scroll()')) {
    scroller.value.addEventListener('scroll', onBackdropScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onPageScroll)
  observer?.disconnect()
  document.removeEventListener('keydown', onKeydown)
  if (pagina()) pagina().inert = false
})
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-paper/90 backdrop-blur-md transition-shadow duration-200 data-scrolled:shadow-[0_6px_24px_-12px_rgb(42_46_40/0.35)]"
    :data-scrolled="scrolled || undefined"
  >
    <div class="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
      <a href="#" class="shrink-0">
        <img :src="asset('km7-logo.webp')" alt="QuinchoKM7" width="2560" height="386" class="logo h-6 w-auto sm:h-8" />
      </a>

      <nav aria-label="Principal" class="ml-auto hidden md:block">
        <ul class="flex items-center gap-8 text-sm font-medium">
          <li v-for="link in links" :key="link.href">
            <a :href="link.href" class="text-ink/80 transition-colors duration-150 hover:text-forest">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center gap-1 md:ml-8">
        <a
          href="#cotiza"
          class="inline-flex min-h-11 items-center whitespace-nowrap rounded-md bg-forest px-4 text-[0.8125rem] font-semibold text-paper sm:px-5 sm:text-sm transition-colors duration-200 hover:bg-forest/90"
        >
          <span class="sm:hidden">Cotizar</span>
          <span class="hidden sm:inline">Cotiza tu evento</span>
        </a>
        <button
          ref="openBtn"
          type="button"
          class="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-ink md:hidden"
          aria-label="Abrir menú"
          :aria-expanded="String(expanded)"
          aria-controls="menu-movil"
          @click="openDrawer"
        >
          <Menu :size="24" :stroke-width="1.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      id="menu-movil"
      ref="drawer"
      class="Drawer md:hidden"
      popover="manual"
      @click="onDrawerClick"
    >
      <div ref="scroller" class="Drawer-scroller">
        <div
          ref="sheet"
          class="Drawer-sheet bg-paper text-ink"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <div class="flex h-18 items-center justify-between border-b border-sage/60 px-6">
            <img :src="asset('km7-logo.webp')" alt="QuinchoKM7" width="2560" height="386" class="logo h-6 w-auto" />
            <button
              type="button"
              class="-mr-3 inline-flex size-11 items-center justify-center rounded-md"
              aria-label="Cerrar menú"
              @click="closeDrawer()"
            >
              <X :size="24" :stroke-width="1.5" aria-hidden="true" />
            </button>
          </div>

          <div class="flex flex-col justify-between gap-10 overflow-y-auto px-6 py-6">
            <nav aria-label="Menú móvil">
              <ul class="divide-y divide-sage/60">
                <li v-for="link in links" :key="link.href">
                  <a
                    :href="link.href"
                    class="flex min-h-14 items-center font-serif text-2xl"
                    @click="closeDrawer(link.href)"
                  >{{ link.label }}</a>
                </li>
              </ul>
              <a
                href="#cotiza"
                class="mt-8 flex min-h-12 items-center justify-center rounded-md bg-forest px-6 text-sm font-semibold text-paper"
                @click="closeDrawer('#cotiza')"
              >
                Cotiza tu evento
              </a>
            </nav>
            <a
              :href="whatsappUrl(DIRECT_MESSAGE)"
              target="_blank"
              rel="noopener"
              class="inline-flex min-h-11 items-center text-sm text-ink/70"
            >
              WhatsApp {{ WHATSAPP_DISPLAY }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* El archivo del logo trae margen transparente abajo: se recorta a la altura del dibujo. */
.logo {
  aspect-ratio: 2560 / 386;
  object-fit: cover;
  object-position: top;
}

.Drawer {
  --drawer-width: min(20rem, 85vw);
  --drawer-backdrop: 0;
  inset: 0;
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  overflow: visible;
}

.Drawer::backdrop {
  background: var(--color-moss);
  opacity: calc(var(--drawer-backdrop) * 0.6);
}

/* Espaciador a la izquierda (cerrado), panel a la derecha (abierto). */
.Drawer-scroller {
  display: grid;
  grid-template-columns: 100% var(--drawer-width);
  height: 100%;
  overflow-x: scroll;
  overscroll-behavior: none;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}

.Drawer-scroller::-webkit-scrollbar {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .Drawer-scroller {
    scroll-behavior: smooth;
  }
}

.Drawer-scroller::before {
  content: '';
  scroll-snap-align: start;
  scroll-initial-target: nearest;
}

.Drawer-sheet {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100svh;
  overflow-y: auto;
  scroll-snap-align: end;
  outline: none;
}

html:has(.Drawer:is(:popover-open, .is-open)) {
  overflow: hidden;
}

@supports not selector(:popover-open) {
  .Drawer {
    display: none;
    position: fixed;
    z-index: 50;
    background: rgb(42 46 40 / calc(var(--drawer-backdrop) * 0.6));
  }

  .Drawer.is-open {
    display: block;
  }
}

@supports (animation-timeline: scroll()) {
  .Drawer {
    timeline-scope: --drawer-fade;
    animation: fade-drawer-backdrop linear both;
    animation-timeline: --drawer-fade;
  }

  .Drawer-scroller {
    scroll-timeline: --drawer-fade x;
  }

  @property --drawer-backdrop {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  @keyframes fade-drawer-backdrop {
    0% { --drawer-backdrop: 0 }
    100% { --drawer-backdrop: 1 }
  }
}
</style>
