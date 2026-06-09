import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import CheckinSlider from '../components/CheckinSlider'
import styles from './EmbodiedCheckin.module.css'

const QUESTIONS = [
  {
    name: 'stressLevel',
    label: '🌊 Stress Level',
    question: 'How stressed or pressured do you feel right now?',
    scaleMin: 'completely calm',
    scaleMax: 'extremely stressed',
    reverse: true,
  },
  {
    name: 'energyLevel',
    label: '⚡ Energy Level',
    question: 'How energized and present do you feel right now?',
    scaleMin: 'completely drained',
    scaleMax: 'fully energized',
    reverse: false,
  },
  {
    name: 'openness',
    label: '🌸 Openness',
    question: 'How open and receptive do you feel to connecting with others right now?',
    scaleMin: 'closed off',
    scaleMax: 'fully open',
    reverse: false,
  },
  {
    name: 'bodyEase',
    label: '🌿 Body Ease',
    question: 'How relaxed and at ease does your body feel right now?',
    scaleMin: 'very tense',
    scaleMax: 'completely at ease',
    reverse: false,
  },
  {
    name: 'authenticVoice',
    label: '❤️ Authentic Voice',
    question: 'How easy would it be to say what you actually mean right now?',
    scaleMin: 'I would perform or hold back',
    scaleMax: 'I could speak completely freely',
    reverse: false,
  },
  {
    name: 'readiness',
    label: '🚀 Readiness',
    question: 'How ready do you feel to show up fully in this moment?',
    scaleMin: 'not ready at all',
    scaleMax: 'completely ready',
    reverse: false,
  },
]

const DEFAULT_SCORES = Object.fromEntries(QUESTIONS.map((q) => [q.name, 5]))

export default function EmbodiedCheckin({ timing, sessionId, sessionLabel }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scores, setScores] = useState(DEFAULT_SCORES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (name, value) => setScores((s) => ({ ...s, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = {
        userId: user.uid,
        sessionId,
        timing,
        isEmbodiedCheckin: true,
        createdAt: serverTimestamp(),
      }
      QUESTIONS.forEach((q) => {
        const raw = scores[q.name]
        if (q.reverse) {
          data[`${q.name}_raw`] = raw
          data[q.name] = 11 - raw
        } else {
          data[q.name] = raw
        }
      })
      await addDoc(collection(db, 'ratings'), data)
      navigate('/')
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isBefore = timing === 'pre'

  return (
    <div className="page">
      <div className={styles.header}>
        <p className={styles.timing}>{isBefore ? 'Before session' : 'After session'}</p>
        <h1>{sessionLabel}</h1>
        <p className={styles.title}>Session Check-In</p>
        <p className={styles.instruction}>
          Answer based on how you feel <strong>RIGHT NOW</strong> — in your body, not your head.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="card">
          {QUESTIONS.map((q, i) => (
            <div key={q.name}>
              {i > 0 && <div className={styles.divider} />}
              <div className={styles.questionBlock}>
                <p className={styles.metricLabel}>{q.label}</p>
                <CheckinSlider
                  name={q.name}
                  question={q.question}
                  scaleMin={q.scaleMin}
                  scaleMax={q.scaleMax}
                  value={scores[q.name]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isBefore ? 'Submit check-in' : 'Submit check-in'}
        </button>
      </form>
    </div>
  )
}
