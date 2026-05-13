'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Video, Smile, MapPin, Send, Loader2, Globe, Lock } from 'lucide-react'
import { createPost } from '@/lib/post'
import toast from 'react-hot-toast'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('File size exceeds 50MB limit')
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!caption && !file) {
      toast.error('Please add some content')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      if (file) {
        formData.append('post', file)
        formData.append('postType', file.type.startsWith('video') ? 'video' : 'photo')
      }
      formData.append('caption', caption)
      
      await createPost(formData)
      toast.success('Post shared successfully!')
      setCaption('')
      setFile(null)
      setPreview(null)
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to share post')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="glass-card w-full max-w-xl border-yellow-500/10 shadow-2xl relative z-10 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-yellow-500/10 bg-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
               S
             </div>
             <div>
               <h3 className="text-sm font-bold">Create New Post</h3>
               <div className="flex gap-2 mt-0.5">
                  <button 
                    onClick={() => setPrivacy('public')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${privacy === 'public' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'border-white/10 text-white/40'}`}
                  >
                    <Globe size={10} /> Public
                  </button>
                  <button 
                    onClick={() => setPrivacy('private')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all ${privacy === 'private' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'border-white/10 text-white/40'}`}
                  >
                    <Lock size={10} /> Private
                  </button>
               </div>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90"
          >
            <X size={20} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's happening in your world?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none min-h-[140px] placeholder:text-white/20 custom-scrollbar"
          />

          <AnimatePresence>
            {preview && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl overflow-hidden bg-black/40 border border-yellow-500/10 shadow-inner group"
              >
                {file?.type.startsWith('video') ? (
                  <video src={preview} className="w-full max-h-[400px] object-contain" controls />
                ) : (
                  <img src={preview} alt="Preview" className="w-full max-h-[400px] object-contain mx-auto" />
                )}
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500 rounded-full text-white transition-all shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file?.name} ({(file?.size! / (1024 * 1024)).toFixed(2)} MB)
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Tools */}
        <div className="p-5 border-t border-yellow-500/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-yellow-500/5 text-yellow-500 rounded-2xl hover:bg-yellow-500/20 transition-all group active:scale-90"
                title="Add Media"
              >
                <ImageIcon size={22} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                className="p-3 bg-blue-500/5 text-blue-500 rounded-2xl hover:bg-blue-500/20 transition-all active:scale-90"
                title="Add Location"
              >
                <MapPin size={22} />
              </button>
              <button 
                className="p-3 bg-pink-500/5 text-pink-500 rounded-2xl hover:bg-pink-500/20 transition-all active:scale-90"
                title="Feelings"
              >
                <Smile size={22} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,video/*" 
                className="hidden" 
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || (!caption && !file)}
              className="btn-gold px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-yellow-500/20 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all group"
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Sharing...</span>
                </>
              ) : (
                <>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Share Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
