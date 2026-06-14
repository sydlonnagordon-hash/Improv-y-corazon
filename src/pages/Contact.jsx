import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', interest: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>

      {/* ── HERO — black ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Let's Talk</p>
          <h1 className={styles.heroHeadline}>
            Start with a<br />conversation.
          </h1>
          <p className={styles.heroSub}>
            Every engagement starts with a free 30-minute discovery call.
            No pitch deck. Just a real conversation about your team and what they need.
          </p>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnRed}
          >
            Book a Discovery Call on Calendly
          </a>
        </div>
      </section>

      {/* ── FORM + INFO — cream ── */}
      <section className={styles.formSection}>
        <div className={styles.formInner}>

          <div className={styles.infoCol}>
            <p className={styles.infoEyebrow}>Or send a message</p>
            <h2 className={styles.infoHeadline}>We'd love to hear from you.</h2>
            <p className={styles.infoBody}>
              Have questions before booking? Want to share more about your
              organization first? Use the form and Sydllonna will respond within 2 business days.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <p className={styles.infoCardLabel}>Email</p>
                <a href="mailto:sydlonna.gordon@gmail.com" className={styles.infoCardValue}>
                  sydlonna.gordon@gmail.com
                </a>
              </div>
              <div className={styles.infoCard}>
                <p className={styles.infoCardLabel}>Based In</p>
                <p className={styles.infoCardValue}>Tampa Bay, FL · Available Nationwide</p>
              </div>
              <div className={styles.infoCard}>
                <p className={styles.infoCardLabel}>Scheduling</p>
                <a
                  href="https://calendly.com/improvycorazon/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.infoCardValue}
                >
                  Book via Calendly →
                </a>
              </div>
            </div>
          </div>

          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.successBox}>
                <p className={styles.successHeadline}>Message received.</p>
                <p className={styles.successBody}>
                  Thank you for reaching out. Sydllonna will be in touch within 2 business days.
                  In the meantime, feel free to book a discovery call directly on Calendly.
                </p>
                <a
                  href="https://calendly.com/improvycorazon/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnRedSmall}
                >
                  Book a Call
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">Your Name *</label>
                    <input
                      className={styles.input}
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email *</label>
                    <input
                      className={styles.input}
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@yourorg.org"
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="org">Organization</label>
                  <input
                    className={styles.input}
                    id="org"
                    name="org"
                    type="text"
                    value={form.org}
                    onChange={handleChange}
                    placeholder="Organization or Program Name"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="interest">What are you interested in?</label>
                  <select
                    className={styles.input}
                    id="interest"
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    <option value="flagship">The Corazón Presence Method (9-Week)</option>
                    <option value="workshop">Presence Under Pressure Workshop</option>
                    <option value="coaching">1:1 Leadership Coaching</option>
                    <option value="youth">Elevate: Youth Mentor Edition</option>
                    <option value="other">Something Else / Not Sure Yet</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">Tell us about your team *</label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What's the challenge you're navigating? What would change if your leaders showed up differently?"
                  />
                </div>
                <button type="submit" className={styles.btnSubmit}>
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ── FINAL CTA — black ── */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <p className={styles.finalCtaEyebrow}>The fastest path forward</p>
          <h2 className={styles.finalCtaHeadline}>
            30 minutes.<br />No pressure. Real conversation.
          </h2>
          <a
            href="https://calendly.com/improvycorazon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnRed}
          >
            Book Your Discovery Call
          </a>
        </div>
      </section>

    </div>
  )
}
