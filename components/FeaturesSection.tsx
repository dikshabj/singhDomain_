'use client'
import FloatingBackground from './FloatingBackground'

const S = 300 // diamond container size
const GAP = 6

const features = [
  { icon: '🌐', title: 'Be a Registrar', desc: 'Manage and register your own web3 domains with full control.', color: '#4ECDC4' },
  { icon: '⛓️', title: 'Mint Web3 TLDs', desc: 'Mint your own TLDs and sell them on the marketplace.', color: 'var(--gold)' },
  { icon: '🛡️', title: 'Own Your Identity', desc: 'Secure your unique digital presence permanently on the blockchain.', color: '#4ECDC4' },
  { icon: '📧', title: 'Web3 Emails', desc: 'Secure decentralized communication with web3-enabled emails.', color: '#FF6B35' },
  { icon: '💳', title: 'Name Your Wallet', desc: 'Personalize your crypto wallet with a human-readable domain.', color: 'var(--gold)' },
  { icon: '🌍', title: 'Surf the Internet', desc: 'Browse smoothly with web3-enabled DNS resolution.', color: '#4ECDC4' },
]

function DiamondCard({ icon, title, desc, color }: typeof features[0]) {
  return (
    <div 
      style={{ 
        width: 'var(--diamond-s)', 
        height: 'var(--diamond-s)', 
        position: 'relative', 
        flexShrink: 0 
      }} 
      className="group"
    >
      {/* Shadow wrapper — drop-shadow respects clip-path */}
      <div
        className="absolute inset-0 transition-all duration-300 group-hover:scale-[1.04]"
        style={{ filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.13))' }}
      >
        {/* Colored border diamond */}
        <div
          className="absolute inset-0"
          style={{ 
            clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)', 
            background: color.startsWith('var') ? `color-mix(in srgb, ${color}, transparent 66%)` : color + '55' 
          }}
        />
        {/* Fill diamond — inset 2px so colored border shows */}
        <div
          className="absolute"
          style={{
            top: 3, left: 3, right: 3, bottom: 3,
            clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
            background: 'var(--diamond-fill)',
          }}
        />
      </div>

      {/* Top vertex circle */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{
          top: 28, left: '50%', transform: 'translateX(-50%)',
          width: 48, height: 48, borderRadius: '50%',
          background: color.startsWith('var') ? `color-mix(in srgb, ${color}, transparent 85%)` : color + '25',
          border: `2px solid ${color.startsWith('var') ? `color-mix(in srgb, ${color}, transparent 50%)` : color + '80'}`,
        }}
      >
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>

      {/* Content — centered */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
        style={{ paddingLeft: 40, paddingRight: 40 }}
      >
        <h3
          className="font-bold mb-2 leading-snug"
          style={{ color: 'var(--text-primary)', fontSize: 14, fontFamily: 'Sora,sans-serif', letterSpacing: '0.02em' }}
        >
          {title}
        </h3>
        <p
          style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.55, opacity: 0.85 }}
        >
          {desc}
        </p>
      </div>

      {/* Bottom vertex arrow */}
      <div
        className="absolute z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-transform duration-300 group-hover:scale-110"
        style={{
          bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: color.startsWith('var') ? `color-mix(in srgb, ${color}, transparent 85%)` : color + '25', 
          border: `1.5px solid ${color.startsWith('var') ? `color-mix(in srgb, ${color}, transparent 60%)` : color + '60'}`, 
          color: color.startsWith('var') ? color : color
        }}
      >
        →
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  const row1 = features.slice(0, 3)
  const row2 = features.slice(3)
  const offset = (S + GAP) / 2
  const overlapY = Math.round(S * 0.30)

  return (
    <section className="py-28 px-6 relative z-10 overflow-hidden">
      <FloatingBackground density="low" />

      {/* CSS vars for responsive sizing */}
      <style>{`
        :root  { 
          --diamond-fill: #fffcf0; 
          --diamond-s: 300px;
        }
        .dark  { --diamond-fill: #0d0d18; }
        
        @media (max-width: 1100px) {
          :root { --diamond-s: 260px; }
        }
        @media (max-width: 640px) {
          :root { --diamond-s: 280px; }
        }
      `}</style>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-300/15 dark:bg-yellow-500/5 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-200/10 dark:bg-teal-500/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-orange-600 dark:text-yellow-500 mb-5 px-4 py-1.5 rounded-full bg-orange-400/10 dark:bg-yellow-400/10 border border-orange-400/20 dark:border-yellow-400/20">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-5" style={{ fontFamily: 'Sora,sans-serif' }}>
            With <span className="text-gradient">Singh Domain</span> You Can
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto text-base leading-relaxed">
            Secure, Web3-native solutions — empowering you to own, manage, and grow your digital identity forever.
          </p>
        </div>

        {/* Responsive Diamond Grid */}
        <div className="flex flex-col items-center">
          {/* Desktop: Staggered Honeycomb (3-3) */}
          <div className="hidden xl:block">
            <div style={{ transform: `translateX(-${offset / 2}px)` }}>
              {/* Row 1 */}
              <div className="flex" style={{ gap: GAP }}>
                {row1.map(f => <DiamondCard key={f.title} {...f} />)}
              </div>
              {/* Row 2 — shifted right */}
              <div
                className="flex"
                style={{ gap: GAP, marginTop: -overlapY, transform: `translateX(${offset}px)` }}
              >
                {row2.map(f => <DiamondCard key={f.title} {...f} />)}
              </div>
            </div>
          </div>

          {/* Tablet: 2-column grid */}
          <div className="hidden md:grid xl:hidden grid-cols-2 gap-x-8 gap-y-16">
             {features.map(f => <DiamondCard key={f.title} {...f} />)}
          </div>

          {/* Mobile: 1-column stack */}
          <div className="grid md:hidden grid-cols-1 gap-y-12">
             {features.map(f => <DiamondCard key={f.title} {...f} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
