'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User as UserIcon, Loader2, X } from 'lucide-react'
import { searchUsers } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true)
        try {
          const data = await searchUsers(query)
          setResults(data)
          setShowResults(true)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 1 && setShowResults(true)}
          placeholder="Search creators..."
          className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-yellow-500/40 transition-all shadow-inner"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card border-yellow-500/20 shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-yellow-500">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-xs font-bold">Searching creators...</span>
                </div>
              ) : results.length > 0 ? (
                results.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => {
                      router.push(`/profile/${user.username}`)
                      setShowResults(false)
                      setQuery('')
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-500/10 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 overflow-hidden border border-yellow-500/10 shrink-0">
                      {user.pic ? (
                        <img src={user.pic} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-yellow-500 font-bold">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">@{user.username}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">{user.fullName || 'User'}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--text-secondary)] text-xs">
                  No users found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
