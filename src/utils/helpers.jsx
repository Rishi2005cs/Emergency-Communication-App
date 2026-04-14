export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
 
// Geolocation
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
 
// Vibration
export function vibrate(pattern = [200, 100, 200, 100, 400]) {
  if ('vibrate' in navigator) navigator.vibrate(pattern)
}
 
// Flash screen
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
 
// Speech recognition
export function startListening(onResult, onEnd) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const recognition = new SR()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = 'en-US'
  recognition.onresult = (e) => onResult(e.results[0][0].transcript)
  recognition.onend = onEnd
  recognition.start()
  return recognition
}