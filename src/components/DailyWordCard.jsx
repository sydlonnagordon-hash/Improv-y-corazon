import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import styles from './DailyWordCard.module.css'

const GRATITUDE_WORDS = [
  'Health', 'Family', 'Friends', 'Home', 'Work',
  'Peace', 'Love', 'Faith', 'Food', 'Rest',
  'Strength', 'Laughter', 'Growth', 'Safety', 'Purpose',
  'Community', 'Clarity', 'Support', 'Breath', 'Hope',
]

const INTENTION_WORDS = [
  'Creativity', 'Kindness', 'Love', 'Beauty', 'Expansion',
  'Abundance', 'Receptivity', 'Gratitude', 'Peace', 'Trust',
  'Surrender', 'Forgiveness', 'Wholeness', 'Presence', 'Courage',
  'Flow', 'Harmony', 'Authenticity', 'Service', 'Joy',
]

const AFFIRMATIONS = {
  Creativity:   "You are a channel for new ideas. Trust what wants to emerge through you.",
  Kindness:     "Kindness is strength in action. It changes rooms without raising a voice.",
  Love:         "Love is the highest intention. When you lead with it, everything shifts.",
  Beauty:       "You see what others miss. That is a gift worth sharing.",
  Expansion:    "Growth is uncomfortable and necessary. You are becoming.",
  Abundance:    "Abundance begins in the mind. You already have more than you know.",
  Receptivity:  "Being open is an act of courage. You are ready to receive.",
  Gratitude:    "Gratitude turns what you have into enough. And enough into more.",
  Peace:        "Peace is not the absence of pressure. It is your ability to return to center.",
  Trust:        "Trust is built one honest moment at a time — starting with yourself.",
  Surrender:    "Letting go is not giving up. It is making room for what is meant to come.",
  Forgiveness:  "Forgiveness frees you first. You are releasing what no longer serves you.",
  Wholeness:    "You are not broken. You are integrating. That is different.",
  Presence:     "The most powerful thing you can offer anyone is your full attention.",
  Courage:      "Courage is not the absence of fear. It is showing up anyway.",
  Flow:         "Flow comes when you stop forcing and start trusting.",
  Harmony:      "Harmony is not perfection. It is finding your rhythm even in the noise.",
  Authenticity: "Your realness is your superpower. The world needs you — not a performance.",
  Service:      "Service is presence with purpose. You are making a difference.",
  Joy:          "Joy is not something you find. It is something you practice.",
}
const DEFAULT_AFFIRMATION = "Your intention is set. Now let it guide you."

export function getToday() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function DailyWordCard({ todayEntry, onSubmit }) {
  const { user } = useAuth()
  const [gratitude, setGratitude] = useState(null)
  const [intention, setIntention] = useState(null)
  const [customGratitude, setCustomGratitude] = useState('')
  const [customIntention, setCustomIntention] = useState('')
  const [saving, setSaving] = useState(false)

  const gratitudeWord = gratitude || customGratitude.trim() || null
  const intentionWord = intention || customIntention.trim() || null
  const canSubmit = !!(gratitudeWord && intentionWord)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSaving(true)
    const entry = {
      gratitude: gratitudeWord,
      intention: intentionWord,
      submittedAt: new Date().toISOString(),
    }
    await setDoc(doc(db, 'users', user.uid, 'dailyWords', getToday()), entry)
    onSubmit(entry)
    setSaving(false)
  }

  // Submitted state
  if (todayEntry?.gratitude) {
    const affirmation = AFFIRMATIONS[todayEntry.intention] || DEFAULT_AFFIRMATION
    return (
      <div className={`card ${styles.card}`}>
        <p className={styles.cardTitle}>Your Daily Practice</p>
        <div className={styles.submittedPair}>
          <div className={styles.submittedBlock}>
            <span className={styles.submittedLabel}>I am grateful for…</span>
            <span className={styles.submittedWord}>{todayEntry.gratitude}</span>
          </div>
          <div className={styles.submittedBlock}>
            <span className={styles.submittedLabel}>Today I intend to embody…</span>
            <span className={styles.submittedWord}>{todayEntry.intention}</span>
          </div>
        </div>
        <div className={styles.affirmation}>
          <p className={styles.affirmationText}>{affirmation}</p>
        </div>
        <span className={styles.submittedNote}>Practice complete for today ✓</span>
      </div>
    )
  }

  // Selection state
  return (
    <div className={`card ${styles.card}`}>
      <p className={styles.cardTitle}>Your Daily Practice</p>

      {/* Step 1 */}
      <div className={styles.step}>
        <p className={styles.stepTitle}>I am grateful for…</p>
        <p className={styles.stepSci}>
          Your brain literally rewires itself around what you repeatedly notice. Mentors who practice gratitude daily build a nervous system that recovers faster, connects deeper, and leads with more presence.
        </p>
        <div className={styles.chips}>
          {GRATITUDE_WORDS.map((w) => (
            <button
              key={w}
              type="button"
              className={`${styles.chip} ${gratitude === w ? styles.chipSelected : ''}`}
              onClick={() => { setGratitude(gratitude === w ? null : w); setCustomGratitude('') }}
            >
              {w}
            </button>
          ))}
        </div>
        <input
          type="text"
          className={styles.customInput}
          placeholder="Or type your own…"
          value={customGratitude}
          maxLength={30}
          onChange={(e) => { setCustomGratitude(e.target.value); setGratitude(null) }}
        />
      </div>

      {/* Step 2 */}
      <div className={`${styles.step} ${styles.stepBordered}`}>
        <p className={styles.stepTitle}>Today I intend to embody…</p>
        <p className={styles.stepSci}>Where attention goes, energy flows. Setting a daily intention primes your nervous system to notice opportunities to live it.</p>
        <div className={styles.chips}>
          {INTENTION_WORDS.map((w) => (
            <button
              key={w}
              type="button"
              className={`${styles.chip} ${intention === w ? styles.chipSelected : ''}`}
              onClick={() => { setIntention(intention === w ? null : w); setCustomIntention('') }}
            >
              {w}
            </button>
          ))}
        </div>
        <input
          type="text"
          className={styles.customInput}
          placeholder="Or type your own…"
          value={customIntention}
          maxLength={30}
          onChange={(e) => { setCustomIntention(e.target.value); setIntention(null) }}
        />
      </div>

      <button
        className={`btn btn-primary ${styles.submitBtn}`}
        disabled={!canSubmit || saving}
        onClick={handleSubmit}
      >
        {saving ? 'Saving…' : 'Set my intention for today'}
      </button>
    </div>
  )
}
