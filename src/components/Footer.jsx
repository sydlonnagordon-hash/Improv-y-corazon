import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="Improv y Corazón" className={styles.logo} />
          <p className={styles.tagline}>Your leaders are showing up.<br />But are they really present?</p>
        </div>
        <nav className={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href="https://calendly.com/improvycorazon/30min" target="_blank" rel="noopener noreferrer">Book a Call</a>
        </nav>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Improv y Corazón. Founded by Sydllonna Burks.</p>
      </div>
    </footer>
  )
}
