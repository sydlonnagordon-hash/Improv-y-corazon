import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './RelationalEnergyResults.module.css'

const INSIGHT_CARDS = {
  Presence: {
    title: '🌿 Presence — Your Naturally Accessed Energy',
    body: "You are a connector. Students feel safe around you because you make them feel seen and understood before you say a single word. Your presence is your superpower — it creates the emotional safety that makes real mentoring possible.\n\nYour growth edge: Pair your warmth with consistency. Students who trust you emotionally need to also trust that you'll show up the same way every time.",
  },
  Structure: {
    title: '🏗️ Structure — Your Naturally Accessed Energy',
    body: "You are a builder. You bring clarity, follow-through, and reliability to every interaction — and students who feel lost find their footing around you. Your consistency is a gift that many young people have rarely experienced.\n\nYour growth edge: Let yourself be moved. Sometimes a student needs you to feel with them before you help them think.",
  },
  Vision: {
    title: '🚀 Vision — Your Naturally Accessed Energy',
    body: "You are an igniter. You see possibility in students before they see it in themselves — and your energy is contagious. You have the rare ability to shift momentum in a room just by showing up fully.\n\nYour growth edge: Slow down enough to meet students where they are. Not every student is ready to move as fast as you see them going.",
  },
  Grounding: {
    title: '🌳 Grounding — Your Naturally Accessed Energy',
    body: "You are a stabilizer. In a world that feels chaotic for many young people, you are the calm in the storm. Students regulate their own nervous systems by being around yours — even when they don't realize it.\n\nYour growth edge: Let yourself initiate. Your steadiness is powerful — now pair it with the courage to speak first, act first, and lead with your voice.",
  },
}


export const ENERGY_INFO = {
  Presence: {
    emoji: '🌿',
    tagline: 'Connection, Empathy & Attunement',
    description:
      "You naturally create the conditions for people to feel seen, heard, and emotionally safe. Your relational strength is in attuning to what others are carrying beneath the surface — and meeting them there with warmth and understanding.",
  },
  Structure: {
    emoji: '🧭',
    tagline: 'Clarity, Organization & Accountability',
    description:
      "You bring a gift for creating order and clear pathways forward. People feel held when you're in the room because there's a thoughtful plan, clear expectations, and someone who will follow through.",
  },
  Vision: {
    emoji: '✨',
    tagline: 'Possibility, Courage & Momentum',
    description:
      "You energize people toward what's possible. Your natural tendency is to challenge comfort zones with encouragement — lighting up the path forward and instilling belief that change and growth are within reach.",
  },
  Grounding: {
    emoji: '🌱',
    tagline: 'Steadiness, Patience & Regulation',
    description:
      "You offer something rare: the ability to remain a calm, stable presence when the pressure rises. People feel safe around you because you don't escalate — you regulate, and that steadiness creates space for others to recover.",
  },
}

export default function RelationalEnergyResults() {
  const { profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const scores =
    location.state?.scores || profile?.relationalEnergyProfile?.scores || null

  if (!scores) {
    return (
      <div className="page">
        <p>No results found. Please complete the assessment first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/assessment/relational-energy')}>
          Take Assessment
        </button>
      </div>
    )
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const naturally = ranked.slice(0, 2)
  const developing = ranked.slice(2)

  return (
    <div className="page">
      <div className={styles.header}>
        <p className="label">Your Results</p>
        <h1>Your Relational Energy Profile</h1>
        <p className={styles.sub}>
          These are your natural communication rhythms and relational tendencies — not fixed traits, but patterns worth knowing.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Naturally Accessed Energies</h2>
        <p className={styles.sectionSub}>These are the relational strengths you draw on most instinctively.</p>
        {naturally.map(([energy, score]) => (
          <EnergyCard key={energy} energy={energy} score={score} primary />
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Supportive Growth Practices</h2>
        <p className={styles.sectionSub}>These energies are available to you — and expanding them can deepen your range as a mentor.</p>
        {developing.map(([energy, score]) => (
          <EnergyCard key={energy} energy={energy} score={score} />
        ))}
      </div>

      <div className={`card ${styles.insightCard}`}>
        <p className={styles.insightLabel}>Personalized Insight</p>
        <h2 className={styles.insightTitle}>{INSIGHT_CARDS[ranked[0][0]].title}</h2>
        {INSIGHT_CARDS[ranked[0][0]].body.split('\n\n').map((para, i) => (
          <p key={i} className={i === 1 ? styles.insightEdge : styles.insightBody}>{para}</p>
        ))}
      </div>

      <button className="btn btn-primary" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  )
}

function EnergyCard({ energy, score, primary }) {
  const info = ENERGY_INFO[energy]
  return (
    <div className={`card ${styles.energyCard} ${primary ? styles.energyCardPrimary : styles.energyCardSecondary}`}>
      <div className={styles.energyHeader}>
        <span className={styles.energyEmoji}>{info.emoji}</span>
        <div>
          <h3 className={styles.energyName}>{energy}</h3>
          <p className={styles.energyTagline}>{info.tagline}</p>
        </div>
        <span className={styles.energyScore}>{score > 0 ? `+${score}` : score}</span>
      </div>
      <p className={styles.energyDesc}>{info.description}</p>
    </div>
  )
}
