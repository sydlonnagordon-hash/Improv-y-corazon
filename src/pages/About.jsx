import { Link } from 'react-router-dom'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>The Person Behind the Work</p>
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

      {/* ── STORY ── */}
      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.headshotBox}>
            <img src="/headshot.jpg" alt="Sydlonna Burks" style={{width: "100%", height: "100%", objectFit: "cover"}} />
          </div>
          <div className={styles.storyText}>
            <p className={styles.storyEyebrow}>Sydlonna Burks</p>
            <blockquote className={styles.storyQuote}>
              "I spent years teaching people to take risks before realizing
              I was going to have to take one myself."
            </blockquote>
            <h2 className={styles.storyHeadline}>
              Adult social emotional learning expert. Culture change facilitator. Recovering perfectionist.
            </h2>
            <p className={styles.storyBody}>
              Sydlonna Burks spent 20+ years in classrooms, nonprofits, and training rooms watching talented,
              caring people freeze, shut down, or perform a version of themselves when things got hard.
              The professional development they received taught them what to do.
              Nobody taught them how to stay present while doing it.
            </p>
            <p className={styles.storyBody}>
              Through her background in theatre, improvisation, and somatic learning,
              she developed the Corazón Presence Method — a presence framework built for workforce programs
              and the teams who lead them. It doesn't just teach skills.
              It changes how people show up.
            </p>
            <p className={styles.storyBody}>
              Today she works with executive directors, HR leaders, and frontline teams across Tampa Bay
              and beyond — helping organizations build cultures where people actually want to stay. And she wrote
              <em> Becoming the Fool</em> because she needed to say some things out loud
              that the workshops couldn't hold.
            </p>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
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

      {/* ── WHY IT WORKS ── */}
      <section className={styles.why}>
        <div className={styles.whyInner}>
          <p className={styles.whyEyebrow}>Why It Works</p>
          <h2 className={styles.whyHeadline}>
            Most training targets knowledge.<br />We train the capacity to use it.
          </h2>
          <p className={styles.whyBody}>
            When pressure rises, the brain reverts to survival — not to workshop notes.
            That's why knowledge-only training fails under stress. The Corazón Presence
            Method trains the body and the relational field alongside the mind, so your
            leaders have access to their full capability exactly when it matters most.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
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
