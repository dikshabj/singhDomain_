'use client'
import FloatingBackground from './FloatingBackground'

const chains = [
  { name: 'Aurora', color: '#00EC97', letter: 'A', bg: '#003E1F' },
  { name: 'Binance', color: '#F3BA2F', letter: 'B', bg: '#1A1200' },
  { name: 'Polygon', color: '#8247E5', letter: 'P', bg: '#1A0D2E' },
  { name: 'SOLANA', color: '#9945FF', letter: 'S', bg: '#1A0A2E', secondary: '#14F195' },
  { name: 'BASE', color: '#0052FF', letter: 'B', bg: '#001A5C' },
  { name: 'NEAR', color: '#00C08B', letter: 'N', bg: '#00261B' },
]

export default function MintSection() {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <FloatingBackground density="low" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 section-line" />
          <h2 className="text-[var(--text-primary)] text-lg md:text-xl font-bold tracking-widest uppercase text-center">
            AVAILABLE MINT OPTIONS IN FUTURE
          </h2>
          <div className="flex-1 section-line" />
        </div>

        {/* Chain grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {chains.map((chain, i) => (
            <div
              key={chain.name}
              className="mint-card group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Logo circle */}
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold relative overflow-hidden"
                style={{
                  background: chain.bg,
                  border: `1px solid ${chain.color}40`,
                  boxShadow: `0 0 20px ${chain.color}20`,
                  color: chain.color,
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.05em',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                {chain.letter}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{background: `radial-gradient(circle at 50% 50%, ${chain.color}20, transparent 70%)`}} />
              </div>

              {/* Name */}
              <div className="text-[var(--text-primary)] text-sm font-semibold tracking-widest group-hover:text-[var(--gold)] dark:group-hover:text-yellow-400 transition-colors"
                style={{fontFamily:'Sora,sans-serif'}}>
                {chain.name}
              </div>

              {/* Coming soon badge */}
              <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                style={{background:'rgba(255,115,63,0.08)', color:'var(--gold)', border:'1px solid rgba(255,115,63,0.15)'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-yellow-400 animate-pulse" />
                Soon
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
