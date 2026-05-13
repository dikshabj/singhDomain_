'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Camera, Save, LogOut, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import FloatingBackground from '@/components/FloatingBackground'
import Sidebar from '@/components/Sidebar'
import { getUserProfile, updateUserProfile, clearProfile, isLoggedIn, getProfile, updateProfilePic, updateSavedProfile } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [companyName, setCompanyName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      await updateUserProfile({ fullName, bio, companyName })
      toast.success('Profile updated successfully!')
      const updatedData = { fullName, bio, companyName }
      setUser({ ...user, ...updatedData })
      updateSavedProfile(updatedData)
    } catch (error) {
      toast.error('Update failed. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Immediately show a local preview
    const previewUrl = URL.createObjectURL(file)
    setUser((prev: any) => ({ ...prev, profilePic: previewUrl, pic: previewUrl }))

    try {
      setIsUpdating(true)
      const uploadResponse = await updateProfilePic(file)
      
      // Backend returns { status: true, data: [updatedUserArray] }
      // Extract the pic URL from the first array element
      const updatedUser = Array.isArray(uploadResponse?.data) 
        ? uploadResponse.data[0] 
        : uploadResponse?.data
      
      const newPicUrl = updatedUser?.pic || previewUrl

      // Update local component state immediately
      setUser((prev: any) => ({ ...prev, profilePic: newPicUrl, pic: newPicUrl }))

      // Sync to localStorage so Navbar/Sidebar refresh via profileUpdate event
      updateSavedProfile({ profilePic: newPicUrl, pic: newPicUrl })
      toast.success('Profile picture updated!')

      // Also do a fresh fetch to ensure full data sync
      const profileResponse = await getUserProfile()
      if (profileResponse?.success && profileResponse.data) {
        const freshData = profileResponse.data
        setUser(freshData)
        updateSavedProfile(freshData)
      }
    } catch (error: any) {
      console.error('Profile Picture Update Error:', error);
      // Revert preview on error
      setUser((prev: any) => ({ ...prev, profilePic: user?.profilePic || user?.pic || '', pic: user?.pic || '' }))
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile picture';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false)
      // Clean up the object URL
      URL.revokeObjectURL(previewUrl)
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
      <FloatingBackground density="low" />

      <section className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9">
            <div className="glass-card overflow-hidden">
              {/* Header/Cover */}
              <div className="h-32 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-b border-yellow-500/10" />
              
              <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl font-bold text-black overflow-hidden border-4 border-[var(--bg-secondary)] shadow-xl">
                      {user?.profilePic || user?.pic ? (
                        <img src={user.profilePic || user.pic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.username?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-black hover:scale-110 transition-transform shadow-lg border-2 border-[var(--bg-secondary)]"
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 mb-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">@{user?.username}</h2>
                      <p className="text-[var(--text-secondary)] text-sm">{user?.email}</p>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                      user?.accountType === 'Business' 
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                    }`}>
                      <Shield size={12} />
                      {user?.accountType || 'Personal Account'}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-yellow-500/10">
                       <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                          <Mail size={16} />
                          <span className="text-sm">{user?.email}</span>
                       </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-yellow-500 uppercase">Full Name</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-yellow-500/10 focus:border-yellow-500/50 focus:outline-none transition-all"
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-yellow-500 uppercase">Company</label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-yellow-500/10 focus:border-yellow-500/50 focus:outline-none transition-all"
                            placeholder="Company name (optional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-yellow-500 uppercase">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-yellow-500/10 focus:border-yellow-500/50 focus:outline-none transition-all resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="btn-gold px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 group disabled:opacity-70 shadow-lg shadow-yellow-500/20"
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
