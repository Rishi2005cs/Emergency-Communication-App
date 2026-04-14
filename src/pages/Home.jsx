import React, { useState, useCallback, useRef } from 'react'
import { stopSpeaking, getLocation, buildMapsLink, vibrate, flashScreen } from '../utils/helpers'
import { useApp } from '../context/AppContext'
import styles from './Home.module.css'
 
const EMERGENCIES = [
  {
    id: 'help',
    label: 'HELP',
    icon: '🆘',
    color: '#ff2d2d',
    glow: 'rgba(255,45,45,0.4)',
    message: 'HELP! I need assistance immediately!',
    tts: 'Help! I need assistance immediately! Please help me!',
  },
  {
    id: 'medical',
    label: 'MEDICAL',
    icon: '🏥',
    color: '#ffaa00',
    glow: 'rgba(255,170,0,0.4)',
    message: 'MEDICAL EMERGENCY! Call an ambulance!',
    tts: 'Medical emergency! Please call an ambulance immediately!',
  },
  {
    id: 'police',
    label: 'POLICE',
    icon: '🚔',
    color: '#2d8fff',
    glow: 'rgba(45,143,255,0.4)',
    message: 'CALL POLICE! I am in danger!',
    tts: 'Call the police! I am in danger! Please help me!',
  },
]
 
export default function Home() {
  const { customPhrases, addHistory, setActiveAlert, speak, addMessage, getAIResponse, messages } = useApp()  
  const [input, setInput] = useState('')
  const [alert, setAlert] = useState(null)
  const [location, setLocation] = useState(null)
  const [locLoading, setLocLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recogRef = useRef(null)

  const sendMessage = async (textOverride) => {
    const text = textOverride || input
    if (!text.trim()) return

    addMessage(text, "user")
    if (!textOverride) setInput('')
    
    setIsTyping(true)
    const aiResponse = await getAIResponse(text)
    setIsTyping(false)
    
    addMessage(aiResponse, "ai")
    speak(aiResponse)
  }
 
  const trigger = useCallback(async (emergency) => {
    vibrate([300, 100, 300, 100, 600])
    flashScreen(2)
 
    setLocLoading(true)
    let loc = null
    try {
      loc = await getLocation()
      setLocation(loc)
    } catch { /* location optional */ }
    setLocLoading(false)
 
    const mapsLink = loc ? buildMapsLink(loc.lat, loc.lng) : null
    const fullMessage = loc
      ? `${emergency.message} My location: ${mapsLink}`
      : emergency.message
 
    const entry = { id: Date.now(), type: emergency.id, label: emergency.label, message: fullMessage, time: new Date().toISOString(), location: loc }
    addHistory(entry)
    setAlert({ ...emergency, fullMessage, mapsLink, loc })
    setActiveAlert(entry)
 
    setSpeaking(true)
    const tts = loc ? `${emergency.tts} My location has been shared.` : emergency.tts
    speak(tts, { rate: 0.8 })
    setTimeout(() => setSpeaking(false), 5000)
  }, [addHistory, setActiveAlert, speak])
 
  const dismiss = () => {
    stopSpeaking()
    setSpeaking(false)
    setAlert(null)
    setActiveAlert(null)
  }
 
  const reTTS = () => {
    if (!alert) return
    setSpeaking(true)
    speak(alert.tts)
    setTimeout(() => setSpeaking(false), 4000)
  }
 
  const copyMessage = () => {
    if (alert) navigator.clipboard?.writeText(alert.fullMessage)
  }
 
  const startListeningMode = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Speech recognition not supported')
      return
    }

    const r = new SR()
    r.lang = 'en-IN'
    r.interimResults = false
    r.maxAlternatives = 1

    setListening(true)

    r.onresult = (e) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      sendMessage(text)
    }

    r.onerror = () => setListening(false)
    r.onend = () => setListening(false)

    r.start()
  }
 
  if (alert) return <AlertScreen alert={alert} locLoading={locLoading} speaking={speaking} onDismiss={dismiss} onReTTS={reTTS} onCopy={copyMessage} />
 
  return (
    <div className={styles.page}>
      <p className={styles.subtitle}>One tap · Your voice · Your safety</p>
 
      <div className={styles.buttonGrid}>
        {EMERGENCIES.map(e => (
          <EmergencyButton key={e.id} emergency={e} onTrigger={trigger} />
        ))}
      </div>
 
      {customPhrases.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Custom Phrases</h3>
          <div className={styles.phraseGrid}>
            {customPhrases.map(p => (
              <button key={p.id} className={styles.phraseBtn} onClick={() => speak(p.text)}>
                <span className={styles.phraseIcon}>{p.icon || '💬'}</span>
                <span>{p.text}</span>
              </button>
            ))}
          </div>
        </section>
      )}
 
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Voice Input</h3>
        <button className={`${styles.listenBtn} ${listening ? styles.listening : ''}`} onClick={startListeningMode} disabled={listening}>
          {listening ? '🎙️ Listening...' : '🎤 Speak to Convert'}
        </button>
        {transcript && (
          <div className={styles.transcript}>
            <p className={styles.transcriptLabel}>Heard:</p>
            <p className={styles.transcriptText}>"{transcript}"</p>
            <button className={styles.speakAgain} onClick={() => speak(transcript)}>🔊 Speak Again</button>
          </div>
        )}
      </section>
      
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Chat</h3>
        
        <div className={styles.chatMessages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.chatBubble} ${m.sender === 'ai' ? styles.aiBubble : ''}`}>
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.chatBubble} ${styles.aiBubble} ${styles.typing}`}>
              Thinking...
            </div>
          )}
        </div>

        <div className={styles.chatBox}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.chatInput}
          />

          <button onClick={() => sendMessage()} className={styles.sendBtn}>
            📤 Send
          </button>

          <button onClick={() => speak(input)} className={styles.speakBtn}>
            🔊 Speak
          </button>
        </div>
      </section>

      <p className={styles.hint}>Tap any button to broadcast your emergency with voice + location</p>
    </div>
  )
}
 
function EmergencyButton({ emergency, onTrigger }) {
  const [pressed, setPressed] = useState(false)
  const handlePress = () => {
    setPressed(true)
    onTrigger(emergency)
    setTimeout(() => setPressed(false), 600)
  }
  return (
    <button
      className={`${styles.eBtn} ${pressed ? styles.eBtnPressed : ''}`}
      style={{ '--color': emergency.color, '--glow': emergency.glow }}
      onClick={handlePress}
      aria-label={`Send ${emergency.label} alert`}
    >
      <div className={styles.eBtnRing} />
      <div className={styles.eBtnRing2} />
      <span className={styles.eBtnIcon}>{emergency.icon}</span>
      <span className={styles.eBtnLabel}>{emergency.label}</span>
    </button>
  )
}
 
function AlertScreen({ alert, locLoading, speaking, onDismiss, onReTTS, onCopy }) {
  return (
    <div className={styles.alertScreen} style={{ '--color': alert.color, '--glow': alert.glow }}>
      <div className={styles.alertPulse} />
      <div className={styles.alertContent}>
        <div className={styles.alertIcon}>{alert.icon}</div>
        <h1 className={styles.alertTitle} style={{ color: alert.color }}>{alert.label}</h1>
        <p className={styles.alertMessage}>{alert.message}</p>
 
        {locLoading && <p className={styles.locLoading}>📡 Getting location...</p>}
        {alert.mapsLink && (
          <a href={alert.mapsLink} target="_blank" rel="noreferrer" className={styles.mapsLink}>
            📍 View My Location on Maps
          </a>
        )}
 
        {speaking && (
          <div className={styles.speakingIndicator}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <p>Speaking aloud…</p>
          </div>
        )}
 
        <div className={styles.alertActions}>
          <button className={styles.actionBtn} onClick={onReTTS}>🔊 Speak Again</button>
          <button className={styles.actionBtn} onClick={onCopy}>📋 Copy</button>
        </div>
 
        <button className={styles.dismissBtn} onClick={onDismiss}>✕ Dismiss Alert</button>
      </div>
    </div>
  )
}