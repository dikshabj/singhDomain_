'use client'

import { useState, useEffect } from 'react'

const DOMAINS = ['.singh', '.metaverse', '.gaming', '.usa', '.web3', '.crypto', '.nft', '.dao']

export default function HeroGlobe() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, 1000) // Delay globe animation by 1s
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`lg:col-span-5 hidden lg:flex items-center justify-center sticky top-24 scale-75 xl:scale-90 transition-all duration-1000 ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{zIndex:2}}>
      <div className="relative w-80 h-80">
        
        {/* Background Glow Aura */}
        <div className="absolute inset-[-40px] rounded-full blur-[80px] animate-pulse" 
          style={{ background: 'var(--gold-glow)', opacity: 0.3 }} />

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
              animation: `spin ${15 + i}s linear infinite`,
              opacity: 0.5
            }}
          />
        ))}

        {/* Rotating Rings (Outer) */}
        <div className="absolute inset-0 rounded-full border border-dashed border-orange-500/20 dark:border-yellow-500/20 animate-spin-slow" />
        
        {/* Tilted Ring 1 */}
        <div className="absolute inset-[-10px] rounded-full border border-orange-500/30 dark:border-yellow-500/30"
          style={{ transform: 'rotateX(75deg) rotateY(15deg)', animation: 'spin 12s linear infinite' }} />
        
        {/* Tilted Ring 2 */}
        <div className="absolute inset-[-10px] rounded-full border border-orange-500/30 dark:border-yellow-500/30"
          style={{ transform: 'rotateX(-75deg) rotateY(-15deg)', animation: 'spin 15s linear infinite reverse' }} />

        {/* Main Core Sphere */}
        <div className="absolute inset-10 rounded-full group cursor-pointer transition-all duration-700 hover:scale-110"
          style={{
            background: 'var(--globe-core-bg)',
            border: '1px solid var(--globe-core-border)',
            boxShadow: 'var(--globe-core-shadow)',
            zIndex: 5
          }}
        >
          {/* Lion Logo Seamless Integration - Highest Z-Index to hide any stray dots behind it */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center p-8 overflow-hidden" style={{ zIndex: 10 }}>
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            <img 
              src="/golden_lion_logo.png" 
              alt="Lion Logo" 
              className="w-[90%] h-[90%] object-contain rounded-full mix-blend-screen filter brightness-125 contrast-110 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform duration-700 relative z-20"
            />
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
              animation: `spin ${8 + i}s linear infinite reverse`,
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
              animation: `float ${6 + i}s ease-in-out ${i * 0.5}s infinite`,
              borderColor: 'var(--border-gold)',
              zIndex: 10
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}
