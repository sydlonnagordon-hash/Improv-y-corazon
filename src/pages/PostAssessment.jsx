import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import RatingSlider from '../components/RatingSlider'
import styles from './BaselineIntake.module.css'

const QUESTIONS = [
  {
    name: 'stressLoad',
    metric: '🌊 Stress Load',
    question: 'Right now, how much pressure are you carrying in your daily work as a mentor?',
    scale: '1 = very little pressure · 5 = overwhelming pressure',
    reverse: true,
  },
  {
    name: 'energyDirection',
    metric: '🌀 Energy Direction',
    question: 'How well do you currently prioritize what matters most and direct your energy toward it — rather than reacting to whatever feels most urgent?',
    scale: '1 = I mostly react · 5 = I prioritize well',
    reverse: false,
  },
  {
    name: 'authenticCommunication',
    metric: '❤️ Authentic Communication',
    question: "How often do you find yourself performing — saying what sounds right rather than what you actually mean — when you're under pressure?",
    scale: '1 = I always communicate authentically · 5 = I almost always perform',
    reverse: true,
  },
  {
    name: 'recoverySpeed',
    metric: '🔄 Recovery Speed',
    question: 'How quickly do you return to focus and presence after a difficult moment, conflict, or stressful interaction?',
    scale: '1 = I struggle to refocus · 5 = I return to presence quickly',
    reverse: false,
  },
  {
    name: 'improvisationalThinking',
    metric: '🎭 Improvisational Thinking',
    question: "How effectively do you adapt and keep moving when plans change unexpectedly or things don't go as expected?",
    scale: '1 = I tend to freeze or shut down · 5 = I adapt and move forward easily',
    reverse: false,
  },
  {
    name: 'initiative',
    metric: '🚀 Initiative',
    question: 'How naturally do you take useful action without waiting for perfect conditions or overthinking?',
    scale: '1 = I often wait or overthink · 5 = I act naturally and confidently',
    reverse: false,
  },
  {
    name: 'pressureAwareness',
    metric: '🔍 Pressure Awareness',
    question: 'How frequently do you currently notice the moment your body feels stress or pressure?',
    scale: '1 = I rarely notice · 5 = I notice immediately',
    reverse: false,
  },
  {
    name: 'emotionalRegulation',
    metric: '⚖️ Emotional Regulation',
    question: 'How reactive vs. responsive do you feel when things feel out of control?',
    scale: '1 = very reactive · 5 = very responsive',
    reverse: false,
  },
  {
    name: 'relationalPresence',
    metric: '🤝 Relational Presence',
    question: 'How well do you maintain connection and presence with others when you are stressed?',
    scale: '1 = I tend to withdraw or disconnect · 5 = I stay connected and present',
    reverse: false,
  },
  {
    name: 'patternRecognition',
    metric: '🔁 Pattern Recognition',
    question: 'How aware are you of your own repeated patterns when pressure rises?',
    scale: '1 = I rarely notice patterns · 5 = I notice them clearly',
    reverse: false,
  },
]

export default function PostAssessment() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [scores, setScores] = useState(
    Object.fromEntries(QUESTIONS.map((q) => [q.name, 3]))
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (name, value) => setScores((s) => ({ ...s, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const postAssessment = {}
      QUESTIONS.forEach((q) => {
        const raw = scores[q.name]
        if (q.reverse) {
          postAssessment[`${q.name}_raw`] = raw
          postAssessment[q.name] = 6 - raw
        } else {
          postAssessment[q.name] = raw
        }
      })
      await updateDoc(doc(db, 'users', user.uid), {
        postAssessment,
        hasSubmittedPostAssessment: true,
      })
      setSubmitted(true)
    } catch {
      setError('Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <p style={{ fontSize: '2.5rem', margin: 0 }}>🌱</p>
          <h2 style={{ color: '#2D5A27', margin: 0 }}>Growth data saved.</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--gray-600)', lineHeight: 1.65, maxWidth: '340px', margin: 0 }}>
            Your growth data is saved. Your facilitator will share your results during the final session.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={() => navigate('/')}>
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className={styles.header}>
        <p className={styles.trademark}>Corazón Post-Assessment</p>
        <h1>Your Growth Assessment</h1>
        <div className={styles.introBlock}>
          <p className={styles.introText}>You made it to Week 6. Now let's measure how far you've come.</p>
          <p className={styles.introText}>Answer these 10 questions the same way you did at the start — honestly, based on how you actually show up right now.</p>
          <p className={styles.introText}><strong>This is your mirror — then and now.</strong></p>
        </div>
        <p className={styles.instruction}>Rate where you are RIGHT NOW — after six weeks of training. There are no right or wrong answers.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="card">
          {QUESTIONS.map((q, i) => (
            <div key={q.name}>
              {i > 0 && <div className={styles.divider} />}
              <div className={styles.questionBlock}>
                <div className={styles.questionMeta}>
                  <span className={styles.questionNum}>{i + 1}.</span>
                  <span className={styles.questionMetric}>{q.metric}</span>
                  {q.reverse && <span className={styles.reverseTag}>↔ adjusted</span>}
                </div>
                <p className={styles.questionText}>{q.question}</p>
                <p className={styles.questionScale}>{q.scale}</p>
                <RatingSlider
                  label=""
                  name={q.name}
                  value={scores[q.name]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Submit My Growth Assessment'}
        </button>
      </form>
    </div>
  )
}
