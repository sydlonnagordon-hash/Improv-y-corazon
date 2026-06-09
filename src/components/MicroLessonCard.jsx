import styles from './MicroLessonCard.module.css'

export default function MicroLessonCard({ lesson }) {
  if (!lesson) return null

  return (
    <div className={`card ${styles.card}`}>
      <p className={styles.eyebrow}>This Week's Lesson</p>
      <h2 className={styles.title}>{lesson.title}</h2>
      <div className={styles.body}>
        {lesson.body.map((para, i) => (
          <p key={i} className={styles.para}>{para}</p>
        ))}
      </div>
    </div>
  )
}
