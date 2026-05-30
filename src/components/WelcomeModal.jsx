import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import styles from './WelcomeModal.module.css'

export default function WelcomeModal({ onClose }) {
  const { user, refreshProfile } = useAuth()

  const handleDismiss = () => {
    onClose()
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { hasSeenWelcome: true })
        .then(() => refreshProfile())
        .catch(() => {})
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleDismiss()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to the Performance Lab 🎭</h1>
          <p className={styles.subtitle}>This is not a grading tool. It's a mirror.</p>
        </div>

        <div className={styles.body}>
          <p>
            The Corazón Pressure Method helps you communicate more authentically and regulate yourself
            better under stress — using improvisational training, nervous system awareness, and self-observation.
          </p>
          <p className={styles.highlight}>
            The guiding idea: <em>The way you play is the way you perform under pressure. Play reveals the pattern.</em>
          </p>
          <p>Over 6 weeks you'll track:</p>
          <ul className={styles.list}>
            <li>How you respond when pressure rises</li>
            <li>How quickly you recover</li>
            <li>How honestly you communicate</li>
            <li>How flexibly you adapt</li>
          </ul>
          <p className={styles.footer}>
            This is professional development — not therapy or assessment. Just honest self-observation.
          </p>
        </div>

        <p className={styles.week6Note}>
          At the end of Week 6 you will complete a final 10-question reflection to measure your growth from where you started.
        </p>

        <p className={styles.disclaimer}>
          This is professional development and performance training. It is not therapy, diagnosis, or a mental health assessment. Use these practices to build self-awareness, communication, and adaptive performance.
        </p>

        <p className={styles.consent}>
          By participating you consent to your anonymized data being used in the Improv y Corazón Elevate Tampa Bay case study.
        </p>

        <button className={styles.btn} onClick={handleDismiss}>
          I'm ready. Let's begin.
        </button>
      </div>
    </div>
  )
}
