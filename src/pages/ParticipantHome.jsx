import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import styles from './ParticipantHome.module.css'

const METRICS = ['confidence', 'communication', 'emotionalRegulation']
const COLORS = { confidence: '#2d6a4f', communication: '#40916c', emotionalRegulation: '#74c69d' }
const LABELS = { confidence: 'Confidence', communication: 'Communication', emotionalRegulation: 'Emotional Reg.' }

export default function ParticipantHome() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [sessSnap, ratSnap] = await Promise.all([
        getDocs(query(collection(db, 'sessions'), orderBy('date', 'asc'))),
        getDocs(query(collection(db, 'ratings'), where('userId', '==', user.uid))),
      ])
      setSessions(sessSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setRatings(ratSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [user.uid])

  const chartData = sessions.map((s) => {
    const pre = ratings.find((r) => r.sessionId === s.id && r.timing === 'pre')
    const post = ratings.find((r) => r.sessionId === s.id && r.timing === 'post')
    const entry = { name: s.label || s.id }
    METRICS.forEach((m) => {
      if (pre) entry[`${m}_pre`] = pre[m]
      if (post) entry[`${m}_post`] = post[m]
    })
    return entry
  })

  const pendingSession = sessions.find((s) => {
    const pre = ratings.find((r) => r.sessionId === s.id && r.timing === 'pre')
    const post = ratings.find((r) => r.sessionId === s.id && r.timing === 'post')
    return !pre || !post
  })

  if (loading) return <div className="page"><p>Loading your progress…</p></div>

  return (
    <div className="page">
      <div>
        <h1>Hello, {profile?.name || 'there'} 👋</h1>
        <p className={styles.sub}>Your Corazón Presence progress</p>
      </div>

      {pendingSession && (
        <div className={`card ${styles.cta}`}>
          <p className={styles.ctaLabel}>Session ready</p>
          <h2>{pendingSession.label}</h2>
          <div className={styles.ctaBtns}>
            {!ratings.find((r) => r.sessionId === pendingSession.id && r.timing === 'pre') && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/rate/${pendingSession.id}/pre`)}
              >
                Rate before session
              </button>
            )}
            {ratings.find((r) => r.sessionId === pendingSession.id && r.timing === 'pre') &&
              !ratings.find((r) => r.sessionId === pendingSession.id && r.timing === 'post') && (
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/rate/${pendingSession.id}/post`)}
              >
                Rate after session
              </button>
            )}
          </div>
        </div>
      )}

      {chartData.length > 0 && chartData.some((d) => Object.keys(d).length > 1) ? (
        <div className="card">
          <h2>Your progress</h2>
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
          <p className={styles.empty}>Complete your first session rating to see your progress chart here.</p>
        </div>
      )}
    </div>
  )
}
