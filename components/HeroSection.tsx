'use client'
import { useEffect, useRef, useState } from 'react'

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

      {/* 3D Globe / Domain sphere */}
      <div className="absolute right-[-2%] xl:right-8 top-1/2 -translate-y-1/2 hidden lg:block scale-75 xl:scale-100" style={{zIndex:2}}>
        <div className="relative w-72 h-72 animate-float">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-spin-slow" />
          <div className="absolute inset-4 rounded-full border border-yellow-400/10" style={{animationDelay:'0.5s', animation:'spin 15s linear infinite reverse'}} />
          {/* Core */}
          <div className="absolute inset-8 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1a1400, #0a0a0a)',
              border: '1px solid rgba(245,197,24,0.3)',
              boxShadow: '0 0 60px rgba(245,197,24,0.2), inset 0 0 40px rgba(245,197,24,0.05)'
            }}
          >
            <div className="absolute inset-0 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-5xl font-display" style={{fontFamily:'Bebas Neue'}}>SD</span>
            </div>
          </div>
          {/* Orbiting dots */}
          {[0,60,120,180,240,300].map((deg, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-yellow-400"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`,
                boxShadow: '0 0 10px rgba(245,197,24,0.8)',
                animation: `spin ${8 + i}s linear infinite`,
                opacity: 0.6 + (i * 0.07)
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

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 text-center lg:text-left">
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

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto lg:mx-0 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute left-6 flex items-center pointer-events-none">
                <svg className="text-yellow-400 w-6 h-6 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your domain... e.g. yourname.singh"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-16 pr-44 py-6 text-lg bg-transparent text-[var(--text-primary)] placeholder-gray-500 focus:outline-none"
              />
              <button className="absolute right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20">
                SEARCH NOW
              </button>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-6">
              <span className="text-xs text-[var(--text-secondary)] mr-1 self-center font-medium opacity-60">Trending:</span>
              {['.singh', '.gaming', '.metaverse', '.usa'].map(d => (
                <button
                  key={d}
                  onClick={() => setSearch(d)}
                  className="domain-pill text-xs hover:bg-white/10 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 mt-16">
            {[
              { label: 'Domains Registered', value: '12K+' },
              { label: 'TLDs Available', value: '50+' },
              { label: 'Blockchains', value: '6+' },
              { label: 'Renewal Fee', value: '$0' },
            ].map(stat => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-400 mb-1" style={{fontFamily:'Bebas Neue'}}>{stat.value}</div>
                <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest opacity-60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
