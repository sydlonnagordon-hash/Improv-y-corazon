import { Link } from 'react-router-dom'
import styles from './Method.module.css'

const energies = [
  {
    name: 'Presence',
    color: 'red',
    desc: 'The capacity to be fully here — undistracted, undefended, and available to what is actually happening in the room.',
  },
  {
    name: 'Structure',
    color: 'white',
    desc: 'The capacity to create clarity and container — so others know what to expect, where the edges are, and that you can hold it together.',
  },
  {
    name: 'Vision',
    color: 'green',
    desc: "The capacity to see beyond the moment — connecting today's work to a larger purpose that inspires forward motion.",
  },
  {
    name: 'Grounding',
    color: 'white',
    desc: "The capacity to remain regulated and centered under pressure — so your leadership doesn't depend on conditions being ideal.",
  },
]

const phases = [
  {
    number: '01',
    name: 'Live Training',
    duration: 'Weeks 1–2',
    desc: 'Immersive, facilitated sessions using structured improvisation to surface how participants actually respond under pressure — not how they think they do. Participants develop awareness and begin building new patterns in real time.',
    bullets: [
      'Group sessions (4–6 hours each)',
      'Individual presence assessment',
      'Live scenario work',
      'Relational energy mapping',
    ],
  },
  {
    number: '02',
    name: 'Field Application',
    duration: 'Weeks 3–4',
    desc: 'Participants take their learning into their real work environment, applying specific practices and tracking their responses. Coaching check-ins provide support and course-correction.',
    bullets: [
      'Structured practice assignments',
      'Weekly group integration calls',
      '1:1 coaching sessions',
      'Reflection journaling protocol',
    ],
  },
  {
    number: '03',
    name: 'Integration & Sustainability',
    duration: 'Weeks 5–6',
    desc: 'The final phase ensures that new capacities become habits, not experiments. Teams build shared language and peer accountability structures that sustain growth long after the program ends.',
    bullets: [
      'Peer accountability circles',
      'Shared practice design',
      'Leadership presence benchmarking',
      'Ongoing cohort community access',
    ],
  },
]

export default function Method() {
  return (
    <div className={styles.page}>

      {/* ── HERO — black ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Our Framework</p>
          <h1 className={styles.heroHeadline}>
            The Corazón<br />Presence Method™
          </h1>
          <p className={styles.heroSub}>
            A presence framework built for workforce programs and the teams who lead them
            — designed to change not just what your staff know, but how they show up.
          </p>
        </div>
      </section>

      {/* ── WHAT IT IS — cream ── */}
      <section className={styles.what}>
        <div className={styles.whatInner}>
          <p className={styles.whatEyebrow}>What It Is</p>
          <h2 className={styles.whatHeadline}>
            Not a communication curriculum.<br />A presence practice.
          </h2>
          <div className={styles.whatCols}>
            <p className={styles.whatBody}>
              The Corazón Presence Method is a 6-week framework that uses structured
              improvisation, somatic awareness, and relational coaching to develop the
              internal capacities that drive leadership effectiveness.
            </p>
            <p className={styles.whatBody}>
              Most programs teach leaders what to do in difficult moments. This one
              trains how to be — so the right action arises naturally, without force,
              even when everything feels uncertain.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 ENERGIES — black ── */}
      <section className={styles.energies}>
        <div className={styles.energiesInner}>
          <p className={styles.energiesEyebrow}>The Framework</p>
          <h2 className={styles.energiesHeadline}>
            The 4 Relational Energies
          </h2>
          <p className={styles.energiesSub}>
            Every leader has access to four relational energies. Effective leadership
            means having full range — not being stuck in one.
          </p>
          <div className={styles.energyGrid}>
            {energies.map(({ name, color, desc }) => (
              <div key={name} className={`${styles.energyCard} ${styles[`accent_${color}`]}`}>
                <p className={styles.energyName}>{name}</p>
                <p className={styles.energyDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 PHASES — cream ── */}
      <section className={styles.phases}>
        <div className={styles.phasesInner}>
          <p className={styles.phasesEyebrow}>How It Works</p>
          <h2 className={styles.phasesHeadline}>3 Phases. 6 Weeks. Real Change.</h2>
          <div className={styles.phaseList}>
            {phases.map(({ number, name, duration, desc, bullets }) => (
              <div key={number} className={styles.phaseItem}>
                <div className={styles.phaseLeft}>
                  <span className={styles.phaseNum}>{number}</span>
                  <div>
                    <p className={styles.phaseName}>{name}</p>
                    <p className={styles.phaseDuration}>{duration}</p>
                  </div>
                </div>
                <div className={styles.phaseRight}>
                  <p className={styles.phaseDesc}>{desc}</p>
                  <ul className={styles.phaseBullets}>
                    {bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTCOMES — black ── */}
      <section className={styles.outcomes}>
        <div className={styles.outcomesInner}>
          <p className={styles.outcomesEyebrow}>What Changes</p>
          <h2 className={styles.outcomesHeadline}>What participants gain</h2>
          <div className={styles.outcomeGrid}>
            {[
              'Increased recovery speed after stressful interactions',
              'Greater authenticity in high-stakes conversations',
              'Reduced reactivity and increased response-ability',
              'Stronger connection with the people they lead',
              'Clearer presence in rooms where it matters most',
              'A shared language for relational dynamics on their team',
            ].map((item, i) => (
              <div key={i} className={styles.outcomeItem}>
                <span className={styles.outcomeCheck}>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — red ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeadline}>
            Ready to bring the Corazón Presence Method to your team?
          </h2>
          <div className={styles.ctaBtns}>
            <a
              href="https://calendly.com/improvycorazon/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWhite}
            >
              Book a Discovery Call
            </a>
            <Link to="/programs" className={styles.btnOutline}>See Our Programs →</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
