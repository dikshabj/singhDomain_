'use client'
import { Globe, Flag, Gamepad2, Shield, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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

function SponsorCard({ name, price, desc, icon: Icon, color, index }: any) {
  return (
    <motion.div 
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Card */}
      <div
        className="relative rounded-2xl pt-12 pb-6 px-6 transition-all duration-500 min-h-[340px] flex flex-col justify-between hover:translate-y-[-8px] group"
        style={{
          background: 'var(--sponsor-card-bg)',
          border: '1px solid var(--sponsor-card-border)',
          boxShadow: '0 10px 40px -15px rgba(0,0,0,0.1)',
          zIndex: 1,
        }}
      >
        {/* Glow effect matching icon color */}
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-10 rounded-full pointer-events-none transition-opacity duration-500"
          style={{ background: color }}
        />

        {/* Icon circle at top center */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg z-10 transition-transform duration-500 group-hover:scale-110"
          style={{
            background: 'var(--sponsor-card-bg)',
            borderColor: color + '44',
            boxShadow: `0 0 20px ${color}22`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>

        <div>
          {/* TLD name */}
          <h3
            className="text-center text-xl font-bold mb-3 text-[var(--text-primary)]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {name}
          </h3>

          {/* Description */}
          <p className="text-center text-[11px] leading-relaxed mb-4 opacity-70 px-2" style={{ color: 'var(--text-secondary)' }}>
            {desc}
          </p>
        </div>

        {/* Price + CTA row */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[9px] uppercase tracking-widest font-semibold opacity-50" style={{ color: 'var(--text-secondary)' }}>SLDs from</div>
              <div className="text-base font-bold text-yellow-500">{price}<span className="text-[10px] font-normal opacity-50">/yr</span></div>
            </div>
            <div className="text-[10px] font-medium text-orange-500/60 dark:text-yellow-500/60">Limited Offer</div>
          </div>
          <button className="w-full py-2.5 rounded-xl text-xs font-bold btn-gold shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all">
            Register Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function SponsoredSection() {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <FloatingBackground density="low" />

      {/* CSS vars */}
      <style>{`
        :root {
          --sponsor-card-bg: rgba(255,255,255,0.92);
          --sponsor-card-border: rgba(255,115,63,0.15);
        }
        .dark {
          --sponsor-card-bg: rgba(255,255,255,0.04);
          --sponsor-card-border: rgba(255,255,255,0.07);
        }
      `}</style>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-orange-300/5 dark:bg-yellow-500/5 blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header centered */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          {/* Section label */}
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-yellow-600 dark:text-yellow-500 mb-6 px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            👑 Premium Web3 Registry
          </span>

          <h2
            className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6 leading-tight"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Premium <span className="text-gradient">Sponsored Domains</span>
          </h2>

          <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed opacity-80">
            Discover our hand-picked sponsored TLDs — premium extensions that power the next generation of digital identities, brands, and communities.
          </p>
        </div>

        {/* Cards Grid — Horizontal static cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sponsoredTLDs.map((card, i) => (
            <SponsorCard key={card.name} {...card} index={i} />
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <div className="flex -space-x-3">
            {[
              'https://i.pravatar.cc/150?u=a042581f4e29026024d',
              'https://i.pravatar.cc/150?u=a042581f4e29026704d',
              'https://i.pravatar.cc/150?u=a04258114e29026702d',
              'https://i.pravatar.cc/150?u=a04258114e29026708d'
            ].map((src, i) => (
              <div 
                key={i} 
                className="w-10 h-10 rounded-full border-2 border-[var(--bg-primary)] bg-yellow-500 shadow-xl overflow-hidden"
              >
                 <img src={src} alt="Pioneer" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-widest opacity-60">
            Joined by <span className="text-[var(--text-primary)] font-bold">12,000+</span> web3 pioneers
          </div>
        </div>
      </div>
    </section>
  )
}
