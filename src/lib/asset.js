// Ruta a un archivo de public/ respetando la carpeta base del sitio
// ('/' en un dominio propio, '/nombre-repo/' en GitHub Pages).
export function asset(path) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
