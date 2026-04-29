'use client'
import { useEffect, useRef, useState } from 'react'
import FloatingBackground from './FloatingBackground'

const DOMAINS = ['.singh', '.metaverse', '.gaming', '.usa', '.web3', '.crypto', '.nft', '.dao']

export default function HeroSection() {
  const [typedText, setTypedText] = useState('')
  const [activeType, setActiveType] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Typing animation
  useEffect(() => {
    const types = ['TLD', 'SLD', 'ALL']
    let idx = 0
    let charIdx = 0
    let deleting = false

    const interval = setInterval(() => {
      const current = types[idx % types.length]
      if (!deleting) {
        setTypedText(current.slice(0, charIdx + 1))
        charIdx++
        if (charIdx === current.length) {
          setTimeout(() => { deleting = true }, 1200)
        }
      } else {
        setTypedText(current.slice(0, charIdx - 1))
        charIdx--
        if (charIdx === 0) {
          deleting = false
          idx++
          setActiveType(idx % 3)
        }
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: {
      x: number; y: number; r: number;
      dx: number; dy: number; opacity: number; color: string
    }[] = []

    const colors = ['#F5C518', '#FFD700', '#FF6B35', '#4ECDC4']

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      // Draw connecting lines
      ctx.globalAlpha = 0.05
      ctx.strokeStyle = '#F5C518'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const [search, setSearch] = useState('')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 lg:pt-32">
      <FloatingBackground density="low" />
      {/* Canvas particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Orbs / Glow blobs */}
      <div className="orb w-96 h-96 top-10 -left-32" style={{background:'radial-gradient(circle, rgba(245,197,24,0.15), transparent 70%)', zIndex:1}} />
      <div className="orb w-80 h-80 bottom-20 -right-20" style={{background:'radial-gradient(circle, rgba(255,107,53,0.12), transparent 70%)', zIndex:1}} />
      <div className="orb w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{background:'radial-gradient(circle, rgba(78,205,196,0.08), transparent 70%)', zIndex:1}} />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 text-center lg:text-left pt-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full mx-auto lg:mx-0"
            style={{background:'rgba(255,115,63,0.08)', border:'1px solid rgba(255,115,63,0.15)'}}>
            <span className="w-2 h-2 rounded-full bg-orange-400 dark:bg-yellow-400 animate-pulse" />
            <span className="text-orange-700 dark:text-yellow-400 text-sm font-medium">Web3 Domain Registry • Zero Renewal Fees</span>
          </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{fontFamily:'Sora, sans-serif'}}>
          <span className="text-[var(--text-primary)]">Get Your</span>
          <br />
          <span className="text-gradient">Web3 Domains</span>
          <br />
          <span className="text-[var(--text-primary)]">and TLDs with</span>
          <br />
          <span className="text-[var(--text-primary)]">Zero </span>
          <span className="text-[var(--gold)] dark:text-yellow-400">Renewal Fees</span>
        </h1>

          {/* Sub text */}
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Own your digital identity forever. Mint, manage, and sell Web3 domains across multiple blockchains.
          </p>

          {/* Type selector buttons */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-10">
            {['TLD', 'SLD', 'ALL'].map((type, i) => (
              <button
                key={type}
                onClick={() => setActiveType(i)}
                className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest transition-all duration-300 ${
                  activeType === i
                    ? 'btn-gold shadow-lg shadow-orange-400/30 dark:shadow-yellow-400/30'
                    : 'btn-outline'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search bar — pill style */}
          <div className="relative max-w-2xl mx-auto lg:mx-0 group">
            {/* Glow halo on hover */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400/20 to-orange-600/20 dark:from-yellow-400/20 dark:to-yellow-600/20 blur-lg opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            <div
              className="relative flex items-center rounded-full border px-2 py-2 shadow-xl backdrop-blur-xl transition-all duration-300"
              style={{
                background: 'var(--sticky-search-bg)',
                borderColor: 'var(--sticky-search-border)',
                boxShadow: '0 4px 30px var(--gold-glow)',
              }}
            >
              {/* Input */}
              <input
                type="text"
                placeholder="Find your name."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none pl-6 pr-2 py-3 text-lg font-medium"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--gold)' }}
              />

              {/* Active TLD display */}
              {!search && (
                <span
                  className="text-base font-bold px-4 select-none whitespace-nowrap"
                  style={{ color: 'var(--gold)', fontFamily: 'Sora, sans-serif' }}
                >
                  .singh
                </span>
              )}

              {/* Divider */}
              <div className="w-px h-6 bg-orange-500/20 dark:bg-yellow-500/20 mr-2" />

              {/* Gold circular search button */}
              <button
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
                style={{
                  background: 'linear-gradient(135deg, var(--gold), #E85D20)',
                  boxShadow: '0 0 24px var(--gold-glow)',
                }}
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-5 px-2">
              <span className="text-xs text-[var(--text-secondary)] mr-1 self-center font-medium">Trending:</span>
              {['.singh', '.gaming', '.metaverse', '.usa'].map(d => (
                <button
                  key={d}
                  onClick={() => setSearch(d)}
                  className="domain-pill text-xs hover:bg-orange-400/10 dark:hover:bg-yellow-400/10 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Stats — big card boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'Domains Registered', value: '12K+' },
              { label: 'TLDs Available', value: '50+' },
              { label: 'Blockchains', value: '6+' },
              { label: 'Renewal Fee', value: '$0' },
            ].map(stat => (
              <div
                key={stat.label}
                className="glass-card px-6 py-8 text-center lg:text-left flex flex-col justify-between hover:border-orange-500/40 dark:hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 dark:text-yellow-400 mb-3 leading-none" style={{fontFamily:'Bebas Neue'}}>{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-[var(--text-secondary)] uppercase tracking-widest font-semibold leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Globe / Domain sphere — right column, sticky so it stays centered */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center sticky top-32 scale-75 xl:scale-100" style={{zIndex:2}}>
          <div className="relative w-80 h-80">
            
            {/* Background Glow Aura */}
            <div className="absolute inset-[-40px] rounded-full blur-[80px] animate-pulse" 
              style={{ background: 'var(--gold-glow)', opacity: 0.4 }} />

            {/* Orbiting Particles (Outer Layer) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div
                key={`p1-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-yellow-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(160px)`,
                  boxShadow: '0 0 15px var(--gold)',
                  animation: `spin ${10 + i}s linear infinite`,
                  opacity: 0.6
                }}
              />
            ))}

            {/* Rotating Rings (Outer) */}
            <div className="absolute inset-0 rounded-full border border-dashed border-orange-500/20 dark:border-yellow-500/20 animate-spin-slow" />
            <div className="absolute inset-6 rounded-full border border-orange-500/10 dark:border-yellow-500/10" 
              style={{ animation: 'spin 12s linear infinite reverse' }} />
            
            {/* Tilted Ring 1 */}
            <div className="absolute inset-[-10px] rounded-full border border-orange-500/30 dark:border-yellow-500/30"
              style={{ transform: 'rotateX(75deg) rotateY(15deg)', animation: 'spin 8s linear infinite' }} />
            
            {/* Tilted Ring 2 */}
            <div className="absolute inset-[-10px] rounded-full border border-orange-500/30 dark:border-yellow-500/30"
              style={{ transform: 'rotateX(-75deg) rotateY(-15deg)', animation: 'spin 10s linear infinite reverse' }} />

            {/* Main Core Sphere */}
            <div className="absolute inset-10 rounded-full group cursor-pointer transition-all duration-700 hover:scale-110"
              style={{
                background: 'var(--globe-core-bg)',
                border: '1px solid var(--globe-core-border)',
                boxShadow: 'var(--globe-core-shadow)',
                zIndex: 5
              }}
            >
              {/* Inner Glow Pulse */}
              <div className="absolute inset-0 rounded-full animate-pulse opacity-50" 
                style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }} />

              {/* Logo / Text */}
              <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center">
                <span className="text-6xl font-display font-bold tracking-tighter" 
                  style={{fontFamily:'Bebas Neue', color:'var(--globe-sd-color)', filter: 'drop-shadow(0 0 10px var(--gold-glow))'}}>
                  SD
                </span>
                <div className="w-12 h-0.5 bg-orange-500/30 dark:bg-yellow-500/30 mt-[-5px] rounded-full" />
              </div>

              {/* Holographic Sweep */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </div>
            </div>

            {/* Orbiting Dots (Inner Layer) */}
            {[30, 150, 270].map((deg, i) => (
              <div
                key={`p2-${i}`}
                className="absolute w-2 h-2 rounded-full bg-orange-500 dark:bg-yellow-500"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(110px)`,
                  boxShadow: '0 0 20px var(--gold)',
                  animation: `spin ${5 + i}s linear infinite reverse`,
                  zIndex: 6
                }}
              />
            ))}

            {/* Floating Domain Tags */}
            {DOMAINS.slice(0, 5).map((d, i) => (
              <div
                key={d}
                className="absolute domain-pill text-[10px] font-bold px-3 py-1.5 backdrop-blur-md shadow-lg"
                style={{
                  top: `${[5, 80, 20, 85, 45][i]}%`,
                  left: `${[-50, -40, 110, 100, -70][i]}%`,
                  animation: `float ${4 + i}s ease-in-out ${i * 0.3}s infinite`,
                  borderColor: 'var(--border-gold)',
                  zIndex: 10
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
