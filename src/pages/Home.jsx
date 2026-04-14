import React, { useState, useCallback, useRef, useEffect } from 'react'
import { stopSpeaking, getLocation, buildMapsLink, buildNearestSearch, EMERGENCY_NUMBERS, vibrate, flashScreen } from '../utils/helpers'
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
    callAction: null, // general help, no specific call
  },
  {
    id: 'medical',
    label: 'MEDICAL',
    icon: '🏥',
    color: '#ffaa00',
    glow: 'rgba(255,170,0,0.4)',
    message: 'MEDICAL EMERGENCY! Calling ambulance now!',
    tts: 'Medical emergency! Calling ambulance now! Please stand by!',
    callAction: 'medical',
  },
  {
    id: 'police',
    label: 'POLICE',
    icon: '🚔',
    color: '#2d8fff',
    glow: 'rgba(45,143,255,0.4)',
    message: 'CALLING POLICE! I am in danger!',
    tts: 'Calling the police now! I am in danger! Please stand by!',
    callAction: 'police',
  },
]
 
export default function Home() {
  const { customPhrases, addHistory, setActiveAlert, speak, startListening, chatMessages, addChatMessage, myName, theirName } = useApp()
  const [alert, setAlert] = useState(null)
  const [locLoading, setLocLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
 
  // 2-person chat state
  const [chatInput, setChatInput] = useState('')
  const [chatListening, setChatListening] = useState(false)
  const [activeSender, setActiveSender] = useState('me') // 'me' or 'them'
  const chatEndRef = useRef(null)
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])
 
  // ── Emergency trigger ───────────────────────────────────────
  const trigger = useCallback(async (emergency) => {
    vibrate([300, 100, 300, 100, 600])
    flashScreen(2)
 
    setLocLoading(true)
    let loc = null
    try { loc = await getLocation() } catch { /* optional */ }
    setLocLoading(false)
 
    const mapsLink = loc ? buildMapsLink(loc.lat, loc.lng) : null
    const nearestLink = buildNearestSearch(emergency.callAction, loc?.lat, loc?.lng)
    const fullMessage = loc
      ? `${emergency.message} My location: ${mapsLink}`
      : emergency.message
 
    const entry = {
      id: Date.now(), type: emergency.id, label: emergency.label,
      message: fullMessage, time: new Date().toISOString(), location: loc
    }
    addHistory(entry)
    setAlert({ ...emergency, fullMessage, mapsLink, nearestLink, loc })
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
 
  // ── Voice input (SOS section) ───────────────────────────────
  const startListeningMode = () => {
    setListening(true)
    startListening(
      (text) => { setTranscript(text); speak(text) },
      () => setListening(false)
    )
  }
 
  // ── 2-person chat send (text) ───────────────────────────────
  const sendChatText = () => {
    const text = chatInput.trim()
    if (!text) return
    addChatMessage(text, activeSender, 'text')
    speak(text)
    setChatInput('')
  }
 
  // ── 2-person chat send (voice → text → TTS) ────────────────
  const sendChatVoice = () => {
    setChatListening(true)
    startListening(
      (text) => {
        addChatMessage(text, activeSender, 'voice')
        speak(text)
        setChatListening(false)
      },
      () => setChatListening(false)
    )
  }
 
  // ── Speak a specific message ────────────────────────────────
  const speakMsg = (text) => speak(text)
 
  if (alert) return (
    <AlertScreen
      alert={alert}
      locLoading={locLoading}
      speaking={speaking}
      onDismiss={dismiss}
      onReTTS={() => { setSpeaking(true); speak(alert.tts); setTimeout(() => setSpeaking(false), 4000) }}
      onCopy={() => navigator.clipboard?.writeText(alert.fullMessage)}
      speak={speak}
    />
  )
 
  return (
    <div className={styles.page}>
      <p className={styles.subtitle}>One tap · Your voice · Your safety</p>
 
      {/* ── Emergency Buttons ── */}
      <div className={styles.buttonGrid}>
        {EMERGENCIES.map(e => (
          <EmergencyButton key={e.id} emergency={e} onTrigger={trigger} />
        ))}
      </div>
 
      {/* ── Custom Phrases ── */}
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
 
      {/* ── Voice Input / TTS Output ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Voice Input → Speak Aloud</h3>
        <button
          className={`${styles.listenBtn} ${listening ? styles.listening : ''}`}
          onClick={startListeningMode}
          disabled={listening}
        >
          {listening ? '🎙️ Listening...' : '🎤 Speak to Broadcast'}
        </button>
        {transcript && (
          <div className={styles.transcript}>
            <p className={styles.transcriptLabel}>Heard:</p>
            <p className={styles.transcriptText}>"{transcript}"</p>
            <button className={styles.speakAgain} onClick={() => speak(transcript)}>🔊 Speak Again</button>
          </div>
        )}
      </section>
 
      {/* ── 2-Person Communication Chat ── */}
      <section className={styles.section}>
        <div className={styles.chatHeader}>
          <h3 className={styles.sectionTitle} style={{ margin: 0 }}>2-Person Communication</h3>
          <div className={styles.senderToggle}>
            <button
              className={`${styles.senderBtn} ${activeSender === 'me' ? styles.senderActive : ''}`}
              onClick={() => setActiveSender('me')}
            >
              {myName}
            </button>
            <button
              className={`${styles.senderBtn} ${activeSender === 'them' ? styles.senderActiveAlt : ''}`}
              onClick={() => setActiveSender('them')}
            >
              {theirName}
            </button>
          </div>
        </div>
 
        <p className={styles.chatHint}>
          Switch sender above · Text or voice → auto speaks aloud · Tap 🔊 to replay any message
        </p>
 
        {/* Messages */}
        <div className={styles.chatMessages}>
          {chatMessages.length === 0 && (
            <p className={styles.chatEmpty}>No messages yet. Start communicating below.</p>
          )}
          {chatMessages.map((m) => (
            <div
              key={m.id}
              className={`${styles.chatBubble} ${m.sender === 'me' ? styles.meBubble : styles.themBubble}`}
            >
              <div className={styles.bubbleTop}>
                <span className={styles.bubbleSender}>{m.sender === 'me' ? myName : theirName}</span>
                <span className={styles.bubbleType}>{m.type === 'voice' ? '🎙️' : '⌨️'}</span>
              </div>
              <p className={styles.bubbleText}>{m.text}</p>
              <div className={styles.bubbleBottom}>
                <span className={styles.bubbleTime}>{new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                <button className={styles.bubbleSpeak} onClick={() => speakMsg(m.text)} title="Speak this message">🔊</button>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
 
        {/* Input bar */}
        <div className={styles.chatInputRow}>
          <input
            className={styles.chatInput}
            type="text"
            placeholder={`${activeSender === 'me' ? myName : theirName} types here...`}
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendChatText()}
          />
          <button className={styles.chatSendBtn} onClick={sendChatText} title="Send & Speak">
            📤
          </button>
          <button
            className={`${styles.chatVoiceBtn} ${chatListening ? styles.chatVoiceActive : ''}`}
            onClick={sendChatVoice}
            disabled={chatListening}
            title="Speak to send"
          >
            {chatListening ? '🎙️' : '🎤'}
          </button>
        </div>
      </section>
 
      <p className={styles.hint}>Tap any button to broadcast your emergency with voice + location</p>
    </div>
  )
}
 
// ── Emergency Button Component ───────────────────────────────
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
 
// ── Alert / Emergency Call Screen ────────────────────────────
function AlertScreen({ alert, locLoading, speaking, onDismiss, onReTTS, onCopy, speak }) {
  const nums = EMERGENCY_NUMBERS[alert.callAction] || null
 
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
 
        {/* ── Emergency Call Buttons ── */}
        {nums && (
          <div className={styles.callSection}>
            <p className={styles.callLabel}>📞 Call Emergency Services</p>
            <div className={styles.callBtns}>
              {/* Primary: 112 */}
              <a href={`tel:${nums.primary}`} className={styles.callBtn} style={{ background: alert.color }}>
                <span className={styles.callBtnNum}>{nums.primary}</span>
                <span className={styles.callBtnSub}>National Emergency</span>
              </a>
              {/* Secondary: 108 or 100 */}
              {alert.callAction === 'medical' && (
                <a href={`tel:${nums.ambulance}`} className={styles.callBtn} style={{ background: '#c47a00' }}>
                  <span className={styles.callBtnNum}>{nums.ambulance}</span>
                  <span className={styles.callBtnSub}>Ambulance</span>
                </a>
              )}
              {alert.callAction === 'police' && (
                <a href={`tel:${nums.police}`} className={styles.callBtn} style={{ background: '#1a5fbf' }}>
                  <span className={styles.callBtnNum}>{nums.police}</span>
                  <span className={styles.callBtnSub}>Police</span>
                </a>
              )}
            </div>
            {/* Find nearest */}
            {alert.nearestLink && (
              <a href={alert.nearestLink} target="_blank" rel="noreferrer" className={styles.nearestLink}>
                🗺️ Find Nearest {alert.callAction === 'medical' ? 'Hospital / Ambulance' : 'Police Station'}
              </a>
            )}
          </div>
        )}
 
        {speaking && (
          <div className={styles.speakingIndicator}>
            <div>
              {[8, 16, 24, 16, 8].map((h, i) => (
                <span key={i} style={{ height: h, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
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