'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, MapPin, Ticket, ArrowLeft, Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import FloatingBackground from '@/components/FloatingBackground'
import { authApi } from '@/lib/api'
import { isLoggedIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'

export default function CommunitiesPage() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await authApi.get('/list-events?pageNumber=0')
      setEvents(response.data || [])
    } catch (error) {
      toast.error('Failed to load communities/events')
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
          <div className="hidden lg:block lg:col-span-3">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Communities & Events</h1>
                <p className="text-[var(--text-secondary)]">Join exclusive real-estate communities and web3 events.</p>
              </div>
              <button className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                <Plus size={20} />
                Create Community
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card overflow-hidden group cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={event.photo || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'} 
                        alt={event.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                        {event.sellingStatus || 'Active'}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold group-hover:text-yellow-500 transition-colors">{event.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{event.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-yellow-500/10">
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <Calendar size={14} className="text-yellow-500" />
                          <span>{event.eventDateTime ? format(new Date(event.eventDateTime), 'MMM dd, yyyy') : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <MapPin size={14} className="text-yellow-500" />
                          <span className="truncate">{event.venue || 'Virtual'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <Ticket size={14} className="text-yellow-500" />
                          <span>{event.price > 0 ? `$${event.price}` : 'Free'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <Users size={14} className="text-yellow-500" />
                          <span>{event.ticketsAvailable || 0} left</span>
                        </div>
                      </div>

                      <button className="w-full py-3 rounded-xl border border-yellow-500/20 font-bold hover:bg-yellow-500 hover:text-black transition-all">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-20 text-center space-y-4">
                 <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto text-yellow-500">
                    <Users size={40} />
                 </div>
                 <h3 className="text-xl font-bold">No communities found</h3>
                 <p className="text-[var(--text-secondary)] max-w-xs mx-auto">Start by creating your first community event to connect with others.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
