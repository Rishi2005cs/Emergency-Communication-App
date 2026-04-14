import React from 'react'
import { useApp } from '../context/AppContext'
import { buildMapsLink } from '../utils/helpers'
import styles from './Page.module.css'
 
const TYPE_META = {
  help: { color: '#ff2d2d', icon: '🆘' },
  medical: { color: '#ffaa00', icon: '🏥' },
  police: { color: '#2d8fff', icon: '🚔' },
}
 
export default function History() {
  const { alertHistory } = useApp()
 
  const fmt = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Alert History</h2>
        <p className={styles.pageDesc}>Your past emergency alerts</p>
      </div>
 
      {alertHistory.length === 0
        ? <div className={styles.empty}><p>🕐</p><p>No alerts yet</p></div>
        : alertHistory.map(entry => {
          const meta = TYPE_META[entry.type] || { color: '#fff', icon: '⚠️' }
          return (
            <div key={entry.id} className={styles.historyCard} style={{ borderColor: `${meta.color}33` }}>
              <div className={styles.historyHeader}>
                <span className={styles.historyIcon}>{meta.icon}</span>
                <div>
                  <p className={styles.historyLabel} style={{ color: meta.color }}>{entry.label}</p>
                  <p className={styles.historyTime}>{fmt(entry.time)}</p>
                </div>
              </div>
              <p className={styles.historyMsg}>{entry.message?.split('My location')[0]}</p>
              {entry.location && (
                <a href={buildMapsLink(entry.location.lat, entry.location.lng)} target="_blank" rel="noreferrer" className={styles.historyMap}>
                  📍 View location on maps
                </a>
              )}
            </div>
          )
        })
      }
    </div>
  )
}