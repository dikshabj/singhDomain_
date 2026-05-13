'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Post, likePost, unlikePost, deletePost, reportPost, updatePost, commentOnPost, savePost, unSavePost, sharePost, getPostComments } from '@/lib/post'
import { getProfile } from '@/lib/auth'
import toast from 'react-hot-toast'
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Play, Clock, X, Trash2, Flag, AlertCircle, Edit3, Check, Bookmark, Send, Info } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import ConfirmationModal from './ConfirmationModal'
import ReportModal from './ReportModal'
import { useRouter } from 'next/navigation'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.totalLike)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [editedCaption, setEditedCaption] = useState(post.caption || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSaved, setIsSaved] = useState(false) // This might need to come from the post object if backend supports it
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.totalComment)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareToUsername, setShareToUsername] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  
  const router = useRouter()

  const currentUser = getProfile()
  const isOwnPost = currentUser?.username === post.username || currentUser?.email === post.email

  const handleLike = async () => {
    try {
      if (isLiked) {
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
        await unlikePost(post._id)
      } else {
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 1000)
        await likePost(post._id)
      }
    } catch (error) {
      toast.error('Action failed')
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await deletePost(post._id)
      if (response.status) {
        toast.success('Post deleted successfully')
        setIsMenuOpen(false)
        setShowDeleteConfirm(false)
        window.location.reload()
      } else {
        toast.error(response.error || 'Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred while deleting')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReport = async (reason: string) => {
    setIsReporting(true)
    try {
      const response = await reportPost(post._id, reason)
      if (response.status) {
        toast.success('Post reported successfully')
        setIsMenuOpen(false)
        setShowReportModal(false)
      } else {
        toast.error(response.error || 'Failed to report post')
      }
    } catch (error) {
      toast.error('An error occurred while reporting')
    } finally {
      setIsReporting(false)
    }
  }

  const handleUpdateCaption = async () => {
    if (editedCaption === post.caption) {
      setIsEditingCaption(false)
      return
    }
    setIsUpdating(true)
    try {
      const response = await updatePost(post._id, editedCaption)
      if (response.status) {
        toast.success('Caption updated')
        setIsEditingCaption(false)
        post.caption = editedCaption // Update local object
      } else {
        toast.error(response.error || 'Update failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSave = async () => {
    try {
      if (isSaved) {
        await unSavePost(post._id)
        setIsSaved(false)
        toast.success('Removed from saved')
      } else {
        await savePost(post._id)
        setIsSaved(true)
        toast.success('Post saved!')
      }
    } catch (error) {
      toast.error('Failed to save post')
    }
  }

  const toggleComments = async () => {
    setShowComments(!showComments)
    if (!showComments && comments.length === 0) {
      fetchComments()
    }
  }

  const fetchComments = async () => {
    setIsLoadingComments(true)
    try {
      console.log('Fetching comments for post:', post._id)
      const response = await getPostComments(post._id, 1)
      console.log('Comments response:', response)
      
      if (Array.isArray(response)) {
        console.log('Setting comments array:', response)
        setComments(response)
        // Optionally update count if response length is different
        // setCommentsCount(response.length) 
      } else {
        console.log('Response is not an array or empty:', response)
        setComments([])
      }
    } catch (error) {
      console.error('Failed to fetch comments', error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const formatCommentDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      // Try standard parsing first
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return formatDistanceToNow(date) + ' ago'
      }
      
      // Handle custom format "7:45:17 pm 12/5/2026"
      // This is a rough fallback
      return dateStr.split(' ').slice(-1)[0] // Show just the date part if parsing fails
    } catch (e) {
      return ''
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    setIsCommenting(true)
    try {
      const response = await commentOnPost(post._id, newComment)
      if (response) {
        toast.success('Comment added')
        setNewComment('')
        setCommentsCount(prev => prev + 1)
        fetchComments() // Refresh comment list
      }
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleShare = async () => {
    if (!shareToUsername.trim()) return
    setIsSharing(true)
    try {
      // Backend sharePost(email, sendTo)
      // Note: We use currentUser?.email because that's what the route expects for :email
      const response = await sharePost(currentUser?.email || '', shareToUsername)
      toast.success(`Shared with @${shareToUsername}`)
      setShowShareModal(false)
      setShareToUsername('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to share post')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mb-6 overflow-hidden border-yellow-500/10 hover:border-yellow-500/20 transition-all shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-[var(--bg-secondary)] overflow-hidden shadow-md">
              {post.pic ? (
                <img src={post.pic} alt={post.username} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-black" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--text-primary)] hover:text-yellow-500 transition-colors cursor-pointer">
                @{post.username}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                <Clock size={10} />
                <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + ' ago' : 'Just now'}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-yellow-500 hover:bg-yellow-500/10 rounded-full transition-all"
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-1">
                      {isOwnPost ? (
                        <>
                          <button
                            onClick={() => {
                              setIsEditingCaption(true)
                              setIsMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-yellow-500/10 rounded-lg transition-colors group"
                          >
                            <Edit3 size={18} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                            Edit Caption
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors group"
                          >
                            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                            Delete Post
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowReportModal(true)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-yellow-500/10 rounded-lg transition-colors group"
                        >
                          <Flag size={18} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                          Report Post
                        </button>
                      )}
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          {isEditingCaption ? (
            <div className="space-y-3">
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-yellow-500/30 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-500 transition-all resize-none"
                rows={3}
                placeholder="Edit your caption..."
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsEditingCaption(false)}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateCaption}
                  disabled={isUpdating}
                  className="px-4 py-1.5 bg-yellow-500 text-black rounded-lg text-xs font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : (
                    <>
                      <Check size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            post.caption && (
              <p className="text-sm text-[var(--text-primary)] leading-relaxed mb-3">
                {post.caption}
              </p>
            )
          )}
        </div>

        {/* Media */}
        <div className="relative aspect-square md:aspect-video bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden group">
          {post.photo && (
            <img 
              src={post.photo} 
              alt="Post Content" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          {post.postType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-yellow-500/80 flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-all">
                <Play size={32} fill="black" />
              </div>
            </div>
          )}

          {/* Double Click Heart Animation */}
          <AnimatePresence>
            {isAnimating && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute pointer-events-none"
              >
                <Heart size={100} fill="#EAB308" className="text-yellow-500 shadow-2xl filter drop-shadow-xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interaction Bar */}
        <div className="p-4 border-t border-yellow-500/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 group transition-all ${isLiked ? 'text-yellow-500' : 'text-[var(--text-secondary)] hover:text-yellow-500'}`}
              >
                <div className="relative">
                  <Heart size={22} fill={isLiked ? "#EAB308" : "transparent"} className="group-active:scale-125 transition-transform" />
                </div>
                <span className="text-xs font-bold">{likesCount}</span>
              </button>
              <button 
                onClick={toggleComments}
                className={`flex items-center gap-2 group transition-all ${showComments ? 'text-yellow-500' : 'text-[var(--text-secondary)] hover:text-yellow-500'}`}
              >
                <MessageCircle size={22} className="group-active:scale-125 transition-transform" />
                <span className="text-xs font-bold">{commentsCount}</span>
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="text-[var(--text-secondary)] hover:text-yellow-500 transition-all group"
              >
                <Share2 size={22} className="group-active:scale-125 transition-transform" />
              </button>
            </div>
            <button 
              onClick={handleSave}
              className={`transition-all group ${isSaved ? 'text-yellow-500' : 'text-[var(--text-secondary)] hover:text-yellow-500'}`}
            >
              <Bookmark size={22} fill={isSaved ? "#EAB308" : "transparent"} className="group-active:scale-125 transition-transform" />
            </button>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4 border-t border-yellow-500/5 mt-4">
                  {/* Comment Input */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={isCommenting || !newComment.trim()}
                      className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-black disabled:opacity-50 active:scale-95 transition-all"
                    >
                      {isCommenting ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Send size={16} />}
                    </button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                    {isLoadingComments ? (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : comments.length > 0 ? (
                      comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-2 group">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border border-[var(--bg-secondary)] overflow-hidden shadow-sm">
                            {comment.pic ? (
                              <img src={comment.pic} alt={comment.username} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold text-black">
                                {comment.username ? comment.username[0].toUpperCase() : 'U'}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/5">
                              <p className="text-[10px] font-bold text-yellow-500">@{comment.username || comment.commentBy}</p>
                              <p className="text-[10px] text-[var(--text-primary)] leading-tight">{comment.text}</p>
                            </div>
                            <p className="text-[8px] text-[var(--text-secondary)] mt-1 ml-2">
                              {formatCommentDate(comment.commentAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-[var(--text-secondary)] text-center py-4">No comments yet. Be the first!</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowShareModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm glass-card p-6 border-yellow-500/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Share2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold">Share Post</h3>
                </div>
                <button onClick={() => setShowShareModal(false)} className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">Send to username</label>
                  <input 
                    type="text" 
                    value={shareToUsername}
                    onChange={(e) => setShareToUsername(e.target.value)}
                    placeholder="Enter username..."
                    className="w-full bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-all"
                  />
                </div>
                
                <div className="bg-yellow-500/5 p-4 rounded-xl flex gap-3 border border-yellow-500/10">
                  <Info size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    This post will be shared with the specified user. They will see it in their notification or feed.
                  </p>
                </div>

                <button 
                  onClick={handleShare}
                  disabled={isSharing || !shareToUsername.trim()}
                  className="btn-gold w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-yellow-500/20"
                >
                  {isSharing ? 'Sharing...' : (
                    <>
                      <Share2 size={18} />
                      Send Post
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            title="Delete Post?"
            message="Are you sure you want to permanently delete this post? This action cannot be undone."
            confirmText="Delete"
            type="danger"
          />
        )}

        {showReportModal && (
          <ReportModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onReport={handleReport}
          />
        )}
      </AnimatePresence>
    </>
  )
}
