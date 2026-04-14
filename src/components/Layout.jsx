import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
 
const nav = [
  { to: '/', label: 'SOS', icon: '🆘' },
  { to: '/contacts', label: 'Contacts', icon: '👥' },
  { to: '/phrases', label: 'Phrases', icon: '💬' },
  { to: '/history', label: 'History', icon: '🕐' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]
 
export default function Layout({ children }) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.logo}>SAFE<span>SIGNAL</span></span>
        <span className={styles.badge}>Emergency</span>
      </header>
      <main className={styles.main}>{children}</main>
      <nav className={styles.nav}>
        {nav.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <span className={styles.navIcon}>{n.icon}</span>
            <span className={styles.navLabel}>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}