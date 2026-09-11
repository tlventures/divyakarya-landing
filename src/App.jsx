import { useState } from 'react'
import { addToWaitlist } from './waitlist'
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
          { value: 'astrology', label: 'AI Pandit' },
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

// ─── Google Play glyph ────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.6 2.1a1 1 0 0 0-.5.9v18a1 1 0 0 0 .5.9l10-9.9-10-9.9Zm11.1 8.5 2.9-2.9-9-5.1 6.1 8ZM4.9 21.6l9-5.1-2.9-2.9-6.1 8Zm12.9-8.4 2.7-1.5c.8-.5.8-1.7 0-2.1l-2.7-1.6-3.2 3.2 3.2 3.2Z" />
    </svg>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
// `status` drives the badge and the call to action:
//   'live'  → on Google Play, links to the store listing
//   'soon'  → built, not yet published
//   'build' → still in development, links to its own page
function ProductCard({ icon, title, subtitle, desc, status, playUrl, moreUrl }) {
  const badge = {
    live:  { label: 'On Google Play', cls: styles.badgeLive },
    soon:  { label: 'Coming Soon',    cls: styles.cardBadge },
    build: { label: 'In Development', cls: styles.cardBadge },
  }[status]

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        {icon
          ? <img className={styles.cardIconImg} src={icon} alt="" />
          : <span className={styles.cardIconPlaceholder} aria-hidden="true" />}
        <span className={badge.cls}>{badge.label}</span>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardSubtitle}>{subtitle}</p>
      <p className={styles.cardDesc}>{desc}</p>

      {(status === 'live' || (status === 'build' && moreUrl)) && (
      <div className={styles.cardActions}>
        {status === 'live' && (
          <a className={styles.storeBtn} href={playUrl} target="_blank" rel="noopener noreferrer">
            <PlayIcon />Get it on Google Play
          </a>
        )}
        {status === 'build' && moreUrl && (
          <a className={styles.ghostBtn} href={moreUrl}>Learn more</a>
        )}
      </div>
      )}
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
            status="live"
            icon="/assets/icon-panchanga.png"
            title="Panchanga"
            subtitle="The Sacred Hindu Calendar"
            desc="Daily Tithi, Nakshatra, Yoga, Rahu Kalam & auspicious Muhurtas — computed offline, personalised to your location."
            playUrl="https://play.google.com/store/apps/details?id=com.divyakarya.panchanga"
          />
          <ProductCard
            status="soon"
            icon="/assets/icon-ai-pandit.png"
            title="AI Pandit"
            subtitle="Your Personal Vedic Astrology Guide"
            desc="Your full birth chart, Dasha periods and transits — plus an AI pandit that answers in the context of your own kundali."
          />
          <ProductCard
            status="build"
            icon={null}
            title="Pandits"
            subtitle="Booked On Demand"
            desc="Verified Pandits for Griha Pravesh, Vivah, Satyanarayan Puja & more — at your home, on your schedule."
            moreUrl="/pandits"
          />
        </div>

        <div className={styles.waitlist}>
          <p className={styles.waitlistLabel}>
            <span className={styles.waitlistLine} />
            Get notified at launch
            <span className={styles.waitlistLine} />
          </p>
          <WaitlistForm />
        </div>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Tarunilakshmi Ventures OPC Pvt Ltd</span>
        <span className={styles.footerSep}>·</span>
        <span>Made with devotion in India 🇮🇳</span>
        <div className={styles.footerLinks}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/support">Support</a>
        </div>
      </footer>
    </div>
  )
}
