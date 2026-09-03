import { Link } from 'react-router-dom'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.page}>

      {/* ── HERO — black ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>The Person Behind the Method</p>
          <h1 className={styles.heroHeadline}>
            This work didn't start<br />
            <em>in a boardroom.</em>
          </h1>
          <p className={styles.heroSub}>
            It started on a stage — with a group of students who needed more than
            techniques. They needed to feel safe enough to be seen.
          </p>
        </div>
      </section>

      {/* ── STORY — cream ── */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.headshotBox}>
            <div className={styles.headshotPlaceholder}>
              <span className={styles.headshotNote}>Headshot Photo<br />Coming Soon</span>
            </div>
          </div>
          <div className={styles.storyText}>
            <p className={styles.storyEyebrow}>Sydllonna Burks</p>
            <p className={styles.storyTitle}>
              Founder, Improv y Corazón&nbsp;&nbsp;·&nbsp;&nbsp;Creator of the Corazón Presence Method™&nbsp;&nbsp;·&nbsp;&nbsp;Relational Presence Under Pressure for Leaders
            </p>
            <h2 className={styles.storyHeadline}>Theatre educator turned presence trainer.</h2>
            <p className={styles.storyBody}>
              Sydllonna spent years in classrooms and on stages — watching talented,
              caring people freeze, disconnect, or perform a version of themselves
              when things got hard. The training they'd received taught them what to do.
              Nobody had taught them how to stay.
            </p>
            <p className={styles.storyBody}>
              Through her background in theatre, improvisation, and somatic learning,
              she developed what became the Corazón Presence Method — a framework for
              training the internal capacities that allow leaders to stay connected and
              effective even when the stakes are highest.
            </p>
            <p className={styles.storyBody}>
              Today she works with youth mentor organizations, nonprofit teams, and
              workforce readiness programs across Tampa Bay and beyond — bringing a
              method that is equal parts rigorous and deeply human.
            </p>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY — black ── */}
      <section className={styles.philosophy}>
        <div className={styles.philInner}>
          <p className={styles.philEyebrow}>The Foundation</p>
          <blockquote className={styles.philQuote}>
            "Improv is not the destination.<br />It's the doorway."
          </blockquote>
          <p className={styles.philBody}>
            Every exercise, every session, every question we ask — they're all in
            service of one thing: helping your people meet themselves honestly under
            pressure. Improvisation is the technology we use to get there. Presence
            is what they leave with.
          </p>
          <div className={styles.philPillars}>
            {[
              { label: 'Embodied Learning', desc: 'Change happens in the body, not just the mind. Our method works at both levels.' },
              { label: 'Radical Honesty', desc: "We work with what's actually happening — not the version people want to present." },
              { label: 'Sustainable Growth', desc: "Quick fixes don't hold. We build practices that compound over time." },
            ].map(({ label, desc }) => (
              <div key={label} className={styles.philCard}>
                <h3 className={styles.philCardTitle}>{label}</h3>
                <p className={styles.philCardBody}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT WORKS — cream ── */}
      <section className={styles.why}>
        <div className={styles.whyInner}>
          <p className={styles.whyEyebrow}>Why It Works</p>
          <h2 className={styles.whyHeadline}>
            Most training targets knowledge.<br />We target the nervous system.
          </h2>
          <p className={styles.whyBody}>
            When pressure rises, the brain reverts to survival — not to
            workshop notes. That's why knowledge-only training fails under
            stress. The Corazón Presence Method trains the body and the
            relational field alongside the mind, so your leaders have
            access to their full capability exactly when it matters most.
          </p>
        </div>
      </section>

      {/* ── CTA — red ── */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaHeadline}>
            Ready to explore what this could look like for your team?
          </h2>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhite}
          >
            Book a Discovery Call
          </a>
          <Link to="/method" className={styles.btnOutline}>See The Method →</Link>
        </div>
      </section>

    </div>
  )
}
