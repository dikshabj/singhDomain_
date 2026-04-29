'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

const TLDS = ['.singh', '.web3', '.crypto', '.nft', '.gaming', '.metaverse', '.usa', '.dao']

export default function StickySearchBar() {
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTld, setActiveTld] = useState('.singh')
  const [tldIndex, setTldIndex] = useState(0)

  // Show bar after scrolling past hero (~80vh)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cycle TLD display in the bar
  useEffect(() => {
    const interval = setInterval(() => {
      setTldIndex(i => {
        const next = (i + 1) % TLDS.length
        setActiveTld(TLDS[next])
        return next
      })
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        visible ? 'top-[72px] opacity-100 translate-y-0' : '-top-24 opacity-0 -translate-y-4'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4">
        <div
          className="flex items-center rounded-full px-2 py-2 shadow-2xl border"
          style={{
            background: 'var(--sticky-search-bg)',
            borderColor: 'var(--sticky-search-border)',
            boxShadow: '0 8px 40px var(--gold-glow), 0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          {/* Input */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Find your name."
            className="flex-1 bg-transparent outline-none px-5 py-2 text-base font-medium"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--gold)' }}
          />

          {/* TLD display — cycling */}
          <span
            className="text-base font-bold px-4 transition-all duration-300 select-none"
            style={{ color: 'var(--gold)', fontFamily: 'Sora, sans-serif' }}
          >
            {activeTld}
          </span>

          {/* Dot separator */}
          <div className="w-px h-6 bg-orange-500/20 dark:bg-yellow-500/20 mx-1" />

          {/* Search button */}
          <button
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--gold), #E85D20)',
              boxShadow: '0 0 20px var(--gold-glow)',
            }}
          >
            <Search className="w-5 h-5 text-black" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
