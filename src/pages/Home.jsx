import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const principles = [
  {
    title: 'Yes, And',
    body: "Not agreement — acknowledgment. You can't respond to what you refuse to receive. The most powerful thing you can do in any room is actually be in it.",
  },
  {
    title: 'Presence Over Performance',
    body: "The goal isn't looking good. It's actually being here. There's a difference between playing a role and inhabiting one — and everyone in the room can feel it.",
  },
  {
    title: 'Uncertainty as Practice',
    body: "The fool doesn't know. That's the whole point. The capacity to stay curious — rather than certain — is the foundation of every other leadership skill.",
  },
]

const offerings = [
  { label: 'The Book as a Team Read', desc: 'Staff read Becoming the Fool together — we facilitate the conversation.' },
  { label: 'Presence Workshops', desc: 'Structured improv-based sessions for teams who want to practice, not just study.' },
  { label: '1:1 Leadership Coaching', desc: 'For leaders navigating a specific challenge, transition, or stuck place.' },
  { label: 'Custom Program Design', desc: "Built around your team's culture, goals, and the room you're actually in." },
]

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── 1. HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroTagline}>Stop Rehearsing. Start Responding.</p>
          <h1 className={styles.heroHeadline}>
            Is your staff performing leadership,<br />
            or practicing it?
          </h1>
          <p className={styles.heroSub}>
            Learn to respond to the one you actually have.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/book" className={styles.btnRedSolid}>
              Get the Book
            </Link>
            <a
              href="https://calendly.com/improvycorazon/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutlineLight}
            >
              Bring It To Your Organization
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. BECOMING THE FOOL ── */}
      <section className={styles.book}>
        <div className={styles.bookInner}>
          <div className={styles.bookText}>
            <p className={styles.sectionEyebrow}>The Book</p>
            <h2 className={styles.bookHeadline}>
              <em>Becoming the Fool</em>
            </h2>
            <p className={styles.bookBody}>
              Improv y Corazón began as a set of questions: what if the most important
              thing we could give a leader isn't a framework — but a practice of showing up?
            </p>
            <p className={styles.bookBody}>
              <em>Becoming the Fool</em> is where those questions landed. It's not a
              business book. It's not a self-help manual. It's an invitation to stop
              performing the version of yourself you've been rehearsing — and to meet
              what's actually in the room.
            </p>
            <p className={styles.bookBody}>
              This is the philosophical foundation of everything we do. Start here.
            </p>
            <Link to="/book" className={styles.btnRedOutline}>
              Read More &amp; Buy the Book →
            </Link>
          </div>
          <div className={styles.bookVisual}>
            <div className={styles.bookCover}>
              <p className={styles.bookCoverTitle}>Becoming<br />the Fool</p>
              <p className={styles.bookCoverAuthor}>Sydlonna Burks</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CORE PHILOSOPHY ── */}
      <section className={styles.philosophy}>
        <div className={styles.philInner}>
          <div className={styles.philQuoteWrap}>
            <span className={styles.philRule} aria-hidden="true" />
            <blockquote className={styles.philQuote}>
              Improvisation isn't about being funny.<br />
              It's about being available.
            </blockquote>
          </div>
          <p className={styles.philSub}>
            We spend too much of our lives rehearsing who we think we should be
            instead of responding to what is actually happening. The practice of
            improvisation — real improvisation — is learning to close that gap.
          </p>
          <div className={styles.philPrinciples}>
            {principles.map(({ title, body }) => (
              <div key={title} className={styles.philCard}>
                <h3 className={styles.philCardTitle}>{title}</h3>
                <p className={styles.philCardBody}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HEART-BASED LEADERSHIP ── */}
      <section className={styles.heart}>
        <div className={styles.heartInner}>
          <p className={styles.sectionEyebrow}>The Deeper Current</p>
          <h2 className={styles.heartHeadline}>Heart-Based Leadership</h2>
          <p className={styles.heartBody}>
            Beneath every framework, every exercise, every moment of genuine connection
            in a room — there is something harder to name. A quality of attention.
            A willingness to be affected.
          </p>
          <p className={styles.heartBody}>
            We call it heart-based leadership not as a metaphor for warmth, but as a
            description of where true presence actually lives. Leading from a place of
            genuine emotional availability, coherence, and attunement to the people in
            front of you — rather than performing the authority you think they need to see.
          </p>
          <blockquote className={styles.heartQuote}>
            Lead from the heart.<br />
            Notice the room.<br />
            Respond to what is actually there.
          </blockquote>
          <p className={styles.heartBody}>
            Research from the HeartMath Institute offers one lens for understanding why
            this matters: the heart generates an electromagnetic field that extends beyond
            the body and shifts measurably with our internal states. We hold this as a
            compelling metaphor — and a question worth sitting with — not as a claim that
            improvisation itself has been scientifically proven to produce these effects.
            The science is theirs. The application is ours.
          </p>
          <p className={styles.heartSource}>
            Source:{' '}
            <a
              href="https://www.heartmath.org/resources/downloads/energetic-heart/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heartSourceLink}
            >
              HeartMath Institute, <em>The Energetic Heart</em>
            </a>
          </p>
        </div>
      </section>

      {/* ── 5. FOR ORGANIZATIONAL BUYERS ── */}
      <section className={styles.orgs}>
        <div className={styles.orgsInner}>
          <p className={styles.sectionEyebrow}>For Organizations</p>
          <h2 className={styles.orgsHeadline}>
            Your team already knows what to do.<br />
            So why does pressure change everything?
          </h2>
          <p className={styles.orgsBody}>
            When things get hard — a student escalates, a meeting derails, a leader
            freezes under scrutiny — the problem isn't knowledge. It's the ability
            to stay present when it's uncomfortable.
          </p>
          <p className={styles.orgsBody}>
            We work with nonprofits, schools, youth mentor organizations, and workforce
            readiness programs that invest in their people and want that investment to
            actually hold under pressure.
          </p>
          <div className={styles.orgsOffers}>
            {offerings.map(({ label, desc }) => (
              <div key={label} className={styles.orgOffer}>
                <span className={styles.orgOfferMark} aria-hidden="true">—</span>
                <div>
                  <p className={styles.orgOfferLabel}>{label}</p>
                  <p className={styles.orgOfferDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnRedSolidInk}
          >
            Book a Discovery Call
          </a>
        </div>
      </section>

      {/* ── 6. ABOUT SYDLONNA ── */}
      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <p className={styles.aboutEyebrow}>The Person Behind This</p>
          <blockquote className={styles.aboutQuote}>
            "I spent years teaching people to take risks before realizing
            I was going to have to take one myself."
          </blockquote>
          <p className={styles.aboutBody}>
            Sydlonna Burks is a theatre educator turned presence trainer working across
            Tampa Bay and beyond. She builds things like this because she's seen what
            happens when people learn to stop performing and start actually showing up —
            to their students, their teams, and themselves.
          </p>
          <Link to="/about" className={styles.btnOutlineDark}>
            Full Story →
          </Link>
        </div>
      </section>

      {/* ── 7. NEWSLETTER ── */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <p className={styles.newsletterEyebrow}>Stay in the Experiment</p>
          <h2 className={styles.newsletterHeadline}>
            This work is ongoing.<br />So is this conversation.
          </h2>
          <p className={styles.newsletterBody}>
            Occasional writing, resources, and invitations for people who are curious
            about presence, play, and what it means to lead from a place of genuine
            availability. No curriculum. No 5-step frameworks. Just honest exploration.
          </p>

          {/* Replace this block with your Mailchimp / ConvertKit embed code */}
          <form className={styles.signupForm} onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className={styles.signupInput}
              aria-label="Email address"
              required
            />
            <button type="submit" className={styles.signupBtn}>
              I'm In
            </button>
          </form>
          {/* End email form placeholder */}

          <p className={styles.signupNote}>
            No spam. Unsubscribe whenever. This is a community, not a funnel.
          </p>
        </div>
      </section>

    </div>
  )
}
