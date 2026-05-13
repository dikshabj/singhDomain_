'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Ticket, Search, Plus, Filter, Clock, ArrowRight, Edit2, Trash2, Users, BarChart3 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import FloatingBackground from '@/components/FloatingBackground'
import { Event, getAllEvents, deleteEvent } from '@/lib/event'
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

export default function EventsPage() {
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

  useEffect(() => {
    fetchEvents()
    const profile = getProfile()
    if (profile) {
      setCurrentUser(profile)
    }

    // Hook for AttendeesModal to open EmailModal
    if (typeof window !== 'undefined') {
      (window as any).openEmailModal = () => setIsEmailModalOpen(true)
    }

    // Handle PayPal Redirect Return
    const paymentStatus = searchParams.get('payment')
    const token = searchParams.get('token')
    const eventId = searchParams.get('eventId')
    if (paymentStatus === 'success' && token && eventId) {
      handlePaymentCapture(token, eventId)
    } else if (paymentStatus === 'cancel') {
      toast.error('Payment was cancelled')
    }
  }, [searchParams])

  const handlePaymentCapture = async (orderId: string, eventId: string) => {
    try {
      toast.loading('Verifying payment...', { id: 'payment-capture' })
      const response = await captureEventPayment(orderId, eventId)
      if (response.error) {
        toast.error(response.error, { id: 'payment-capture' })
      } else {
        toast.success('Payment successful! Your tickets are booked.', { id: 'payment-capture' })
        fetchEvents()
        router.replace('/events') // Clean up URL
      }
    } catch (error) {
      toast.error('Failed to capture payment', { id: 'payment-capture' })
    }
  }

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const data = await getAllEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to load events', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventID: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
    
    try {
      const response = await deleteEvent(eventID)
      if (response.error) {
        toast.error(response.error)
      } else {
        toast.success('Event deleted successfully')
        fetchEvents()
      }
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    // Search filtering
    const matchesSearch = 
      event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Tab filtering
    if (activeTab === 'all') return true;

    const eventDate = new Date(event.eventDateTime);
    const now = new Date();
    // Set both to start of day for cleaner 'today' vs 'upcoming' vs 'past' if needed, 
    // but standard comparison is usually fine for most users.
    
    if (activeTab === 'upcoming') {
      return eventDate >= now;
    }
    
    if (activeTab === 'past') {
      return eventDate < now;
    }

    if (activeTab === 'my-tickets') {
      return event.userTicketCount && event.userTicketCount > 0;
    }

    if (activeTab === 'created') {
      const currentUserId = currentUser?._id || currentUser?.id;
      return currentUserId && event.userID === currentUserId;
    }

    return true;
  }) : []

  const isOwner = (event: Event) => {
    const currentUserId = currentUser?._id || currentUser?.id;
    return currentUserId && event.userID === currentUserId;
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />
      <FloatingBackground density="low" />

      <section className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 h-fit">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9 space-y-8">
            
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-yellow-500/10 to-transparent p-8 rounded-3xl border border-yellow-500/10 shadow-2xl backdrop-blur-sm">
              <div>
                <h1 className="text-4xl font-black text-yellow-500 mb-2">Discover Events</h1>
                <p className="text-[var(--text-secondary)] text-sm">Experience the best Web3 events on SinghDomain</p>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20 active:scale-95 transition-all"
                 >
                    <Plus size={20} />
                    Create Event
                 </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4">
               <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                  <input 
                    type="text"
                    placeholder="Search events, venues, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-all shadow-inner"
                  />
               </div>
                <div className="flex bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-yellow-500/10 w-full md:w-fit overflow-x-auto">
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
            </div>

            {/* Events Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold animate-pulse text-yellow-500 tracking-widest">LOADING EVENTS...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event, idx) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card group overflow-hidden border-yellow-500/5 hover:border-yellow-500/30 transition-all shadow-xl hover:shadow-2xl"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={event.photo || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'} 
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <div className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg">
                           {event.price > 0 ? `$${event.price}` : 'FREE'}
                        </div>
                        {isOwner(event) && (
                          <div className="flex gap-2">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation()
                                 setSelectedEventId(event._id)
                                 setIsEditModalOpen(true)
                               }}
                               className="p-2 bg-black/60 hover:bg-yellow-500 hover:text-black rounded-lg backdrop-blur-md transition-all text-white border border-white/10"
                               title="Edit Event"
                             >
                                <Edit2 size={14} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation()
                                 setSelectedEventId(event._id)
                                 setIsAnalyticsModalOpen(true)
                               }}
                               className="p-2 bg-black/60 hover:bg-yellow-500 hover:text-black rounded-lg backdrop-blur-md transition-all text-white border border-white/10"
                               title="View Analytics"
                             >
                                <BarChart3 size={14} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation()
                                 setSelectedEventId(event._id)
                                 setIsAttendeesModalOpen(true)
                               }}
                               className="p-2 bg-black/60 hover:bg-yellow-500 hover:text-black rounded-lg backdrop-blur-md transition-all text-white border border-white/10"
                               title="View Attendees"
                             >
                                <Users size={14} />
                             </button>
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation()
                                 handleDeleteEvent(event._id)
                               }}
                               className="p-2 bg-black/60 hover:bg-red-500 rounded-lg backdrop-blur-md transition-all text-white border border-white/10"
                               title="Delete Event"
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                         <div className="flex items-center gap-2 text-yellow-400 text-[10px] font-bold mb-1">
                            <Calendar size={12} />
                            <span>{event.eventDateTime ? format(new Date(event.eventDateTime), 'PPP') : 'Date TBA'}</span>
                         </div>
                         <h3 className="text-white font-black text-lg line-clamp-1">{event.name}</h3>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs">
                        <MapPin size={14} className="text-yellow-500" />
                        <span className="line-clamp-1">{event.venue || 'Remote / Metaverse'}</span>
                      </div>
                      <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                              <Ticket size={16} />
                           </div>
                           <span className="text-[10px] font-bold">{event.ticketsAvailable} left</span>
                        </div>
                         <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEventId(event._id)
                              setIsBookModalOpen(true)
                            }}
                            disabled={event.ticketsAvailable === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10 active:scale-95 disabled:opacity-50 disabled:grayscale"
                          >
                            <Ticket size={14} />
                            {event.userTicketCount ? 'Buy More' : 'Book Now'}
                          </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-20 text-center space-y-6 border-yellow-500/10">
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto text-yellow-500 animate-bounce">
                  <Calendar size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">No events found</h3>
                  <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">
                    Try adjusting your search or check back later for new experiences.
                  </p>
                </div>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn-gold px-10 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <CreateEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />

      <BookTicketModal 
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false)
          setSelectedEventId(null)
        }}
        event={events.find(e => e._id === selectedEventId) || null}
        onSuccess={fetchEvents}
      />

      <AttendeesModal 
        isOpen={isAttendeesModalOpen}
        onClose={() => {
          setIsAttendeesModalOpen(false)
          setSelectedEventId(null)
        }}
        event={events.find(e => e._id === selectedEventId) || null}
      />

      <EditEventModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedEventId(null)
        }}
        onSuccess={fetchEvents}
        event={events.find(e => e._id === selectedEventId) || null}
      />

      <AnalyticsModal 
        isOpen={isAnalyticsModalOpen}
        onClose={() => {
          setIsAnalyticsModalOpen(false)
          setSelectedEventId(null)
        }}
        event={events.find(e => e._id === selectedEventId) || null}
      />

      <EmailAttendeesModal 
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false)
          setSelectedEventId(null)
        }}
        event={events.find(e => e._id === selectedEventId) || null}
      />
    </main>
  )
}
