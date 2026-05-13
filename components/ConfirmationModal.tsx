'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
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
        className="glass-card w-full max-w-sm border-yellow-500/10 shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="p-6 text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            type === 'danger' ? 'bg-red-500/10 text-red-500' : 
            type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 
            'bg-blue-500/10 text-blue-500'
          }`}>
            <AlertCircle size={32} />
          </div>
          
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {message}
          </p>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl font-bold text-black transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 
                'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20'
              }`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded-full text-[var(--text-secondary)]"
        >
          <X size={16} />
        </button>
      </motion.div>
    </div>
  )
}
