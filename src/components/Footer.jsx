import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="Improv y Corazón" className={styles.logo} />
          <p className={styles.tagline}>
            Presence is not a personality trait.<br />It's a practice.
          </p>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookBtn}
          >
            Book a Discovery Call
          </a>
        </div>
        <div className={styles.linksBlock}>
          <p className={styles.linksLabel}>Navigate</p>
          <nav className={styles.links}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/method">The Method</Link>
            <Link to="/programs">Programs</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <div className={styles.linksBlock}>
          <p className={styles.linksLabel}>Connect</p>
          <nav className={styles.links}>
            <a href="mailto:sydlonna.gordon@gmail.com">Email Us</a>
            <a href="https://calendly.com/improvycorazon/30min" target="_blank" rel="noopener noreferrer">Book a Call</a>
          </nav>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Improv y Corazón · Founded by Sydllonna Burks · Tampa Bay & Beyond</p>
      </div>
    </footer>
  )
}
