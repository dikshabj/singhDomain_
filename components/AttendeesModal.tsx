'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Search, User, Calendar, Mail, Hash } from 'lucide-react'
import { Event, verifyTicket } from '@/lib/event'
import toast from 'react-hot-toast'

interface AttendeesModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
}

export default function AttendeesModal({ isOpen, onClose, event }: AttendeesModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!event) return null

  const attendees = event.soldTo || []
  
  const filteredAttendees = attendees.filter(attendee => 
    attendee.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-yellow-500/10 flex items-center justify-between bg-gradient-to-r from-yellow-500/5 to-transparent flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-yellow-500">Event Attendees</h2>
                  <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-bold">
                    {attendees.length} total participants for "{event.name}"
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-yellow-500/10 rounded-xl text-[var(--text-secondary)] hover:text-yellow-500 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-yellow-500/10 bg-white/5 flex-shrink-0">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={18} />
                  <input 
                    type="text"
                    placeholder="Search by username, user ID, or order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-yellow-500/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-yellow-500 transition-all shadow-inner"
                  />
               </div>
            </div>

            {/* Attendees List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee, idx) => (
                  <motion.div
                    key={attendee.userId + idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/20 transition-all group"
                  >
                    <div className="relative">
                      <img 
                        src={attendee.pic || `https://ui-avatars.com/api/?name=${attendee.username}&background=EAB308&color=000`} 
                        alt={attendee.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/20 group-hover:border-yellow-500 transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[var(--bg-secondary)]">
                        {attendee.ticket}
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-bold text-sm text-yellow-500">@{attendee.username || 'Anonymous'}</h4>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-[10px] mt-1">
                          <User size={10} />
                          <span className="truncate max-w-[120px]">{attendee.userId}</span>
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-[10px]">
                          <Calendar size={10} className="text-yellow-500/50" />
                          <span>Booked: {attendee.date ? new Date(attendee.date).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-[10px] mt-1">
                          <Hash size={10} className="text-yellow-500/50" />
                          <span className="truncate max-w-[120px]">Order: {attendee.orderId || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col justify-center items-end gap-2">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-yellow-500/80 uppercase">Tickets</span>
                          <span className="text-lg font-black text-white">{attendee.ticket}</span>
                        </div>
                        
                        <button 
                          onClick={async () => {
                            try {
                              const res = await verifyTicket(event._id, attendee._id)
                              if (res.success || !res.error) {
                                toast.success(res.message || 'Ticket verified successfully!')
                              } else {
                                toast.error(res.error || 'Verification failed')
                              }
                            } catch (error) {
                              toast.error('Failed to verify ticket')
                            }
                          }}
                          className="px-3 py-1 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded-lg text-[8px] font-black uppercase tracking-widest border border-green-500/20 transition-all"
                        >
                          Verify Entry
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500/50">
                    <Users size={32} />
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm font-bold">No attendees found</p>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-yellow-500/10 bg-black/20 flex items-center justify-between flex-shrink-0">
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-secondary)]">
                      Revenue Generated
                    </div>
                    <div className="text-xl font-black text-yellow-500">
                      ${attendees.reduce((acc, curr) => acc + (curr.price || 0), 0).toFixed(2)}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // We'll trigger a callback to the parent to open the email modal
                      (window as any).openEmailModal?.()
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                  >
                    <Mail size={14} />
                    Message All
                  </button>
               </div>
               <div className="text-[10px] font-bold text-yellow-500/50 hidden md:block">
                 SINGHDOMAIN ORGANIZER HUB
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
