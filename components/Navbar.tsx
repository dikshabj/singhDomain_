'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, ShoppingBag, Menu, X, Search } from 'lucide-react'

const TLDS = ['.singh', '.web3', '.crypto', '.nft', '.gaming', '.metaverse', '.usa', '.dao']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [activeTld, setActiveTld] = useState('.singh')
  const [tldIndex, setTldIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowSearch(window.scrollY > window.innerHeight * 0.65)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cycle TLD in the navbar search bar
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

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-blur shadow-2xl' : 'bg-transparent'
      }`}
    >
      {/* Row 1: Logo + Links + Actions */}
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow opacity-40 blur-sm" />
            <img
              src="/images/singh-logo.png"
              alt="Singh Domain Logo"
              className="relative w-10 h-10 rounded-full object-cover shadow-lg ring-1 ring-yellow-500/30"
            />
          </div>
          <span
            className="font-display text-2xl tracking-widest text-[var(--text-primary)] group-hover:text-yellow-400 transition-colors"
            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em' }}
          >
            SINGHDOMAIN
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {['Home', 'How to buy', 'FAQs'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-yellow-400 transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-yellow-400 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link href="/login" className="hidden md:block">
            <button className="btn-gold px-6 py-2.5 rounded-lg text-sm font-semibold relative z-10">
              Login
            </button>
          </Link>

          {/* Cart Icon */}
          <button className="relative p-2 text-[var(--text-secondary)] hover:text-yellow-400 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[var(--text-secondary)] hover:text-yellow-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Row 2: Sticky search bar — slides in below navbar when scrolled */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showSearch ? 'max-h-24 opacity-100 pb-3' : 'max-h-0 opacity-0 pb-0'
        }`}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div
            className="flex items-center rounded-full border px-2 py-1.5 shadow-lg"
            style={{
              background: 'var(--sticky-search-bg)',
              borderColor: 'rgba(245,197,24,0.3)',
              boxShadow: '0 4px 20px rgba(245,197,24,0.12)',
            }}
          >
            {/* Input */}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Find your name."
              className="flex-1 bg-transparent outline-none pl-5 pr-2 py-2 text-sm font-medium"
              style={{ color: 'var(--text-primary)', caretColor: '#F5C518' }}
            />

            {/* Cycling TLD */}
            <span
              className="text-sm font-bold px-3 select-none whitespace-nowrap transition-all duration-300"
              style={{ color: '#F5C518', fontFamily: 'Sora, sans-serif' }}
            >
              {activeTld}
            </span>

            {/* Divider */}
            <div className="w-px h-5 bg-yellow-500/20 mr-1.5" />

            {/* Gold circular search button */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F5C518, #E6B800)',
                boxShadow: '0 0 16px rgba(245,197,24,0.4)',
              }}
            >
              <Search className="w-4 h-4 text-black" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden nav-blur mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4 border border-[var(--border)]">
          {['Home', 'How to buy', 'FAQs'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[var(--text-secondary)] hover:text-yellow-400 transition-colors text-lg"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button className="btn-gold px-6 py-3 rounded-lg text-sm font-semibold w-full mt-2">
            Login
          </button>
        </div>
      )}
    </nav>
  )
}
