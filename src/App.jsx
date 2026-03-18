import { useState } from 'react'
import { addToWaitlist } from './firebase'
import styles from './App.module.css'

// ─── Decorative SVG lotus ─────────────────────────────────────────────────────
function Lotus({ size = 48, color = '#D4AF37' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.9" transform="rotate(-30 50 70)" />
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.9" transform="rotate(0 50 70)" />
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.9" transform="rotate(30 50 70)" />
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.7" transform="rotate(-60 50 70)" />
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.7" transform="rotate(60 50 70)" />
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.5" transform="rotate(-90 50 70)" />
      <ellipse cx="50" cy="70" rx="8" ry="20" fill={color} opacity="0.5" transform="rotate(90 50 70)" />
      <circle cx="50" cy="62" r="8" fill={color} />
    </svg>
  )
}

// ─── Mandala ring decoration ──────────────────────────────────────────────────
function MandalaRing() {
  return (
    <div className={styles.mandalaWrap} aria-hidden="true">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={styles.mandala}>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
          <ellipse key={deg} cx="100" cy="100" rx="4" ry="40"
            fill="none" stroke="#D4AF37" strokeWidth="1"
            opacity="0.5"
            transform={`rotate(${deg} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="60" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#FF8C00" strokeWidth="0.6" opacity="0.3" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
        <text x="100" y="113" textAnchor="middle" fontSize="28" fill="#C8941A" fontFamily="serif" opacity="0.9">ॐ</text>
      </svg>
    </div>
  )
}

// ─── Waitlist Form ────────────────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('both')
  const [status, setStatus] = useState('idle') // idle | loading | success | duplicate | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const result = await addToWaitlist(email.trim().toLowerCase(), interest)
      if (result.duplicate) {
        setStatus('duplicate')
      } else {
        setStatus('success')
        setEmail('')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.successBox}>
        <span className={styles.successIcon}>🪔</span>
        <p className={styles.successTitle}>You're on the list!</p>
        <p className={styles.successSub}>We'll reach out as soon as we launch. Jai Shri Ram.</p>
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
            <input
              type="radio"
              name="interest"
              value={value}
              checked={interest === value}
              onChange={() => setInterest(value)}
            />
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
          {status === 'loading' ? '...' : 'Join Waitlist'}
        </button>
      </div>

      {status === 'duplicate' && (
        <p className={styles.statusMsg} style={{ color: 'var(--gold)' }}>
          You're already on the waitlist. We'll be in touch!
        </p>
      )}
      {status === 'error' && (
        <p className={styles.statusMsg} style={{ color: 'var(--maroon)' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ icon, title, subtitle, desc, badge }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBadge}>{badge}</div>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={`${styles.cardTitle} serif`}>{title}</h3>
      <p className={styles.cardSubtitle}>{subtitle}</p>
      <p className={styles.cardDesc}>{desc}</p>
      <div className={styles.cardDivider} />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className={styles.root}>
      {/* Background texture */}
      <div className={styles.bgTexture} aria-hidden="true" />

      {/* Top border */}
      <div className={styles.topBorder} aria-hidden="true" />

      {/* Hero */}
      <header className={styles.hero}>
        <MandalaRing />

        <div className={styles.heroContent}>
          <p className={`${styles.tagline} devanagari`}>दिव्य कार्य</p>
          <h1 className={`${styles.brand} serif`}>DivyaKarya</h1>
          <div className={styles.heroDivider}>
            <Lotus size={28} color="#C8941A" />
          </div>
          <p className={styles.heroSub}>
            Sacred services reimagined for modern India.
          </p>
          <div className={styles.comingSoon}>
            <span className={styles.dot} />
            Something divine is coming
          </div>
        </div>
      </header>

      {/* Products */}
      <section className={styles.products}>
        <h2 className={`${styles.sectionTitle} serif`}>What We're Building</h2>
        <div className={styles.cardGrid}>
          <ProductCard
            badge="Coming Soon"
            icon={<span className={styles.productEmoji}>📅</span>}
            title="DivyaKarya Panchanga"
            subtitle="The Sacred Hindu Calendar"
            desc="A beautifully crafted digital Panchanga giving you daily Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, Abhijit Muhurta, and auspicious timings — personalized to your location."
          />
          <ProductCard
            badge="Coming Soon"
            icon={<span className={styles.productEmoji}>🪔</span>}
            title="DivyaKarya"
            subtitle="Pandit on Demand"
            desc="Connect with verified, trusted Pandits across India for Griha Pravesh, Vivah, Satyanarayan Puja, Naming Ceremonies, and more — at your home, on your schedule."
          />
        </div>
      </section>

      {/* Waitlist */}
      <section className={styles.waitlist}>
        <div className={styles.waitlistInner}>
          <Lotus size={40} color="#FF8C00" />
          <h2 className={`${styles.waitlistTitle} serif`}>Be Among the First</h2>
          <p className={styles.waitlistSub}>
            Join our waitlist and receive early access when we launch.
            <br />Tell us what you're interested in.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerDivider}>
          {[...Array(7)].map((_, i) => (
            <span key={i} className={styles.footerDot} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className={styles.footerOm}>ॐ</p>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} DivyaKarya. All rights reserved.
        </p>
        <p className={styles.footerSub}>Made with devotion in India 🇮🇳</p>
      </footer>

      {/* Bottom border */}
      <div className={styles.topBorder} aria-hidden="true" />
    </div>
  )
}
