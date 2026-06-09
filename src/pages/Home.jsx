import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const services = [
  {
    title: 'Leadership Presence Workshops',
    desc: 'Intensive group sessions using improvisation as a mirror — revealing how leaders actually show up under pressure, and building the muscle to shift it in real time.',
  },
  {
    title: 'The Corazón Presence Method',
    desc: 'A six-session framework tracking six core capacities: stress load, energy direction, authentic communication, recovery speed, improvisational thinking, and initiative.',
  },
  {
    title: 'Facilitator-Led Team Experiences',
    desc: 'Custom engagements designed around your team\'s culture, goals, and growth edges. We meet people where they are — and help them go further.',
  },
]

const metrics = [
  'Recovery Speed After Stress',
  'Authentic Communication',
  'Improvisational Thinking',
  'Energy Direction',
  'Initiative Under Pressure',
  'Presence in Relationship',
]

export default function Home() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Leadership Development · Tampa Bay & Beyond</p>
          <h1 className={styles.headline}>
            Your leaders are showing up.<br />
            But are they really <em>present?</em>
          </h1>
          <p className={styles.subhead}>
            Improv y Corazón uses the power of improvisation to close the gap between
            showing up and truly being there — building leaders who are responsive,
            grounded, and fully alive in the room.
          </p>
          <div className={styles.heroCtas}>
            <a
              href="https://calendly.com/improvycorazon/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Book a Free Discovery Call
            </a>
            <Link to="/about" className={styles.btnSecondary}>Learn Our Approach</Link>
          </div>
        </div>
        <div className={styles.heroAccent} aria-hidden="true" />
      </section>

      {/* What We Do */}
      <section className={styles.whatWeDo}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>What We Do</p>
          <h2 className={styles.sectionHeading}>
            Presence isn't a personality trait.<br />It's a practice.
          </h2>
          <p className={styles.sectionBody}>
            Most leadership training teaches people what to do. We teach people
            how to <em>be</em> — under pressure, in conflict, in the unknown. Through
            structured improvisation and reflective practice, leaders develop the
            internal capacities that drive real performance.
          </p>
          <div className={styles.metrics}>
            {metrics.map(m => (
              <div key={m} className={styles.metricPill}>{m}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <p className={styles.sectionLabel}>Services</p>
          <h2 className={styles.sectionHeading}>How we work together</h2>
          <div className={styles.serviceGrid}>
            {services.map((s, i) => (
              <div key={i} className={styles.serviceCard}>
                <span className={styles.serviceNum}>0{i + 1}</span>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className={styles.aboutTeaser}>
        <div className={styles.sectionInner + ' ' + styles.aboutTeaserInner}>
          <div className={styles.aboutText}>
            <p className={styles.sectionLabel}>About</p>
            <h2 className={styles.sectionHeading}>Founded on presence. Built for leaders.</h2>
            <p className={styles.sectionBody}>
              Improv y Corazón was founded by Sydllonna Burks — facilitator, coach, and
              practitioner of the Corazón Presence Method. Her work lives at the intersection
              of embodied learning, improvisation, and organizational development.
            </p>
            <Link to="/about" className={styles.btnOutline}>Meet Sydllonna →</Link>
          </div>
          <div className={styles.aboutAccent}>
            <img src="/logo.png" alt="" className={styles.aboutLogo} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeading}>Ready to develop leaders who are truly present?</h2>
          <p className={styles.ctaBody}>
            Let's talk about what your team needs. A 30-minute conversation is the first step.
          </p>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Schedule Your Discovery Call
          </a>
        </div>
      </section>

    </div>
  )
}
