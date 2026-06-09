import styles from './RatingSlider.module.css'

export default function RatingSlider({ name, value, onChange }) {
  return (
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
  )
}
