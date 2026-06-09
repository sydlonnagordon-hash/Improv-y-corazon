import { Link } from 'react-router-dom'
import styles from './About.module.css'

const values = [
  {
    title: 'Presence Over Performance',
    desc: 'We believe the most effective leaders are the ones who can be fully in the room — not managing impressions, but genuinely engaged.',
  },
  {
    title: 'The Body Knows',
    desc: 'Presence is embodied. Our methods work with how leaders physically inhabit space, stress, and relationship — not just how they think about it.',
  },
  {
    title: 'Play is Serious Work',
    desc: 'Improvisation isn\'t a party trick. It\'s one of the most direct paths to discovering how you actually respond when the plan falls apart.',
  },
  {
    title: 'Data Informs, Experience Transforms',
    desc: 'We track six core metrics across every engagement — not for accountability, but so leaders can see their own arc and trust what\'s changing.',
  },
]

export default function About() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.headline}>
            Presence is the<br />leadership skill<br />nobody teaches.
          </h1>
        </div>
      </section>

      {/* Founder */}
      <section className={styles.founder}>
        <div className={styles.founderInner}>
          <div className={styles.founderText}>
            <p className={styles.sectionLabel}>Founder</p>
            <h2 className={styles.sectionHeading}>Sydllonna Burks</h2>
            <p className={styles.body}>
              Sydllonna Burks is a facilitator, coach, and practitioner of the Corazón
              Presence Method — a framework she developed at the intersection of
              embodied learning, improvisation, and organizational development.
            </p>
            <p className={styles.body}>
              Her work began with a simple observation: leaders who struggle aren't
              usually lacking skills or strategy. They're lacking presence. The ability
              to be grounded, responsive, and genuinely connected in the moments that matter.
            </p>
            <p className={styles.body}>
              Improv y Corazón grew from that conviction — that presence is learnable,
              measurable, and transformative. Sydllonna brings warmth, precision, and
              deep care to every engagement she leads.
            </p>
          </div>
          <div className={styles.founderImageWrap}>
            <div className={styles.founderImagePlaceholder}>
              <img src="/logo.png" alt="Improv y Corazón" className={styles.founderLogo} />
            </div>
          </div>
        </div>
      </section>

      {/* Method */}
      <section className={styles.method}>
        <div className={styles.methodInner}>
          <p className={styles.sectionLabel}>The Method</p>
          <h2 className={styles.sectionHeading}>The Corazón Presence Method</h2>
          <p className={styles.body}>
            Our six-session framework builds presence as a practice — not a personality
            trait. Each session focuses on a different dimension of how leaders show up,
            using improvisation as both a mirror and a training ground.
          </p>
          <div className={styles.sessions}>
            {[
              ['Week 1', 'The First Yes'],
              ['Week 2', 'Pressure & Presence'],
              ['Week 3', 'The Corazón Shift'],
              ['Week 4', 'Noticing'],
              ['Week 5', 'Settling'],
              ['Week 6', 'Little Bird Moment'],
            ].map(([week, title]) => (
              <div key={week} className={styles.sessionRow}>
                <span className={styles.sessionWeek}>{week}</span>
                <span className={styles.sessionTitle}>{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className={styles.valuesInner}>
          <p className={styles.sectionLabel}>What We Believe</p>
          <h2 className={styles.sectionHeading}>Our guiding principles</h2>
          <div className={styles.valueGrid}>
            {values.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeading}>Let's talk about your team.</h2>
          <p className={styles.ctaBody}>
            A 30-minute conversation is all it takes to find out if we're the right fit.
          </p>
          <div className={styles.ctaBtns}>
            <a
              href="https://calendly.com/improvycorazon/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Book a Discovery Call
            </a>
            <Link to="/contact" className={styles.btnSecondary}>Send a Message</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
