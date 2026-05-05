'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Gavel, Tag, Clock, ShieldCheck, Share2, Heart, 
  ArrowLeft, Wallet, Info, History, ArrowUpRight,
  ChevronRight, Zap
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import { getAuctionById, placeBid, buyNft, Auction } from '@/lib/auction'
import { isLoggedIn } from '@/lib/auth'
import toast, { Toaster } from 'react-hot-toast'

export default function AuctionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchAuctionDetails()
    }
  }, [params.id])

  const fetchAuctionDetails = async () => {
    setIsLoading(true)
    try {
      const data = await getAuctionById(params.id as string)
      setAuction(data)
      if (data.price) setBidAmount((parseFloat(data.price) + 1).toString())
    } catch (error) {
      toast.error('Failed to load auction details')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn()) {
      toast.error('Please login to place a bid')
      router.push('/login')
      return
    }

    if (!bidAmount || parseFloat(bidAmount) <= parseFloat(auction?.price || '0')) {
      toast.error('Bid amount must be higher than current price')
      return
    }

    setIsSubmitting(true)
    try {
      await placeBid(auction!._id, parseFloat(bidAmount))
      toast.success('Bid placed successfully!')
      fetchAuctionDetails() // Refresh data
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to place bid')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBuyNow = async () => {
    if (!isLoggedIn()) {
      toast.error('Please login to buy')
      router.push('/login')
      return
    }

    setIsSubmitting(true)
    try {
      // For buy, we need the user's wallet address. 
      // This usually comes from the logged in user profile
      const profile = JSON.parse(localStorage.getItem('profile') || '{}')
      const walletAddress = profile.walletAddress || '0x0000000000000000000000000000000000000000'
      
      await buyNft(auction!._id, walletAddress)
      toast.success('Purchase successful!')
      router.push('/profile')
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to complete purchase')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Auction not found</h2>
        <Link href="/marketplace" className="text-yellow-500 hover:underline">Back to Marketplace</Link>
      </div>
    )
  }

  const isBidding = auction.sellingStatus === 'Open for bidding' || auction.sellingStatus === 'Time Auction'

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />

      <section className="relative pt-32 pb-20 px-6">
        <FloatingBackground density="low" />
        
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8">
            <Link href="/marketplace" className="hover:text-yellow-500 transition-colors">Marketplace</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--text-primary)] font-medium truncate">{auction.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Media */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-3 border-yellow-500/10 rounded-3xl overflow-hidden aspect-square relative group">
                <img 
                  src={auction.postDetails?.photo || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800'} 
                  alt={auction.name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                   <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all">
                    <Heart className="w-5 h-5" />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all">
                    <Share2 className="w-5 h-5" />
                   </button>
                </div>
              </div>

              {/* Description Tab */}
              <div className="glass-card p-8 border-yellow-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-xl font-bold">About this Asset</h3>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {auction.description || "This premium Web3 domain represents a unique digital identity on the Singh Domain network. It can be used for decentralized websites, wallet masking, and social profiles."}
                </p>
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="text-[var(--text-secondary)] text-xs font-bold uppercase mb-1">Contract Address</p>
                    <p className="text-sm font-mono truncate text-yellow-500">0xSingh...{auction._id.slice(-6)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="text-[var(--text-secondary)] text-xs font-bold uppercase mb-1">Token ID</p>
                    <p className="text-sm font-bold">{auction.tokenID || "9921"}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Info & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 p-0.5">
                    <img 
                      src={auction.userDetails?.pic || 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'} 
                      alt="" 
                      className="w-full h-full rounded-full object-cover border-2 border-[var(--bg-primary)]"
                    />
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)] text-xs font-bold">OWNED BY</p>
                    <p className="font-bold flex items-center gap-1">
                      @{auction.userDetails?.username || 'singh_admin'}
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </p>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {auction.name}
                </h1>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-sm flex items-center gap-2">
                    {isBidding ? <Gavel className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                    {auction.sellingStatus}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Verified Asset
                  </div>
                </div>
              </div>

              {/* Price & Bid Section */}
              <div className="glass-card p-8 border-yellow-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Gavel className="w-32 h-32" />
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-widest mb-2">
                      {isBidding ? 'Current Bid' : 'List Price'}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-yellow-500 tracking-tighter">
                        {auction.price}
                      </span>
                      <span className="text-xl font-bold text-[var(--text-secondary)]">SINGH</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 mt-2">
                      ≈ ${(parseFloat(auction.price) * 0.12).toFixed(2)} USD
                    </p>
                  </div>

                  {isBidding && (
                    <div className="text-right">
                      <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mb-2">Auction Ends In</p>
                      <div className="flex gap-3">
                        <div className="text-center">
                          <p className="text-xl font-bold">02</p>
                          <p className="text-[10px] text-[var(--text-secondary)] uppercase">Days</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">14</p>
                          <p className="text-[10px] text-[var(--text-secondary)] uppercase">Hrs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">45</p>
                          <p className="text-[10px] text-[var(--text-secondary)] uppercase">Min</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isBidding ? (
                  <form onSubmit={handlePlaceBid} className="space-y-4 relative z-10">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-yellow-500">SINGH</div>
                      <input 
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        className="w-full pl-20 pr-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] focus:outline-none focus:border-yellow-500 transition-all font-bold text-lg"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gold py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/20 group"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Place Your Bid
                          <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[var(--text-secondary)] text-xs">
                      Minimum next bid: <span className="text-yellow-500 font-bold">{(parseFloat(auction.price) + 1)} SINGH</span>
                    </p>
                  </form>
                ) : auction.sellingStatus === 'For sale' ? (
                  <button 
                    onClick={handleBuyNow}
                    disabled={isSubmitting}
                    className="w-full btn-gold py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/20 group relative z-10"
                  >
                     {isSubmitting ? (
                        <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Buy Now
                          <Wallet className="w-6 h-6" />
                        </>
                      )}
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-center font-bold">
                    This domain is currently not for sale.
                  </div>
                )}
              </div>

              {/* Bidding History */}
              <div className="glass-card border-yellow-500/10 overflow-hidden">
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-bold">Bidding History</h3>
                  </div>
                  <span className="text-xs font-bold text-[var(--text-secondary)] px-2 py-1 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)]">
                    {auction.biddingHistory?.length || 0} Bids
                  </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
                  {auction.biddingHistory && auction.biddingHistory.length > 0 ? (
                    <div className="space-y-1">
                      {auction.biddingHistory.map((bid, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-yellow-500/5 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-xs font-bold">
                              {bid.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-sm">@{bid.username || 'bidder_x'}</p>
                              <p className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest">
                                {new Date(bid.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-yellow-500">{bid.price} SINGH</p>
                            <p className="text-[10px] text-[var(--text-secondary)] font-bold">OFFER</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[var(--text-secondary)] italic">
                      No bids yet. Be the first to bid!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(to right, #fbbf24, #f59e0b, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(234, 179, 8, 0.4);
        }
      `}</style>
    </main>
  )
}
