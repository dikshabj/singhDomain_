'use client'

import { useState, useEffect } from 'react'
import { Home, Search, Bell, Mail, Users, User as UserIcon, Plus, Bookmark, Calendar } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { getProfile, getUserProfile, updateSavedProfile } from '@/lib/auth'

interface SidebarProps {
  onPostClick?: () => void
}

export default function Sidebar({ onPostClick }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const refreshProfile = () => {
      setUser(getProfile())
    }
    refreshProfile()
    window.addEventListener('profileUpdate', refreshProfile)

    // Sync fresh pic from backend
    const syncPic = async () => {
      const profile = getProfile()
      if (!profile?.Token) return
      try {
        const response = await getUserProfile()
        if (response?.success && response.data) {
          updateSavedProfile(response.data)
          setUser((prev: any) => ({
            ...prev,
            profilePic: response.data.profilePic || prev?.profilePic,
            pic: response.data.profilePic || prev?.pic,
          }))
        }
      } catch {
        // silently fail
      }
    }
    syncPic()

    return () => window.removeEventListener('profileUpdate', refreshProfile)
  }, [])

  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/feed' },
    { icon: <Search size={22} />, label: 'Explore', path: '/explore' },
    { icon: <Calendar size={22} />, label: 'Events', path: '/events' },
    { icon: <Bell size={22} />, label: 'Notifications', path: '/notifications' },
    { icon: <Mail size={22} />, label: 'Messages', path: '/messages' },
    { icon: <Users size={22} />, label: 'Communities', path: '/communities' },
    { icon: <Bookmark size={22} />, label: 'Saved', path: '/saved' },
    { icon: <UserIcon size={22} />, label: 'Profile', path: '/profile' },
  ]

  return (
    <div className="glass-card p-6 space-y-6 sticky top-24 h-fit">
      <div className="flex flex-col items-center text-center pb-6 border-b border-yellow-500/10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-2xl font-bold text-black border-4 border-[var(--bg-secondary)] shadow-xl mb-3 overflow-hidden">
          {user?.profilePic || user?.pic ? (
            <img 
              src={user.profilePic || user.pic} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            user?.username?.charAt(0).toUpperCase()
          )}
        </div>
        <h2 className="font-bold text-lg">{user?.username}</h2>
        <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button 
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${pathname === item.path ? 'bg-yellow-500/10 text-yellow-500' : 'text-[var(--text-secondary)] hover:bg-yellow-500/5 hover:text-yellow-500'}`}
          >
            <div className={`${pathname === item.path ? 'text-yellow-500' : 'group-hover:scale-110 transition-transform'}`}>
              {item.icon}
            </div>
            <span className={`font-bold text-sm ${pathname === item.path ? 'text-[var(--text-primary)]' : ''}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {onPostClick && (
        <button 
          onClick={onPostClick}
          className="btn-gold w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 hover:scale-[1.02] transition-all"
        >
          <Plus size={20} />
          Create Post
        </button>
      )}
    </div>
  )
}
