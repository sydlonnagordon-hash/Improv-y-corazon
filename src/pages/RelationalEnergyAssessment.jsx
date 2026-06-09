import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './RelationalEnergyAssessment.module.css'

const QUESTIONS = [
  {
    prompt: 'When I need to say something difficult, I naturally…',
    options: [
      { text: 'speak from how I\'m feeling, even if it\'s uncomfortable', energy: 'Presence' },
      { text: 'choose my words carefully to stay clear and organized', energy: 'Structure' },
      { text: 'say it directly and move toward resolution quickly', energy: 'Vision' },
      { text: 'wait until I feel calm enough to respond without reacting', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I sense tension in a conversation, I usually…',
    options: [
      { text: 'address the emotional undercurrent first', energy: 'Presence' },
      { text: 'identify what needs to be clarified or restructured', energy: 'Structure' },
      { text: 'push through the discomfort toward honesty', energy: 'Vision' },
      { text: 'stay regulated and let the tension settle naturally', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I communicate under pressure, others usually experience me as…',
    options: [
      { text: 'emotionally attuned and present', energy: 'Presence' },
      { text: 'clear, organized, and solution-focused', energy: 'Structure' },
      { text: 'direct, bold, and action-oriented', energy: 'Vision' },
      { text: 'calm, measured, and steady', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I feel misunderstood, my first instinct is to…',
    options: [
      { text: 'reconnect emotionally before explaining myself', energy: 'Presence' },
      { text: 'clarify exactly what I meant more precisely', energy: 'Structure' },
      { text: 'reframe the situation and move forward', energy: 'Vision' },
      { text: 'pause, breathe, and let the moment pass', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I am being truly authentic, I tend to…',
    options: [
      { text: 'lead with how I genuinely feel', energy: 'Presence' },
      { text: 'communicate with precision and honesty', energy: 'Structure' },
      { text: 'speak boldly even when it feels risky', energy: 'Vision' },
      { text: 'stay grounded in what I know to be true', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I notice I am performing instead of being real, I usually…',
    options: [
      { text: 'feel disconnected from the people around me', energy: 'Presence' },
      { text: 'feel like my systems and structure are off', energy: 'Structure' },
      { text: 'feel like I am holding back my real energy', energy: 'Vision' },
      { text: 'feel an internal tension I can\'t quite name', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When someone shares something vulnerable with me, I naturally…',
    options: [
      { text: 'create emotional space and stay fully present', energy: 'Presence' },
      { text: 'help them think through it practically', energy: 'Structure' },
      { text: 'encourage them toward possibility and action', energy: 'Vision' },
      { text: 'hold steady and let them feel supported without pressure', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I feel truly connected in a conversation, it usually means…',
    options: [
      { text: 'both people feel emotionally safe and seen', energy: 'Presence' },
      { text: 'communication is clear and purposeful', energy: 'Structure' },
      { text: 'we are being honest and taking relational risks', energy: 'Vision' },
      { text: 'there is calm, unspoken mutual trust', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I am at my best in communication, I am usually…',
    options: [
      { text: 'deeply empathetic and emotionally present', energy: 'Presence' },
      { text: 'organized, clear, and consistent', energy: 'Structure' },
      { text: 'bold, energizing, and direct', energy: 'Vision' },
      { text: 'calm, patient, and dependably steady', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When communication breaks down, I typically…',
    options: [
      { text: 'focus on repairing the emotional connection', energy: 'Presence' },
      { text: 'identify where clarity or follow-through was lost', energy: 'Structure' },
      { text: 'push toward an honest reset', energy: 'Vision' },
      { text: 'stay regulated and wait for the right moment', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I first notice stress rising in my body, I usually…',
    options: [
      { text: 'become more aware of the emotional atmosphere around me', energy: 'Presence' },
      { text: 'shift into problem-solving and organizing mode', energy: 'Structure' },
      { text: 'increase my energy and push toward action', energy: 'Vision' },
      { text: 'slow down internally and become quieter', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When plans change unexpectedly, I typically…',
    options: [
      { text: 'check in with how others are affected emotionally', energy: 'Presence' },
      { text: 'immediately begin reorganizing priorities', energy: 'Structure' },
      { text: 'adapt quickly and look for new possibilities', energy: 'Vision' },
      { text: 'stay calm and focused on what remains stable', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I feel pressure to perform, I tend to…',
    options: [
      { text: 'become highly attuned to how others perceive me', energy: 'Presence' },
      { text: 'focus on getting things right and in order', energy: 'Structure' },
      { text: 'bring more energy and push harder', energy: 'Vision' },
      { text: 'withdraw inward and rely on my steadiness', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When something goes wrong in the middle of an interaction, I…',
    options: [
      { text: 'prioritize reconnecting emotionally with the people involved', energy: 'Presence' },
      { text: 'assess what broke down and how to fix it', energy: 'Structure' },
      { text: 'shift energy and improvise a new direction', energy: 'Vision' },
      { text: 'stay grounded and prevent further disruption', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I fall behind or make a mistake, I usually…',
    options: [
      { text: 'process how it affected my relationships first', energy: 'Presence' },
      { text: 'figure out what needs to be corrected and reorganized', energy: 'Structure' },
      { text: 'refocus quickly and move forward with renewed energy', energy: 'Vision' },
      { text: 'absorb it quietly and return to steady action', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I am under stress and still need to show up for others, I…',
    options: [
      { text: 'draw on emotional connection to stay present', energy: 'Presence' },
      { text: 'rely on structure and preparation to stay focused', energy: 'Structure' },
      { text: 'use momentum and forward energy to keep going', energy: 'Vision' },
      { text: 'regulate internally so I can remain a steady presence', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When someone questions whether they can count on me, I usually…',
    options: [
      { text: 'have an honest conversation about how they\'re feeling', energy: 'Presence' },
      { text: 'recommit to clear expectations and follow through consistently', energy: 'Structure' },
      { text: 'bring renewed energy and show up differently', energy: 'Vision' },
      { text: 'demonstrate reliability through consistent, quiet action', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I observe my own patterns under pressure, I notice I tend to…',
    options: [
      { text: 'prioritize how relationships are being affected', energy: 'Presence' },
      { text: 'focus on what is unclear or needs reorganizing', energy: 'Structure' },
      { text: 'move toward action and possibility', energy: 'Vision' },
      { text: 'become quieter and more internally regulated', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I recover after a stressful moment, I usually do it by…',
    options: [
      { text: 'reconnecting with someone I trust emotionally', energy: 'Presence' },
      { text: 'returning to structure, clarity, and next steps', energy: 'Structure' },
      { text: 'redirecting my energy toward something meaningful', energy: 'Vision' },
      { text: 'finding stillness and allowing myself to reset', energy: 'Grounding' },
    ],
  },
  {
    prompt: 'When I reflect honestly on how I show up under pressure, I would say I am most naturally…',
    options: [
      { text: 'emotionally present and relationally aware', energy: 'Presence' },
      { text: 'organized, reliable, and solution-focused', energy: 'Structure' },
      { text: 'adaptive, bold, and action-oriented', energy: 'Vision' },
      { text: 'calm, grounded, and emotionally regulated', energy: 'Grounding' },
    ],
  },
]

export default function RelationalEnergyAssessment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(QUESTIONS.map(() => ({ most: null, least: null })))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = QUESTIONS[step]
  const answer = answers[step]
  const canProceed = answer.most !== null && answer.least !== null
  const isLast = step === QUESTIONS.length - 1

  const handleSelect = (optionIndex, type) => {
    const energy = current.options[optionIndex].energy
    setAnswers((prev) => {
      const next = [...prev]
      const curr = { ...next[step] }
      if (curr[type] === energy) {
        curr[type] = null
      } else {
        curr[type] = energy
        const other = type === 'most' ? 'least' : 'most'
        if (curr[other] === energy) curr[other] = null
      }
      next[step] = curr
      return next
    })
  }

  const calculateScores = () => {
    const scores = { Presence: 0, Structure: 0, Vision: 0, Grounding: 0 }
    answers.forEach(({ most, least }) => {
      if (most) scores[most] += 2
      if (least) scores[least] -= 1
    })
    return scores
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const scores = calculateScores()
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        relationalEnergyProfile: { scores, submittedAt: new Date().toISOString() },
        hasSubmittedEnergyProfile: true,
      })
      navigate('/energy-results', { state: { scores } })
    } catch {
      setError('Could not save. Please try again.')
      setLoading(false)
    }
  }

  const progress = ((step + 1) / QUESTIONS.length) * 100

  return (
    <div className="page">
      <div className={styles.header}>
        <p className={styles.trademark}>Corazón Relational Energy Profile™</p>
        <h1>Know Your Natural Style</h1>
        <div className={styles.introBlock}>
          <p className={styles.introText}>This is not a personality test. It is a mirror.</p>
          <p className={styles.introText}>Your relational energy reflects your instinctive, natural way of connecting, communicating, and taking action — especially under pressure. There are no right or wrong answers.</p>
          <p className={styles.introText}>Answer as your most natural, free self — not how you think you should respond, but how you actually tend to show up.</p>
          <p className={styles.introText}>Your results will reveal your naturally accessed energies and your less frequently accessed energies — the foundation of your personal Corazón presence profile.</p>
          <p className={styles.introFooter}>This assessment was developed by Improv y Corazón and is rooted in relational presence, improv-based learning, and nervous system awareness.</p>
        </div>
        <p className={styles.instruction}>
          <strong>If I am free to be myself, I would naturally…</strong><br />
          Choose <strong>one Most Like Me</strong> and <strong>one Least Like Me</strong> per question.
        </p>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.progressLabel}>Question {step + 1} of {QUESTIONS.length}</p>

      <div className={`card ${styles.questionCard}`}>
        <p className={styles.prompt}>{current.prompt}</p>
        <div className={styles.options}>
          {current.options.map((opt, i) => {
            const isMost = answer.most === opt.energy
            const isLeast = answer.least === opt.energy
            return (
              <div
                key={i}
                className={`${styles.option} ${isMost ? styles.optionMost : ''} ${isLeast ? styles.optionLeast : ''}`}
              >
                <p className={styles.optionText}>{opt.text}</p>
                <div className={styles.optionBtns}>
                  <button
                    type="button"
                    className={`${styles.selectBtn} ${isMost ? styles.selectBtnMost : ''}`}
                    onClick={() => handleSelect(i, 'most')}
                  >
                    ▲ Most Like Me
                  </button>
                  <button
                    type="button"
                    className={`${styles.selectBtn} ${isLeast ? styles.selectBtnLeast : ''}`}
                    onClick={() => handleSelect(i, 'least')}
                  >
                    ▽ Least Like Me
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className={styles.nav}>
        {step > 0 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep((s) => s - 1)}
            style={{ flex: 1 }}
          >
            ← Back
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canProceed}
            onClick={() => setStep((s) => s + 1)}
            style={{ flex: 2 }}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canProceed || loading}
            onClick={handleSubmit}
            style={{ flex: 2 }}
          >
            {loading ? 'Saving…' : 'See My Profile'}
          </button>
        )}
      </div>
    </div>
  )
}
