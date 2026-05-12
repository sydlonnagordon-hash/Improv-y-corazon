import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { SESSIONS } from '../sessions'
import styles from './ParticipantHome.module.css'

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

export default function ParticipantHome() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [ratings, setRatings] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [ratSnap, configSnap] = await Promise.all([
        getDocs(query(collection(db, 'ratings'), where('userId', '==', user.uid))),
        getDoc(doc(db, 'config', 'settings')),
      ])
      setRatings(ratSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setActiveSessionId(configSnap.exists() ? configSnap.data().activeSessionId : null)
      setLoading(false)
    }
    load()
  }, [user.uid])

  const activeSession = SESSIONS.find((s) => s.id === activeSessionId)
  const preRated = activeSession && ratings.some((r) => r.sessionId === activeSession.id && r.timing === 'pre')
  const postRated = activeSession && ratings.some((r) => r.sessionId === activeSession.id && r.timing === 'post')

  const chartData = SESSIONS.map((s) => {
    const pre = ratings.find((r) => r.sessionId === s.id && r.timing === 'pre')
    const post = ratings.find((r) => r.sessionId === s.id && r.timing === 'post')
    const entry = { name: s.label.split(': ')[0] }
    METRICS.forEach((m) => {
      if (pre) entry[`${m}_pre`] = pre[m]
      if (post) entry[`${m}_post`] = post[m]
    })
    return entry
  }).filter((d) => Object.keys(d).length > 1)

  if (loading) return <div className="page"><p>Loading your progress…</p></div>

  return (
    <div className="page">
      <div>
        <h1>Hello, {profile?.name || 'there'} 👋</h1>
        <p className={styles.sub}>Your Corazón Presence progress</p>
      </div>

      {activeSession ? (
        <div className={`card ${styles.cta}`}>
          <p className={styles.ctaLabel}>Current session</p>
          <h2>{activeSession.label}</h2>
          {!preRated && !postRated && (
            <div className={styles.ctaBtns}>
              <button className="btn btn-primary" onClick={() => navigate(`/rate/${activeSession.id}/pre`)}>
                Rate before session
              </button>
            </div>
          )}
          {preRated && !postRated && (
            <div className={styles.ctaBtns}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Before rating submitted ✓</p>
              <button className="btn btn-primary" onClick={() => navigate(`/rate/${activeSession.id}/post`)}>
                Rate after session
              </button>
            </div>
          )}
          {preRated && postRated && (
            <p style={{ fontSize: '0.875rem', color: 'var(--green-base)', fontWeight: 600 }}>
              Both ratings submitted ✓
            </p>
          )}
        </div>
      ) : (
        <div className="card">
          <p className={styles.empty}>No active session right now. Check back soon.</p>
        </div>
      )}

      {chartData.length > 0 ? (
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
