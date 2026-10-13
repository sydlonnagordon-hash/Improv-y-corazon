import { Link } from 'react-router-dom'
import styles from './Programs.module.css'

const programs = [
  {
    name: 'The Corazón Presence Method™',
    type: 'Flagship Program',
    duration: '6 Weeks',
    format: 'Cohort-Based',
    desc: 'Our full framework — three phases, six weeks, and a complete transformation in how your team members show up. Designed for organizations ready to invest in lasting change.',
    outcomes: ['4 Relational Energy training', 'Live training sessions', 'Field application', 'Integration coaching'],
    forWho: 'Leadership cohorts of 8–20 participants',
  },
  {
    name: 'Presence Under Pressure',
    type: 'Workshop',
    duration: 'Half or Full Day',
    format: 'On-Site Facilitation',
    desc: 'An intensive, immersive experience using structured improvisation to reveal how participants actually show up when things get hard — and giving them tools to shift it in real time.',
    outcomes: ['Presence assessment', 'Live scenario work', 'Immediate practice tools', 'Team debrief'],
    forWho: 'Teams of any size, leadership retreats, staff development days',
  },
  {
    name: 'Relational Leadership Coaching',
    type: '1:1 Coaching',
    duration: 'Ongoing',
    format: 'Virtual or In-Person',
    desc: 'Individual coaching sessions grounded in the Corazón framework. Ideal for executive directors, team leads, and high-potential leaders navigating a specific challenge or transition.',
    outcomes: ['Custom presence assessment', 'Energy range development', 'Weekly accountability', 'On-demand support'],
    forWho: 'Individual leaders, executive directors, program managers',
  },
  {
    name: 'Elevate: Youth Mentor Edition',
    type: 'Specialized Program',
    duration: '6 Weeks',
    format: 'Cohort-Based',
    desc: 'Purpose-built for youth mentor organizations. Draws on the Corazón framework with a focus on the unique relational dynamics of working with young people — trust, boundaries, and authentic authority.',
    outcomes: ['Mentor presence training', 'Youth-specific scenarios', 'Group accountability structures', 'Facilitation skills'],
    forWho: 'Youth mentors, program staff, team leads in youth-serving orgs',
  },
]

export default function Programs() {
  return (
    <div className={styles.page}>

      {/* ── HERO — black ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>What We Offer</p>
          <h1 className={styles.heroHeadline}>Programs Built for Real Organizations</h1>
          <p className={styles.heroSub}>
            Every engagement is grounded in the Corazón Presence Method.
            The format adapts to where your team is and what they need.
          </p>
        </div>
      </section>

      {/* ── PROGRAMS — alternating ── */}
      {programs.map(({ name, type, duration, format, desc, outcomes, forWho }, i) => (
        <section key={name} className={i % 2 === 0 ? styles.programCream : styles.programBlack}>
          <div className={styles.programInner}>
            <div className={styles.programMeta}>
              <span className={styles.programType}>{type}</span>
              <div className={styles.programTags}>
                <span className={styles.tag}>{duration}</span>
                <span className={styles.tag}>{format}</span>
              </div>
            </div>
            <h2 className={styles.programName}>{name}</h2>
            <p className={styles.programDesc}>{desc}</p>
            <div className={styles.programDetails}>
              <div className={styles.outcomes}>
                <p className={styles.detailLabel}>Includes</p>
                <ul className={styles.outcomeList}>
                  {outcomes.map(o => <li key={o}>{o}</li>)}
                </ul>
              </div>
              <div className={styles.audience}>
                <p className={styles.detailLabel}>Best For</p>
                <p className={styles.audienceText}>{forWho}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── PILOT — black ── */}
      <section className={styles.pilot}>
        <div className={styles.pilotInner}>
          <p className={styles.pilotEyebrow}>Live Pilot Results</p>
          <h2 className={styles.pilotHeadline}>
            Elevate Tampa Bay
          </h2>
          <p className={styles.pilotBody}>
            In Spring 2026, Improv y Corazón piloted the Corazón Presence Method
            with Elevate Tampa Bay — a workforce readiness cohort supporting young
            adults navigating career transitions. Here's what happened.
          </p>
          <div className={styles.pilotGrid}>
            <div className={styles.pilotBox}>
              <p className={styles.pilotBoxLabel}>Video Documentation</p>
              <p className={styles.pilotBoxNote}>Coming Soon</p>
            </div>
            <div className={styles.pilotBox}>
              <p className={styles.pilotBoxLabel}>Impact Report</p>
              <a href="mailto:sydlonna@improvycorazon.com?subject=Impact Report Request" className={styles.pilotBoxNote} style={{color:'#C0392B', textDecoration:'none', fontWeight:600}}>Request the Report →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM ── cream ── */}
      <section className={styles.custom}>
        <div className={styles.customInner}>
          <p className={styles.customEyebrow}>Don't see exactly what you need?</p>
          <h2 className={styles.customHeadline}>
            Every engagement is custom.<br />Let's design yours together.
          </h2>
          <p className={styles.customBody}>
            We don't drop off a curriculum and leave. We co-design every engagement
            around your team's culture, goals, and growth edges — and we stay close
            to make sure it lands.
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

    </div>
  )
}
