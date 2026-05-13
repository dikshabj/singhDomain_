'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon, ShoppingBag, Menu, X, Search, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getProfile, clearProfile, isLoggedIn as checkLoggedIn, getUserProfile, updateSavedProfile } from '@/lib/auth'

import { API_URL } from '@/lib/api'

const getImageUrl = (path?: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [profilePic, setProfilePic] = useState('')
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const refreshProfile = () => {
      const profile = getProfile()
      if (profile?.Token) {
        setLoggedIn(true)
        setUserEmail(profile.email || '')
        setProfilePic(profile.profilePic || profile.pic || '')
      }
    }

    refreshProfile()
    window.addEventListener('profileUpdate', refreshProfile)
    window.addEventListener('storage', refreshProfile)

    // Sync fresh profile from backend to catch any stale localStorage pic
    const syncProfileFromBackend = async () => {
      const profile = getProfile()
      if (!profile?.Token) return
      try {
        const response = await getUserProfile()
        if (response?.success && response.data) {
          const freshPic = response.data.profilePic || response.data.pic || ''
          updateSavedProfile(response.data)
          if (freshPic) setProfilePic(freshPic)
        }
      } catch {
        // silently fail — offline or token expired
      }
    }
    syncProfileFromBackend()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('profileUpdate', refreshProfile)
      window.removeEventListener('storage', refreshProfile)
    }
  }, [])

  const handleLogout = () => {
    clearProfile()
    setLoggedIn(false)
    setUserEmail('')
    router.push('/')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const { searchDomain } = await import('@/lib/domain')
    setIsSearching(true)
    try {
      const data = await searchDomain(searchQuery)
      setResults(data)
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleBuyDomain = async (domainName: string) => {
    if (!loggedIn) {
      toast.error('Please login to buy domains');
      router.push('/login');
      return;
    }
    
    try {
      toast.loading('Initiating purchase...', { id: 'buy-domain' });
      const { buyDomain } = await import('@/lib/domain');
      const response = await buyDomain(domainName);
      
      if (response.success && response.paymentIntent) {
        toast.success('Redirecting to payment...', { id: 'buy-domain' });
        // If it's a paypal link, redirect there
        if (response.paymentIntent.links) {
          const approveLink = response.paymentIntent.links.find((l: any) => l.rel === 'approve');
          if (approveLink) {
            window.location.href = approveLink.href;
            return;
          }
        }
        router.push('/profile');
      } else if (response.error) {
        toast.error(response.error, { id: 'buy-domain' });
      } else if (response.message) {
        toast.error(response.message, { id: 'buy-domain' });
      } else {
        toast.error('Failed to initiate purchase', { id: 'buy-domain' });
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error initiating purchase';
      toast.error(msg, { id: 'buy-domain' });
    }
  }

  if (!mounted) return null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 dark:from-yellow-400 dark:to-yellow-600 animate-pulse-slow opacity-40 blur-sm" />
                <img
                  src="/images/singh-logo.png"
                  alt="Singh Domain Logo"
                  className="relative w-10 h-10 rounded-full object-cover shadow-lg ring-1 ring-orange-500/30 dark:ring-yellow-500/30"
                />
              </div>
              <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:text-yellow-400 transition-colors">
                SinghDomain
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {!isSearchExpanded && [
                { name: 'Home', href: '/' },
                { name: 'Marketplace', href: '/marketplace' },
                { name: 'Domains', href: '/domains' },
                { name: 'Referral', href: '/referral' },
                { name: 'Feed', href: '/feed' },
                { name: 'Profile', href: '/profile' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs md:text-sm font-bold text-[var(--text-secondary)] hover:text-yellow-400 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Navbar Search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: typeof window !== 'undefined' && window.innerWidth < 1024 ? 200 : 350, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-full mr-2"
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search domains..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-yellow-500/5 border border-yellow-500/20 rounded-full px-4 py-1.5 text-sm outline-none focus:border-yellow-500/40 transition-all text-[var(--text-primary)]"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-3 h-3 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
                        </div>
                      )}
                      
                      {results.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full right-0 mt-2 w-[300px] glass-card border-yellow-500/20 shadow-2xl p-3 overflow-hidden"
                        >
                          <div className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {results.map((res, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-all">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold truncate">{res.name}</p>
                                  <p className="text-[8px] font-bold text-green-500 uppercase">{res.availabilityStatus}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-black text-yellow-500">${res.price}</p>
                                  <button 
                                    onClick={() => handleBuyDomain(res.name)}
                                    className="px-2 py-1 bg-yellow-500 text-black rounded text-[9px] font-bold hover:scale-105 active:scale-95 transition-all"
                                  >
                                    Buy
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  setIsSearchExpanded(!isSearchExpanded)
                  if (!isSearchExpanded) {
                    setTimeout(() => searchInputRef.current?.focus(), 100)
                  } else {
                    setResults([])
                  }
                }}
                className={`p-1.5 md:p-2 rounded-lg transition-all ${isSearchExpanded ? 'text-yellow-400 bg-yellow-500/10' : 'text-[var(--text-secondary)] hover:text-yellow-400'}`}
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 md:p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--gold)] dark:hover:text-yellow-400 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            {loggedIn ? (
              <div className="flex items-center gap-1.5 md:gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-all"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black text-xs font-black overflow-hidden border border-yellow-500/20">
                    {profilePic ? (
                      <img 
                        src={getImageUrl(profilePic)} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      userEmail.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden lg:block text-xs md:text-sm font-bold text-[var(--text-primary)]">
                    {userEmail.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 md:p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="btn-gold px-4 md:px-6 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-bold">
                  Login
                </button>
              </Link>
            )}

            <button className="relative p-1.5 md:p-2 text-[var(--text-secondary)] hover:text-yellow-400 transition-colors">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden text-[var(--text-secondary)] hover:text-yellow-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--bg-primary)] border-t border-[var(--border)] overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Marketplace', href: '/marketplace' },
                { name: 'Domains', href: '/domains' },
                { name: 'Referral', href: '/referral' },
                { name: 'Feed', href: '/feed' },
                { name: 'Profile', href: '/profile' }
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[var(--text-secondary)] py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!loggedIn && (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <button className="btn-gold w-full py-3 rounded-xl font-bold">Login</button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
