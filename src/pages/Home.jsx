import { Link } from 'react-router-dom'

const writtenTestimonials = [
  { name: "Jaraux Washington", role: "Elevate Tampa Bay Participant", quote: "I've never had a training like this before. It made me realize how much I hold back at work. I felt safe enough to be honest about it." },
  { name: "Tamera", role: "Elevate Tampa Bay Participant", quote: "The Improv activities were fun, but I didn't expect them to be so revealing. I saw myself react in ways I didn't even know I did." },
  { name: "Rhonda", role: "Mentor Participant", quote: "I've been in leadership for years and I've never had a training that made me look at my own patterns the way this did." },
  { name: "Emari", role: "Elevate Tampa Bay Participant", quote: "I usually shut down when things get uncomfortable. This helped me see that. And for the first time, I tried something different." },
  { name: "Willie Washington", role: "Elevate Tampa Bay Participant", quote: "I didn't think a professional training could feel this personal. But it did. And I think that's the point." },
  { name: "Brian", role: "Elevate Tampa Bay Participant", quote: "I showed up thinking it was just a workshop. I left thinking about how I show up in my relationships. That shift surprised me." },
]

const videoTestimonials = [
  { name: "Brian", youtubeId: "GgkdW74WBas" },
  { name: "Jaraux Washington", youtubeId: "Pg6MnJECJow" },
  { name: "Seraiah", youtubeId: "ZqNP7GiwGDw" },
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ minHeight: '92vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#C0392B' }} />
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 28 }}>
          6-Week Presence Training for Workforce Development Programs
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 900, color: '#FAF7F2', lineHeight: 1.1, maxWidth: 900, marginBottom: 32, letterSpacing: '-0.02em' }}>
          Your training, guaranteed to land.
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(17px, 2vw, 20px)', fontWeight: 300, color: 'rgba(253,250,246,0.65)', maxWidth: 700, lineHeight: 1.7, marginBottom: 24 }}>
          Improv y Corazón helps workforce programs make sure their staff actually learn and use what they're taught. Through improv-based, hands-on training, every participant improves from their before-training quiz to their after-training quiz and demonstrates the skill in a live role-play, or we come back for a free follow-up session.
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(16px, 1.8vw, 19px)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(253,250,246,0.45)', maxWidth: 580, lineHeight: 1.6, marginBottom: 52 }}>
          Culture starts at the top. We help the people who lead it.
        </p>
        <a href="https://calendly.com/improvycorazon/30min" target="_blank" rel="noopener noreferrer" style={{ background: '#C0392B', color: '#FAF7F2', padding: '18px 44px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
          Book a Free Call
        </a>
      </section>

      {/* WHAT WE DO */}
      <section style={{ background: '#FAF7F2', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 20, textAlign: 'center' }}>The Problem We Solve</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: '#0A0A0A', textAlign: 'center', maxWidth: 700, margin: '0 auto 72px', lineHeight: 1.15 }}>Organizations buy communication training because they think they have a communication problem.<br />What they actually have is a presence problem.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {[
              { number: '01', title: 'Self-Awareness', desc: "Staff learn to recognize their own patterns under pressure — before those patterns damage relationships and derail the work." },
              { number: '02', title: 'Emotional Regulation', desc: 'Your team stays present and functional during hard conversations instead of shutting down, blowing up, or checking out.' },
              { number: '03', title: 'Authentic Communication', desc: "Staff say what's actually true — to each other, to leadership, to the people they serve." },
              { number: '04', title: 'Culture Shift', desc: "When individuals change how they show up, the culture changes with them. That's the guarantee." },
            ].map((item) => (
              <div key={item.number} style={{ background: '#0A0A0A', padding: '48px 36px', color: '#FAF7F2' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: '#1A1A1A', lineHeight: 1, marginBottom: 20 }}>{item.number}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: '#FAF7F2', marginBottom: 14 }}>{item.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: 'rgba(253,250,246,0.62)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE QUESTION */}
      <section style={{ background: '#C0392B', padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontStyle: 'italic', fontWeight: 400, color: '#FAF7F2', lineHeight: 1.3, marginBottom: 32 }}>"“Who do you become when pressure arrives?”"</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 19, color: 'rgba(250,247,242,0.75)', lineHeight: 1.6 }}>That is the question beneath all Improv y Corazón work. Not who you are when things are easy — who you are when they are not.</p>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section style={{ background: '#0A0A0A', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 20, textAlign: 'center' }}>Who We Serve</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, color: '#FAF7F2', textAlign: 'center', marginBottom: 64 }}>Built for leaders who are done losing good people</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            {[
              { title: 'Executive Directors', desc: "You've built something meaningful. But if your staff can't communicate under pressure, the mission leaks. We help you build a culture worth staying in." },
              { title: 'HR Directors', desc: "Retention isn't a recruiting problem — it's a culture problem. We give you a proven 6-week intervention that addresses the root, not the symptom." },
              { title: 'Program Managers', desc: "You're responsible for outcomes but can't control how your team shows up. We change that — by changing how your people show up to themselves first." },
              { title: 'Frontline Staff & Teams', desc: "The people doing the hardest work deserve the most support. We bring this work directly to the people your mission depends on." },
            ].map((item) => (
              <div key={item.title} style={{ borderTop: '2px solid #C0392B', paddingTop: 28 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#FAF7F2', marginBottom: 14 }}>{item.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: 'rgba(253,250,246,0.62)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section style={{ background: '#FAF7F2', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 20, textAlign: 'center' }}>What We Offer</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, color: '#0A0A0A', textAlign: 'center', marginBottom: 64 }}>Choose your entry point</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {/* Flagship card */}
            <div style={{ background: '#0A0A0A', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#C0392B', textAlign: 'center', padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FAF7F2' }}>
                ★ Flagship Program
              </div>
              <div style={{ padding: '40px 36px 48px', flex: 1 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 14 }}>6 Weeks · Cohort-Based</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#FAF7F2', marginBottom: 16, lineHeight: 1.2 }}>The Corazón Presence Method™</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: 'rgba(253,250,246,0.62)', lineHeight: 1.6 }}>Our full framework — three phases, six weeks, and a complete transformation in how your team members show up. Designed for organizations ready to invest in lasting change.</p>
              </div>
            </div>
            {/* Workshop card */}
            <div style={{ background: '#141414', padding: '40px 36px 48px' }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>Half or Full Day · On-Site</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#FAF7F2', marginBottom: 16, lineHeight: 1.2 }}>Presence Under Pressure</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: 'rgba(253,250,246,0.62)', lineHeight: 1.6 }}>An intensive, immersive experience using structured improvisation to reveal how participants actually show up when things get hard — and giving them tools to shift it in real time.</p>
            </div>
            {/* Coaching card */}
            <div style={{ background: '#141414', padding: '40px 36px 48px' }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>Ongoing · Virtual or In-Person</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#FAF7F2', marginBottom: 16, lineHeight: 1.2 }}>Relational Leadership Coaching</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: 'rgba(253,250,246,0.62)', lineHeight: 1.6 }}>Individual coaching sessions grounded in the Corazón framework. Ideal for executive directors, team leads, and high-potential leaders navigating a specific challenge or transition.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/programs" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C0392B', textDecoration: 'none', borderBottom: '1px solid #C0392B', paddingBottom: 3 }}>See All Programs →</Link>
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section style={{ background: '#FAF7F2', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C0392B', marginBottom: 20, textAlign: 'center' }}>Hear It From Them</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, color: '#0A0A0A', textAlign: 'center', marginBottom: 64 }}>Real words from real participants</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 900, margin: '0 auto 80px' }}>
            {videoTestimonials.map((v) => (
              <div key={v.name} style={{ background: '#0A0A0A', overflow: 'hidden' }}>
                {v.youtubeId ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtubeId}`}
                      title={`${v.name} testimonial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                ) : null}
                <div style={{ padding: '12px 16px', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#FAF7F2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{v.name}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {writtenTestimonials.map((t) => (
              <div key={t.name} style={{ background: '#0A0A0A', padding: '36px 32px' }}>
                <div style={{ fontSize: 40, color: '#C0392B', fontFamily: "'Playfair Display', serif", lineHeight: 1, marginBottom: 16 }}>“</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontStyle: 'italic', color: '#FAF7F2', lineHeight: 1.6, marginBottom: 24 }}>{t.quote}</p>
                <div style={{ borderTop: '1px solid #222', paddingTop: 16 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: '#FAF7F2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: '#555', marginTop: 4 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: '#0A0A0A', padding: '100px 24px', textAlign: 'center', borderTop: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, color: '#FAF7F2', lineHeight: 1.15, marginBottom: 24 }}>Ready to bring this to your team?</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 19, color: 'rgba(253,250,246,0.62)', lineHeight: 1.6, marginBottom: 48 }}>Let's talk about what your people actually need — and build something that addresses the root.</p>
          <a href="https://calendly.com/improvycorazon/30min" target="_blank" rel="noopener noreferrer" style={{ background: '#C0392B', color: '#FAF7F2', padding: '18px 44px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
            Book a Free Discovery Call
          </a>
        </div>
      </section>
    </>
  )
}
