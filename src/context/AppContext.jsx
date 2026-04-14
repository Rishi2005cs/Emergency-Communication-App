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

  // ---------------- NEW STATE (CHAT & SETTINGS) ----------------
  const [messages, setMessages] = useState([])
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ss_api_key') || '')
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('ss_ai_provider') || 'gemini')

  // ---------------- SAVE FUNCTIONS ----------------
  const saveApiKey = useCallback((key) => {
    setApiKey(key)
    localStorage.setItem('ss_api_key', key)
  }, [])

  const saveAiProvider = useCallback((provider) => {
    setAiProvider(provider)
    localStorage.setItem('ss_ai_provider', provider)
  }, [])

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
  const addMessage = (text, sender = "user") => {
    setMessages(prev => [...prev, { text, sender, time: Date.now() }])
  }

  const getAIResponse = async (userText) => {
    if (!apiKey) {
      // Mock response if no API key is provided
      return new Promise(resolve => {
        setTimeout(() => {
          resolve("I'm here to help. (Set your Gemini API key in Settings for real AI responses)")
        }, 1000)
      })
    }

    try {
      if (aiProvider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are ECA (Electronic Conversation Assistant), a helpful emergency and daily assistant. User says: ${userText}` }] }]
          })
        })
        const data = await response.json()
        return data.candidates[0].content.parts[0].text
      } else {
        // OpenAI placeholder
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are ECA assistant." }, { role: "user", content: userText }]
          })
        })
        const data = await response.json()
        return data.choices[0].message.content
      }
    } catch (err) {
      console.error("AI Error:", err)
      return "Sorry, I'm having trouble connecting to my brain right now."
    }
  }

  // ---------------- 🔊 TEXT TO SPEECH ----------------
  const speak = (text, options = {}) => {
    if (!('speechSynthesis' in window)) return

    const {
      rate = parseFloat(localStorage.getItem('ss_tts_rate') || '0.9'),
      pitch = parseFloat(localStorage.getItem('ss_tts_pitch') || '1'),
      volume = 1
    } = options

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    // Create utterance
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = rate
    utter.pitch = pitch
    utter.volume = volume

    // Wait for voices to be loaded if they aren't
    const voices = window.speechSynthesis.getVoices()
    
    const setVoice = () => {
      const updatedVoices = window.speechSynthesis.getVoices()
      const voice =
        updatedVoices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) ||
        updatedVoices.find(v => v.lang === "en-IN") ||
        updatedVoices.find(v => v.lang.startsWith("en")) ||
        updatedVoices[0]

      if (voice) utter.voice = voice
      window.speechSynthesis.speak(utter)
    }

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice
    } else {
      setVoice()
    }
  }

  // ---------------- 🎤 SPEECH TO TEXT ----------------
  const startListening = (setText) => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech Recognition not supported")
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "en-IN"
    recognition.start()

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setText(transcript)
    }
  }

  return (
    <AppContext.Provider
      value={{
        contacts,
        saveContacts,
        customPhrases,
        savePhrases,
        alertHistory,
        addHistory,
        activeAlert,
        setActiveAlert,

        // NEW
        messages,
        addMessage,
        getAIResponse,
        speak,
        startListening,
        apiKey,
        saveApiKey,
        aiProvider,
        saveAiProvider
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)