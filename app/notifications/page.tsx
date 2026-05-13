'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Heart, MessageCircle, UserPlus, Clock, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import { getNotifications, Notification } from '@/lib/notification'
import { isLoggedIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await getNotifications(0)
      setNotifications(data)
    } catch (error) {
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (key: string) => {
    switch (key) {
      case 'Like': return <Heart size={18} className="text-yellow-500 fill-yellow-500" />
      case 'Comment': return <MessageCircle size={18} className="text-blue-500" />
      case 'Follow': return <UserPlus size={18} className="text-green-500" />
      default: return <Bell size={18} className="text-yellow-500" />
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />
      <FloatingBackground density="low" />

      <section className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium animate-pulse text-yellow-500">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 flex gap-4 items-start border-l-4 ${notification.read ? 'border-transparent' : 'border-yellow-500'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 overflow-hidden border border-yellow-500/10">
                    {notification.user?.pic ? (
                      <img src={notification.user.pic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-lg font-bold text-yellow-500">
                        {notification.user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getIcon(notification.key)}
                      <p className="text-sm">
                        <span className="font-bold text-yellow-500">@{notification.user?.username}</span>
                        {' '}{notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                      <Clock size={10} />
                      <span>{formatDistanceToNow(new Date(notification.createdAt))} ago</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto text-yellow-500">
                <Bell size={40} />
              </div>
              <h3 className="text-xl font-bold">No notifications yet</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                When someone interacts with your posts, you'll see it here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
