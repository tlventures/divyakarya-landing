import { useEffect, useRef } from 'react'

// ─── Draw Nataraja (dancing Shiva) silhouette ────────────────────────────────
function drawNataraja(ctx, cx, cy, scale, alpha) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#D4AF37'
  ctx.fillStyle = '#D4AF37'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Ring of fire (prabhavali) with flame tips
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const r1 = 72, r2 = 86
    const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1
    const x2 = Math.cos(a) * r2, y2 = Math.sin(a) * r2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(0, 0, 72, 0, Math.PI * 2)
  ctx.stroke()

  // Head with crown
  ctx.beginPath()
  ctx.arc(0, -42, 10, 0, Math.PI * 2)
  ctx.fill()
  // Crown spikes
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath()
    ctx.moveTo(i * 4, -52)
    ctx.lineTo(i * 4 + 2, -62 - Math.abs(i) * 3)
    ctx.lineTo(i * 4 + 4, -52)
    ctx.stroke()
  }

  // Neck + upper body
  ctx.beginPath()
  ctx.moveTo(0, -32)
  ctx.lineTo(0, -10)
  ctx.stroke()

  // Upper right arm (holds drum / damaru)
  ctx.beginPath()
  ctx.moveTo(0, -28)
  ctx.quadraticCurveTo(20, -30, 40, -20)
  ctx.stroke()
  // Damaru at tip
  ctx.beginPath()
  ctx.arc(42, -19, 4, 0, Math.PI * 2)
  ctx.stroke()

  // Upper left arm (holds fire)
  ctx.beginPath()
  ctx.moveTo(0, -28)
  ctx.quadraticCurveTo(-20, -30, -40, -20)
  ctx.stroke()
  // Flame at tip
  ctx.beginPath()
  ctx.moveTo(-42, -19)
  ctx.quadraticCurveTo(-46, -28, -42, -36)
  ctx.quadraticCurveTo(-38, -28, -42, -19)
  ctx.fill()

  // Lower right arm (abhaya mudra - raised open)
  ctx.beginPath()
  ctx.moveTo(0, -18)
  ctx.quadraticCurveTo(18, -14, 30, -5)
  ctx.stroke()

  // Lower left arm (pointing to raised foot - gaja hasta)
  ctx.beginPath()
  ctx.moveTo(0, -18)
  ctx.quadraticCurveTo(-16, -10, -20, 5)
  ctx.stroke()

  // Hips / waist
  ctx.beginPath()
  ctx.moveTo(-12, -10)
  ctx.lineTo(12, -10)
  ctx.stroke()

  // Standing left leg (slightly bent)
  ctx.beginPath()
  ctx.moveTo(-4, -10)
  ctx.lineTo(-8, 20)
  ctx.lineTo(-6, 55)
  ctx.stroke()
  // Foot
  ctx.beginPath()
  ctx.moveTo(-6, 55)
  ctx.lineTo(-18, 58)
  ctx.stroke()

  // Raised right leg (bent at knee, lifted)
  ctx.beginPath()
  ctx.moveTo(4, -10)
  ctx.quadraticCurveTo(30, 10, 38, 25)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(38, 25)
  ctx.quadraticCurveTo(42, 40, 30, 48)
  ctx.stroke()

  // Demon underfoot (Apasmara)
  ctx.beginPath()
  ctx.ellipse(-6, 62, 14, 6, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

// ─── Draw Ganesha silhouette ─────────────────────────────────────────────────
function drawGanesha(ctx, cx, cy, scale, alpha) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#FF8C00'
  ctx.fillStyle = '#FF8C00'
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Crown / mukut
  ctx.beginPath()
  ctx.moveTo(-18, -58)
  ctx.lineTo(-10, -72)
  ctx.lineTo(0, -60)
  ctx.lineTo(10, -72)
  ctx.lineTo(18, -58)
  ctx.stroke()
  // Crown base band
  ctx.beginPath()
  ctx.moveTo(-20, -56)
  ctx.lineTo(20, -56)
  ctx.stroke()

  // Large elephant head (oval)
  ctx.beginPath()
  ctx.ellipse(0, -28, 24, 28, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Left ear (big fan ear)
  ctx.beginPath()
  ctx.ellipse(-30, -22, 13, 20, -0.25, 0, Math.PI * 2)
  ctx.stroke()
  // Right ear
  ctx.beginPath()
  ctx.ellipse(30, -22, 13, 20, 0.25, 0, Math.PI * 2)
  ctx.stroke()

  // Eyes (two small circles)
  ctx.beginPath()
  ctx.arc(-8, -38, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(8, -38, 3, 0, Math.PI * 2)
  ctx.fill()

  // Trunk (long, curling to left, tip touching modak)
  ctx.beginPath()
  ctx.moveTo(-5, -10)
  ctx.bezierCurveTo(-8, 10, -30, 15, -28, 35)
  ctx.bezierCurveTo(-26, 48, -12, 52, -8, 48)
  ctx.stroke()
  // Trunk rings
  ctx.beginPath(); ctx.arc(-10, 18, 4, 0, Math.PI); ctx.stroke()
  ctx.beginPath(); ctx.arc(-20, 30, 4, 0.3, Math.PI + 0.3); ctx.stroke()

  // Modak (sweet) at trunk tip
  ctx.beginPath()
  ctx.arc(-8, 50, 7, 0, Math.PI * 2)
  ctx.stroke()

  // Neck decoration
  ctx.beginPath()
  ctx.moveTo(-16, 2)
  ctx.lineTo(16, 2)
  ctx.stroke()

  // Pot belly body
  ctx.beginPath()
  ctx.ellipse(0, 36, 26, 28, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Sacred thread (yajnopavita) across body
  ctx.beginPath()
  ctx.moveTo(16, 5)
  ctx.quadraticCurveTo(24, 28, 12, 55)
  ctx.stroke()

  // Upper right arm (holds ankush / goad)
  ctx.beginPath()
  ctx.moveTo(20, 12)
  ctx.lineTo(48, -5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(48, -5)
  ctx.lineTo(52, -14)
  ctx.lineTo(46, -10)
  ctx.stroke()

  // Upper left arm (holds pasha / noose)
  ctx.beginPath()
  ctx.moveTo(-20, 12)
  ctx.lineTo(-46, -2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(-48, -8, 7, 0, Math.PI * 2)
  ctx.stroke()

  // Lower right arm (varada mudra - blessing)
  ctx.beginPath()
  ctx.moveTo(24, 28)
  ctx.lineTo(44, 44)
  ctx.stroke()

  // Lower left arm (holds broken tusk)
  ctx.beginPath()
  ctx.moveTo(-24, 28)
  ctx.lineTo(-44, 42)
  ctx.stroke()
  // Tusk
  ctx.beginPath()
  ctx.moveTo(-44, 42)
  ctx.lineTo(-50, 55)
  ctx.stroke()

  // Legs (seated, crossed)
  ctx.beginPath()
  ctx.moveTo(-10, 62)
  ctx.quadraticCurveTo(-30, 70, -36, 80)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(10, 62)
  ctx.quadraticCurveTo(30, 70, 36, 80)
  ctx.stroke()

  // Base / lotus seat
  ctx.beginPath()
  for (let i = -3; i <= 3; i++) {
    const bx = i * 10
    ctx.moveTo(bx - 6, 82)
    ctx.quadraticCurveTo(bx, 78, bx + 6, 82)
  }
  ctx.stroke()

  ctx.restore()
}

// ─── Draw a rotating mandala ──────────────────────────────────────────────────
function drawMandala(ctx, cx, cy, radius, angle, petals, color) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angle)

  for (let ring = 0; ring < 4; ring++) {
    const r = radius * (0.3 + ring * 0.23)
    const alpha = 0.07 - ring * 0.01
    ctx.strokeStyle = color
    ctx.globalAlpha = alpha
    ctx.lineWidth = 1

    // Polygon ring
    ctx.beginPath()
    for (let i = 0; i <= petals; i++) {
      const a = (i / petals) * Math.PI * 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Petal spokes
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
      ctx.stroke()
    }
  }

  // Star overlay
  ctx.globalAlpha = 0.05
  ctx.beginPath()
  for (let i = 0; i < petals * 2; i++) {
    const a = (i / (petals * 2)) * Math.PI * 2
    const r2 = i % 2 === 0 ? radius : radius * 0.4
    const x = Math.cos(a) * r2, y = Math.sin(a) * r2
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()

  ctx.restore()
}

// ─── Lotus particle ───────────────────────────────────────────────────────────
function drawLotusParticle(ctx, x, y, size, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = '#FF9933'
  for (let i = 0; i < 6; i++) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((i / 6) * Math.PI * 2)
    ctx.beginPath()
    ctx.ellipse(0, -size * 0.6, size * 0.25, size * 0.55, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.restore()
}

// ─── Main canvas component ────────────────────────────────────────────────────
export default function HinduCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Om particles
    const oms = Array.from({ length: 12 }, (_, i) => ({
      x: (i / 12) * window.innerWidth + Math.random() * 80 - 40,
      y: Math.random() * window.innerHeight,
      size: 10 + Math.random() * 22,
      alpha: 0.04 + Math.random() * 0.08,
      speed: 0.15 + Math.random() * 0.2,
      drift: (Math.random() - 0.5) * 0.12,
    }))

    // Lotus particles
    const lotuses = Array.from({ length: 8 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 6 + Math.random() * 10,
      alpha: 0.04 + Math.random() * 0.06,
      speed: 0.1 + Math.random() * 0.15,
    }))

    let t = 0

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      t += 1

      // ── Background mandalas (corners + center-ish) ──────────────────────
      drawMandala(ctx, W * 0.5, H * 0.5, Math.min(W, H) * 0.22, t * 0.002, 16, '#D4AF37')
      drawMandala(ctx, W * 0.5, H * 0.5, Math.min(W, H) * 0.35, -t * 0.0012, 12, '#C8941A')
      drawMandala(ctx, 0, 0, 120, t * 0.004, 8, '#FF8C00')
      drawMandala(ctx, W, 0, 100, -t * 0.005, 8, '#D4AF37')
      drawMandala(ctx, 0, H, 90, -t * 0.003, 8, '#FF8C00')
      drawMandala(ctx, W, H, 110, t * 0.004, 8, '#D4AF37')

      // ── Nataraja (right side, partial) ──────────────────────────────────
      const nataScale = Math.min(W, H) * 0.0028
      drawNataraja(ctx, W * 0.88, H * 0.5, nataScale, 0.07)

      // ── Ganesha (left side, partial) ────────────────────────────────────
      const ganScale = Math.min(W, H) * 0.0025
      drawGanesha(ctx, W * 0.12, H * 0.52, ganScale, 0.07)

      // ── Floating Om characters ──────────────────────────────────────────
      ctx.font = "serif"
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      oms.forEach(o => {
        o.y -= o.speed
        o.x += o.drift
        if (o.y < -40) {
          o.y = H + 20
          o.x = Math.random() * W
          o.alpha = 0.04 + Math.random() * 0.08
        }
        ctx.globalAlpha = o.alpha
        ctx.fillStyle = '#C8941A'
        ctx.font = `${o.size}px serif`
        ctx.fillText('ॐ', o.x, o.y)
      })

      // ── Floating lotus particles ─────────────────────────────────────────
      lotuses.forEach(l => {
        l.y -= l.speed
        if (l.y < -20) {
          l.y = H + 20
          l.x = Math.random() * W
        }
        drawLotusParticle(ctx, l.x, l.y, l.size, l.alpha)
      })

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
