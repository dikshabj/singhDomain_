'use client'
import { useEffect, useRef, useState } from 'react'
import FloatingBackground from './FloatingBackground'

const DOMAINS = ['.singh', '.metaverse', '.gaming', '.usa', '.web3', '.crypto', '.nft', '.dao']

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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


  return (
    <section className="relative min-h-[90vh] lg:h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-10 lg:pt-32" style={{ zIndex: 0 }}>
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start pt-6 md:pt-8">
        
            {/* Web3 Registry Badge — stay at top */}
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full"
              style={{background:'rgba(245,197,24,0.1)', border:'1px solid rgba(245,197,24,0.2)'}}>
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-400 text-xs font-medium uppercase tracking-wider">Web3 Domain Registry • Zero Renewal Fees</span>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          <div className="lg:col-span-7 text-center lg:text-left pt-4">
            {/* Hero content removed search and replaced with spacing */}
            <div className="mb-4" />

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-4" style={{fontFamily:'Sora, sans-serif'}}>
          <span className="text-[var(--text-primary)]">Get Your </span>
          <span className="text-gradient">Web3 Domains</span>
          <br />
          <span className="text-[var(--text-primary)]">with </span>
          <span className="text-yellow-400">Zero Renewal Fees</span>
        </h1>

          {/* Sub text */}
          <p className="text-[var(--text-secondary)] text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-80">
            Own your digital identity forever. Mint, manage, and sell Web3 domains across multiple blockchains.
          </p>

          {/* Search Bar removed — moved to global Navbar */}
          <div>
            {/* Trending Tags Row — moved below search bar */}
            <div className="flex flex-wrap justify-start gap-2 mt-4 px-2 items-center">
              <span className="text-[10px] text-[var(--text-secondary)] mr-1 font-bold uppercase tracking-tighter opacity-60">Trending:</span>
              {['.singh', '.gaming', '.metaverse', '.usa'].map(d => (
                <button
                  key={d}
                  className="domain-pill text-[10px] py-1 px-3 border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-400/10 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Extra decorative pill — moved below search bar */}
            <div className="inline-flex mt-4 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest ml-4">
              .singh
            </div>
          </div>

          {/* Type selector removed */}

          {/* Search bar removed from here */}

          {/* Stats removed from here */}
        </div>

        {/* 3D Globe / Domain sphere — right column, sticky so it stays centered */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center sticky top-24 scale-75 xl:scale-90" style={{zIndex:2}}>
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
    </div>
  </section>
)
}
