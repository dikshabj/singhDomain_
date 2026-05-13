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
import { API_URL } from '@/lib/api'

const getImageUrl = (path?: string) => {
  if (!path) return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'
  if (path.startsWith('http')) return path
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

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
    <main className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-yellow-500/30">
      <FloatingBackground />
      <Toaster position="top-center" />
      <Navbar />
      
      <section className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 h-fit">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9 space-y-12">
            
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent border border-white/5 p-8 lg:p-12">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
              
              <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-[2px] bg-yellow-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Live Experiences</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-6">
                    DISCOVER <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 animate-gradient-x">EXTRAORDINARY</span>
                  </h1>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                    Join the world's most exclusive events. Your journey starts here.
                  </p>
                </motion.div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-8 py-4 bg-yellow-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] active:scale-95 self-start"
                >
                  <Plus className="relative z-10" size={16} />
                  <span className="relative z-10">Host Your Event</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="relative flex-[2]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-500/50" size={20} />
                  <input 
                    type="text"
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="flex flex-1 gap-3">
                  <div className="relative flex-1">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-[10px] font-black uppercase tracking-wider focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer text-white"
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
                      className="w-full h-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-wider focus:outline-none focus:border-yellow-500 text-white placeholder:text-white/20"
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
                    className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-[var(--text-secondary)] border-white/5 hover:border-yellow-500/30'}`}
                  >
                    {tab.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="relative">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-[4/5] rounded-[2rem] bg-white/5 animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]"
                >
                   <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Calendar className="text-yellow-500" size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-white mb-2">No Experiences Found</h3>
                   <p className="text-[var(--text-secondary)] text-xs">Try adjusting your filters.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, idx) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative flex flex-col bg-white/[0.03] backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/5 hover:border-yellow-500/40 transition-all duration-500"
                    >
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img 
                          src={getImageUrl(event.photo)} 
                          alt={event.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full">
                          <span className="text-yellow-500 font-black text-[10px]">${event.price}</span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-500 px-3 py-1 rounded-lg">
                            <span className="text-black font-black text-[8px] uppercase tracking-widest">{event.category || 'EVENT'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 -mt-8 relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest text-yellow-500">
                           {format(new Date(event.eventDateTime), 'MMM dd')}
                           <span className="text-white/20">•</span>
                           <span className="text-white/60">{format(new Date(event.eventDateTime), 'hh:mm a')}</span>
                        </div>

                        <h3 className="text-lg font-black text-white mb-2 line-clamp-1 group-hover:text-yellow-500 transition-colors">
                          {event.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[10px] mb-6">
                          <MapPin size={12} className="text-yellow-500" />
                          <span className="font-bold line-clamp-1">{event.venue}</span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-yellow-500/60 uppercase mb-1">Stock</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-white">{event.ticketsAvailable}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {(currentUser?._id === event.userID || currentUser?.id === event.userID) ? (
                              <div className="flex items-center gap-1.5">
                                 <ActionButton 
                                  icon={<Edit2 size={14} />} 
                                  onClick={() => { setSelectedEventId(event._id); setIsEditModalOpen(true); }}
                                  color="hover:text-blue-400"
                                 />
                                 <ActionButton 
                                  icon={<BarChart3 size={14} />} 
                                  onClick={() => { setSelectedEventId(event._id); setIsAnalyticsModalOpen(true); }}
                                  color="hover:text-purple-400"
                                 />
                                 <ActionButton 
                                  icon={<Users size={14} />} 
                                  onClick={() => { setSelectedEventId(event._id); setIsAttendeesModalOpen(true); }}
                                  color="hover:text-green-400"
                                 />
                                 <ActionButton 
                                  icon={<Trash2 size={14} />} 
                                  onClick={() => handleDelete(event._id)}
                                  color="hover:text-red-400"
                                 />
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setSelectedEventId(event._id); setIsBookModalOpen(true); }}
                                disabled={event.ticketsAvailable === 0}
                                className={`group/btn relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${event.ticketsAvailable === 0 ? 'bg-white/5 text-white/20' : 'bg-white text-black hover:bg-yellow-500'}`}
                              >
                                {event.ticketsAvailable === 0 ? 'Sold Out' : 'Book'}
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
        </div>
      </section>

      {/* Modals */}
      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchEvents} />
      <BookTicketModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} event={selectedEvent} onSuccess={fetchEvents} />
      <AttendeesModal isOpen={isAttendeesModalOpen} onClose={() => setIsAttendeesModalOpen(false)} event={selectedEvent} />
      <EditEventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} event={selectedEvent} onSuccess={fetchEvents} />
      <AnalyticsModal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} event={selectedEvent} />
      <EmailAttendeesModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} event={selectedEvent} />
    </main>
  )
}

function ActionButton({ icon, onClick, color }: any) {
  return (
    <button onClick={onClick} className={`p-2 rounded-xl bg-white/5 text-white/40 border border-white/5 transition-all ${color}`}>
      {icon}
    </button>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}
