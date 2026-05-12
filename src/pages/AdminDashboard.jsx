import { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import styles from './AdminDashboard.module.css'

const METRICS = ['confidence', 'communication', 'emotionalRegulation']
const LABELS = { confidence: 'Confidence', communication: 'Communication', emotionalRegulation: 'Emotional Reg.' }
const COLORS = { confidence: '#2d6a4f', communication: '#40916c', emotionalRegulation: '#74c69d' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [users, setUsers] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [newSession, setNewSession] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => {
    const [sessSnap, userSnap, ratSnap] = await Promise.all([
      getDocs(query(collection(db, 'sessions'), orderBy('date', 'desc'))),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'ratings')),
    ])
    setSessions(sessSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setRatings(ratSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const createSession = async () => {
    if (!newSession.trim()) return
    setCreating(true)
    await addDoc(collection(db, 'sessions'), {
      label: newSession.trim(),
      date: serverTimestamp(),
    })
    setNewSession('')
    await load()
    setCreating(false)
  }

  const aggregateBySession = sessions.map((s) => {
    const postRatings = ratings.filter((r) => r.sessionId === s.id && r.timing === 'post')
    const entry = { name: s.label, count: postRatings.length }
    METRICS.forEach((m) => {
      const vals = postRatings.map((r) => r[m]).filter(Boolean)
      entry[m] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null
    })
    return entry
  }).reverse()

  const participants = users.filter((u) => u.role !== 'admin')

  if (loading) return <div className="page"><p>Loading…</p></div>

  return (
    <div className={`page page-wide ${styles.page}`}>
      <h1>Admin Dashboard</h1>

      <div className="card">
        <h2>Create session</h2>
        <div className={styles.sessionCreate}>
          <input
            type="text"
            value={newSession}
            onChange={(e) => setNewSession(e.target.value)}
            placeholder="Session name, e.g. Week 3"
            onKeyDown={(e) => e.key === 'Enter' && createSession()}
          />
          <button className={`btn btn-secondary ${styles.createBtn}`} onClick={createSession} disabled={creating}>
            {creating ? '…' : 'Add'}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Average post-session scores</h2>
        {aggregateBySession.length === 0
          ? <p className={styles.empty}>No session data yet.</p>
          : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={aggregateBySession} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {METRICS.map((m) => (
                  <Bar key={m} dataKey={m} name={LABELS[m]} fill={COLORS[m]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>

      <div className="card">
        <h2>Participants ({participants.length})</h2>
        <div className={styles.table}>
          {participants.map((p) => {
            const userRatings = ratings.filter((r) => r.userId === p.id && r.timing === 'post')
            const latest = userRatings[userRatings.length - 1]
            return (
              <div
                key={p.id}
                className={`${styles.row} ${styles.rowClickable}`}
                onClick={() => navigate(`/admin/participant/${p.id}`)}
              >
                <div>
                  <strong>{p.name || p.email}</strong>
                  <span className={styles.meta}>{userRatings.length} post-session ratings</span>
                </div>
                {latest && (
                  <div className={styles.scores}>
                    {METRICS.map((m) => (
                      <span key={m} className={styles.score} style={{ background: 'var(--green-pale)' }}>
                        {LABELS[m].split(' ')[0]} {latest[m]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {participants.length === 0 && <p className={styles.empty}>No participants yet.</p>}
        </div>
      </div>
    </div>
  )
}
