import { Flame, CookingPot, Refrigerator, Sofa, Tv, Heater, Toilet, SquareParking } from 'lucide-vue-next'

export const USOS = [
  { title: 'Fin de año', text: 'Asado o cena para todo el equipo' },
  { title: 'Aniversarios y despedidas', text: 'Por unas horas o el día completo.' },
  { title: 'Reuniones y capacitaciones', text: 'WiFi y TV para trabajar antes de celebrar.' },
]

// Textos de largo parejo (24 a 28 caracteres) para que entren en una línea
// y la grilla no se descuadre.
export const EQUIPAMIENTO = [
  { icon: Flame, title: 'Parrilla interior', text: 'Asados en cualquier clima.' },
  { icon: CookingPot, title: 'Cocina equipada', text: 'Con vajilla y utensilios.' },
  { icon: Refrigerator, title: 'Refrigeración', text: 'Refrigerador y congelador.' },
  { icon: Sofa, title: 'Sillas y sillones', text: 'Asientos para todo el grupo.' },
  { icon: Tv, title: 'WiFi, TV y sonido', text: 'Para presentar o celebrar.' },
  { icon: Heater, title: 'Calefacción', text: 'Cómodo en pleno invierno.' },
  { icon: Toilet, title: 'Baños', text: 'Limpios y listos para usar.' },
  { icon: SquareParking, title: 'Estacionamiento', text: 'Dentro del mismo recinto.' },
]

// Fotos del lugar (public/images/quincho). Solo texto alternativo: la galería no lleva leyendas.
export const GALERIA = [
  { src: '/images/quincho/quincho-km7-salon-armado-para-evento.webp', alt: 'Salón con mesas armadas para un evento, con sillones junto al ventanal' },
  { src: '/images/quincho/quincho-km7-salon-principal-coyhaique.webp', alt: 'Salón principal del QuinchoKM7 con mesas, barra, sillones y ventanales' },
  { src: '/images/quincho/quincho-km7-mesas-largas-con-ventanal.webp', alt: 'Mesas largas puestas con bancas, junto al ventanal y los sillones' },
  { src: '/images/quincho/quincho-km7-comedor-con-ventanal.webp', alt: 'Comedor con mesas de mantel a cuadros y un gran ventanal hacia los árboles' },
  { src: '/images/quincho/quincho-km7-mesa-larga-puesta.webp', alt: 'Mesa larga puesta con platos, copas y cubiertos para todo el grupo' },
  { src: '/images/quincho/quincho-km7-salon-con-sillones-y-plantas.webp', alt: 'Mesas puestas y zona de sillones junto a los ventanales del quincho' },
  { src: '/images/quincho/quincho-km7-salon-con-mesas-para-grupos.webp', alt: 'Salón con mesas largas puestas para grupos y la cocina a leña al fondo' },
  { src: '/images/quincho/quincho-km7-mesa-junto-al-ventanal.webp', alt: 'Mesa para dos junto al ventanal con vista al jardín' },
  { src: '/images/quincho/quincho-km7-mesas-armadas-junto-al-ventanal.webp', alt: 'Mesas armadas para un evento junto al ventanal' },
  { src: '/images/quincho/quincho-km7-salon-con-tv-y-barra.webp', alt: 'Salón con TV, barra con taburetes y mesas para el grupo' },
  { src: '/images/quincho/quincho-km7-mesas-puestas-para-el-grupo.webp', alt: 'Mesas puestas para el grupo, con bancas y sillas, en el salón de madera' },
  { src: '/images/quincho/quincho-km7-sillones-con-vista-al-cerro.webp', alt: 'Sillones junto al ventanal con vista al cerro y los campos' },
  { src: '/images/quincho/quincho-km7-cocina-a-lena-y-mesa-de-te.webp', alt: 'Cocina a leña y mesa con termo, tazas y flores' },
  { src: '/images/quincho/quincho-km7-techo-de-vigas-de-madera.webp', alt: 'Salón con techo alto de vigas de madera y mesas armadas' },
  { src: '/images/quincho/quincho-km7-salon-amplio-con-barra.webp', alt: 'Vista amplia del salón con barra, mesas y ventanales' },
]
