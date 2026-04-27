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
    <div className="relative group">

      {/* Card */}
      <div
        className="relative rounded-2xl pt-10 pb-6 px-6 transition-all duration-300 group-hover:-translate-y-1"
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
            borderColor: 'rgba(245,197,24,0.4)',
            boxShadow: '0 0 20px rgba(245,197,24,0.25)',
          }}
        >
          {icon}
        </div>

        {/* TLD name */}
        <h3
          className="text-center text-xl font-bold mb-2 text-[var(--text-primary)] group-hover:text-yellow-400 transition-colors"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {name}
        </h3>

        {/* Description */}
        <p className="text-center text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)', opacity: 0.85 }}>
          {desc}
        </p>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--sponsor-card-border)' }}>
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>SLDs from</div>
            <div className="text-lg font-bold text-yellow-500" style={{ fontFamily: 'Sora, sans-serif' }}>{price}<span className="text-xs font-normal opacity-60">/yr</span></div>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #F5C518, #E6B800)',
              color: '#000',
              boxShadow: '0 0 16px rgba(245,197,24,0.3)',
            }}
          >
            Register →
          </button>
        </div>

        {/* Gold star row */}
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="14" height="14" fill="#F5C518" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SponsoredSection() {
  const [left] = [sponsoredTLDs[1]]          // .usa  — large left card
  const right = [sponsoredTLDs[0], sponsoredTLDs[2], sponsoredTLDs[3]] // right stacked

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <FloatingBackground density="low" />

      {/* CSS vars */}
      <style>{`
        :root {
          --sponsor-card-bg: rgba(255,255,255,0.92);
          --sponsor-card-border: rgba(245,197,24,0.25);
          --sponsor-num: rgba(245,197,24,0.10);
        }
        .dark {
          --sponsor-card-bg: rgba(255,255,255,0.04);
          --sponsor-card-border: rgba(255,255,255,0.07);
          --sponsor-num: rgba(255,255,255,0.04);
        }
      `}</style>

      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-yellow-300/10 dark:bg-yellow-500/5 blur-[180px] -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — text + large featured card */}
          <div>
            {/* Section label */}
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-yellow-600 dark:text-yellow-500 mb-5 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20">
              👑 Sponsored TLDs
            </span>

            <h2
              className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-5 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Premium<br />
              <span className="text-gradient">Web3 Domains</span>
            </h2>

            <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-12 max-w-md opacity-80">
              Discover our hand-picked sponsored TLDs — premium extensions that power the next generation of digital identities, brands, and communities on the blockchain.
            </p>

            {/* Featured large card */}
            <div className="max-w-sm">
              <SponsorCard {...left} />
            </div>
          </div>

          {/* RIGHT — 3 stacked cards */}
          <div className="flex flex-col gap-10 pt-8">
            {right.map(tld => (
              <SponsorCard key={tld.name} {...tld} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
