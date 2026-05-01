'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon, ShoppingBag, Menu, X, Search, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProfile, clearProfile, isLoggedIn as checkLoggedIn } from '@/lib/auth'

const TLDS = ['.singh', '.web3', '.crypto', '.nft', '.gaming', '.metaverse', '.usa', '.dao']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Check auth status
    const profile = getProfile()
    if (profile?.Token) {
      setLoggedIn(true)
      setUserEmail(profile.email || '')
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    clearProfile()
    setLoggedIn(false)
    setUserEmail('')
    router.push('/')
  }

  // if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-blur shadow-2xl border-b border-yellow-500/10' : 'bg-transparent'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-yellow-400 dark:to-yellow-600 animate-pulse-slow opacity-40 blur-sm" />
            <img
              src="/images/singh-logo.png"
              alt="Singh Domain Logo"
              className="relative w-10 h-10 rounded-full object-cover shadow-lg ring-1 ring-orange-500/30 dark:ring-yellow-500/30"
            />
          </div>
          <span
            className="font-display text-lg sm:text-xl md:text-2xl tracking-widest text-[var(--text-primary)] group-hover:text-[var(--gold)] dark:group-hover:text-yellow-400 transition-colors"
            style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em' }}
          >
            SINGHDOMAIN
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {['Home', 'How to buy', 'FAQs'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] dark:bg-yellow-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden mr-1 md:mr-2"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm outline-none focus:border-yellow-500/40 transition-all"
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
              className={`p-1.5 md:p-2 rounded-lg transition-all ${isSearchExpanded ? 'text-yellow-400 bg-yellow-500/10' : 'text-[var(--text-secondary)] hover:text-yellow-400'}`}
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          {loggedIn ? (
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="flex items-center gap-2 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg bg-orange-500/10 dark:bg-yellow-500/10 border border-orange-500/20 dark:border-yellow-500/20">
                <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-yellow-400 dark:to-yellow-600 flex items-center justify-center text-black text-[9px] md:text-xs font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block text-xs md:text-sm text-[var(--text-primary)] font-medium max-w-[120px] truncate">{userEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-400 hover:border-red-400/30 transition-all"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex">
              <button className="btn-gold px-2.5 md:px-6 py-1.5 md:py-2.5 rounded-lg text-[9px] md:text-sm font-semibold relative z-10 whitespace-nowrap">
                Login
              </button>
            </Link>
          )}

          <button className="relative p-1.5 md:p-2 text-[var(--text-secondary)] hover:text-yellow-400 transition-colors">
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-orange-400 dark:bg-yellow-400 text-black text-[7px] md:text-xs w-2.5 h-2.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden text-[var(--text-secondary)] hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {menuOpen && (
        <div className="md:hidden nav-blur mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4 border border-[var(--border)]">
          {['Home', 'How to buy', 'FAQs'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[var(--text-secondary)] hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-colors text-lg"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          {loggedIn ? (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-yellow-400 dark:to-yellow-600 flex items-center justify-center text-black text-sm font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-[var(--text-primary)] font-medium truncate max-w-[160px]">{userEmail}</span>
              </div>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <button className="btn-gold px-6 py-3 rounded-lg text-sm font-semibold w-full mt-2">
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
