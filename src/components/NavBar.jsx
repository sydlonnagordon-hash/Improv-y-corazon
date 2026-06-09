import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './NavBar.module.css'

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Improv y Corazón" className={styles.logoImg} />
          <span className={styles.logoText}>Improv y Corazón</span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={open ? styles.barTop + ' ' + styles.barTopOpen : styles.barTop} />
          <span className={open ? styles.barMid + ' ' + styles.barMidOpen : styles.barMid} />
          <span className={open ? styles.barBot + ' ' + styles.barBotOpen : styles.barBot} />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          <Link to="/" className={pathname === '/' ? styles.active : ''} onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" className={pathname === '/about' ? styles.active : ''} onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" className={pathname === '/contact' ? styles.active : ''} onClick={() => setOpen(false)}>Contact</Link>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookBtn}
            onClick={() => setOpen(false)}
          >
            Book a Call
          </a>
        </nav>
      </div>
    </header>
  )
}
