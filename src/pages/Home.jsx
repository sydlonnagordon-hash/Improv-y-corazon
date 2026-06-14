import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── HERO — black ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <img src="/logo.png" alt="Improv y Corazón" className={styles.heroLogo} />
          <h1 className={styles.heroHeadline}>
            Your leaders know what to do.<br />
            So why does pressure change everything?
          </h1>
          <p className={styles.heroSub}>
            Improv y Corazón helps organizations develop leaders who stay connected,
            authentic, and effective — even when the stakes are highest.
          </p>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnRed}
          >
            Book a Discovery Call
          </a>
        </div>
      </section>

      {/* ── PROBLEM — cream ── */}
      <section className={styles.problem}>
        <div className={styles.sectionInner}>
          <p className={styles.problemStatement}>
            You've invested in training. Your team has attended the workshops.
            They know the frameworks.
          </p>
          <p className={styles.problemBridge}>
            But when a student pushes back, a conversation gets hard,
            or pressure rises — the skills disappear.
          </p>
          <p className={styles.problemRed}>
            That's not a knowledge problem. That's a presence problem.
          </p>
        </div>
      </section>

      {/* ── DIFFERENTIATOR — black ── */}
      <section className={styles.differentiator}>
        <div className={styles.sectionInner}>
          <div className={styles.diffGrid}>
            <div className={styles.diffItem}>
              <span className={styles.diffMark}>—</span>
              <p className={styles.diffText}>We don't teach communication. We remove what blocks it.</p>
            </div>
            <div className={styles.diffItem}>
              <span className={styles.diffMark}>—</span>
              <p className={styles.diffText}>We don't build confidence. We reveal the beliefs undermining it.</p>
            </div>
            <div className={styles.diffItem}>
              <span className={styles.diffMark}>—</span>
              <p className={styles.diffText}>We don't improve leadership. We train presence under pressure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE — cream ── */}
      <section className={styles.serve}>
        <div className={styles.sectionInner}>
          <p className={styles.serveEyebrow}>Who We Serve</p>
          <h2 className={styles.serveHeadline}>Built for organizations that develop people.</h2>
          <div className={styles.serveGrid}>
            {[
              { icon: '◆', label: 'Youth Mentor Organizations' },
              { icon: '◆', label: 'Workforce Readiness Programs' },
              { icon: '◆', label: 'Schools & Educator Development Teams' },
              { icon: '◆', label: 'Nonprofit Leadership Teams' },
            ].map(({ icon, label }) => (
              <div key={label} className={styles.serveCard}>
                <span className={styles.serveIcon}>{icon}</span>
                <p className={styles.serveLabel}>{label}</p>
              </div>
            ))}
          </div>
          <Link to="/programs" className={styles.btnOutlineBlack}>See Our Programs →</Link>
        </div>
      </section>

      {/* ── COMING SOON — black ── */}
      <section className={styles.pilot}>
        <div className={styles.sectionInner}>
          <p className={styles.pilotEyebrow}>Results Coming Summer 2026</p>
          <h2 className={styles.pilotHeadline}>
            From our Elevate Tampa Bay pilot.
          </h2>
          <div className={styles.pilotGrid}>
            <div className={styles.pilotBox}>
              <p className={styles.pilotBoxLabel}>Participant Testimonials</p>
              <p className={styles.pilotBoxNote}>Coming Summer 2026</p>
            </div>
            <div className={styles.pilotBox}>
              <p className={styles.pilotBoxLabel}>Program Video</p>
              <p className={styles.pilotBoxNote}>Coming Summer 2026</p>
            </div>
            <div className={styles.pilotBox}>
              <p className={styles.pilotBoxLabel}>Impact Statistics</p>
              <p className={styles.pilotBoxNote}>Coming Summer 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — red ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeadline}>
            Ready to see what your leaders are capable of?
          </h2>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhite}
          >
            Book a Discovery Call
          </a>
        </div>
      </section>

    </div>
  )
}
