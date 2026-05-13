'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Ticket, Search, Plus, Filter, Clock, ArrowRight, Edit2, Trash2, Users, BarChart3, ChevronRight, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import FloatingBackground from '@/components/FloatingBackground'
import { Event, getAllEvents, deleteEvent, captureEventPayment } from '@/lib/event'
import { useRouter, useSearchParams } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'
import { format } from 'date-fns'
import CreateEventModal from '@/components/CreateEventModal'
import BookTicketModal from '@/components/BookTicketModal'
import AttendeesModal from '@/components/AttendeesModal'
import EditEventModal from '@/components/EditEventModal'
import AnalyticsModal from '@/components/AnalyticsModal'
import EmailAttendeesModal from '@/components/EmailAttendeesModal'
import { getProfile } from '@/lib/auth'

function EventsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past' | 'my-tickets' | 'created'>('all')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('')

  useEffect(() => {
    fetchEvents()
    fetchUser()
    handlePaymentParams()
  }, [])

  const handlePaymentParams = async () => {
    const payment = searchParams.get('payment')
    const orderId = searchParams.get('token')
    const eventId = searchParams.get('eventId')

    if (payment === 'success' && orderId && eventId) {
      try {
        toast.loading('Verifying payment...', { id: 'payment-capture' })
        const response = await captureEventPayment(orderId, eventId)
        if (response.error) {
          toast.error(response.error, { id: 'payment-capture' })
        } else {
          toast.success('Ticket booked successfully!', { id: 'payment-capture' })
          fetchEvents()
          router.replace('/events')
        }
      } catch (error) {
        toast.error('Payment verification failed', { id: 'payment-capture' })
      }
    } else if (payment === 'cancel') {
      toast.error('Payment was cancelled')
      router.replace('/events')
    }
  }

  const fetchUser = async () => {
    const profile = getProfile()
    setCurrentUser(profile)
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const data = await getAllEvents()
      setEvents(data)
    } catch (error) {
      toast.error('Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      await deleteEvent(id)
      toast.success('Event deleted')
      fetchEvents()
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    const now = new Date()
    const eventDate = new Date(event.eventDateTime)

    if (activeTab === 'upcoming' && eventDate < now) return false
    if (activeTab === 'past' && eventDate >= now) return false
    
    if (activeTab === 'my-tickets') {
      const currentUserId = currentUser?._id || currentUser?.id;
      const hasTicket = event.soldTo?.some(s => s.userId === currentUserId)
      if (!hasTicket) return false
    }

    if (activeTab === 'created') {
      const currentUserId = currentUser?._id || currentUser?.id;
      if (!currentUserId || event.userID !== currentUserId) return false;
    }

    if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;
    if (selectedLocation && !event.location?.toLowerCase().includes(selectedLocation.toLowerCase()) && !event.venue?.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

    return true;
  }) : []

  const selectedEvent = events.find(e => e._id === selectedEventId) || null

  return (
    <div className="flex min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-yellow-500/30">
      <FloatingBackground />
      <Toaster position="top-center" />
      
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 min-h-screen relative flex flex-col">
        <Navbar />
        
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
          
          {/* Hero Section - Refined & Premium */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent border border-white/5 p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-[2px] bg-yellow-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Live Experiences</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-8">
                  DISCOVER <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 animate-gradient-x">EXTRAORDINARY</span>
                </h1>
                <p className="text-[var(--text-secondary)] text-sm lg:text-base max-w-lg leading-relaxed font-medium">
                  Join the world's most exclusive events, from high-stakes Web3 summits to intimate underground concerts. Your journey starts here.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-4"
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-10 py-5 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Plus className="relative z-10" size={18} />
                  <span className="relative z-10">Host Your Event</span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Search & Navigation Bar */}
          <div className="sticky top-24 z-40 space-y-6 bg-[#0A0A0B]/80 backdrop-blur-xl p-4 -mx-4 rounded-3xl border border-white/5 lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:mx-0 lg:border-none">
            <div className="flex flex-col xl:flex-row items-stretch gap-4">
              {/* Search Bar */}
              <div className="relative flex-[2]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500/50" size={20} />
                <input 
                  type="text"
                  placeholder="Search by name, venue or details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white/10 transition-all shadow-inner"
                />
              </div>

              {/* Category & Location Selectors */}
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-10 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer text-white"
                  >
                    <option value="All" className="bg-[#1A1A1B]">All Categories</option>
                    <option value="General" className="bg-[#1A1A1B]">General</option>
                    <option value="Technology" className="bg-[#1A1A1B]">Technology</option>
                    <option value="Entertainment" className="bg-[#1A1A1B]">Entertainment</option>
                    <option value="Music" className="bg-[#1A1A1B]">Music</option>
                    <option value="Sports" className="bg-[#1A1A1B]">Sports</option>
                    <option value="Education" className="bg-[#1A1A1B]">Education</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input 
                    type="text"
                    placeholder="City..."
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-yellow-500 text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(['all', 'upcoming', 'past', 'my-tickets', 'created'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-[var(--text-secondary)] border-white/5 hover:border-yellow-500/30'}`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Events Content */}
          <div className="relative">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02]"
              >
                 <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                   <Calendar className="text-yellow-500" size={40} />
                   <div className="absolute inset-0 animate-ping rounded-full bg-yellow-500/20 opacity-40" />
                 </div>
                 <h3 className="text-3xl font-black text-white mb-3">No Experiences Found</h3>
                 <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">We couldn't find any events matching your current criteria. Try expanding your search.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, idx) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative flex flex-col bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-yellow-500/40 transition-all duration-500"
                  >
                    {/* Visual Element */}
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img 
                        src={event.photo || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'} 
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full w-fit">
                          <span className="text-yellow-500 font-black text-xs">${event.price}</span>
                        </div>
                      </div>

                      <div className="absolute top-6 right-6">
                        <div className="bg-yellow-500 px-5 py-2 rounded-2xl shadow-xl shadow-yellow-500/20">
                          <span className="text-black font-black text-[9px] uppercase tracking-widest">{event.category || 'EVENT'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1 -mt-10 relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                         <div className="px-4 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                           {format(new Date(event.eventDateTime), 'MMM dd')}
                         </div>
                         <div className="w-1 h-1 rounded-full bg-white/20" />
                         <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest">
                           {format(new Date(event.eventDateTime), 'hh:mm a')}
                         </span>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-3 line-clamp-1 group-hover:text-yellow-500 transition-colors">
                        {event.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-8">
                        <MapPin size={16} className="text-yellow-500" />
                        <span className="font-bold line-clamp-1 opacity-80">{event.venue}</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-yellow-500/60 uppercase tracking-[0.2em] mb-1">Availability</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white">{event.ticketsAvailable}</span>
                            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">left</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {(currentUser?._id === event.userID || currentUser?.id === event.userID) ? (
                            <div className="flex items-center gap-2">
                               <ActionButton 
                                icon={<Edit2 size={16} />} 
                                onClick={() => { setSelectedEventId(event._id); setIsEditModalOpen(true); }}
                                color="hover:bg-blue-500/20 hover:text-blue-400"
                               />
                               <ActionButton 
                                icon={<BarChart3 size={16} />} 
                                onClick={() => { setSelectedEventId(event._id); setIsAnalyticsModalOpen(true); }}
                                color="hover:bg-purple-500/20 hover:text-purple-400"
                               />
                               <ActionButton 
                                icon={<Users size={16} />} 
                                onClick={() => { setSelectedEventId(event._id); setIsAttendeesModalOpen(true); }}
                                color="hover:bg-green-500/20 hover:text-green-400"
                               />
                               <ActionButton 
                                icon={<Trash2 size={16} />} 
                                onClick={() => handleDelete(event._id)}
                                color="hover:bg-red-500/20 hover:text-red-400"
                               />
                            </div>
                          ) : (
                            <button 
                              onClick={() => { setSelectedEventId(event._id); setIsBookModalOpen(true); }}
                              disabled={event.ticketsAvailable === 0}
                              className={`group/btn relative px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${event.ticketsAvailable === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-black hover:bg-yellow-500 active:scale-95'}`}
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                {event.ticketsAvailable === 0 ? 'Sold Out' : 'Get Access'}
                                {event.ticketsAvailable > 0 && <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Branding */}
        <div className="p-10 text-center opacity-20 mt-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">SinghDomain Experience Engine</p>
        </div>
      </main>

      {/* Modals */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />

      <BookTicketModal 
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />

      <AttendeesModal 
        isOpen={isAttendeesModalOpen}
        onClose={() => setIsAttendeesModalOpen(false)}
        event={selectedEvent}
      />

      <EditEventModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />

      <AnalyticsModal 
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        event={selectedEvent}
      />

      <EmailAttendeesModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  )
}

function ActionButton({ icon, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-2xl bg-white/5 text-[var(--text-secondary)] border border-white/5 transition-all ${color}`}
    >
      {icon}
    </button>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
          <Sparkles className="absolute inset-0 m-auto text-yellow-500 animate-pulse" size={24} />
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}
