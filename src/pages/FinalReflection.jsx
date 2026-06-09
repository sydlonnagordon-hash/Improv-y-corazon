import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './FinalReflection.module.css'

const METRIC_OPTIONS = [
  '🌊 Stress Load',
  '🌀 Energy Direction',
  '❤️ Authentic Communication',
  '🔄 Recovery Speed',
  '🎭 Improvisational Thinking',
  '🚀 Initiative',
]

export default function FinalReflection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [whatShifted, setWhatShifted] = useState('')
  const [capacityGrew, setCapacityGrew] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState(null)
  const [why, setWhy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = whatShifted.trim() && capacityGrew && wouldRecommend !== null && why.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        finalReflection: {
          whatShifted,
          capacityGrew,
          wouldRecommend,
          why,
          submittedAt: new Date().toISOString(),
        },
        hasSubmittedReflection: true,
      })
      navigate('/', { state: { fromReflection: true } })
    } catch (err) {
      setError('Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className={styles.header}>
        <p className="label">Week 6 complete 🎉</p>
        <h1>End of Program Reflection</h1>
        <p className={styles.sub}>Take a moment. You've tracked yourself honestly for 6 weeks.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="card">
          <div className={styles.question}>
            <label className={styles.questionLabel}>What shifted for you over these 6 weeks?</label>
            <textarea
              className={styles.textarea}
              value={whatShifted}
              onChange={(e) => setWhatShifted(e.target.value)}
              placeholder="Describe any change — in how you see yourself, how you show up, or what you notice."
              rows={4}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.question}>
            <label className={styles.questionLabel}>Which capacity grew the most?</label>
            <select
              className={styles.select}
              value={capacityGrew}
              onChange={(e) => setCapacityGrew(e.target.value)}
            >
              <option value="">Select a capacity…</option>
              {METRIC_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={styles.divider} />

          <div className={styles.question}>
            <label className={styles.questionLabel}>Would you recommend this program?</label>
            <div className={styles.yesNo}>
              <button
                type="button"
                className={`${styles.yesNoBtn} ${wouldRecommend === true ? styles.selected : ''}`}
                onClick={() => setWouldRecommend(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`${styles.yesNoBtn} ${wouldRecommend === false ? styles.selected : ''}`}
                onClick={() => setWouldRecommend(false)}
              >
                No
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.question}>
            <label className={styles.questionLabel}>Why?</label>
            <textarea
              className={styles.textarea}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="Your honest take helps improve the program."
              rows={3}
            />
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !canSubmit}
        >
          {loading ? 'Saving…' : 'Submit Reflection'}
        </button>
      </form>
    </div>
  )
}
