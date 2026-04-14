import React, { createContext, useContext, useState, useCallback } from 'react'
 
const AppContext = createContext(null)
 
export function AppProvider({ children }) {
 
  // ---------------- EXISTING STATE ----------------
  const [contacts, setContacts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_contacts') || '[]') } catch { return [] }
  })
 
  const [customPhrases, setCustomPhrases] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_phrases') || '[]') } catch { return [] }
  })
 
  const [alertHistory, setAlertHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_history') || '[]') } catch { return [] }
  })
 
  const [activeAlert, setActiveAlert] = useState(null)
 
  // ---------------- 2-PERSON CHAT STATE ----------------
  // sender: 'me' | 'them' | type: 'text' | 'voice'
  const [chatMessages, setChatMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_chat') || '[]') } catch { return [] }
  })
 
  const [myName, setMyName] = useState(() => localStorage.getItem('ss_myname') || 'Me')
  const [theirName, setTheirName] = useState(() => localStorage.getItem('ss_theirname') || 'Them')
 
  // ---------------- SAVE FUNCTIONS ----------------
  const saveContacts = useCallback((c) => {
    setContacts(c)
    localStorage.setItem('ss_contacts', JSON.stringify(c))
  }, [])
 
  const savePhrases = useCallback((p) => {
    setCustomPhrases(p)
    localStorage.setItem('ss_phrases', JSON.stringify(p))
  }, [])
 
  const addHistory = useCallback((entry) => {
    setAlertHistory(prev => {
      const next = [entry, ...prev].slice(0, 50)
      localStorage.setItem('ss_history', JSON.stringify(next))
      return next
    })
  }, [])
 
  // ---------------- CHAT FUNCTIONS ----------------
  const addChatMessage = useCallback((text, sender = 'me', type = 'text') => {
    const msg = { id: Date.now(), text, sender, time: new Date().toISOString(), type }
    setChatMessages(prev => {
      const next = [...prev, msg].slice(-100)
      localStorage.setItem('ss_chat', JSON.stringify(next))
      return next
    })
    return msg
  }, [])
 
  const clearChat = useCallback(() => {
    setChatMessages([])
    localStorage.removeItem('ss_chat')
  }, [])
 
  const saveMyName = useCallback((n) => {
    setMyName(n)
    localStorage.setItem('ss_myname', n)
  }, [])
 
  const saveTheirName = useCallback((n) => {
    setTheirName(n)
    localStorage.setItem('ss_theirname', n)
  }, [])
 
  // ---------------- 🔊 TEXT TO SPEECH ----------------
  const speak = useCallback((text, options = {}) => {
    if (!('speechSynthesis' in window)) return
    const {
      rate = parseFloat(localStorage.getItem('ss_tts_rate') || '0.9'),
      pitch = parseFloat(localStorage.getItem('ss_tts_pitch') || '1'),
      volume = 1
    } = options
 
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = rate
    utter.pitch = pitch
    utter.volume = volume
 
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const voice =
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang === 'en-IN') ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0]
      if (voice) utter.voice = voice
      window.speechSynthesis.speak(utter)
    }
 
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice
    } else {
      setVoice()
    }
  }, [])
 
  // ---------------- 🎤 SPEECH TO TEXT ----------------
  const startListening = useCallback((onResult, onEnd) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Speech Recognition not supported in this browser. Use Chrome.'); return null }
    const recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (e) => onResult(e.results[0][0].transcript)
    recognition.onerror = () => onEnd && onEnd()
    recognition.onend = () => onEnd && onEnd()
    recognition.start()
    return recognition
  }, [])
 
  return (
    <AppContext.Provider value={{
      contacts, saveContacts,
      customPhrases, savePhrases,
      alertHistory, addHistory,
      activeAlert, setActiveAlert,
      chatMessages, addChatMessage, clearChat,
      myName, saveMyName,
      theirName, saveTheirName,
      speak, startListening,
    }}>
      {children}
    </AppContext.Provider>
  )
}
 
export const useApp = () => useContext(AppContext)