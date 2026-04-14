import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Contacts from './pages/Contacts'
import Phrases from './pages/Phrases'
import History from './pages/History'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/phrases" element={<Phrases />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}