import { ref } from 'vue'

// Partes que no se ven al cargar la página: se descargan aparte y se precargan
// cuando el navegador está ocioso, para no retrasar la portada.
export const cargarDateField = () => import('../components/DateField.vue')
export const cargarLightbox = () => import('../components/Lightbox.vue')
export const cargarMobileMenu = () => import('../components/MobileMenu.vue')

export function precargarAlEstarOcioso() {
  const precargar = () => {
    cargarDateField()
    cargarLightbox()
    cargarMobileMenu()
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(precargar, { timeout: 4000 })
  else setTimeout(precargar, 2500)
}

// Si alguien toca el campo de fecha antes de que el calendario termine de descargarse,
// el pedido queda guardado y el calendario se abre apenas carga.
export const pedidoAbrirFecha = ref(false)
