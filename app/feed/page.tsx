'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Hash, TrendingUp, Users, Home, Search, Bell, Mail, User as UserIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import PostCard from '@/components/PostCard'
import CreatePostModal from '@/components/CreatePostModal'
import Sidebar from '@/components/Sidebar'
import UserSearch from '@/components/UserSearch'
import { Post, getAllPosts, getTrendingTags } from '@/lib/post'
import { isLoggedIn, getProfile, getRecommendedUsers, followUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function FeedPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'following'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([])
  const [trendingTags, setTrendingTags] = useState<any[]>([])

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    setUser(getProfile())
    fetchPosts()
    fetchRecommended()
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      const data = await getTrendingTags()
      if (Array.isArray(data) && data.length > 0) {
        setTrendingTags(data)
      }
    } catch {
      // silently fail — fallback UI is shown when trendingTags is empty
    }
  }

  const fetchRecommended = async () => {
    try {
      const data = await getRecommendedUsers()
      setRecommendedUsers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await getAllPosts(1)
      setPosts(data)
    } catch (error) {
      toast.error('Failed to load feed')
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
          
          {/* Left Sidebar - Navigation */}
          <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 h-fit">
            <Sidebar onPostClick={() => setIsModalOpen(true)} />
          </div>

          {/* Main Feed */}
          <div className="col-span-1 lg:col-span-6 space-y-6">
            {/* Feed Tabs */}
            <div className="glass-card p-1 flex gap-2 mb-6">
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-[var(--text-secondary)] hover:bg-yellow-500/5'}`}
              >
                For You
              </button>
              <button 
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'following' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-[var(--text-secondary)] hover:bg-yellow-500/5'}`}
              >
                Following
              </button>
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium animate-pulse text-yellow-500">Loading your feed...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center space-y-4">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto text-yellow-500">
                  <Plus size={40} />
                </div>
                <h3 className="text-xl font-bold">No posts found</h3>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto">
                  Be the first to share something amazing with the SinghDomain community!
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-gold px-8 py-3 rounded-xl font-bold"
                >
                  Create First Post
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Trending */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
            <UserSearch />
            
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6 text-yellow-500">
                <TrendingUp size={20} />
                <h3 className="font-bold">Trending Topics</h3>
              </div>
              <div className="space-y-4">
                {trendingTags.length > 0 ? (
                  trendingTags.slice(0, 5).map((tag, i) => (
                    <TrendingItem key={tag._id || i} tag={tag.hashtag} count={`${tag.count || 0}`} />
                  ))
                ) : (
                  <>
                    <TrendingItem key="tech" tag="Technology" count="posts" />
                    <TrendingItem key="web3" tag="Web3" count="posts" />
                    <TrendingItem key="design" tag="Design" count="posts" />
                  </>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
               <h3 className="font-bold mb-4">Who to follow</h3>
               <div className="space-y-4">
                 {recommendedUsers.length > 0 ? (
                   recommendedUsers.slice(0, 4).map((rec) => (
                     <FollowItem 
                       key={rec._id} 
                       name={rec.fullName || rec.username} 
                       username={rec.username} 
                       pic={rec.pic}
                       onFollowSuccess={fetchRecommended}
                     />
                   ))
                 ) : (
                   <div className="text-[10px] text-[var(--text-secondary)] italic">No suggestions available</div>
                 )}
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Create Post Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-2xl shadow-yellow-500/40 active:scale-90 transition-transform z-50"
      >
        <Plus size={28} />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <CreatePostModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={fetchPosts} 
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function TrendingItem({ tag, count }: { tag: string, count: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold group-hover:text-yellow-500 transition-colors">#{tag}</span>
        <span className="text-[10px] text-[var(--text-secondary)]">{count} posts</span>
      </div>
    </div>
  )
}

function FollowItem({ name, username, pic, onFollowSuccess }: { name: string, username: string, pic?: string, onFollowSuccess: () => void }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    setLoading(true)
    try {
      await followUser(username)
      setIsFollowing(true)
      toast.success(`Following @${username}`)
      onFollowSuccess()
    } catch (error) {
      toast.error('Action failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 overflow-hidden flex items-center justify-center text-[10px] font-bold text-yellow-500 border border-yellow-500/10">
          {pic ? (
            <img src={pic} alt="" className="w-full h-full object-cover" />
          ) : (
            username[0].toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold truncate">{name}</h4>
          <p className="text-[10px] text-[var(--text-secondary)] truncate">@{username}</p>
        </div>
      </div>
      <button 
        onClick={handleFollow}
        disabled={loading || isFollowing}
        className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all active:scale-95 disabled:opacity-50 ${isFollowing ? 'bg-white/5 text-[var(--text-secondary)]' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}
      >
        {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}
