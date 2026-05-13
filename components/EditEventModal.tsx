'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Calendar, MapPin, DollarSign, Users, Sparkles, Loader2 } from 'lucide-react'
import { Event, updateEvent } from '@/lib/event'
import toast from 'react-hot-toast'

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  event: Event | null
}

export default function EditEventModal({ isOpen, onClose, onSuccess, event }: EditEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    price: '0',
    totalTickets: '100',
    eventDateTime: '',
    sellingStatus: 'For sale'
  })
  
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        venue: event.venue || '',
        price: event.price?.toString() || '0',
        totalTickets: event.totalTickets?.toString() || '100',
        // Format datetime for input[type="datetime-local"]
        eventDateTime: event.eventDateTime ? new Date(event.eventDateTime).toISOString().slice(0, 16) : '',
        sellingStatus: event.sellingStatus || 'For sale'
      })
      setPreviewImage(event.photo || null)
    }
  }, [event])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return

    try {
      setIsSubmitting(true)
      const submitData = new FormData()
      submitData.append('id', event._id) // Backend expects 'id'
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('venue', formData.venue)
      submitData.append('price', formData.price)
      submitData.append('totalTickets', formData.totalTickets)
      submitData.append('eventDateTime', formData.eventDateTime)
      submitData.append('sellingStatus', formData.sellingStatus)
      if (file) {
        submitData.append('photo', file)
      } else if (event.photo) {
        submitData.append('photo', event.photo)
      }

      const response = await updateEvent(submitData)
      if (response.error || response.err) {
        toast.error(response.error || response.err || 'Failed to update event')
      } else {
        toast.success('Event updated successfully!')
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      console.error('Failed to update event', error)
      toast.error(error.response?.data?.error || 'Something went wrong')
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
                <h2 className="text-xl font-black text-white">Edit Event</h2>
                <p className="text-[var(--text-secondary)] text-[10px]">Update your event details</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-[var(--text-secondary)] hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form id="edit-event-form" onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Event Banner</label>
              <div 
                onClick={() => document.getElementById('edit-event-photo')?.click()}
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
                  id="edit-event-photo"
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
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Event Title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all"
                />
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input
                    type="text"
                    required
                    name="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
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
                    name="eventDateTime"
                    value={formData.eventDateTime}
                    onChange={(e) => setFormData({...formData, eventDateTime: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500/50" size={16} />
                  <input
                    type="number"
                    min="0"
                    required
                    name="price"
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
                    name="totalTickets"
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
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-yellow-500 outline-none transition-all resize-none"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold text-xs hover:bg-white/5 transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              form="edit-event-form"
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] btn-gold py-4 rounded-xl font-bold text-xs shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
