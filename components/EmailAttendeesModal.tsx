'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Mail, Type, MessageSquare, Loader2, Sparkles } from 'lucide-react'
import { Event, sendEmailToAttendees } from '@/lib/event'
import toast from 'react-hot-toast'

interface EmailAttendeesModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
}

export default function EmailAttendeesModal({ isOpen, onClose, event }: EmailAttendeesModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    try {
      setIsSubmitting(true)
      const response = await sendEmailToAttendees(event._id, formData.subject, formData.message)
      if (response.success || !response.error) {
        toast.success('Emails sent to all attendees!')
        onClose()
      } else {
        toast.error(response.error || 'Failed to send emails')
      }
    } catch (error) {
      toast.error('Failed to send emails')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!event) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xl bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-yellow-500/10 flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
                  <Mail size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Message Attendees</h2>
                  <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-bold">
                    Email notification for "{event.name}"
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-yellow-500/10 rounded-xl text-[var(--text-secondary)] hover:text-yellow-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                  <Type size={12} />
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venue Change or Event Update"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                  <MessageSquare size={12} />
                  Your Message
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write your update here..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 flex items-start gap-3">
                <Sparkles className="text-yellow-500 mt-0.5" size={16} />
                <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic">
                  This message will be sent to all <span className="text-yellow-500 font-black">{event.soldTo?.length || 0}</span> attendees. 
                  Please ensure your information is accurate before sending.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl font-bold text-xs hover:bg-white/5 transition-colors border border-white/10"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] btn-gold py-4 rounded-xl font-bold text-xs shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} />
                      Send to Everyone
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
