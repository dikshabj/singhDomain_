'use client'
import Link from 'next/link'

const socials = [
  { icon: 'T', label: 'Twitter', href: '#', color: '#1DA1F2' },
  { icon: 'I', label: 'Instagram', href: '#', color: '#E1306C' },
  { icon: 'F', label: 'Facebook', href: '#', color: '#1877F2' },
  { icon: 'in', label: 'LinkedIn', href: '#', color: '#0A66C2' },
  { icon: '✈', label: 'Telegram', href: '#', color: '#229ED9' },
]

export default function Footer() {
  return (
    <>
      {/* Community Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Pink/purple glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
          style={{background:'radial-gradient(ellipse, rgba(180,0,255,0.12), transparent 70%)', filter:'blur(40px)'}} />

        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-10">Join the Community</h2>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-black font-bold text-lg transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: `linear-gradient(135deg, #F5C518, #E6A800)`,
                  boxShadow: '0 4px 20px rgba(245,197,24,0.3)',
                  fontFamily: s.icon.length > 1 ? 'inherit' : 'inherit'
                }}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-16 relative" style={{borderColor:'var(--border)', background:'var(--bg-primary)'}}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">
                S
              </div>
              <span className="text-[var(--text-primary)] text-2xl font-bold" style={{fontFamily:'Bebas Neue', letterSpacing:'0.15em'}}>
                SINGH
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed opacity-70">
              Singh domains are more than just web3 domains.
            </p>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-5 uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-3">
              {['About', 'App', 'Premium DNS', 'Become a partner'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-[var(--text-secondary)] hover:text-yellow-400 transition-colors text-sm flex items-center gap-2 opacity-80 hover:opacity-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/50" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App downloads */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-5 uppercase tracking-widest text-sm">Download Singh Social Media app:</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:border-yellow-400/30"
                style={{background:'var(--bg-card)', border:'1px solid var(--border)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#34A853"><path d="M3.18 23.76c.33.18.7.24 1.06.19l11.47-11.47L12.42 9.2z M.29 2.05C.1 2.42 0 2.85 0 3.35v17.3c0 .5.1.93.29 1.3l.1.09 9.69-9.69v-.23L.39 1.96zM19.44 9.33l-2.74-1.56L13.5 11l3.2 3.2 2.74-1.56c.78-.44.78-1.87 0-2.31zM4.24.05L15.71 11.52 12.42 14.8l-8.18-8.18c-.55-.55-.6-1.4-.1-2z"/></svg>
                <div>
                  <div className="text-[var(--text-secondary)] text-xs opacity-60">GET IT ON</div>
                  <div className="text-[var(--text-primary)] text-sm font-semibold">Google Play</div>
                </div>
              </a>
              <a href="https://apps.apple.com/in/app/singhcoin/id1634159563" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:border-yellow-400/30"
                style={{background:'var(--bg-card)', border:'1px solid var(--border)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--text-primary)]"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div className="text-[var(--text-secondary)] text-xs opacity-60">Download on the</div>
                  <div className="text-[var(--text-primary)] text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 text-center text-[var(--text-secondary)] text-sm opacity-60"
          style={{borderTop:'1px solid var(--border)'}}>
          © Singhcoin, All Right Reserved.
        </div>
      </footer>
    </>
  )
}
