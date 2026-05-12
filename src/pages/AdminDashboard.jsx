import { useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { SESSIONS } from '../sessions'
import styles from './AdminDashboard.module.css'

const METRICS = ['recoverySpeedAfterStress', 'healthySocialRisks', 'listeningWithoutFixing', 'prioritizeUnderPressure', 'recoveryAfterFallingBehind']
const LABELS = {
  recoverySpeedAfterStress: 'Recovery Speed',
  healthySocialRisks: 'Healthy Social Risks',
  listeningWithoutFixing: 'Listening',
  prioritizeUnderPressure: 'Prioritize Under Pressure',
  recoveryAfterFallingBehind: 'Recovery After Falling Behind',
}
const COLORS = {
  recoverySpeedAfterStress: '#1b4332',
  healthySocialRisks: '#2d6a4f',
  listeningWithoutFixing: '#40916c',
  prioritizeUnderPressure: '#74c69d',
  recoveryAfterFallingBehind: '#b7e4c7',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [ratings, setRatings] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    await Promise.all(
      SESSIONS.map((s) =>
        setDoc(doc(db, 'sessions', s.id), { label: s.label, order: s.order }, { merge: true })
      )
    )
    const [userSnap, ratSnap, configSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'ratings')),
      getDoc(doc(db, 'config', 'settings')),
    ])
    setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setRatings(ratSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    setActiveSessionId(configSnap.exists() ? configSnap.data().activeSessionId : null)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const setActive = async (sessionId) => {
    setSaving(true)
    await setDoc(doc(db, 'config', 'settings'), { activeSessionId: sessionId })
    setActiveSessionId(sessionId)
    setSaving(false)
  }

  const aggregateBySession = SESSIONS.map((s) => {
    const postRatings = ratings.filter((r) => r.sessionId === s.id && r.timing === 'post')
    const entry = { name: s.label.split(': ')[0], count: postRatings.length }
    METRICS.forEach((m) => {
      const vals = postRatings.map((r) => r[m]).filter(Boolean)
      entry[m] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null
    })
    return entry
  })

  const participants = users.filter((u) => u.role !== 'admin')

  if (loading) return <div className="page"><p>Loading…</p></div>

  return (
    <div className={`page page-wide ${styles.page}`}>
      <h1>Admin Dashboard</h1>

      <div className="card">
        <h2>Sessions</h2>
        <div className={styles.sessionList}>
          {SESSIONS.map((s) => (
            <div key={s.id} className={`${styles.sessionRow} ${activeSessionId === s.id ? styles.sessionActive : ''}`}>
              <div>
                <strong>{s.label}</strong>
                {activeSessionId === s.id && <span className={styles.activeBadge}>Active</span>}
              </div>
              <button
                className={`btn btn-secondary ${styles.setActiveBtn}`}
                onClick={() => setActive(s.id)}
                disabled={saving || activeSessionId === s.id}
              >
                {activeSessionId === s.id ? 'Active' : 'Set Active'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Average post-session scores</h2>
        {aggregateBySession.every((e) => e.count === 0)
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
