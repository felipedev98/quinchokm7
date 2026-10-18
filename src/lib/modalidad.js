import { ref } from 'vue'

// Las dos formas de arrendar. Textos usados por la sección "Dos formas de arrendar",
// el formulario y el mensaje de WhatsApp.
export const MODALIDADES = [
  {
    valor: 'espacio',
    titulo: 'Solo el espacio',
    resumen: 'Arriendas el quincho completo y equipado para tu grupo.',
    mensaje: 'Me interesa arrendar solo el quincho.',
  },
  {
    valor: 'alimentacion',
    titulo: 'Espacio con alimentación',
    resumen: 'Preparamos la comida para tu grupo. Pago único con salón, comida y aseo.',
    mensaje: 'Me interesa el quincho con servicio de alimentación.',
  },
]

// Modalidad elegida desde la sección: el formulario la toma ya marcada.
export const modalidadElegida = ref('')
