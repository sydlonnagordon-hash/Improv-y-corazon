import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import styles from './PresenceBoard.module.css'

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4', '5']

export default function PresenceBoard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'leaderboard'))
      const data = snap.docs
        .map((d) => ({ uid: d.id, ...d.data() }))
        .filter((e) => e.points > 0)
        .sort((a, b) => b.points - a.points)
      setEntries(data)
      setLoading(false)
    }
    load()
  }, [])

  const top5 = entries.slice(0, 5)
  const myRank = entries.findIndex((e) => e.uid === user.uid) + 1
  const myEntry = entries.find((e) => e.uid === user.uid)
  const myInTop5 = myRank >= 1 && myRank <= 5

  if (loading) return <div className="page"><p>Loading…</p></div>

  return (
    <div className="page">
      <div className={styles.header}>
        <h1>The Presence Board 🔥</h1>
        <p className={styles.subtitle}>
          This isn't about who's the best. It's about who's showing up. Every task completed is a rep. Every rep builds presence.
        </p>
      </div>

      <div className="card">
        <div className={styles.pointsGuide}>
          <p className={styles.guideTitle}>How points are earned</p>
          <div className={styles.guideGrid}>
            <span>Baseline assessment</span><span className={styles.pts}>5 pts</span>
            <span>Relational Energy Assessment</span><span className={styles.pts}>5 pts</span>
            <span>Before session check-in</span><span className={styles.pts}>3 pts</span>
            <span>After session check-in</span><span className={styles.pts}>3 pts</span>
            <span>Weekly Self-Observation</span><span className={styles.pts}>2 pts</span>
            <span>Daily practice</span><span className={styles.pts}>2 pts</span>
            <span>Growth assessment (Week 6)</span><span className={styles.pts}>10 pts</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className={styles.boardTitle}>Top 5</h2>
        {top5.length === 0 ? (
          <p className={styles.empty}>No points recorded yet — keep showing up!</p>
        ) : (
          <div className={styles.board}>
            {top5.map((entry, i) => {
              const isMe = entry.uid === user.uid
              return (
                <div key={entry.uid} className={`${styles.row} ${i === 0 ? styles.rowFirst : ''} ${isMe ? styles.rowMe : ''}`}>
                  <span className={styles.medal}>{RANK_MEDALS[i]}</span>
                  <span className={styles.name}>
                    {entry.firstName}
                    {isMe && <span className={styles.youTag}> (you)</span>}
                  </span>
                  <span className={styles.score}>{entry.points} pts</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Show current user's rank if outside top 5 */}
        {!myInTop5 && myEntry && (
          <>
            <div className={styles.ellipsis}>…</div>
            <div className={`${styles.row} ${styles.rowMe}`}>
              <span className={styles.medal}>#{myRank}</span>
              <span className={styles.name}>{myEntry.firstName} <span className={styles.youTag}>(you)</span></span>
              <span className={styles.score}>{myEntry.points} pts</span>
            </div>
          </>
        )}

        {!myInTop5 && !myEntry && (
          <div className={styles.noPoints}>
            <p>You don't have any points yet — complete your first task to appear on the board.</p>
          </div>
        )}
      </div>

      <div className={`card ${styles.prizeCard}`}>
        <p className={styles.prizeTitle}>Prizes</p>
        <div className={styles.prizes}>
          <span>🥇 1st Place — $75</span>
          <span>🥈 2nd Place — $50</span>
          <span>🥉 3rd Place — $25</span>
        </div>
        <p className={styles.prizeSub}>Complete as many tasks as you can. Every rep counts.</p>
      </div>
    </div>
  )
}
