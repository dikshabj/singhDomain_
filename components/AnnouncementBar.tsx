'use client'
export default function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden z-40 h-10 flex items-center" style={{
      background: 'linear-gradient(90deg, #0a0a0a, #1a1200, var(--gold) 40%, var(--gold) 60%, #1a1200, #0a0a0a)',
      backgroundSize: '200% 100%',
      animation: 'sweepGold 5s ease infinite'
    }}>
      {/* Marquee content */}
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-12 text-black font-semibold text-sm" style={{fontFamily:'Sora,sans-serif'}}>
            <span>🚀</span>
            <span className="font-bold">LIMITED TIME OFFER!</span>
            <span>🚀</span>
            <span>Get</span>
            <span className="font-black text-red-700 mx-1">50% OFF</span>
            <span>on all DOMAINS</span>
            <span>🚀</span>
            <span className="mx-6">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
