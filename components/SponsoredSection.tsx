'use client'

const sponsoredTLDs = [
  { name: '.metaverse', price: '5.00' },
  { name: '.usa', price: '5.00' },
  { name: '.gaming', price: '5.00' },
  { name: '.singh', price: '5.00' },
]

export default function SponsoredSection() {
  return (
    <section className="py-24 px-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{background:'radial-gradient(circle, rgba(245,197,24,0.05), transparent 70%)'}} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex-1 section-line" />
          <h2 className="text-[var(--text-primary)] text-xl font-bold tracking-widest uppercase flex items-center gap-3">
            <span className="text-yellow-400">👑</span>
            SPONSORED
            <span className="text-yellow-400">👑</span>
          </h2>
          <div className="flex-1 section-line" />
        </div>

        {/* Outer gold border container */}
        <div className="relative p-1 rounded-3xl" style={{
          background: 'linear-gradient(135deg, #F5C518, #8B6A00, #F5C518, #8B6A00)',
          backgroundSize: '300% 300%',
          animation: 'shimmer 4s ease infinite'
        }}>
          <div className="rounded-3xl p-6" style={{background:'var(--bg-secondary)'}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sponsoredTLDs.map((tld, i) => (
                <div
                  key={tld.name}
                  className="sponsored-card group cursor-pointer"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Sponsored badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-yellow-400 text-sm">👑</span>
                    <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">SPONSORED</span>
                  </div>

                  {/* TLD name */}
                  <div className="text-[var(--text-primary)] text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors" style={{fontFamily:'Sora,sans-serif', fontWeight:700}}>
                    {tld.name}
                  </div>

                  {/* Price */}
                  <div className="text-[var(--text-secondary)] text-sm mb-1 opacity-70">SLDs starting at:</div>
                  <div className="text-[var(--text-primary)] text-2xl font-bold">
                    $ {tld.price}
                  </div>

                  {/* CTA */}
                  <button className="mt-5 w-full btn-outline py-2.5 rounded-xl text-sm font-semibold group-hover:bg-yellow-400/10 transition-all">
                    Register Now →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
