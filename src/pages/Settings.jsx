import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Page.module.css'
 
export default function Settings() {
  const { speak, myName, saveMyName, theirName, saveTheirName, clearChat } = useApp()
 
  const [ttsRate, setTtsRate] = useState(() => parseFloat(localStorage.getItem('ss_tts_rate') || '0.85'))
  const [ttsPitch, setTtsPitch] = useState(() => parseFloat(localStorage.getItem('ss_tts_pitch') || '1'))
  const [vibOn, setVibOn] = useState(() => localStorage.getItem('ss_vib') !== 'false')
  const [flashOn, setFlashOn] = useState(() => localStorage.getItem('ss_flash') !== 'false')
  const [nameA, setNameA] = useState(myName)
  const [nameB, setNameB] = useState(theirName)
 
  const saveAll = () => {
    localStorage.setItem('ss_tts_rate', ttsRate.toString())
    localStorage.setItem('ss_tts_pitch', ttsPitch.toString())
    localStorage.setItem('ss_vib', vibOn.toString())
    localStorage.setItem('ss_flash', flashOn.toString())
    saveMyName(nameA.trim() || 'Me')
    saveTheirName(nameB.trim() || 'Them')
    speak('Settings saved.', { rate: ttsRate, pitch: ttsPitch })
    alert('Settings saved!')
  }
 
  const clearAll = () => {
    if (confirm('Clear ALL data? Contacts, phrases, history and chat will be deleted.')) {
      localStorage.clear()
      window.location.reload()
    }
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Settings</h2>
        <p className={styles.pageDesc}>Customize your experience</p>
      </div>
 
      {/* ── Chat Names ── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Communication Names</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 12, lineHeight: 1.5 }}>
          Set display names for the 2-person communication chat on the SOS screen.
        </p>
        <div className={styles.formGroup}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Person A (you — shown in red)</label>
            <input
              value={nameA}
              onChange={e => setNameA(e.target.value)}
              placeholder="e.g. Me, Ravi, Patient"
              maxLength={20}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Person B (them — shown in blue)</label>
            <input
              value={nameB}
              onChange={e => setNameB(e.target.value)}
              placeholder="e.g. Them, Doctor, Helper"
              maxLength={20}
            />
          </div>
        </div>
        <button
          className={styles.outlineBtn}
          style={{ marginTop: 12, width: '100%', color: 'var(--red)', borderColor: 'rgba(255,45,45,0.3)' }}
          onClick={() => { if (confirm('Clear all chat messages?')) clearChat() }}
        >
          🗑️ Clear Chat History
        </button>
      </div>
 
      {/* ── Voice & Speech ── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Voice & Speech</h3>
        <div className={styles.settingRow}>
          <label>Speech Rate <span className={styles.settingVal}>{ttsRate.toFixed(1)}x</span></label>
          <input
            type="range" min="0.5" max="2" step="0.1"
            value={ttsRate}
            onChange={e => setTtsRate(parseFloat(e.target.value))}
            className={styles.range}
          />
        </div>
        <div className={styles.settingRow}>
          <label>Pitch <span className={styles.settingVal}>{ttsPitch.toFixed(1)}</span></label>
          <input
            type="range" min="0.5" max="2" step="0.1"
            value={ttsPitch}
            onChange={e => setTtsPitch(parseFloat(e.target.value))}
            className={styles.range}
          />
        </div>
        <button
          className={styles.outlineBtn}
          style={{ marginTop: 12, width: '100%' }}
          onClick={() => speak('This is a test of the SafeSignal voice settings.', { rate: ttsRate, pitch: ttsPitch })}
        >
          🔊 Test Voice
        </button>
      </div>
 
      {/* ── Alerts ── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Alerts</h3>
        <Toggle label="Vibration on alert" checked={vibOn} onChange={setVibOn} />
        <Toggle label="Screen flash on alert" checked={flashOn} onChange={setFlashOn} />
      </div>
 
      {/* ── Emergency Numbers ── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Emergency Numbers (India)</h3>
        {[
          { num: '112', label: 'National Emergency (Police, Fire, Ambulance)' },
          { num: '108', label: 'Ambulance' },
          { num: '100', label: 'Police' },
          { num: '101', label: 'Fire' },
          { num: '1091', label: 'Women Helpline' },
        ].map(e => (
          <div key={e.num} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.9rem' }}>{e.label}</span>
            <a href={`tel:${e.num}`} style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '2px', color: 'var(--red)', background: 'rgba(255,45,45,0.1)', padding: '4px 12px', borderRadius: 8 }}>
              {e.num}
            </a>
          </div>
        ))}
      </div>
 
      {/* ── About ── */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>About</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          SafeSignal v1.1 — Built with React + Web Speech API + Geolocation API.<br />
          Works offline as a PWA. All data stays on your device. No tracking.
        </p>
      </div>
 
      <button className={styles.primaryBtn} onClick={saveAll}>Save Settings</button>
      <button className={styles.dangerBtn} onClick={clearAll}>Clear All Data</button>
    </div>
  )
}
 
function Toggle({ label, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span>{label}</span>
      <button
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  )
}