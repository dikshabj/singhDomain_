'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ticket, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react'
import { Event, buyEventTicket, buyFreeTicket, createBuyEventIntent } from '@/lib/event'
import { toast } from 'react-hot-toast'

interface BookTicketModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  onSuccess?: () => void
}

export default function BookTicketModal({ isOpen, onClose, event, onSuccess }: BookTicketModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!event) return null

  const handleBooking = async () => {
    try {
      setIsSubmitting(true)
      let response;
      
      if (event.price === 0) {
        response = await buyFreeTicket(event._id, quantity)
        if (response.success || response._id) {
          toast.success('Tickets booked successfully!')
          onSuccess?.()
          onClose()
        } else {
          toast.error(response.error || 'Failed to book tickets')
        }
      } else {
        // PayPal Flow
        response = await createBuyEventIntent(event.price * quantity, event._id, quantity)
        if (response.success && response.data?.url) {
          toast.loading('Redirecting to PayPal...')
          window.location.href = response.data.url
        } else {
          toast.error(response.error || 'Failed to initialize payment')
        }
      }
    } catch (error: any) {
      console.error('Booking error:', error)
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Booking failed please try again'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = (event.price * quantity).toFixed(2)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-yellow-500/10 flex items-center justify-between bg-gradient-to-r from-yellow-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                  <Ticket size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-yellow-500">Book Tickets</h2>
                  <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-bold">Secure your spot</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-yellow-500/10 rounded-xl text-[var(--text-secondary)] hover:text-yellow-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-8">
                {/* Event Info Summary */}
                <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <img 
                    src={event.photo || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'} 
                    alt={event.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-1">{event.name}</h3>
                    <p className="text-[var(--text-secondary)] text-xs mt-1 line-clamp-1">{event.venue}</p>
                    <div className="mt-2 text-yellow-500 font-black text-sm">
                      {event.price > 0 ? `$${event.price}` : 'FREE'}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-[var(--text-secondary)]">Select Quantity</span>
                    <span className="text-yellow-500">{event.ticketsAvailable} available</span>
                  </div>
                  <div className="flex items-center justify-center gap-8 bg-[var(--bg-primary)] p-4 rounded-2xl border border-yellow-500/10 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-yellow-500/20 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-3xl font-black min-w-[2ch] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(event.ticketsAvailable, quantity + 1))}
                      className="w-10 h-10 rounded-full border border-yellow-500/20 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-yellow-500/5 p-5 rounded-2xl border border-yellow-500/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                    <span className="font-bold">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-yellow-500/10 pt-2">
                    <span className="text-yellow-500 font-black">Total Amount</span>
                    <span className="text-yellow-500 font-black">${totalPrice}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={isSubmitting || event.ticketsAvailable === 0}
                  onClick={handleBooking}
                  className="w-full btn-gold py-4 rounded-2xl font-black text-lg shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <ShoppingCart size={24} />
                      {event.price === 0 ? 'Get Free Tickets' : 'Book Now'}
                    </>
                  )}
                </button>
                
                <p className="text-center text-[var(--text-secondary)] text-[10px] uppercase tracking-widest font-bold pb-4">
                  100% Secure Checkout via SinghDomain
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
