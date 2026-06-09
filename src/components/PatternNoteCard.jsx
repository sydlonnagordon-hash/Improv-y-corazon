import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import styles from './PatternNoteCard.module.css'

const PROMPTS_LIVE = [
  {
    question: 'What did you notice happening in your body when pressure rose this week?',
    placeholder: 'Describe what you felt physically or emotionally...',
  },
  {
    question: 'Where did you freeze, perform, or pull back — and what triggered it?',
    placeholder: 'Be specific about the moment...',
  },
  {
    question: 'What helped you return to presence?',
    placeholder: 'What worked for you...',
  },
]

const PROMPTS_FIELD = [
  {
    question: 'What pressure pattern showed up most in your mentor interactions this week?',
    placeholder: 'Describe what you kept noticing...',
  },
  {
    question: 'Where did you catch yourself and make a different choice?',
    placeholder: 'Describe the moment and what you did differently...',
  },
  {
    question: 'What is one thing you want to do differently next week?',
    placeholder: 'Be specific...',
  },
]

export default function PatternNoteCard({ sessionId, existingNote }) {
  const { user } = useAuth()
  const weekNum = parseInt(sessionId.replace('week-', ''))
  const prompts = weekNum <= 3 ? PROMPTS_LIVE : PROMPTS_FIELD

  const initAnswers = () => {
    if (!existingNote) return ['', '', '']
    if (existingNote.prompt1 !== undefined) {
      return [existingNote.prompt1 || '', existingNote.prompt2 || '', existingNote.prompt3 || '']
    }
    return ['', '', '']
  }

  const [answers, setAnswers] = useState(initAnswers)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(!!existingNote)

  const handleChange = (i, value) =>
    setAnswers((prev) => prev.map((a, j) => (j === i ? value : a)))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (answers.every((a) => !a.trim())) return
    setLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid, 'patternNotes', sessionId), {
        prompt1: answers[0],
        prompt2: answers[1],
        prompt3: answers[2],
        sessionId,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch {
      // silently fail — non-critical
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const isNewFormat = existingNote?.prompt1 !== undefined
    return (
      <div className={`card ${styles.card}`}>
        <p className={styles.cardLabel}>Weekly Self-Observation</p>
        {isNewFormat ? (
          prompts.map((p, i) => (
            <div key={i} className={styles.savedEntry}>
              <p className={styles.savedQuestion}>{p.question}</p>
              <p className={styles.savedAnswer}>{answers[i] || '—'}</p>
            </div>
          ))
        ) : (
          <p className={styles.savedNote}>{existingNote?.note || ''}</p>
        )}
        <span className={styles.savedBadge}>Saved ✓</span>
      </div>
    )
  }

  return (
    <div className={`card ${styles.card}`}>
      <p className={styles.cardLabel}>Weekly Self-Observation</p>
      <p className={styles.subtitle}>Take 2 minutes. Answer honestly.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {prompts.map((p, i) => (
          <div key={i} className={styles.promptBlock}>
            <p className={styles.question}>{i + 1}. {p.question}</p>
            <textarea
              className={styles.textarea}
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={p.placeholder}
              rows={3}
            />
          </div>
        ))}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || answers.every((a) => !a.trim())}
        >
          {loading ? 'Saving…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
