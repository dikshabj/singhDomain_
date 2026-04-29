'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, ShoppingBag, Menu, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TLDS = ['.singh', '.web3', '.crypto', '.nft', '.gaming', '.metaverse', '.usa', '.dao']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-blur shadow-2xl border-b border-yellow-500/10' : 'bg-transparent'
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
            WEB3 DOMAINS
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
        <div className="flex items-center gap-3">
          {/* Expandable Search */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden mr-2"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search domains..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-full px-4 py-1.5 text-sm outline-none focus:border-yellow-500/40 transition-all"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded)
                if (!isSearchExpanded) setTimeout(() => searchInputRef.current?.focus(), 100)
              }}
              className={`p-2 rounded-lg transition-all ${isSearchExpanded ? 'text-yellow-400 bg-yellow-500/10' : 'text-[var(--text-secondary)] hover:text-yellow-400'}`}
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

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
