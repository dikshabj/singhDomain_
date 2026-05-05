'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Camera, Save, LogOut, ChevronRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import { getUserProfile, updateUserProfile, clearProfile, isLoggedIn, getProfile } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await getUserProfile()
        if (response.success) {
          const data = response.data
          setUser(data)
          setFullName(data.fullName || '')
          setBio(data.bio || '')
          setCompanyName(data.companyName || '')
        }
      } catch (error) {
        toast.error('Failed to fetch profile details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const response = await updateUserProfile({ fullName, bio, companyName })
      toast.success('Profile updated successfully!')
      // Update local user state
      setUser({ ...user, fullName, bio, companyName })
    } catch (error) {
      toast.error('Update failed. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = () => {
    clearProfile()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />

      <section className="relative z-10 pt-32 pb-20 px-6 min-h-screen">
        <FloatingBackground density="low" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Sidebar/Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="glass-card p-6 border-yellow-500/10">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-black overflow-hidden border-4 border-[var(--bg-secondary)] shadow-xl">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.username?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                      <Camera size={16} />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold">{user?.username}</h2>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">{user?.email}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
                    <Shield size={12} />
                    {user?.accountType || 'Personal Account'}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors group"
                  >
                    <span className="flex items-center gap-3 font-semibold">
                      <LogOut size={18} />
                      Logout
                    </span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content/Form */}
            <div className="md:col-span-2">
              <div className="glass-card p-8 md:p-10 border-yellow-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                    <User size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Profile Settings</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Update your personal information</p>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-yellow-500/50 focus:outline-none transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Company</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-yellow-500/50 focus:outline-none transition-all"
                        placeholder="Company name (optional)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-yellow-500/50 focus:outline-none transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn-gold px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 group disabled:opacity-70"
                    >
                      {isUpdating ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save size={18} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
