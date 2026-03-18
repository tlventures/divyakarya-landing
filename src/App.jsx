import { useState } from 'react'
import { addToWaitlist } from './firebase'
import HinduCanvas from './HinduCanvas'
import styles from './App.module.css'

// ─── Waitlist Form ────────────────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('both')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const result = await addToWaitlist(email.trim().toLowerCase(), interest)
      setStatus(result.duplicate ? 'duplicate' : 'success')
      if (!result.duplicate) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.successBox}>
        <span>🪔</span>
        <strong>You're on the list!</strong>
        <span>We'll reach out at launch. Jai Shri Ram.</span>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.interestRow}>
        {[
          { value: 'panchanga', label: 'Panchanga' },
          { value: 'pandit',    label: 'Pandit Service' },
          { value: 'both',      label: 'Both' },
        ].map(({ value, label }) => (
          <label key={value} className={`${styles.chip} ${interest === value ? styles.chipActive : ''}`}>
            <input type="radio" name="interest" value={value}
              checked={interest === value} onChange={() => setInterest(value)} />
            {label}
          </label>
        ))}
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.emailInput}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
        <button className={styles.submitBtn} type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? '…' : 'Join Waitlist'}
        </button>
      </div>
      {status === 'duplicate' && <p className={styles.statusMsg} style={{ color: '#D4AF37' }}>Already on the list — we'll be in touch!</p>}
      {status === 'error'     && <p className={styles.statusMsg} style={{ color: '#ff6b6b' }}>Something went wrong. Please try again.</p>}
    </form>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ icon, title, subtitle, desc }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardIcon}>{icon}</span>
        <span className={styles.cardBadge}>Coming Soon</span>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardSubtitle}>{subtitle}</p>
      <p className={styles.cardDesc}>{desc}</p>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className={styles.root}>
      <HinduCanvas />

      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoOm}>ॐ</span>
          <div className={styles.logoText}>
            <span className={styles.logoName}>DivyaKarya</span>
            <span className={styles.logoSub}>दिव्य कार्य</span>
          </div>
        </div>
        <div className={styles.navPill}>
          <span className={styles.dot} />
          Launching Soon
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.heroText}>
          <h1 className={styles.heroHeadline}>
            Sacred services,<br />
            <span className={styles.heroAccent}>reimagined for modern India.</span>
          </h1>
        </div>

        <div className={styles.cardGrid}>
          <ProductCard
            icon="📅"
            title="DivyaKarya Panchanga"
            subtitle="The Sacred Hindu Calendar"
            desc="Daily Tithi, Nakshatra, Yoga, Rahu Kalam & auspicious Muhurtas — personalized to your location."
          />
          <ProductCard
            icon="🪔"
            title="DivyaKarya"
            subtitle="Pandit on Demand"
            desc="Verified Pandits for Griha Pravesh, Vivah, Satyanarayan Puja & more — at your home, on your schedule."
          />
        </div>

        <div className={styles.waitlist}>
          <p className={styles.waitlistLabel}>
            <span className={styles.waitlistLine} />
            Be among the first to know
            <span className={styles.waitlistLine} />
          </p>
          <WaitlistForm />
        </div>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} DivyaKarya</span>
        <span className={styles.footerSep}>·</span>
        <span>Made with devotion in India 🇮🇳</span>
      </footer>
    </div>
  )
}
