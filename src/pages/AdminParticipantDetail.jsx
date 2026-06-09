import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { SESSIONS } from '../sessions'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import styles from './AdminParticipantDetail.module.css'
import { ENERGY_INFO } from './RelationalEnergyResults'

const METRICS = ['stressLoad', 'energyDirection', 'authenticCommunication', 'recoverySpeed', 'improvisationalThinking', 'initiative']

const CHECKIN_METRICS = [
  { name: 'stressLevel', label: '🌊 Stress Level' },
  { name: 'energyLevel', label: '⚡ Energy Level' },
  { name: 'openness', label: '🌸 Openness' },
  { name: 'bodyEase', label: '🌿 Body Ease' },
  { name: 'authenticVoice', label: '❤️ Authentic Voice' },
  { name: 'readiness', label: '🚀 Readiness' },
]

const BASELINE_METRICS = [
  { name: 'stressLoad', label: '🌊 Stress Load' },
  { name: 'energyDirection', label: '🌀 Energy Direction' },
  { name: 'authenticCommunication', label: '❤️ Authentic Communication' },
  { name: 'recoverySpeed', label: '🔄 Recovery Speed' },
  { name: 'improvisationalThinking', label: '🎭 Improvisational Thinking' },
  { name: 'initiative', label: '🚀 Initiative' },
  { name: 'pressureAwareness', label: '🔍 Pressure Awareness' },
  { name: 'emotionalRegulation', label: '⚖️ Emotional Regulation' },
  { name: 'relationalPresence', label: '🤝 Relational Presence' },
  { name: 'patternRecognition', label: '🔁 Pattern Recognition' },
]
const LABELS = {
  stressLoad: '🌊 Stress Load',
  energyDirection: '🌀 Energy Direction',
  authenticCommunication: '❤️ Authentic Communication',
  recoverySpeed: '🔄 Recovery Speed',
  improvisationalThinking: '🎭 Improvisational Thinking',
  initiative: '🚀 Initiative',
}
const COLORS = {
  stressLoad: '#1b4332',
  energyDirection: '#2d6a4f',
  authenticCommunication: '#40916c',
  recoverySpeed: '#52b788',
  improvisationalThinking: '#74c69d',
  initiative: '#b7e4c7',
}
const DESCRIPTIONS = {
  stressLoad: 'how much pressure they were carrying',
  energyDirection: 'how well they prioritized and directed their energy',
  authenticCommunication: 'how close their words were to what they actually meant',
  recoverySpeed: 'how quickly they returned to focus and presence after stress',
  improvisationalThinking: 'how effectively they adapted when things didn\'t go as expected',
  initiative: 'how naturally they took action without overthinking',
}

export default function AdminParticipantDetail() {
  const { uid } = useParams()
  const navigate = useNavigate()
  const [participant, setParticipant] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [userSnap, ratSnap] = await Promise.all([
        getDoc(doc(db, 'users', uid)),
        getDocs(query(collection(db, 'ratings'), where('userId', '==', uid))),
      ])
      setParticipant(userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null)
      setRatings(ratSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [uid])

  if (loading) return <div className="page"><p>Loading…</p></div>
  if (!participant) return <div className="page"><p>Participant not found.</p></div>

  const chartData = SESSIONS.map((s) => {
    const pre = ratings.find((r) => r.sessionId === s.id && r.timing === 'pre' && !r.isEmbodiedCheckin)
    const post = ratings.find((r) => r.sessionId === s.id && r.timing === 'post' && !r.isEmbodiedCheckin)
    const entry = { name: s.label.split(': ')[0] }
    METRICS.forEach((m) => {
      if (pre) entry[`${m}_pre`] = pre[m]
      if (post) entry[`${m}_post`] = post[m]
    })
    return entry
  }).filter((d) => Object.keys(d).length > 1)

  const LIVE_SESSION_IDS = ['week-1', 'week-2', 'week-3']
  const checkinSessions = SESSIONS.filter((s) => LIVE_SESSION_IDS.includes(s.id)).map((s) => ({
    session: s,
    pre: ratings.find((r) => r.sessionId === s.id && r.timing === 'pre' && r.isEmbodiedCheckin),
    post: ratings.find((r) => r.sessionId === s.id && r.timing === 'post' && r.isEmbodiedCheckin),
  })).filter((e) => e.pre || e.post)

  const postRatings = ratings.filter((r) => r.timing === 'post' && !r.isEmbodiedCheckin)

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

      {participant.relationalEnergyProfile?.scores && (
        <div className="card">
          <h2>Relational Energy Profile</h2>
          <div className={styles.energyGrid}>
            {Object.entries(participant.relationalEnergyProfile.scores)
              .sort((a, b) => b[1] - a[1])
              .map(([energy, score]) => {
                const info = ENERGY_INFO[energy]
                return (
                  <div key={energy} className={styles.energyRow}>
                    <span className={styles.energyEmoji}>{info.emoji}</span>
                    <div className={styles.energyInfo}>
                      <span className={styles.energyName}>{energy}</span>
                      <span className={styles.energyTagline}>{info.tagline}</span>
                    </div>
                    <span className={styles.energyScore}>{score > 0 ? `+${score}` : score}</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {checkinSessions.length > 0 && (
        <div className="card">
          <h2>Embodied Check-In — Weeks 1–3</h2>
          <p className={styles.legend} style={{ marginBottom: 12 }}>Before / After session scores (1–10 · higher = better)</p>
          {checkinSessions.map(({ session, pre, post }) => (
            <div key={session.id} className={styles.checkinBlock}>
              <p className={styles.checkinSessionName}>{session.label}</p>
              <div className={styles.baselineTable}>
                <div className={styles.baselineHeader}>
                  <span className={styles.baselineMetricCol}>Metric</span>
                  <span className={styles.baselineScoreCol}>Before</span>
                  <span className={styles.baselineScoreCol}>After</span>
                  <span className={styles.baselineScoreCol}>Shift</span>
                </div>
                {CHECKIN_METRICS.map((m) => {
                  const before = pre?.[m.name]
                  const after = post?.[m.name]
                  const delta = before != null && after != null ? after - before : null
                  return (
                    <div key={m.name} className={styles.baselineRow}>
                      <span className={styles.baselineMetricCol}>{m.label}</span>
                      <span className={styles.baselineScoreCol}>{before ?? '—'}</span>
                      <span className={styles.baselineScoreCol}>{after ?? '—'}</span>
                      <span className={`${styles.baselineScoreCol} ${delta > 0 ? styles.deltaPos : delta < 0 ? styles.deltaNeg : ''}`}>
                        {delta == null ? '—' : delta > 0 ? `+${delta}` : delta}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {(participant.baseline || participant.postAssessment) && (
        <div className="card">
          <h2>Baseline vs Growth Assessment</h2>
          {participant.baseline && participant.postAssessment ? null : (
            <p className={styles.legend} style={{ marginBottom: 12 }}>
              {participant.baseline && !participant.postAssessment ? 'Baseline submitted — post-assessment pending.' : 'Post-assessment submitted — no baseline on file.'}
            </p>
          )}
          <div className={styles.baselineTable}>
            <div className={styles.baselineHeader}>
              <span className={styles.baselineMetricCol}>Metric</span>
              <span className={styles.baselineScoreCol}>Baseline</span>
              <span className={styles.baselineScoreCol}>Week 6</span>
              <span className={styles.baselineScoreCol}>Change</span>
            </div>
            {BASELINE_METRICS.map((m) => {
              const base = participant.baseline?.[m.name]
              const post = participant.postAssessment?.[m.name]
              const delta = base != null && post != null ? post - base : null
              return (
                <div key={m.name} className={styles.baselineRow}>
                  <span className={styles.baselineMetricCol}>{m.label}</span>
                  <span className={styles.baselineScoreCol}>{base ?? '—'}</span>
                  <span className={styles.baselineScoreCol}>{post ?? '—'}</span>
                  <span className={`${styles.baselineScoreCol} ${delta > 0 ? styles.deltaPos : delta < 0 ? styles.deltaNeg : ''}`}>
                    {delta == null ? '—' : delta > 0 ? `+${delta}` : delta}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
              {METRICS.map((m) => [
                <Line
                  key={`${m}_pre`}
                  type="monotone"
                  dataKey={`${m}_pre`}
                  name={LABELS[m]}
                  stroke={COLORS[m]}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={{ r: 3 }}
                  legendType="none"
                  connectNulls
                />,
                <Line
                  key={`${m}_post`}
                  type="monotone"
                  dataKey={`${m}_post`}
                  name={LABELS[m]}
                  stroke={COLORS[m]}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  connectNulls
                />,
              ])}
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.chartLegend}>
            {METRICS.map((m) => (
              <div key={m} className={styles.chartLegendItem}>
                <span className={styles.chartLegendDot} />
                <div>
                  <span className={styles.chartLegendLabel}>{LABELS[m]}</span>
                  <span className={styles.chartLegendDesc}>{DESCRIPTIONS[m]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <p className={styles.empty}>No ratings submitted yet.</p>
        </div>
      )}

      <div className="card">
        <h2>Session breakdown</h2>
        <div className={styles.table}>
          {SESSIONS.map((s) => {
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
          {SESSIONS.every((s) => !ratings.find((r) => r.sessionId === s.id)) && (
            <p className={styles.empty}>No ratings yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
