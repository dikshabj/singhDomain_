'use client'
import FloatingBackground from './FloatingBackground'

const sponsoredTLDs = [
  {
    name: '.metaverse',
    price: '$5.00',
    desc: 'The ultimate domain for virtual worlds, gaming platforms, and next-gen immersive digital experiences.',
    icon: '🌐',
    num: '01',
  },
  {
    name: '.usa',
    price: '$5.00',
    desc: 'Establish your American digital identity with the most trusted country-specific Web3 domain extension.',
    icon: '🇺🇸',
    num: '02',
  },
  {
    name: '.gaming',
    price: '$5.00',
    desc: 'Built for gamers, streamers, and esports brands who want to own their corner of the digital arena.',
    icon: '🎮',
    num: '03',
  },
  {
    name: '.singh',
    price: '$5.00',
    desc: 'Claim your cultural heritage with the first Web3 community domain powering the Singh identity worldwide.',
    icon: '⚔️',
    num: '04',
  },
]

function SponsorCard({ name, price, desc, icon }: typeof sponsoredTLDs[0]) {
  return (
    <div className="relative group h-full">

      {/* Card */}
      <div
        className="relative h-full flex flex-col rounded-2xl pt-10 pb-6 px-6 transition-all duration-300 group-hover:-translate-y-1"
        style={{
          background: 'var(--sponsor-card-bg)',
          border: '1px solid var(--sponsor-card-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          zIndex: 1,
        }}
      >
        {/* Notch + Icon circle at top center */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 shadow-lg"
          style={{
            background: 'var(--sponsor-card-bg)',
            borderColor: 'var(--border-gold)',
            boxShadow: '0 0 20px var(--gold-glow)',
          }}
        >
          {icon}
        </div>

        {/* TLD name */}
        <h3
          className="text-center text-xl font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--gold)] dark:group-hover:text-yellow-400 transition-colors"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {name}
        </h3>

        {/* Description */}
        <p className="text-center text-sm leading-relaxed mb-4 flex-grow" style={{ color: 'var(--text-secondary)' }}>
          {desc}
        </p>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--sponsor-card-border)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)' }}>SLDs from</div>
            <div className="text-lg font-bold text-orange-600 dark:text-yellow-500" style={{ fontFamily: 'Sora, sans-serif' }}>{price}<span className="text-xs font-normal text-[var(--text-secondary)] ml-0.5">/yr</span></div>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--gold), #E85D20)',
              color: '#FFFFFF',
              boxShadow: '0 0 16px var(--gold-glow)',
            }}
          >
            Register →
          </button>
        </div>

        {/* Gold star row */}
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="14" height="14" fill="var(--gold)" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
      </div>
    </div>
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
        {/* Section Header — centered full-width */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-orange-600 dark:text-yellow-500 mb-5 px-4 py-1.5 rounded-full bg-orange-400/10 dark:bg-yellow-400/10 border border-orange-400/20 dark:border-yellow-400/20">
            👑 Sponsored TLDs
          </span>

          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-5 leading-tight"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Premium <span className="text-gradient">Web3 Domains</span>
          </h2>

          <p className="text-[var(--text-secondary)] text-base leading-relaxed max-w-2xl mx-auto">
            Discover our hand-picked sponsored TLDs — premium extensions that power the next generation of digital identities, brands, and communities on the blockchain.
          </p>
        </div>

        {/* Cards Grid — responsive: 1 → 2 → 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-14">
          {sponsoredTLDs.map(tld => (
            <SponsorCard key={tld.name} {...tld} />
          ))}
        </div>
      </div>
    </section>
  )
}
