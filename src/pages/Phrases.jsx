import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Page.module.css'
 
const DEFAULTS = [
  { icon: '🔇', text: 'I am deaf. Please write to me.' },
  { icon: '🗣️', text: 'I cannot speak. Please be patient.' },
  { icon: '🌐', text: 'I do not speak English well.' },
  { icon: '💊', text: 'I have a medical condition. Please call an ambulance.' },
  { icon: '🏠', text: 'I need help getting home safely.' },
]
 
export default function Phrases() {
  const { customPhrases, savePhrases, speak } = useApp()
  const [form, setForm] = useState({ icon: '💬', text: '' })
  const ICONS = ['💬', '🆘', '🏥', '🚔', '🔇', '🗣️', '🌐', '💊', '🏠', '⚠️']
 
  const add = () => {
    if (!form.text.trim()) return
    savePhrases([...customPhrases, { id: Date.now(), ...form }])
    setForm({ icon: '💬', text: '' })
  }
 
  const remove = (id) => savePhrases(customPhrases.filter(p => p.id !== id))
 
  const addDefault = (p) => {
    if (customPhrases.some(c => c.text === p.text)) return
    savePhrases([...customPhrases, { id: Date.now(), ...p }])
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Custom Phrases</h2>
        <p className={styles.pageDesc}>Pre-built messages for quick communication</p>
      </div>
 
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Add New Phrase</h3>
        <div className={styles.iconPicker}>
          {ICONS.map(ic => (
            <button key={ic} className={`${styles.iconOpt} ${form.icon === ic ? styles.iconSelected : ''}`} onClick={() => setForm(f => ({ ...f, icon: ic }))}>{ic}</button>
          ))}
        </div>
        <textarea
          placeholder="Type your phrase here..."
          value={form.text}
          onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          rows={3}
          style={{ resize: 'none', marginTop: 12 }}
        />
        <button className={styles.primaryBtn} style={{ marginTop: 12 }} onClick={add}>Add Phrase</button>
      </div>
 
      {customPhrases.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Your Phrases</h3>
          {customPhrases.map(p => (
            <div key={p.id} className={styles.phraseRow}>
              <span className={styles.phraseRowIcon}>{p.icon}</span>
              <span className={styles.phraseRowText}>{p.text}</span>
              <button className={styles.iconBtn} onClick={() => speak(p.text)} title="Speak">🔊</button>
              <button className={styles.iconBtn} onClick={() => remove(p.id)} title="Delete">🗑️</button>
            </div>
          ))}
        </div>
      )}
 
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick-Add Templates</h3>
        {DEFAULTS.map((d, i) => (
          <div key={i} className={styles.phraseRow}>
            <span className={styles.phraseRowIcon}>{d.icon}</span>
            <span className={styles.phraseRowText}>{d.text}</span>
            <button className={styles.iconBtn} onClick={() => speak(d.text)} title="Speak">🔊</button>
            <button className={styles.iconBtn} onClick={() => addDefault(d)} title="Add">➕</button>
          </div>
        ))}
      </div>
    </div>
  )
}