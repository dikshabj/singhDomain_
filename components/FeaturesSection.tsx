'use client'

const features = [
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="#4ECDC4" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
        <path d="M7 15h.01M12 15h2"/>
      </svg>
    ),
    title: 'BE A REGISTRAR',
    desc: 'Take charge by managing and registering your own web3 domains.',
    color: '#4ECDC4',
    bg: 'rgba(78,205,196,0.05)'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="#4ECDC4" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M6 3l6 3 6-3v12l-6 3-6-3V3z"/>
        <path d="M12 6v12M6 3l6 3M18 3l-6 3"/>
      </svg>
    ),
    title: 'MINT WEB3 TLDS',
    desc: 'Mint your own TLDs and sell them on the marketplace.',
    color: '#4ECDC4',
    bg: 'rgba(78,205,196,0.05)'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="#4ECDC4" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'OWN YOUR DIGITAL IDENTITY',
    desc: 'Secure your unique presence in the digital world.',
    color: '#4ECDC4',
    bg: 'rgba(78,205,196,0.05)'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="#F5C518" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    title: 'CHAT WITH WEB3 EMAILS',
    desc: 'Enjoy secure and efficient communication with web3-enabled emails.',
    color: '#F5C518',
    bg: 'rgba(245,197,24,0.05)'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="#FF6B6B" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    title: 'NAME YOUR WALLET',
    desc: 'Personalize your cryptocurrency wallet with a distinctive web3 domain.',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.05)'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" stroke="#aaa" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: 'SURF THE INTERNET',
    desc: 'Experience smooth browsing with web3-enabled DNS.',
    color: '#aaa',
    bg: 'rgba(170,170,170,0.03)'
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <div className="flex-1 section-line" />
          <h2 className="text-[var(--text-primary)] text-2xl font-bold tracking-widest text-center whitespace-nowrap">
            WITH <span className="text-yellow-400">SINGH DOMAIN</span> YOU CAN
          </h2>
          <div className="flex-1 section-line" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card group"
              style={{
                background: `linear-gradient(135deg, ${f.bg}, transparent)`,
                animationDelay: `${i * 0.1}s`
              }}
            >
              {/* Icon */}
              <div className="mb-5 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{background: f.bg, border: `1px solid ${f.color}20`}}>
                {f.icon}
              </div>

              {/* Title */}
              <h3 className="text-[var(--text-primary)] font-bold text-lg mb-3 tracking-wide group-hover:text-yellow-400 transition-colors" style={{fontFamily:'Sora,sans-serif'}}>
                {f.title}
              </h3>

              {/* Desc */}
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed opacity-80">
                {f.desc}
              </p>

              {/* Arrow */}
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                style={{color: f.color}}>
                Learn more
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
