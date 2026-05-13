'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, Hash, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import { getAllPosts, Post } from '@/lib/post'
import PostCard from '@/components/PostCard'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function ExplorePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExploreContent()
  }, [])

  const fetchExploreContent = async () => {
    try {
      setIsLoading(true)
      const data = await getAllPosts(1)
      setPosts(data)
    } catch (error) {
      toast.error('Failed to load explore content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />
      <FloatingBackground density="low" />

      <section className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Search Header */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-yellow-500 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search SinghDomain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-yellow-500/50 transition-all text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Trending Section */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6 text-yellow-500">
                  <TrendingUp size={20} />
                  <h3 className="font-bold">Trending for you</h3>
                </div>
                <div className="space-y-6">
                  <TrendingItem tag="SinghDomain" count="12.5K" />
                  <TrendingItem tag="CryptoRealEstate" count="8.2K" />
                  <TrendingItem tag="Web3Property" count="5.4K" />
                  <TrendingItem tag="SinghCoin" count="3.1K" />
                  <TrendingItem tag="MetaMask" count="1.9K" />
                </div>
              </div>
            </div>

            {/* Content Feed */}
            <div className="lg:col-span-8">
              <h2 className="text-xl font-bold mb-6">Explore Posts</h2>
              {isLoading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function TrendingItem({ tag, count }: { tag: string, count: string }) {
  return (
    <div className="group cursor-pointer space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-secondary)]">Trending in Real Estate</span>
        <Hash size={12} className="text-[var(--text-secondary)]" />
      </div>
      <h4 className="font-bold group-hover:text-yellow-500 transition-colors">#{tag}</h4>
      <p className="text-[10px] text-[var(--text-secondary)]">{count} posts</p>
    </div>
  )
}
