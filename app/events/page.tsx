'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Ticket, Search, Plus, Filter, Clock, ArrowRight, Edit2, Trash2, Users, BarChart3 } from 'lucide-react'
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
    const orderId = searchParams.get('token') // PayPal returns token as order ID
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
          // Clean URL
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
    // Basic Search
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    // Tab Filtering
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

    // Category filtering
    if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;

    // Location filtering
    if (selectedLocation && !event.location?.toLowerCase().includes(selectedLocation.toLowerCase()) && !event.venue?.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

    return true;
  }) : []

  const selectedEvent = events.find(e => e._id === selectedEventId) || null

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-yellow-500/30">
      <FloatingBackground />
      <Toaster position="top-center" />
      
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 min-h-screen relative">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">
                DISCOVER <span className="text-yellow-500">EVENTS</span>
              </h1>
              <p className="text-[var(--text-secondary)] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-8 h-[2px] bg-yellow-500" />
                Experience the extraordinary
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsModalOpen(true)}
              className="btn-gold group px-8 py-4 rounded-2xl flex items-center gap-3 self-start md:self-center"
            >
              <Plus className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-black uppercase tracking-tighter text-sm">Host Event</span>
            </motion.button>
          </div>

          {/* Search & Tabs */}
          <div className="space-y-8 mb-12">
            
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4">
               <div className="relative flex-[2] w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                  <input 
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-all shadow-inner"
                  />
               </div>

               <div className="flex flex-1 gap-4 w-full md:w-auto">
                 <div className="relative flex-1">
                   <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500/50" size={14} />
                   <select 
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                     className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-2xl py-4 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-yellow-500 transition-all appearance-none cursor-pointer text-white"
                   >
                     <option value="All">All Categories</option>
                     <option value="General">General</option>
                     <option value="Technology">Technology</option>
                     <option value="Entertainment">Entertainment</option>
                     <option value="Music">Music</option>
                     <option value="Sports">Sports</option>
                     <option value="Education">Education</option>
                   </select>
                 </div>

                 <div className="relative flex-1">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500/50" size={14} />
                   <input 
                     type="text"
                     placeholder="Location..."
                     value={selectedLocation}
                     onChange={(e) => setSelectedLocation(e.target.value)}
                     className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-2xl py-4 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-yellow-500 transition-all text-white"
                   />
                 </div>
               </div>
            </div>

            <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-yellow-500/10 w-fit overflow-x-auto">
               {(['all', 'upcoming', 'past', 'my-tickets', 'created'] as const).map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-[var(--text-secondary)] hover:text-yellow-500'}`}
                 >
                   {tab.replace('-', ' ')}
                 </button>
               ))}
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[4/5] rounded-3xl bg-[var(--bg-secondary)] animate-pulse border border-white/5" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-20 text-center bg-[var(--bg-secondary)] rounded-3xl border border-yellow-500/10">
                 <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Calendar className="text-yellow-500" size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                 <p className="text-[var(--text-secondary)] text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, idx) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-white/5 hover:border-yellow-500/30 transition-all duration-500 shadow-xl hover:shadow-yellow-500/5"
                  >
                    {/* Event Banner */}
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={event.photo || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'} 
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                        <span className="text-yellow-500 font-black text-sm">${event.price}</span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-500 px-4 py-1.5 rounded-full">
                        <span className="text-black font-black text-[10px] uppercase tracking-widest">{event.category || 'Event'}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                           {format(new Date(event.eventDateTime), 'MMM dd')}
                         </div>
                         <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                           <Clock size={10} />
                           {format(new Date(event.eventDateTime), 'hh:mm a')}
                         </div>
                      </div>

                      <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-yellow-500 transition-colors">
                        {event.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs mb-6">
                        <MapPin size={14} className="text-yellow-500/50" />
                        <span className="font-bold line-clamp-1">{event.venue}</span>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Remaining</span>
                          <span className="text-lg font-black text-white">{event.ticketsAvailable} <span className="text-xs text-[var(--text-secondary)] font-normal">/ {event.totalTickets}</span></span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {(currentUser?._id === event.userID || currentUser?.id === event.userID) ? (
                            <div className="flex items-center gap-2">
                               <button 
                                onClick={() => {
                                  setSelectedEventId(event._id)
                                  setIsEditModalOpen(true)
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-yellow-500/10 text-[var(--text-secondary)] hover:text-yellow-500 transition-all border border-white/5"
                                title="Edit Event"
                               >
                                 <Edit2 size={16} />
                               </button>
                               <button 
                                onClick={() => {
                                  setSelectedEventId(event._id)
                                  setIsAnalyticsModalOpen(true)
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/10 text-[var(--text-secondary)] hover:text-blue-500 transition-all border border-white/5"
                                title="View Analytics"
                               >
                                 <BarChart3 size={16} />
                               </button>
                               <button 
                                onClick={() => {
                                  setSelectedEventId(event._id)
                                  setIsAttendeesModalOpen(true)
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-green-500/10 text-[var(--text-secondary)] hover:text-green-500 transition-all border border-white/5"
                                title="View Attendees"
                               >
                                 <Users size={16} />
                               </button>
                               <button 
                                onClick={() => handleDelete(event._id)}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all border border-white/5"
                                title="Delete Event"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setSelectedEventId(event._id)
                                setIsBookModalOpen(true)
                              }}
                              disabled={event.ticketsAvailable === 0}
                              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all ${event.ticketsAvailable === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-yellow-500 text-black hover:scale-105 shadow-lg shadow-yellow-500/20'}`}
                            >
                              {event.ticketsAvailable === 0 ? 'Sold Out' : 'Book Now'}
                              {event.ticketsAvailable > 0 && <ArrowRight size={16} />}
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

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EventsContent />
    </Suspense>
  )
}
