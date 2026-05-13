'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, X, Send, Loader2 } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onReport: (reason: string) => Promise<void>
}

export default function ReportModal({ isOpen, onClose, onReport }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return
    setIsSubmitting(true)
    try {
      await onReport(reason)
      setReason('')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-card w-full max-w-md border-yellow-500/10 shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="p-5 border-b border-yellow-500/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2 text-yellow-500">
            <Flag size={18} />
            <h3 className="font-bold">Report Post</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Why are you reporting this post? Your feedback helps us keep the community safe.
          </p>
          
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-xl p-4 text-sm min-h-[120px] focus:outline-none focus:border-yellow-500/40 transition-all resize-none"
          />

          <div className="grid grid-cols-2 gap-2 mb-4">
            {['Spam', 'Harassment', 'Hate Speech', 'Misinformation'].map(r => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className="px-3 py-2 bg-white/5 hover:bg-yellow-500/10 border border-transparent hover:border-yellow-500/20 rounded-lg text-xs transition-all text-left"
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="btn-gold w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Submit Report
          </button>
        </div>
      </motion.div>
    </div>
  )
}
