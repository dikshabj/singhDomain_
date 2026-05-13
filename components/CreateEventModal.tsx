'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Calendar, MapPin, DollarSign, Users, Info, Sparkles } from 'lucide-react'
import { createEvent } from '@/lib/event'
import toast from 'react-hot-toast'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all appearance-none text-[var(--text-primary)]"
                  >
                    <option value="General" className="bg-[var(--bg-secondary)]">General</option>
                    <option value="Technology" className="bg-[var(--bg-secondary)]">Technology</option>
                    <option value="Entertainment" className="bg-[var(--bg-secondary)]">Entertainment</option>
                    <option value="Music" className="bg-[var(--bg-secondary)]">Music</option>
                    <option value="Sports" className="bg-[var(--bg-secondary)]">Sports</option>
                    <option value="Education" className="bg-[var(--bg-secondary)]">Education</option>
                  </select>
                </div>
              </div>
            </div>
      if (response.error || response.err || response.message?.includes('fail')) {
        toast.error(response.error || response.err || 'Failed to create event')
      } else {
        toast.success('Event created successfully!')
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      console.error('Failed to create event', error)
      const message = error.response?.data?.error || error.response?.data?.err || error.message || 'Something went wrong. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Host New Event</h2>
                <p className="text-[var(--text-secondary)] text-[10px]">Create an unforgettable experience</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
            
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Event Banner</label>
              <div 
                onClick={() => document.getElementById('event-photo')?.click()}
                className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 ${previewImage ? 'border-yellow-500/50' : 'border-white/10 hover:border-yellow-500/30 bg-white/5'}`}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Click to upload banner</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                  </>
                )}
                <input 
                  id="event-photo"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Event Title</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Web3 Developers Meetup"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Venue / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    placeholder="e.g. Metaverse / New York"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Date & Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDateTime}
                    onChange={(e) => setFormData({...formData, eventDateTime: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Ticket Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Total Tickets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Total Tickets</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalTickets}
                    onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What is this event about?"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all resize-none"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold text-xs hover:bg-white/5 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] btn-gold py-4 rounded-xl font-bold text-xs shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create Event
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
