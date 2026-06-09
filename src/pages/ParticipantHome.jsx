import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import { SESSIONS } from '../sessions'
import { WEEK_CONTENT } from '../weekContent'
import WelcomeModal from '../components/WelcomeModal'
import PatternNoteCard from '../components/PatternNoteCard'
import DailyWordCard, { getToday } from '../components/DailyWordCard'
import MicroLessonCard from '../components/MicroLessonCard'
import { computePoints } from '../utils/points'
import styles from './ParticipantHome.module.css'


export default function ParticipantHome() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [ratings, setRatings] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [patternNotes, setPatternNotes] = useState({})
  const [dailyWords, setDailyWords] = useState({})
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeDismissed, setWelcomeDismissed] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [ratSnap, configSnap, pnSnap, dwSnap, profileSnap] = await Promise.all([
        getDocs(query(collection(db, 'ratings'), where('userId', '==', user.uid))),
        getDoc(doc(db, 'config', 'settings')),
        getDocs(collection(db, 'users', user.uid, 'patternNotes')),
        getDocs(collection(db, 'users', user.uid, 'dailyWords')),
        getDoc(doc(db, 'users', user.uid)),
      ])
      const allRatings = ratSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      const pnMap = Object.fromEntries(pnSnap.docs.map((d) => [d.id, d.data()]))
      const dwMap = Object.fromEntries(dwSnap.docs.map((d) => [d.id, d.data()]))
      const profileData = profileSnap.exists() ? profileSnap.data() : {}

      setRatings(allRatings)
      setActiveSessionId(configSnap.exists() ? configSnap.data().activeSessionId : null)
      setPatternNotes(pnMap)
      setDailyWords(dwMap)
      setLoading(false)

      // Compute and store points + leaderboard entry
      const pts = computePoints(profileData, allRatings, pnMap, dwMap)
      if (pts !== (profileData.points ?? -1)) {
        const firstName = (profileData.name || '').split(' ')[0] || user.email?.split('@')[0] || 'Participant'
        updateDoc(doc(db, 'users', user.uid), { points: pts }).catch(() => {})
        setDoc(doc(db, 'leaderboard', user.uid), { firstName, points: pts, uid: user.uid }).catch(() => {})
      }
    }
    load()
  }, [user.uid])

  useEffect(() => {
    if (!loading && profile && !profile.hasSeenWelcome && !welcomeDismissed) {
      setShowWelcome(true)
    }
  }, [loading, profile, welcomeDismissed])

  useEffect(() => {
    if (loading) return
    if (location.state?.fromBaseline) return
    const welcomeDone = profile?.hasSeenWelcome || welcomeDismissed
    if (welcomeDone && !profile?.hasSubmittedBaseline) {
      navigate('/baseline')
    }
  }, [loading, profile, welcomeDismissed, location.state])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    setWelcomeDismissed(true)
  }

  const handleDailySubmit = (entry) => {
    setDailyWords((prev) => ({ ...prev, [getToday()]: entry }))
  }

  // Phase / session logic
  const activeSession = SESSIONS.find((s) => s.id === activeSessionId)
  const weekNum = activeSessionId ? parseInt(activeSessionId.replace('week-', '')) : null
  const isLivePhase = weekNum && weekNum <= 3
  const isFieldPhase = weekNum && weekNum >= 4

  const preRated = activeSession && ratings.some((r) => r.sessionId === activeSession.id && r.timing === 'pre')
  const postRated = activeSession && ratings.some((r) => r.sessionId === activeSession.id && r.timing === 'post')
  const energyProfileDone = profile?.hasSubmittedEnergyProfile
  const week6PostRated = ratings.some((r) => r.sessionId === 'week-6' && r.timing === 'post')
  const postAssessmentDone = profile?.hasSubmittedPostAssessment
  const reflectionDone = profile?.hasSubmittedReflection || location.state?.fromReflection
  const todayEntry = dailyWords[getToday()] || null

  // Streak
  const streak = calculateStreak(Object.keys(dailyWords))
  const milestone = getMilestone(streak)

  // Chart data
  const energyScores = profile?.relationalEnergyProfile?.scores || null
  const ENERGY_AXES = ['Presence', 'Structure', 'Vision', 'Grounding']
  const ENERGY_EMOJIS = { Presence: '🌿', Structure: '🧭', Vision: '✨', Grounding: '🌱' }
  const radarData = energyScores
    ? (() => {
        const vals = ENERGY_AXES.map((e) => energyScores[e] ?? 0)
        const min = Math.min(...vals)
        const shift = min < 0 ? -min : 0
        const max = Math.max(...vals) + shift || 1
        return ENERGY_AXES.map((e) => ({
          subject: e,
          value: (energyScores[e] ?? 0) + shift,
          fullMark: max,
        }))
      })()
    : null

  if (loading) return <div className="page"><p>Loading your progress…</p></div>

  return (
    <div className="page">
      {showWelcome && <WelcomeModal onClose={handleWelcomeClose} />}

      <div className={styles.greeting}>
        <h1>Hello, {profile?.name || 'there'} 👋</h1>
        <p className={styles.sub}>Elevate Tampa Bay</p>
        <button className={styles.aboutLink} onClick={() => setShowWelcome(true)}>
          About this program
        </button>
      </div>

      {streak > 0 && (
        <div className={styles.streak}>
          <span className={styles.streakFire}>🔥</span>
          <div className={styles.streakText}>
            <span className={styles.streakCount}>{streak} {streak === 1 ? 'day' : 'days'} showing up!</span>
            {milestone && <span className={styles.streakMilestone}>{milestone}</span>}
          </div>
        </div>
      )}

      <div className={styles.content}>

        {/* ── Getting Started (new participants only) ── */}
        {!profile?.hasSubmittedBaseline && (
          <div className={`card ${styles.gettingStarted}`}>
            <h2 className={styles.gsTitle}>Welcome — Here's Where to Begin 👋</h2>
            <ol className={styles.gsList}>
              <li className={styles.gsItem}>Complete your Baseline Assessment</li>
              <li className={styles.gsItem}>Take the Relational Energy Assessment (Week 2)</li>
              <li className={styles.gsItem}>Set your daily gratitude + intention</li>
              <li className={styles.gsItem}>Rate yourself before today's session begins</li>
              <li className={styles.gsItem}>Rate yourself after the session ends</li>
            </ol>
            <button className="btn btn-primary" onClick={() => navigate('/baseline')}>
              Start Baseline Assessment
            </button>
          </div>
        )}

        {/* ── Phase badge ── */}
        {activeSession && (
          <div className={isLivePhase ? styles.phaseLive : styles.phaseField}>
            {isLivePhase ? '📚 Live Training Phase' : '🌿 Field Integration Phase'}
          </div>
        )}

        {/* ── WEEKS 1–3: Task checklist ── */}
        {isLivePhase && (
          <>
          <MicroLessonCard lesson={WEEK_CONTENT[activeSessionId]?.lesson} />
          <div className={`card ${styles.taskCard}`}>
            <h2 className={styles.taskTitle}>{activeSession.label}</h2>
            <div className={styles.taskList}>

              <TaskRow
                done={!!profile?.hasSubmittedBaseline}
                phase="Baseline assessment"
                desc={profile?.hasSubmittedBaseline ? 'Completed — 5 points earned' : 'Complete your baseline before the first session'}
                action={!profile?.hasSubmittedBaseline ? (
                  <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate('/baseline')}>
                    Start
                  </button>
                ) : null}
              />

              <TaskRow
                done={preRated}
                phase="Before session"
                desc={isLivePhase ? 'Embodied check-in — how you feel right now' : 'Rate your 6 metrics before the session begins'}
                action={!preRated ? (
                  <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate(`/rate/${activeSession.id}/pre`)}>
                    {isLivePhase ? 'Check in' : 'Rate now'}
                  </button>
                ) : null}
              />

              {activeSessionId === 'week-2' && (
                <TaskRow
                  done={energyProfileDone}
                  phase="During session"
                  desc="Complete your Relational Energy Assessment"
                  action={energyProfileDone ? (
                    <button className={`btn btn-secondary ${styles.taskBtnSm}`} onClick={() => navigate('/energy-results')}>
                      View profile
                    </button>
                  ) : (
                    <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate('/assessment/relational-energy')}>
                      Start
                    </button>
                  )}
                />
              )}

              <TaskRow
                done={postRated}
                phase="After session"
                desc={isLivePhase ? 'Embodied check-in + weekly self-observation' : 'Rate your 6 metrics + submit your weekly self-observation'}
                action={preRated && !postRated ? (
                  <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate(`/rate/${activeSession.id}/post`)}>
                    {isLivePhase ? 'Check in' : 'Rate now'}
                  </button>
                ) : null}
                muted={!preRated && !postRated}
              />

              <TaskRow
                done={!!(todayEntry?.gratitude)}
                phase="Daily practice"
                desc={todayEntry?.gratitude ? `${todayEntry.gratitude} · ${todayEntry.intention}` : 'Gratitude + intention — see below'}
              />

            </div>
          </div>
          </>
        )}

        {/* ── WEEKS 4–6: Micro-lesson + reflection ── */}
        {isFieldPhase && (
          <>
            <div className={`card ${styles.taskCard}`}>
              <h2 className={styles.taskTitle}>{activeSession.label}</h2>
              <div className={styles.taskList}>
                <TaskRow
                  done={!!profile?.hasSubmittedBaseline}
                  phase="Baseline assessment"
                  desc={profile?.hasSubmittedBaseline ? 'Completed — 5 points earned' : 'Complete your baseline assessment'}
                  action={!profile?.hasSubmittedBaseline ? (
                    <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate('/baseline')}>
                      Start
                    </button>
                  ) : null}
                />
                <TaskRow
                  done={preRated}
                  phase="Before session"
                  desc="Rate your 6 metrics before the session begins"
                  action={!preRated ? (
                    <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate(`/rate/${activeSession.id}/pre`)}>
                      Rate now
                    </button>
                  ) : null}
                />
                <TaskRow
                  done={postRated}
                  phase="After session"
                  desc="Rate your 6 metrics + submit your weekly self-observation"
                  action={preRated && !postRated ? (
                    <button className={`btn btn-primary ${styles.taskBtn}`} onClick={() => navigate(`/rate/${activeSession.id}/post`)}>
                      Rate now
                    </button>
                  ) : null}
                  muted={!preRated && !postRated}
                />
              </div>
            </div>
            <MicroLessonCard lesson={WEEK_CONTENT[activeSessionId]?.lesson} />
          </>
        )}

        {/* ── No active session ── */}
        {!activeSession && (
          <div className="card">
            <p className={styles.empty}>No active session right now. Check back soon.</p>
          </div>
        )}

        {/* ── Pattern note (weeks 1–3: after post-rating; weeks 4–6: always) ── */}
        {activeSession && (isLivePhase ? postRated : isFieldPhase) && (
          <PatternNoteCard
            sessionId={activeSession.id}
            sessionLabel={activeSession.label}
            existingNote={patternNotes[activeSession.id]}
          />
        )}

        {/* ── Daily practice ── */}
        <DailyWordCard todayEntry={todayEntry} onSubmit={handleDailySubmit} />

        {/* ── End of program ── */}
        {week6PostRated && !postAssessmentDone && (
          <div className={`card ${styles.completionCard}`}>
            <p className={styles.ctaLabel}>Week 6 complete 🎉</p>
            <h2>Your Growth Assessment</h2>
            <p className={styles.reflectionSub}>You've completed all 6 weeks of training. Now let's measure how far you've come — answer the same 10 questions from your baseline to see your growth.</p>
            <button className="btn btn-primary" onClick={() => navigate('/post-assessment')}>
              Take my growth assessment
            </button>
          </div>
        )}
        {week6PostRated && postAssessmentDone && !reflectionDone && (
          <div className={`card ${styles.completionCard}`}>
            <p className={styles.ctaLabel}>Program complete 🎉</p>
            <h2>End of Program Reflection</h2>
            <p className={styles.reflectionSub}>You have completed all 6 weeks. Take a few minutes to reflect on your journey.</p>
            <button className="btn btn-primary" onClick={() => navigate('/reflection')}>
              Write my reflection
            </button>
          </div>
        )}
        {week6PostRated && postAssessmentDone && reflectionDone && (
          <div className={`card ${styles.completionCard}`}>
            <p className={styles.ctaLabel}>Program complete 🎉</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--green-base)', fontWeight: 600 }}>
              Growth assessment + reflection submitted ✓ — thank you for your honesty.
            </p>
          </div>
        )}

        {/* ── Relational Energy Profile chart ── */}
        <div className="card">
          <h2>Your Relational Energy Profile</h2>
          {radarData ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#dee2e6" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#2D5A27', fontWeight: 600 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Energy" dataKey="value" stroke="#2D5A27" fill="#2D5A27" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className={styles.energyLegend}>
                {ENERGY_AXES.map((e) => (
                  <div key={e} className={styles.energyLegendItem}>
                    <span className={styles.energyLegendEmoji}>{ENERGY_EMOJIS[e]}</span>
                    <span className={styles.energyLegendName}>{e}</span>
                    <span className={styles.energyLegendScore}>
                      {energyScores[e] > 0 ? `+${energyScores[e]}` : energyScores[e]}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.empty}>Complete your Relational Energy Assessment to see your profile here.</p>
          )}
        </div>


      </div>
    </div>
  )
}

function TaskRow({ done, phase, desc, action, muted }) {
  return (
    <div className={`${styles.taskRow} ${done ? styles.taskDone : ''} ${muted ? styles.taskMuted : ''}`}>
      <span className={styles.taskDot}>{done ? '✓' : '○'}</span>
      <div className={styles.taskBody}>
        <span className={styles.taskPhase}>{phase}</span>
        <span className={styles.taskDesc}>{desc}</span>
      </div>
      {action && <div className={styles.taskAction}>{action}</div>}
    </div>
  )
}

function dateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function calculateStreak(dates) {
  if (!dates.length) return 0
  const dateSet = new Set(dates)
  const today = getToday()
  const cursor = new Date()
  if (!dateSet.has(today)) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (true) {
    const d = dateKey(cursor)
    if (dateSet.has(d)) { streak++; cursor.setDate(cursor.getDate() - 1) }
    else break
  }
  return streak
}

function getMilestone(streak) {
  if (streak === 21) return "21 days — you're building something real. 🌱"
  if (streak === 14) return "Two weeks strong. This is becoming who you are. ✨"
  if (streak === 7) return "One full week. Your consistency is showing. 🙌"
  if (streak === 3) return "Three days in a row — momentum is building!"
  return null
}

