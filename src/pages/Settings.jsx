import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Page.module.css'
 
export default function Settings() {
  const { apiKey, saveApiKey, aiProvider, saveAiProvider, speak } = useApp()
  const [ttsRate, setTtsRate] = useState(() => parseFloat(localStorage.getItem('ss_tts_rate') || '0.85'))
  const [ttsPitch, setTtsPitch] = useState(() => parseFloat(localStorage.getItem('ss_tts_pitch') || '1'))
  const [vibOn, setVibOn] = useState(() => localStorage.getItem('ss_vib') !== 'false')
  const [flashOn, setFlashOn] = useState(() => localStorage.getItem('ss_flash') !== 'false')
  const [localKey, setLocalKey] = useState(apiKey)

  const save = () => {
    saveApiKey(localKey)
    localStorage.setItem('ss_tts_rate', ttsRate.toString())
    localStorage.setItem('ss_tts_pitch', ttsPitch.toString())
    localStorage.setItem('ss_vib', vibOn.toString())
    localStorage.setItem('ss_flash', flashOn.toString())
    alert('Settings saved!')
  }

  const clearAll = () => {
    if (confirm('Clear all data?')) {
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

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>AI Assistant</h3>
        <div className={styles.settingRow}>
          <label>AI Provider</label>
          <select value={aiProvider} onChange={e => saveAiProvider(e.target.value)} className={styles.select}>
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI</option>
          </select>
        </div>
        <div className={styles.settingRow}>
          <label>API Key</label>
          <input 
            type="password" 
            placeholder="Enter API Key" 
            value={localKey} 
            onChange={e => setLocalKey(e.target.value)} 
            className={styles.input} 
          />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 8 }}>
          Keys are stored locally on your device.
        </p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Voice & Speech</h3>
        <div className={styles.settingRow}>
          <label>Speech Rate <span className={styles.settingVal}>{ttsRate.toFixed(1)}x</span></label>
          <input type="range" min="0.5" max="2" step="0.1" value={ttsRate} onChange={e => setTtsRate(parseFloat(e.target.value))} className={styles.range} />
        </div>
        <div className={styles.settingRow}>
          <label>Pitch <span className={styles.settingVal}>{ttsPitch.toFixed(1)}</span></label>
          <input type="range" min="0.5" max="2" step="0.1" value={ttsPitch} onChange={e => setTtsPitch(parseFloat(e.target.value))} className={styles.range} />
        </div>
        <button className={styles.outlineBtn} style={{ marginTop: 12 }} onClick={() => speak('This is a test of the speech settings.', { rate: ttsRate, pitch: ttsPitch })}>
          🔊 Test Voice
        </button>
      </div>
 
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Alerts</h3>
        <Toggle label="Vibration on alert" checked={vibOn} onChange={setVibOn} />
        <Toggle label="Screen flash on alert" checked={flashOn} onChange={setFlashOn} />
      </div>
 
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>About</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          SafeSignal v1.0 — Built with React + Web Speech API + Geolocation API.<br/>
          Works offline as a PWA. No data leaves your device.
        </p>
      </div>
 
      <button className={styles.primaryBtn} onClick={save}>Save Settings</button>
      <button className={styles.dangerBtn} onClick={clearAll}>Clear All Data</button>
    </div>
  )
}
 
function Toggle({ label, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span>{label}</span>
      <button className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`} onClick={() => onChange(!checked)}>
        <span className={styles.toggleThumb} />
      </button>
    </div>
  )
}