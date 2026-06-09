import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const mailto = `mailto:improvycorazon@gmail.com?subject=Inquiry from ${encodeURIComponent(form.name)} (${encodeURIComponent(form.org || 'no org')})&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.org}\n\n${form.message}`)}`
    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Contact</p>
          <h1 className={styles.headline}>Let's start a conversation.</h1>
          <p className={styles.subhead}>
            Whether you're curious about the Corazón Presence Method, exploring options
            for your team, or ready to book — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.bodyInner}>

          <div className={styles.formWrap}>
            <h2 className={styles.formHeading}>Send a message</h2>
            {submitted ? (
              <div className={styles.successMsg}>
                <p>Your email client should have opened. If not, you can reach us directly at <strong>improvycorazon@gmail.com</strong>.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="name">Name *</label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="org">Organization</label>
                  <input id="org" name="org" type="text" value={form.org} onChange={handleChange} placeholder="Company or organization (optional)" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" required rows={6} value={form.message} onChange={handleChange} placeholder="Tell us about your team, what you're looking for, or just say hello." />
                </div>
                <button type="submit" className={styles.submitBtn}>Send Message</button>
              </form>
            )}
          </div>

          <div className={styles.sidebar}>
            <div className={styles.sideCard}>
              <p className={styles.sideLabel}>Prefer to schedule directly?</p>
              <h3 className={styles.sideHeading}>Book a Free 30-Minute Discovery Call</h3>
              <p className={styles.sideBody}>No pressure, no pitch. Just a conversation about your team and whether we might be a good fit.</p>
              <a
                href="https://calendly.com/improvycorazon/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.calendlyBtn}
              >
                View Availability on Calendly
              </a>
            </div>

            <div className={styles.sideInfo}>
              <p className={styles.sideLabel}>Based in</p>
              <p className={styles.sideDetail}>Tampa Bay, Florida</p>
              <p className={styles.sideDetail}>Available nationally and virtually</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
