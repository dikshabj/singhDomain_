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
            style={{background:'rgba(245,197,24,0.1)', border:'1px solid rgba(245,197,24,0.2)'}}>
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400 text-sm font-medium">Web3 Domain Registry • Zero Renewal Fees</span>
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
          <span className="text-yellow-400">Renewal Fees</span>
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
                    ? 'btn-gold shadow-lg shadow-yellow-400/30'
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
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 blur-lg opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            <div
              className="relative flex items-center rounded-full border px-2 py-2 shadow-xl backdrop-blur-xl transition-all duration-300"
              style={{
                background: 'var(--sticky-search-bg)',
                borderColor: 'rgba(245,197,24,0.3)',
                boxShadow: '0 4px 30px rgba(245,197,24,0.1)',
              }}
            >
              {/* Input */}
              <input
                type="text"
                placeholder="Find your name."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none pl-6 pr-2 py-3 text-lg font-medium"
                style={{ color: 'var(--text-primary)', caretColor: '#F5C518' }}
              />

              {/* Active TLD display */}
              {!search && (
                <span
                  className="text-base font-bold px-4 select-none whitespace-nowrap"
                  style={{ color: '#F5C518', fontFamily: 'Sora, sans-serif' }}
                >
                  .singh
                </span>
              )}

              {/* Divider */}
              <div className="w-px h-6 bg-yellow-500/20 mr-2" />

              {/* Gold circular search button */}
              <button
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
                style={{
                  background: 'linear-gradient(135deg, #F5C518, #E6B800)',
                  boxShadow: '0 0 24px rgba(245,197,24,0.45)',
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
              <span className="text-xs text-[var(--text-secondary)] mr-1 self-center font-medium opacity-60">Trending:</span>
              {['.singh', '.gaming', '.metaverse', '.usa'].map(d => (
                <button
                  key={d}
                  onClick={() => setSearch(d)}
                  className="domain-pill text-xs hover:bg-yellow-400/10 transition-colors"
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
                className="glass-card px-6 py-8 text-center lg:text-left flex flex-col justify-between hover:border-yellow-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl font-bold text-yellow-400 mb-3 leading-none" style={{fontFamily:'Bebas Neue'}}>{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest opacity-70 font-semibold leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Globe / Domain sphere — right column, sticky so it stays centered */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center sticky top-32 scale-75 xl:scale-100" style={{zIndex:2}}>
          <div className="relative w-72 h-72 animate-float">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full animate-spin-slow"
              style={{ border: '1px solid var(--globe-ring1)' }} />
            <div className="absolute inset-4 rounded-full"
              style={{ animationDelay:'0.5s', animation:'spin 15s linear infinite reverse', border: '1px solid var(--globe-ring2)' }} />
            {/* Core */}
            <div className="absolute inset-8 rounded-full"
              style={{
                background: 'var(--globe-core-bg)',
                border: '1px solid var(--globe-core-border)',
                boxShadow: 'var(--globe-core-shadow)'
              }}
            >
              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                <span className="text-5xl font-display font-bold" style={{fontFamily:'Bebas Neue', color:'var(--globe-sd-color)'}}>SD</span>
              </div>
            </div>
            {/* Inner glow ring (light theme decoration) */}
            <div className="absolute inset-10 rounded-full pointer-events-none"
              style={{ border: '1px dashed var(--globe-ring2)', opacity: 0.5 }} />
            {/* Orbiting dots */}
            {[0,60,120,180,240,300].map((deg, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`,
                  boxShadow: '0 0 10px rgba(245,197,24,0.9)',
                  animation: `spin ${8 + i}s linear infinite`,
                  opacity: 0.7 + (i * 0.05)
                }}
              />
            ))}
            {/* Floating domain tags around sphere */}
            {DOMAINS.slice(0,4).map((d, i) => (
              <div
                key={d}
                className="absolute domain-pill text-xs"
                style={{
                  top: `${[10, 70, 15, 75][i]}%`,
                  left: `${[-60, -50, 100, 90][i]}%`,
                  animation: `float ${5 + i}s ease-in-out ${i * 0.5}s infinite`,
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
