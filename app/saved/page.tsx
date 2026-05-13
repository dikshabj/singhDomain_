'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, ArrowLeft, Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import FloatingBackground from '@/components/FloatingBackground'
import PostCard from '@/components/PostCard'
import { Post, getSavedPosts } from '@/lib/post'
import { isLoggedIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

export default function SavedPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    fetchSavedPosts()
  }, [])

  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getSavedPosts(1)
      setPosts(data)
    } catch (error) {
      console.error('Failed to load saved posts', error)
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 h-fit">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-6 space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <button 
                onClick={() => router.back()}
                className="p-2 bg-yellow-500/10 text-yellow-500 rounded-full hover:bg-yellow-500/20 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-yellow-500">Saved Posts</h1>
                <p className="text-xs text-[var(--text-secondary)]">Posts you've bookmarked for later</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium animate-pulse text-yellow-500">Fetching your bookmarks...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center space-y-6 border-yellow-500/10">
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto text-yellow-500">
                  <Bookmark size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No saved posts yet</h3>
                  <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto">
                    Click the bookmark icon on any post to save it here for later reference.
                  </p>
                </div>
                <button 
                  onClick={() => router.push('/feed')}
                  className="btn-gold px-8 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20"
                >
                  Explore Feed
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Empty or Stats */}
          <div className="hidden lg:block lg:col-span-3">
             <div className="glass-card p-6 border-yellow-500/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                   <Bookmark size={18} className="text-yellow-500" />
                   Saved Collection
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                   Your saved posts are private and only visible to you. You can organize them here in the future.
                </p>
             </div>
          </div>
        </div>
      </section>
    </main>
  )
}
