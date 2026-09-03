import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/method', label: 'The Method' },
  { to: '/programs', label: 'Programs' },
  { to: '/contact', label: 'Contact' },
  { to: '/book', label: 'Buy the Book', highlight: true },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Improv y Corazón" className={styles.logoImg} />
        </NavLink>

        <button
          className={styles.hamburger}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={`${styles.bar} ${open ? styles.barTopOpen : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barMidOpen : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barBotOpen : ''}`} />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`} role="navigation">
          {links.map(({ to, label, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                highlight
                  ? `${styles.bookLink} ${isActive ? styles.bookLinkActive : ''}`
                  : `${styles.link} ${isActive ? styles.active : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
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
