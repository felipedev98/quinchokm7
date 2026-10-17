export function osmEmbedUrl({ lat, lng }, delta = 0.01) {
  const params = new URLSearchParams({
    bbox: [lng - delta, lat - delta, lng + delta, lat + delta].join(','),
    layer: 'mapnik',
    marker: `${lat},${lng}`,
  })
  return `https://www.openstreetmap.org/export/embed.html?${params}`
}

export function directionsUrl({ lat, lng }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
