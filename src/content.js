import { Flame, CookingPot, Refrigerator, Sofa, Tv, Heater, Toilet, SquareParking } from 'lucide-vue-next'

export const USOS = [
  { title: 'Fin de año', text: 'Asado o cena para todos, sin compartir el espacio.' },
  { title: 'Aniversarios y despedidas', text: 'Por unas horas o el día completo.' },
  { title: 'Reuniones y capacitaciones', text: 'Wifi, TV y enchufes para trabajar antes de celebrar.' },
]

// Textos de largo parejo (24 a 28 caracteres) para que entren en una línea
// y la grilla no se descuadre.
export const EQUIPAMIENTO = [
  { icon: Flame, title: 'Parrilla interior', text: 'Asados en cualquier clima.' },
  { icon: CookingPot, title: 'Cocina equipada', text: 'Con vajilla y utensilios.' },
  { icon: Refrigerator, title: 'Refrigeración', text: 'Refrigerador y congelador.' },
  { icon: Sofa, title: 'Sillas y sillones', text: 'Asientos para todo el grupo.' },
  { icon: Tv, title: 'Wifi, TV y sonido', text: 'Para presentar o celebrar.' },
  { icon: Heater, title: 'Calefacción', text: 'Cómodo en pleno invierno.' },
  { icon: Toilet, title: 'Baños', text: 'Limpios y listos para usar.' },
  { icon: SquareParking, title: 'Estacionamiento', text: 'Dentro del mismo recinto.' },
]

export const GALERIA = [
  { src: '/images/galeria/01.jpg', label: 'Mesas armadas', alt: 'Mesas del quincho armadas para un grupo' },
  { src: '/images/galeria/02.jpg', label: 'Cocina', alt: 'Cocina equipada del quincho' },
  { src: '/images/galeria/03.jpg', label: 'Living con TV', alt: 'Zona de sillones con TV' },
  { src: '/images/galeria/04.jpg', label: 'Parrilla interior', alt: 'Parrilla interior del quincho' },
  { src: '/images/galeria/05.jpg', label: 'Celebraciones', alt: 'Grupo de trabajo conversando en el quincho' },
  { src: '/images/galeria/06.jpg', label: 'Madera y ventanales', alt: 'Detalle de madera y ventanales del quincho' },
  { src: '/images/galeria/07.jpg', label: 'Estacionamiento', alt: 'Acceso y estacionamiento dentro del recinto' },
  { src: '/images/galeria/08.jpg', label: 'Exterior', alt: 'Exterior del quincho con el paisaje alrededor' },
]

// Marcadores: reemplazar por testimonios reales y activar TESTIMONIOS_VISIBLES en src/config.js.
export const TESTIMONIOS = [
  { quote: '[Testimonio pendiente]', author: '[Nombre, lugar de trabajo]' },
  { quote: '[Testimonio pendiente]', author: '[Nombre, lugar de trabajo]' },
  { quote: '[Testimonio pendiente]', author: '[Nombre, lugar de trabajo]' },
]
