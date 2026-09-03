import styles from './Book.module.css'

export default function Book() {
  return (
    <div className={styles.page}>

      {/* ── HERO — black ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Now Available</p>
          <h1 className={styles.heroHeadline}>Becoming the Fool</h1>
          <p className={styles.heroSub}>
            A book about presence, play, and what happens when you stop performing
            and start showing up.
          </p>
        </div>
      </section>

      {/* ── ABOUT THE BOOK — cream ── */}
      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <p className={styles.sectionEyebrow}>About the Book</p>
          <h2 className={styles.aboutHeadline}>
            The fool isn't the one who doesn't know.<br />
            The fool is the one willing to find out.
          </h2>
          <div className={styles.aboutBody}>
            <p>
              <em>Becoming the Fool</em> draws on the wisdom of improvisational
              theater to explore what it means to lead, connect, and live with
              genuine presence. It is for anyone who has ever felt the gap between
              who they are and who they perform themselves to be.
            </p>
            <p>
              Through storytelling, practice, and provocation, this book invites
              you into a different relationship with uncertainty — one grounded not
              in control, but in curiosity.
            </p>
          </div>
        </div>
      </section>

      {/* ── BUY — green ── */}
      <section className={styles.buy}>
        <div className={styles.buyInner}>
          <p className={styles.buyEyebrow}>Get Your Copy</p>
          <h2 className={styles.buyHeadline}>Buy the Book</h2>
          <p className={styles.buyDesc}>
            <em>Becoming the Fool</em> is a print book, shipped directly from the
            author. Order securely below.
          </p>

          <div className={styles.buyCard}>
            <div className={styles.buyCardDetails}>
              <p className={styles.buyCardTitle}>Becoming the Fool</p>
              <p className={styles.buyCardFormat}>Print · Paperback</p>
            </div>
            <a
              href="https://buy.stripe.com/9B67sN5WkeOicRDcDz2Fa05"
              className={styles.buyBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Now
            </a>
          </div>

          <p className={styles.shippingNote}>
            This is a print book fulfilled by the author via IngramSpark.
            Orders typically ship within <strong>7–10 business days</strong> of purchase.
            You will receive shipping confirmation by email.
          </p>
        </div>
      </section>

      {/* ── CLOSING — black ── */}
      <section className={styles.closing}>
        <div className={styles.closingInner}>
          <p className={styles.closingQuote}>
            "Presence is not a personality trait. It's a practice."
          </p>
          <p className={styles.closingAttrib}>— Improv y Corazón</p>
        </div>
      </section>

    </div>
  )
}
