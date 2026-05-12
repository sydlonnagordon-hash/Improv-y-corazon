import styles from './RatingSlider.module.css'

const LABELS = { 1: 'Not at all', 2: 'A little', 3: 'Somewhat', 4: 'Quite a bit', 5: 'Very much' }

export default function RatingSlider({ label, name, value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value} — {LABELS[value]}</span>
      </div>
      <div className={styles.pips}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.pip} ${value === n ? styles.active : ''}`}
            onClick={() => onChange(name, n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
