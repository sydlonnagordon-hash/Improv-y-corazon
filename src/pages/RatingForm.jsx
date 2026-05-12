import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import RatingSlider from '../components/RatingSlider'
import { useNavigate } from 'react-router-dom'
import styles from './RatingForm.module.css'

const METRICS = [
  { name: 'recoverySpeedAfterStress', label: 'Recovery Speed After Stress' },
  { name: 'healthySocialRisks', label: 'Ability To Take Healthy Social Risks' },
  { name: 'listeningWithoutFixing', label: 'Listening Without Fixing' },
  { name: 'prioritizeUnderPressure', label: 'Ability To Prioritize Under Pressure' },
  { name: 'recoveryAfterFallingBehind', label: 'Recovery After Falling Behind' },
]

const DEFAULT_RATINGS = {
  recoverySpeedAfterStress: 3,
  healthySocialRisks: 3,
  listeningWithoutFixing: 3,
  prioritizeUnderPressure: 3,
  recoveryAfterFallingBehind: 3,
}

export default function RatingForm({ timing, sessionId, sessionLabel, onDone }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ratings, setRatings] = useState(DEFAULT_RATINGS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (name, value) => setRatings((r) => ({ ...r, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await addDoc(collection(db, 'ratings'), {
        userId: user.uid,
        sessionId,
        timing,
        ...ratings,
        createdAt: serverTimestamp(),
      })
      onDone?.()
      navigate('/')
    } catch (err) {
      setError('Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div>
        <p className="label">{timing === 'pre' ? 'Before session' : 'After session'}</p>
        <h1>{sessionLabel}</h1>
      </div>
      <p className={styles.instruction}>Rate yourself honestly — there are no right answers.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="card">
          {METRICS.map((m) => (
            <div key={m.name} className={styles.metric}>
              <RatingSlider
                label={m.label}
                name={m.name}
                value={ratings[m.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Submit ratings'}
        </button>
      </form>
    </div>
  )
}
