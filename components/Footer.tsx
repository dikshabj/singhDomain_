'use client'
import Link from 'next/link'
import FloatingBackground from './FloatingBackground'

const socials = [
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: 'X', href: 'https://x.com/SinghTheApp', color: '#1DA1F2' },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>, label: 'Instagram', href: 'https://www.instagram.com/singhtheapp/', color: '#E1306C' },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>, label: 'Facebook', href: 'https://www.facebook.com/singhtheapp', color: '#1877F2' },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>, label: 'LinkedIn', href: 'https://www.linkedin.com/company/singhtheapp', color: '#0A66C2' },
  { icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ transform: "translate(-1px, 1px)" }}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12.32 12.32 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>, label: 'Telegram', href: 'https://t.me/group_singhtheapp', color: '#229ED9' },
]

export default function Footer() {
  return (
    <>
      {/* Community Section */}
      <section className="py-20 px-6 relative z-10 overflow-hidden">
        <FloatingBackground density="low" />
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
                  background: `linear-gradient(135deg, var(--gold), #E85D20)`,
                  boxShadow: '0 4px 20px var(--gold-glow)',
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
      <footer className="border-t px-6 pt-16 pb-6 relative" style={{borderColor:'var(--border)', background:'var(--bg-primary)'}}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/5 p-1 border border-orange-500/20 dark:border-yellow-500/20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-yellow-400 dark:to-yellow-600 opacity-20 blur-sm" />
                <img
                  src="/images/singh-logo.png"
                  alt="SinghDomain Logo"
                  className="relative w-full h-full object-contain rounded-full"
                />
              </div>
              <span className="text-[var(--text-primary)] text-2xl font-bold" style={{fontFamily:'Bebas Neue', letterSpacing:'0.15em'}}>
                SINGHDOMAIN
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Singh domains are more than just web3 domains.
            </p>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-5 uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: 'https://singhcoin.io' },
                { label: 'App', href: 'https://app.singhcoin.io' },
                { label: 'Premium DNS', href: '/' },
                { label: 'Become a partner', href: '/' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400/50 dark:bg-yellow-400/50" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App downloads */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-5 uppercase tracking-widest text-sm">Download Singh Social Media app:</h4>
            <div className="flex flex-col gap-3">
              <a href="https://play.google.com/store/apps/details?id=com.smartgenesis.singhcoin.singhcoin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:border-orange-400/30 dark:hover:border-yellow-400/30"
                style={{background:'var(--bg-secondary)', border:'1px solid var(--border)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#34A853"><path d="M3.18 23.76c.33.18.7.24 1.06.19l11.47-11.47L12.42 9.2z M.29 2.05C.1 2.42 0 2.85 0 3.35v17.3c0 .5.1.93.29 1.3l.1.09 9.69-9.69v-.23L.39 1.96zM19.44 9.33l-2.74-1.56L13.5 11l3.2 3.2 2.74-1.56c.78-.44.78-1.87 0-2.31zM4.24.05L15.71 11.52 12.42 14.8l-8.18-8.18c-.55-.55-.6-1.4-.1-2z"/></svg>
                <div>
                  <div className="text-[var(--text-secondary)] text-xs">GET IT ON</div>
                  <div className="text-[var(--text-primary)] text-sm font-semibold">Google Play</div>
                </div>
              </a>
              <a href="https://apps.apple.com/in/app/singhcoin/id1634159563" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:border-orange-400/30 dark:hover:border-yellow-400/30"
                style={{background:'var(--bg-secondary)', border:'1px solid var(--border)'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--text-primary)]"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div className="text-[var(--text-secondary)] text-xs">Download on the</div>
                  <div className="text-[var(--text-primary)] text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 text-center text-[var(--text-secondary)] text-sm"
          style={{borderTop:'1px solid var(--border)'}}>
          <p className="mb-2">© Singhcoin, All Right Reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="https://singhcoin.io/privacypolicy.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="https://singhcoin.io/tnc.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </>
  )
}
