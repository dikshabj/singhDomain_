'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Gavel, Tag, Clock, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import { getAuctions, Auction } from '@/lib/auction'
import toast, { Toaster } from 'react-hot-toast'

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false)
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'sale' | 'bidding'>('all')

  useEffect(() => {
    setMounted(true)
    fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    setIsLoading(true)
    try {
      const data = await getAuctions()
      setAuctions(data)
    } catch (error) {
      toast.error('Failed to load auctions')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = (auction.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    if (activeFilter === 'all') return matchesSearch
    if (activeFilter === 'sale') return matchesSearch && auction.sellingStatus === 'For sale'
    if (activeFilter === 'bidding') return matchesSearch && (auction.sellingStatus === 'Open for bidding' || auction.sellingStatus === 'Time Auction')
    return matchesSearch
  })

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />

      <section className="relative pt-24 pb-20 px-6">
        <FloatingBackground density="low" />
        
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                <Gavel className="w-3 h-3" />
                Marketplace
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                Singh Domain <span className="text-gradient">Marketplace</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm max-w-xl">
                The premier marketplace for exclusive digital identities. Buy, sell, and bid on verified domains.
              </p>
            </motion.div>

            {/* Compact Stats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 border-yellow-500/10 flex gap-6 items-center bg-white/5 backdrop-blur-sm"
            >
              <div className="text-center">
                <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider mb-0.5">Live</p>
                <p className="text-xl font-bold">124</p>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div className="text-center">
                <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider mb-0.5">Volume</p>
                <p className="text-xl font-bold text-yellow-500">2.4M</p>
              </div>
            </motion.div>
          </div>

          {/* Controls - More compact */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] focus:outline-none focus:border-yellow-500/50 text-sm transition-all"
              />
            </div>

            <div className="flex p-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-x-auto max-w-full">
              {(['all', 'sale', 'bidding'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    activeFilter === filter 
                      ? 'bg-yellow-500 text-black shadow-md' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'sale' ? 'Fixed Price' : 'Auctions'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid - 4 columns on desktop, smaller cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass-card h-[380px] animate-pulse bg-[var(--bg-secondary)]/50" />
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {filteredAuctions.map((auction) => (
                  <AuctionCard key={auction._id} auction={auction} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredAuctions.length === 0 && (
            <div className="text-center py-20 glass-card border-dashed border-2 border-[var(--border)] rounded-3xl">
              <Search className="w-10 h-10 text-yellow-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-1">No domains found</h3>
              <p className="text-[var(--text-secondary)] text-sm">Try a different search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function AuctionCard({ auction }: { auction: Auction }) {
  const isBidding = auction.sellingStatus === 'Open for bidding' || auction.sellingStatus === 'Time Auction'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group border-yellow-500/5 hover:border-yellow-500/30 shadow-lg flex flex-col transition-all duration-300"
    >
      {/* Image Area - Fixed Aspect Ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
        <img 
          src={auction.postDetails?.photo || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600'} 
          alt={auction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {isBidding ? (
            <div className="px-2 py-1 rounded-md bg-orange-500 text-white text-[8px] font-black uppercase tracking-tighter">
              Auction
            </div>
          ) : (
            <div className="px-2 py-1 rounded-md bg-yellow-500 text-black text-[8px] font-black uppercase tracking-tighter">
              Fixed
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Link 
            href={`/auction/${auction._id}`}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg text-xs font-bold transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-yellow-500/20">
            <img src={auction.userDetails?.pic || 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">@{auction.userDetails?.username || 'user'}</span>
          <ShieldCheck className="w-3 h-3 text-blue-500" />
        </div>

        <h3 className="text-lg font-bold mb-1 truncate leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
          {auction.name}
        </h3>
        <p className="text-[var(--text-secondary)] text-[11px] mb-4 line-clamp-1">
          {auction.description || "Premium Web3 Domain"}
        </p>

        <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <div>
            <p className="text-[var(--text-secondary)] text-[9px] font-bold uppercase tracking-wider mb-0.5">
              Price
            </p>
            <p className="text-lg font-black text-yellow-500">
              {auction.price} <span className="text-[10px] font-medium text-[var(--text-primary)] opacity-50">SINGH</span>
            </p>
          </div>
          <Link href={`/auction/${auction._id}`} className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-yellow-500 transition-all group/btn">
            <ArrowUpRight className="w-4 h-4 text-[var(--text-secondary)] group-hover/btn:text-black" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
