'use client'
import { Globe, Flag, Gamepad2, Shield, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import FloatingBackground from './FloatingBackground'

const sponsoredTLDs = [
  {
    name: '.metaverse',
    price: '$5.00',
    desc: 'The ultimate domain for virtual worlds, gaming platforms, and next-gen immersive digital experiences.',
    icon: Globe,
    color: '#4ECDC4',
  },
  {
    name: '.usa',
    price: '$5.00',
    desc: 'Establish your American digital identity with the most trusted country-specific Web3 domain extension.',
    icon: Flag,
    color: '#FF6B35',
  },
  {
    name: '.gaming',
    price: '$5.00',
    desc: 'Built for gamers, streamers, and esports brands who want to own their corner of the digital arena.',
    icon: Gamepad2,
    color: '#F5C518',
  },
  {
    name: '.singh',
    price: '$5.00',
    desc: 'Claim your cultural heritage with the first Web3 community domain powering the Singh identity worldwide.',
    icon: Shield,
    color: '#FFD700',
  },
]

function SponsorCard({ name, price, desc, icon: Icon, color, index, total }: any) {
  return (
    <motion.div 
      className="relative w-full max-w-lg mx-auto"
      initial={false}
    >
      {/* Card */}
      <div
        className="relative rounded-2xl pt-14 pb-8 px-10 transition-all duration-500 min-h-[380px] flex flex-col justify-between"
        style={{
          background: 'var(--sponsor-card-bg)',
          border: '1px solid var(--sponsor-card-border)',
          boxShadow: '0 20px 60px -15px rgba(0,0,0,0.3)',
          zIndex: 1,
        }}
      >
        {/* Glow effect matching icon color */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 blur-3xl opacity-10 rounded-full pointer-events-none"
          style={{ background: color }}
        />

        {/* Icon circle at top center */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg z-10"
          style={{
            background: 'var(--sponsor-card-bg)',
            borderColor: color + '66',
            boxShadow: `0 0 20px ${color}33`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>

        {/* TLD name */}
        <h3
          className="text-center text-xl font-bold mb-2 text-[var(--text-primary)]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {name}
        </h3>

        {/* Description */}
        <p className="text-center text-xs leading-relaxed mb-4 opacity-70" style={{ color: 'var(--text-secondary)' }}>
          {desc}
        </p>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold opacity-50" style={{ color: 'var(--text-secondary)' }}>SLDs from</div>
            <div className="text-lg font-bold text-yellow-500">{price}<span className="text-xs font-normal opacity-50">/yr</span></div>
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-bold btn-gold shadow-lg shadow-yellow-500/20">
            Register →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function SponsoredSection() {
  const cards = sponsoredTLDs
  const [activeIndex, setActiveIndex] = useState(0)

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length)
  }

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  return (
    <section className="py-12 px-6 relative z-10 overflow-hidden">
      <FloatingBackground density="low" />

      {/* CSS vars */}
      <style>{`
        :root {
          --sponsor-card-bg: rgba(255,255,255,0.92);
          --sponsor-card-border: rgba(255,115,63,0.15);
          --sponsor-num: rgba(255,115,63,0.08);
        }
        .dark {
          --sponsor-card-bg: rgba(255,255,255,0.04);
          --sponsor-card-border: rgba(255,255,255,0.07);
          --sponsor-num: rgba(255,255,255,0.04);
        }
      `}</style>

      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-orange-300/10 dark:bg-yellow-500/5 blur-[180px] -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-orange-200/10 dark:bg-yellow-400/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — text info */}
          <div className="lg:sticky lg:top-40 self-start">
            {/* Section label */}
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-yellow-600 dark:text-yellow-500 mb-5 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20">
              👑 Sponsored TLDs
            </span>

            <h2
              className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-5 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Premium<br />
              <span className="text-gradient">Web3 Domains</span>
            </h2>

            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 max-w-md opacity-80">
              Discover our hand-picked sponsored TLDs — premium extensions that power the next generation of digital identities, brands, and communities on the blockchain.
            </p>

            <div className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-3">
                {[
                  'https://i.pravatar.cc/150?u=a042581f4e29026024d',
                  'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                  'https://i.pravatar.cc/150?u=a04258114e29026702d',
                  'https://i.pravatar.cc/150?u=a04258114e29026708d'
                ].map((src, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, zIndex: 10 }}
                    className="w-12 h-12 rounded-full border-2 border-[var(--bg-primary)] bg-yellow-500 shadow-xl overflow-hidden"
                  >
                     <img src={src} alt="Pioneer" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm font-medium text-[var(--text-secondary)]">
                Joined by <span className="text-[var(--text-primary)] font-bold">12,000+</span> web3 pioneers
              </div>
            </div>
          </div>

          {/* RIGHT — Interactive Card Carousel */}
          <div className="relative h-[500px] flex items-center justify-center lg:justify-center pt-0">
            <div className="relative w-full max-w-lg lg:pr-4">
              
              {/* Stack background effect (indicates more cards) */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 scale-95 opacity-20 bg-yellow-500/20 rounded-2xl blur-sm" />
              <div className="absolute inset-0 translate-x-2 translate-y-2 scale-98 opacity-40 bg-yellow-500/10 rounded-2xl blur-xs" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ x: 50, opacity: 0, rotate: 2 }}
                  animate={{ x: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: -50, opacity: 0, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative z-10"
                >
                  <SponsorCard {...cards[activeIndex]} />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls — Contained within margins */}
              <div className="absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                <button 
                  onClick={nextCard}
                  className="w-14 h-14 rounded-full bg-yellow-500 text-black flex items-center justify-center shadow-xl shadow-yellow-500/40 hover:scale-110 active:scale-95 transition-all group"
                >
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <button 
                onClick={prevCard}
                className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-yellow-500/20 bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center justify-center text-yellow-500/60 hover:text-yellow-400 hover:border-yellow-500/50 transition-all z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
