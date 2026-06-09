import { useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { SESSIONS } from '../sessions'
import { exportCSV, generatePDF } from '../utils/export'
import { FIXED_MAX_POINTS } from '../utils/points'
import styles from './AdminDashboard.module.css'

const METRICS = ['stressLoad', 'energyDirection', 'authenticCommunication', 'recoverySpeed', 'improvisationalThinking', 'initiative']

const CHECKIN_METRICS = ['stressLevel', 'energyLevel', 'openness', 'bodyEase', 'authenticVoice', 'readiness']
const CHECKIN_LABELS = {
  stressLevel: '🌊 Stress Level',
  energyLevel: '⚡ Energy Level',
  openness: '🌸 Openness',
  bodyEase: '🌿 Body Ease',
  authenticVoice: '❤️ Authentic Voice',
  readiness: '🚀 Readiness',
}
const CHECKIN_COLORS = {
  stressLevel: '#1b4332',
  energyLevel: '#2d6a4f',
  openness: '#40916c',
  bodyEase: '#52b788',
  authenticVoice: '#74c69d',
  readiness: '#b7e4c7',
}
const CHECKIN_DESCRIPTIONS = {
  stressLevel: 'stress level (adjusted — higher = calmer)',
  energyLevel: 'energy and presence',
  openness: 'openness to connecting with others',
  bodyEase: 'body relaxation and ease',
  authenticVoice: 'ease of speaking authentically',
  readiness: 'readiness to show up fully',
}

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

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [ratings, setRatings] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState(false)

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
    const postRatings = ratings.filter((r) => r.sessionId === s.id && r.timing === 'post' && !r.isEmbodiedCheckin)
    const entry = { name: s.label.split(': ')[0], count: postRatings.length }
    METRICS.forEach((m) => {
      const vals = postRatings.map((r) => r[m]).filter(Boolean)
      entry[m] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null
    })
    return entry
  })

  const LIVE_SESSIONS = SESSIONS.filter((_, i) => i < 3)
  const checkinBySession = LIVE_SESSIONS.map((s) => {
    const pre = ratings.filter((r) => r.sessionId === s.id && r.timing === 'pre' && r.isEmbodiedCheckin)
    const post = ratings.filter((r) => r.sessionId === s.id && r.timing === 'post' && r.isEmbodiedCheckin)
    const avg = (arr, m) => {
      const vals = arr.map((r) => r[m]).filter((v) => v != null)
      return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null
    }
    const entry = { name: s.label.split(': ')[0] }
    CHECKIN_METRICS.forEach((m) => {
      entry[`${m}_pre`] = avg(pre, m)
      entry[`${m}_post`] = avg(post, m)
    })
    return entry
  })

  const participants = users.filter((u) => u.role !== 'admin')

  const handleExportCSV = async () => {
    setExporting(true)
    try { await exportCSV(users, ratings) } catch (e) { console.error(e) }
    setExporting(false)
  }

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true)
    try { await generatePDF(users, ratings) } catch (e) { console.error(e) }
    setGeneratingPDF(false)
  }

  if (loading) return <div className="page"><p>Loading…</p></div>

  return (
    <div className={`page page-wide ${styles.page}`}>
      <h1>Admin Dashboard</h1>

      <div className="card">
        <h2>Export Data</h2>
        <p className={styles.exportDesc}>Download all participant data for analysis and reporting.</p>
        <div className={styles.exportBtns}>
          <button
            className={`btn btn-secondary ${styles.exportBtn}`}
            onClick={handleExportCSV}
            disabled={exporting || generatingPDF}
          >
            {exporting ? 'Exporting…' : '⬇ Export CSV'}
          </button>
          <button
            className={`btn btn-primary ${styles.exportBtn}`}
            onClick={handleGeneratePDF}
            disabled={exporting || generatingPDF}
          >
            {generatingPDF ? 'Generating…' : '📄 Generate PDF Report'}
          </button>
        </div>
        {(exporting || generatingPDF) && (
          <p className={styles.exportNote}>Fetching participant data — this may take a moment…</p>
        )}
      </div>

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
        <h2>Embodied Check-In — Weeks 1–3</h2>
        <p className={styles.exportDesc}>Average before/after scores per session. All metrics 1–10; higher = better.</p>
        {checkinBySession.every((s) => CHECKIN_METRICS.every((m) => s[`${m}_post`] == null))
          ? <p className={styles.empty}>No check-in data yet.</p>
          : (
            <>
              {checkinBySession.map((s) => {
                const hasData = CHECKIN_METRICS.some((m) => s[`${m}_pre`] != null || s[`${m}_post`] != null)
                if (!hasData) return null
                return (
                  <div key={s.name} className={styles.checkinSession}>
                    <p className={styles.checkinSessionName}>{s.name}</p>
                    <div className={styles.checkinGrid}>
                      <div className={styles.checkinGridHeader}>
                        <span>Metric</span><span>Before</span><span>After</span>
                      </div>
                      {CHECKIN_METRICS.map((m) => (
                        <div key={m} className={styles.checkinGridRow}>
                          <span className={styles.checkinMetricName}>{CHECKIN_LABELS[m]}</span>
                          <span>{s[`${m}_pre`] ?? '—'}</span>
                          <span>{s[`${m}_post`] ?? '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )
        }
      </div>

      <div className="card">
        <h2>Average post-session scores (Weeks 4–6)</h2>
        {aggregateBySession.every((e) => e.count === 0)
          ? <p className={styles.empty}>No session data yet.</p>
          : (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={aggregateBySession.filter((_, i) => i >= 3)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  {METRICS.map((m) => (
                    <Bar key={m} dataKey={m} name={LABELS[m]} fill={COLORS[m]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
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
            </>
          )
        }
      </div>

      <div className="card">
        <h2>🔥 Presence Board — Full Leaderboard</h2>
        <p className={styles.exportDesc}>All participants ranked by points. Completion % is based on {FIXED_MAX_POINTS} fixed-task points (excludes daily practice).</p>
        {participants.length === 0
          ? <p className={styles.empty}>No participants yet.</p>
          : (
            <div className={styles.leaderTableWrap}>
            <div className={styles.leaderTable}>
              <div className={styles.leaderHeader}>
                <span className={styles.leaderRankCol}>Rank</span>
                <span className={styles.leaderNameCol}>Participant</span>
                <span className={styles.leaderPtsCol}>Points</span>
                <span className={styles.leaderPctCol}>Core %</span>
              </div>
              {[...participants]
                .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
                .map((p, i) => {
                  const pts = p.points ?? 0
                  const pct = Math.min(100, Math.round(pts / FIXED_MAX_POINTS * 100))
                  const medals = ['🥇', '🥈', '🥉']
                  return (
                    <div
                      key={p.id}
                      className={`${styles.leaderRow} ${styles.rowClickable}`}
                      onClick={() => navigate(`/admin/participant/${p.id}`)}
                    >
                      <span className={styles.leaderRankCol}>
                        {medals[i] ?? `#${i + 1}`}
                      </span>
                      <div className={styles.leaderNameCol}>
                        <strong>{p.name || p.email}</strong>
                        <span className={styles.meta}>{p.email}</span>
                      </div>
                      <span className={styles.leaderPtsCol}>{pts} pts</span>
                      <span className={styles.leaderPctCol}>
                        <span className={styles.pctBar}>
                          <span className={styles.pctFill} style={{ width: `${pct}%` }} />
                        </span>
                        {pct}%
                      </span>
                    </div>
                  )
                })}
            </div>
            </div>
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
                  <span className={styles.baselineBadge}>
                    {p.hasSubmittedBaseline ? '✅ Baseline complete' : '⭕ Baseline not submitted'}
                  </span>
                  {p.relationalEnergyProfile?.scores && (() => {
                    const top = Object.entries(p.relationalEnergyProfile.scores).sort((a, b) => b[1] - a[1])[0]
                    const emojis = { Presence: '🌿', Structure: '🧭', Vision: '✨', Grounding: '🌱' }
                    return <span className={styles.energyBadge}>{emojis[top[0]]} {top[0]}</span>
                  })()}
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
