'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-blur py-3 shadow-2xl' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow opacity-70 blur-sm" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-lg">
              S
            </div>
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
