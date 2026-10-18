import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Si una parte que se carga aparte ya no existe (se publicó una versión nueva con el
// sitio abierto), se recarga una vez para traer la versión actual.
window.addEventListener('vite:preloadError', (evento) => {
  try {
    if (sessionStorage.getItem('qkm7-recargado')) return
    sessionStorage.setItem('qkm7-recargado', '1')
  } catch {
    return
  }
  evento.preventDefault()
  window.location.reload()
})

createApp(App).mount('#app')
