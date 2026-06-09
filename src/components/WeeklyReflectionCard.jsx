import styles from './WeeklyReflectionCard.module.css'

export default function WeeklyReflectionCard({ content }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>This week's practices</p>
        {content.practices.map((p, i) => (
          <div key={i} className={styles.practice}>
            <span className={styles.practiceIcon}>{p.icon}</span>
            <div>
              <span className={styles.practiceName}>{p.name}</span>
              <span className={styles.practiceDesc}> — {p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
