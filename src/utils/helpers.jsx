// ── Stop TTS ──────────────────────────────────────────────────
export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
 
// ── Geolocation ───────────────────────────────────────────────
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      err => reject(err),
      { timeout: 8000, enableHighAccuracy: true }
    )
  })
}
 
export function buildMapsLink(lat, lng) {
  return `https://maps.google.com/?q=${lat},${lng}`
}
 
// Returns a Google Maps search URL for nearest hospital/police
export function buildNearestSearch(type, lat, lng) {
  const query = type === 'medical' ? 'ambulance+hospital+near+me' : 'police+station+near+me'
  if (lat && lng) {
    return `https://www.google.com/maps/search/${query}/@${lat},${lng},14z`
  }
  return `https://www.google.com/maps/search/${query}`
}
 
// India emergency numbers (fallback numbers for other countries too)
export const EMERGENCY_NUMBERS = {
  medical: {
    primary: '112',       // National Emergency (India)
    ambulance: '108',     // Ambulance (India)
    label: 'Ambulance',
  },
  police: {
    primary: '112',       // National Emergency (India)
    police: '100',        // Police (India)
    label: 'Police',
  },
}
 
// ── Vibration ─────────────────────────────────────────────────
export function vibrate(pattern = [200, 100, 200, 100, 400]) {
  if ('vibrate' in navigator) navigator.vibrate(pattern)
}
 
// ── Screen Flash ──────────────────────────────────────────────
export function flashScreen(times = 3) {
  let count = 0
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:9999;pointer-events:none;opacity:0;transition:opacity 0.1s'
  document.body.appendChild(overlay)
  const flash = () => {
    if (count >= times * 2) { overlay.remove(); return }
    overlay.style.opacity = count % 2 === 0 ? '0.9' : '0'
    count++
    setTimeout(flash, 150)
  }
  flash()
}