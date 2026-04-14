import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import styles from './Page.module.css'
 
export default function Contacts() {
  const { contacts, saveContacts } = useApp()
  const [form, setForm] = useState({ name: '', phone: '', relation: '' })
  const [editing, setEditing] = useState(null)
 
  const submit = () => {
    if (!form.name || !form.phone) return
    if (editing !== null) {
      const updated = contacts.map((c, i) => i === editing ? { ...c, ...form } : c)
      saveContacts(updated)
      setEditing(null)
    } else {
      saveContacts([...contacts, { ...form, id: Date.now() }])
    }
    setForm({ name: '', phone: '', relation: '' })
  }
 
  const remove = (i) => saveContacts(contacts.filter((_, idx) => idx !== i))
 
  const edit = (i) => {
    setEditing(i)
    setForm({ name: contacts[i].name, phone: contacts[i].phone, relation: contacts[i].relation || '' })
  }
 
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Emergency Contacts</h2>
        <p className={styles.pageDesc}>People to notify in an emergency</p>
      </div>
 
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{editing !== null ? 'Edit Contact' : 'Add Contact'}</h3>
        <div className={styles.formGroup}>
          <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input placeholder="Phone / WhatsApp *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" />
          <input placeholder="Relation (e.g. Mom, Friend)" value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))} />
        </div>
        <div className={styles.formActions}>
          {editing !== null && <button className={styles.cancelBtn} onClick={() => { setEditing(null); setForm({ name: '', phone: '', relation: '' }) }}>Cancel</button>}
          <button className={styles.primaryBtn} onClick={submit}>{editing !== null ? 'Save' : 'Add Contact'}</button>
        </div>
      </div>
 
      {contacts.length === 0
        ? <div className={styles.empty}><p>👥</p><p>No contacts yet</p></div>
        : contacts.map((c, i) => (
          <div key={c.id || i} className={styles.contactCard}>
            <div className={styles.contactAvatar}>{c.name[0].toUpperCase()}</div>
            <div className={styles.contactInfo}>
              <p className={styles.contactName}>{c.name}</p>
              <p className={styles.contactSub}>{c.phone}{c.relation && ` · ${c.relation}`}</p>
            </div>
            <div className={styles.contactActions}>
              <a href={`tel:${c.phone}`} className={styles.iconBtn} title="Call">📞</a>
              <a href={`sms:${c.phone}`} className={styles.iconBtn} title="SMS">💬</a>
              <button className={styles.iconBtn} onClick={() => edit(i)} title="Edit">✏️</button>
              <button className={styles.iconBtn} onClick={() => remove(i)} title="Delete">🗑️</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}