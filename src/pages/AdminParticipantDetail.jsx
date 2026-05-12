import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import styles from './AdminParticipantDetail.module.css'

const METRICS = ['confidence', 'communication', 'emotionalRegulation']
const LABELS = { confidence: 'Confidence', communication: 'Communication', emotionalRegulation: 'Emotional Reg.' }
const COLORS = { confidence: '#2d6a4f', communication: '#40916c', emotionalRegulation: '#74c69d' }

export default function AdminParticipantDetail() {
  const { uid } = useParams()
  const navigate = useNavigate()
  const [participant, setParticipant] = useState(null)
  const [sessions, setSessions] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [userSnap, sessSnap, ratSnap] = await Promise.all([
        getDoc(doc(db, 'users', uid)),
        getDocs(query(collection(db, 'sessions'), orderBy('date', 'asc'))),
        getDocs(query(collection(db, 'ratings'), where('userId', '==', uid))),
      ])
      setParticipant(userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null)
      setSessions(sessSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setRatings(ratSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [uid])

  if (loading) return <div className="page"><p>Loading…</p></div>
  if (!participant) return <div className="page"><p>Participant not found.</p></div>

  const chartData = sessions.map((s) => {
    const pre = ratings.find((r) => r.sessionId === s.id && r.timing === 'pre')
    const post = ratings.find((r) => r.sessionId === s.id && r.timing === 'post')
    const entry = { name: s.label || s.id }
    METRICS.forEach((m) => {
      if (pre) entry[`${m}_pre`] = pre[m]
      if (post) entry[`${m}_post`] = post[m]
    })
    return entry
  }).filter((d) => Object.keys(d).length > 1)

  const postRatings = ratings.filter((r) => r.timing === 'post')

  return (
    <div className={`page page-wide ${styles.page}`}>
      <div className={styles.header}>
        <button className={`btn btn-ghost ${styles.back}`} onClick={() => navigate('/admin')}>
          ← Back
        </button>
        <div>
          <h1>{participant.name || participant.email}</h1>
          <p className={styles.sub}>{participant.email} · {postRatings.length} post-session ratings</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="card">
          <h2>Progress over sessions</h2>
          <p className={styles.legend}>Dashed = before session &nbsp;·&nbsp; Solid = after session</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {METRICS.map((m) => [
                <Line
                  key={`${m}_pre`}
                  type="monotone"
                  dataKey={`${m}_pre`}
                  name={`${LABELS[m]} (before)`}
                  stroke={COLORS[m]}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={{ r: 3 }}
                  connectNulls
                />,
                <Line
                  key={`${m}_post`}
                  type="monotone"
                  dataKey={`${m}_post`}
                  name={`${LABELS[m]} (after)`}
                  stroke={COLORS[m]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  connectNulls
                />,
              ])}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="card">
          <p className={styles.empty}>No ratings submitted yet.</p>
        </div>
      )}

      <div className="card">
        <h2>Session breakdown</h2>
        <div className={styles.table}>
          {sessions.map((s) => {
            const pre = ratings.find((r) => r.sessionId === s.id && r.timing === 'pre')
            const post = ratings.find((r) => r.sessionId === s.id && r.timing === 'post')
            if (!pre && !post) return null
            return (
              <div key={s.id} className={styles.row}>
                <strong className={styles.sessionLabel}>{s.label}</strong>
                <div className={styles.timings}>
                  {['pre', 'post'].map((t) => {
                    const r = t === 'pre' ? pre : post
                    if (!r) return (
                      <div key={t} className={`${styles.timing} ${styles.missing}`}>
                        <span className={styles.timingLabel}>{t === 'pre' ? 'Before' : 'After'}</span>
                        <span className={styles.timingMissing}>—</span>
                      </div>
                    )
                    return (
                      <div key={t} className={styles.timing}>
                        <span className={styles.timingLabel}>{t === 'pre' ? 'Before' : 'After'}</span>
                        <div className={styles.scores}>
                          {METRICS.map((m) => (
                            <span key={m} className={styles.score} style={{ background: 'var(--green-pale)' }}>
                              {LABELS[m].split(' ')[0]} {r[m]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {sessions.every((s) => !ratings.find((r) => r.sessionId === s.id)) && (
            <p className={styles.empty}>No ratings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
