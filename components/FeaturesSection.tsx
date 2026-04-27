'use client'
import FloatingBackground from './FloatingBackground'

const S = 300 // diamond container size
const GAP = 6

const features = [
  { icon: '🌐', title: 'Be a Registrar', desc: 'Manage and register your own web3 domains with full control.', color: '#4ECDC4' },
  { icon: '⛓️', title: 'Mint Web3 TLDs', desc: 'Mint your own TLDs and sell them on the marketplace.', color: '#F5C518' },
  { icon: '🛡️', title: 'Own Your Identity', desc: 'Secure your unique digital presence permanently on the blockchain.', color: '#4ECDC4' },
  { icon: '📧', title: 'Web3 Emails', desc: 'Secure decentralized communication with web3-enabled emails.', color: '#FF6B35' },
  { icon: '💳', title: 'Name Your Wallet', desc: 'Personalize your crypto wallet with a human-readable domain.', color: '#F5C518' },
  { icon: '🌍', title: 'Surf the Internet', desc: 'Browse smoothly with web3-enabled DNS resolution.', color: '#4ECDC4' },
]

function DiamondCard({ icon, title, desc, color }: typeof features[0]) {
  return (
    <div style={{ width: S, height: S, position: 'relative', flexShrink: 0 }} className="group">
      {/* Shadow wrapper — drop-shadow respects clip-path */}
      <div
        className="absolute inset-0 transition-all duration-300 group-hover:scale-[1.04]"
        style={{ filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.13))' }}
      >
        {/* Colored border diamond */}
        <div
          className="absolute inset-0"
          style={{ clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)', background: color + '55' }}
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
          top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 44, height: 44, borderRadius: '50%',
          background: color + '25',
          border: `2px solid ${color}80`,
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>

      {/* Content — centered */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
        style={{ paddingTop: 48, paddingBottom: 36, paddingLeft: 44, paddingRight: 44 }}
      >
        <h3
          className="font-bold mb-2 leading-snug"
          style={{ color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Sora,sans-serif', letterSpacing: '0.02em' }}
        >
          {title}
        </h3>
        <p
          style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.55, opacity: 0.85 }}
        >
          {desc}
        </p>
        <div
          className="mt-3 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ background: color + '25', border: `1.5px solid ${color}60`, color }}
        >
          →
        </div>
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

      {/* CSS vars for diamond fill */}
      <style>{`
        :root  { --diamond-fill: #fffcf0; }
        .dark  { --diamond-fill: #0d0d18; }
      `}</style>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-yellow-300/15 dark:bg-yellow-500/5 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal-200/10 dark:bg-teal-500/5 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-yellow-600 dark:text-yellow-500 mb-5 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-5" style={{ fontFamily: 'Sora,sans-serif' }}>
            With <span className="text-gradient">Singh Domain</span> You Can
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto text-base leading-relaxed opacity-80">
            Secure, Web3-native solutions — empowering you to own, manage, and grow your digital identity forever.
          </p>
        </div>

        {/* Diamond honeycomb grid — shift whole group left by offset/2 to keep centered */}
        <div className="flex flex-col items-center">
          <div style={{ transform: `translateX(-${offset / 2}px)` }}>
            {/* Row 1 */}
            <div className="flex" style={{ gap: GAP }}>
              {row1.map(f => <DiamondCard key={f.title} {...f} />)}
            </div>
            {/* Row 2 — shifted right by full offset relative to row 1 */}
            <div
              className="flex"
              style={{ gap: GAP, marginTop: -overlapY, transform: `translateX(${offset}px)` }}
            >
              {row2.map(f => <DiamondCard key={f.title} {...f} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
