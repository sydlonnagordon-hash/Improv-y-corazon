import styles from './CheckinSlider.module.css'

export default function CheckinSlider({ name, question, scaleMin, scaleMax, value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.question}>{question}</p>
      <div className={styles.buttons}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.btn} ${value === n ? styles.active : ''}`}
            onClick={() => onChange(name, n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className={styles.ends}>
        <span className={styles.endLabel}>1 — {scaleMin}</span>
        <span className={styles.endLabel}>10 — {scaleMax}</span>
      </div>
    </div>
  )
}
